import 'package:ajps_flutter_app/pages/user/edit_user_profile_screen.dart';
import 'package:ajps_flutter_app/pages/user/user_dashboard_screen.dart';
import 'package:ajps_flutter_app/pages/user/user_profile_page_screen.dart';
import 'package:ajps_flutter_app/pages/user/user_settings_screen.dart';
import 'package:ajps_flutter_app/pages/submission/online_submission_screen.dart';
import 'package:ajps_flutter_app/services/profile_service.dart';
// import 'package:ajps_flutter_app/widgets/user_profile_image_widget.dart';
import 'package:ajps_flutter_app/widgets/safe_user_profile_image_widget.dart';
import 'package:ajps_flutter_app/widgets/error_boundary.dart';
import 'package:ajps_flutter_app/settings/app_config.dart';
import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:provider/provider.dart';
import 'package:ajps_flutter_app/navigation/navigation_provider.dart';

class UserSectionPage extends StatefulWidget {
  const UserSectionPage({super.key});

  @override
  State<UserSectionPage> createState() => _UserSectionPageState();
}

class _UserSectionPageState extends State<UserSectionPage> {
  int _selectedIndex = 0;
  late final List<Widget> _pages;
  int _profileImageRefreshKey = 0;

  @override
  /*void initState() {
    super.initState();
    _pages = [
      _DashboardPage(),
      _ProfilePage(),
      _EditProfilePage(),
      _OnlineSubmissionPage(),
      _SettingsPage(),
    ];
  }*/
  void initState() {
    super.initState();
    _pages = [
      const UserDashboardScreen(),
      UserProfilePageScreen(),
      _EditProfileScreenWrapper(),
      const OnlineSubmissionScreen(),
      const UserSettingsScreen(),
    ];
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    Navigator.pop(context); // Close the drawer
  }

  void _refreshProfileImage() {
    setState(() {
      _profileImageRefreshKey++;
    });
  }

  // ignore: unused_element
  Widget _buildProfileImage(AuthService authService) {
    return ErrorBoundary(
      // ignore: sort_child_properties_last
      child: SafeUserProfileImageWidget(
        key: ValueKey(_profileImageRefreshKey),
        radius: 28,
        authService: authService,
      ),
      fallback: const CircleAvatar(
        radius: 28,
        backgroundColor: Colors.grey,
        child: Icon(Icons.person, size: 36, color: Colors.white),
      ),
    );
  }

  Widget _buildSafeProfileImage(AuthService authService) {
    // Ultra-safe fallback that never fails
    return FutureBuilder<String?>(
      key: ValueKey(_profileImageRefreshKey),
      future: _getSafeProfileImageUrl(authService),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const CircleAvatar(
            radius: 28,
            backgroundColor: Colors.grey,
            child: SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(
                strokeWidth: 2,
                color: Colors.white,
              ),
            ),
          );
        }

        if (snapshot.hasData && snapshot.data != null) {
          return CircleAvatar(
            radius: 28,
            backgroundColor: Colors.grey,
            backgroundImage: NetworkImage(snapshot.data!),
            onBackgroundImageError: (_, __) {
              // Silently fail and show fallback
            },
          );
        }

