import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/sections/home_section.dart';
import 'package:ajps_flutter_app/pages/journal/journal_main_page.dart';
import 'package:ajps_flutter_app/sections/user_section.dart';
import 'package:ajps_flutter_app/pages/user/admin_dashboard_screen.dart';
import 'package:ajps_flutter_app/pages/user/journal_submissions_screen.dart';
import 'package:ajps_flutter_app/pages/user/reviewer_dashboard_screen.dart';
import 'package:ajps_flutter_app/pages/login_register/login_screen.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:ajps_flutter_app/navigation/navigation_provider.dart';
import 'package:provider/provider.dart';

class MainNavigator extends StatefulWidget {
  const MainNavigator({super.key});

  @override
  State<MainNavigator> createState() => _MainNavigatorState();
}

class _MainNavigatorState extends State<MainNavigator> {
  final PageController _pageController = PageController();
  final GlobalKey<HomeSectionState> _homeSectionKey = GlobalKey();

  @override
  Widget build(BuildContext context) {
    final navigationProvider = Provider.of<NavigationProvider>(context);
    final authService = Provider.of<AuthService>(context, listen: false);
    Widget userTab;

    if (!authService.isLoggedIn) {
      // Show login screen if not authenticated
      userTab = const LoginScreen();
    } else {
      final userRole = authService.getUserRole();
      switch (userRole) {
        case 'admin':
          userTab = const AdminDashboardScreen();
          break;
        case 'editor':
          userTab = const JournalSubmissionsScreen();
          break;
        case 'reviewer':
          userTab = const ReviewerDashboardScreen();
          break;
        default:
          userTab = const UserSectionPage();
      }
    }

    final pages = [
      HomeSection(key: _homeSectionKey),
      const JournalPage(),
      userTab,
    ];
    return Scaffold(
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(), // Disable swipe
        children: pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book),
            label: 'Journal',
          ),
          BottomNavigationBarItem(icon: Icon(Icons.person), label: 'User'),
        ],
        currentIndex: navigationProvider.selectedIndex,
        selectedItemColor: Theme.of(context).colorScheme.primary,
        onTap: (index) {
          // If tapping the currently selected Home tab, reset it
          if (navigationProvider.selectedIndex == index && index == 0) {
            _homeSectionKey.currentState?.reset();
          }

          navigationProvider.setTab(index);
          _pageController.jumpToPage(index);
        },
      ),
    );
  }
}
