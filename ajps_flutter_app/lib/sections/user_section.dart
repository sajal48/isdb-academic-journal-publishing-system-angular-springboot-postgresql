import 'package:ajps_flutter_app/pages/user/edit_user_profile_screen.dart';
import 'package:ajps_flutter_app/pages/user/user_dashboard_screen.dart';
import 'package:ajps_flutter_app/pages/user/user_profile_page_screen.dart';
import 'package:ajps_flutter_app/services/profile_service.dart';
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
      _OnlineSubmissionPage(),
      _SettingsPage(),
    ];
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    Navigator.pop(context); // Close the drawer
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
                const CircleAvatar(
                  radius: 28,
                  child: Icon(Icons.person, size: 36),
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
            leading: const Icon(Icons.upload_file),
            title: const Text('Online Submission'),
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

class _OnlineSubmissionPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Online Submission'));
  }
}

class _SettingsPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Settings'));
  }
}
