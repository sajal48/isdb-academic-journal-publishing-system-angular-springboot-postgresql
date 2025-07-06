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
  void initState() {
    super.initState();
    _pages = [
      _DashboardPage(),
      _ProfilePage(),
      _EditProfilePage(),
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

class _DashboardPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Dashboard'));
  }
}

class _ProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Profile'));
  }
}

class _EditProfilePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return const Center(child: Text('Edit Profile'));
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