        return const CircleAvatar(
          radius: 28,
          backgroundColor: Colors.grey,
          child: Icon(Icons.person, size: 36, color: Colors.white),
        );
      },
    );
  }

  Future<String?> _getSafeProfileImageUrl(AuthService authService) async {
    try {
      final profileService = ProfileService();
      final profile = await profileService.getProfile(authService: authService);

      String? rawUrl =
          profile['profileImage'] ?? profile['data']?['profileImage'];

      if (rawUrl != null && rawUrl.isNotEmpty) {
        final baseUri = Uri.parse(AppConfig.getApiBaseUrl);

        if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
          try {
            final imgUri = Uri.parse(rawUrl);
            return imgUri
                .replace(
                  host: baseUri.host,
                  port: baseUri.hasPort ? baseUri.port : null,
                )
                .toString();
          } catch (_) {
            return rawUrl;
          }
        } else if (rawUrl.startsWith('/')) {
          return '${AppConfig.getApiBaseUrl}$rawUrl';
        } else {
          return '${AppConfig.getApiBaseUrl}/$rawUrl';
        }
      }
    } catch (e) {
      print('Error loading profile image: $e');
    }
    return null;
  }

  @override
  Widget build(BuildContext context) {
    final titles = [
      'Dashboard',
      'Profile',
      'Edit Profile',
      'Online Submission',
      'Settings',
    ];
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.primary,
        title: Text(titles[_selectedIndex]),
        foregroundColor: Colors.white,
      ),
      drawer: _buildDrawer(),
      body: _pages[_selectedIndex],
    );
  }

  Widget _buildDrawer() {
    final authService = Provider.of<AuthService>(context, listen: false);
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          DrawerHeader(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                GestureDetector(
                  onTap: _refreshProfileImage,
                  child: _buildSafeProfileImage(authService),
                ),
                const SizedBox(height: 10),
                Text(
                  authService.getUserEmail(),
                  style: const TextStyle(color: Colors.white, fontSize: 16),
                ),
                Text(
                  'Role: ${authService.getUserRole()}',
                  style: const TextStyle(color: Colors.white70, fontSize: 14),
                ),
              ],
            ),
          ),
          ListTile(
            leading: const Icon(Icons.dashboard),
            title: const Text('Dashboard'),
            selected: _selectedIndex == 0,
            onTap: () => _onItemTapped(0),
          ),
          ListTile(
            leading: const Icon(Icons.person),
            title: const Text('Profile'),
            selected: _selectedIndex == 1,
            onTap: () => _onItemTapped(1),
          ),
          ListTile(
            leading: const Icon(Icons.edit),
            title: const Text('Edit Profile'),
            selected: _selectedIndex == 2,
            onTap: () => _onItemTapped(2),
          ),
          ListTile(
            leading: const Icon(Icons.web_outlined),
            title: const Text('Online Submission'),
            subtitle: const Text('Submit your manuscript via web'),
            selected: _selectedIndex == 3,
            onTap: () => _onItemTapped(3),
          ),
          ListTile(
            leading: const Icon(Icons.settings),
            title: const Text('Settings'),
            selected: _selectedIndex == 4,
            onTap: () => _onItemTapped(4),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.logout, color: Colors.red),
            title: const Text('Logout', style: TextStyle(color: Colors.red)),
            onTap: () async {
              await authService.logout(context);
              // After logout, switch to User tab to show login with navigation
              if (mounted) {
                Provider.of<NavigationProvider>(
                  context,
                  listen: false,
                ).setTab(2);
              }
            },
          ),
        ],
      ),
    );
  }
}

// Placeholder pages for each section
// ignore: unused_element
typedef _PageWidget = Widget;

// ignore: unused_element
class _DashboardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Dashboard'));
  }
}

/*class _ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Profile'));
  }
}*/

// Remove _EditProfilePage and add a wrapper that gets the latest user/profile data from context
class _EditProfileScreenWrapper extends StatefulWidget {
  @override
  State<_EditProfileScreenWrapper> createState() =>
      _EditProfileScreenWrapperState();
}

class _EditProfileScreenWrapperState extends State<_EditProfileScreenWrapper> {
  Map<String, dynamic> _user = const {};
  String _userEmail = '';
  bool _loading = true;

  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    _loadUserProfile();
  }

  Future<void> _loadUserProfile() async {
    setState(() => _loading = true);
    final authService = Provider.of<AuthService>(context, listen: false);
    try {
      final response = await ProfileService().getProfile(
        authService: authService,
      );
      setState(() {
        _user = response['data'] ?? {};
        _userEmail = authService.getUserEmail();
        _loading = false;
      });
    } catch (e) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) {
      return const Center(child: CircularProgressIndicator());
    }
    return EditUserProfileScreen(user: _user, userEmail: _userEmail);
  }
}
