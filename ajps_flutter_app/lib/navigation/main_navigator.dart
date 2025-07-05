import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/sections/home_section.dart';
import 'package:ajps_flutter_app/pages/journal/journal_main_page.dart';
import 'package:ajps_flutter_app/pages/user/user_auth_wrapper.dart'; // Use the new wrapper

class MainNavigator extends StatefulWidget {
  const MainNavigator({super.key});

  @override
  State<MainNavigator> createState() => _MainNavigatorState();
}

class _MainNavigatorState extends State<MainNavigator> {
  int _selectedIndex = 0;
  final PageController _pageController = PageController();

  // GlobalKey to control the HomeSection state
  final GlobalKey<HomeSectionState> _homeSectionKey = GlobalKey();

  late final List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _pages = [
      HomeSection(key: _homeSectionKey),
      const JournalPage(),
      const UserAuthWrapper(), // Use UserAuthWrapper for the User tab
    ];
  }

  void _onItemTapped(int index) {
    // If tapping the currently selected Home tab, reset it
    if (_selectedIndex == index && index == 0) {
      _homeSectionKey.currentState?.reset();
    }

    setState(() {
      _selectedIndex = index;
    });
    _pageController.jumpToPage(index);
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: PageView(
        controller: _pageController,
        physics: const NeverScrollableScrollPhysics(), // Disable swipe
        children: _pages,
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
        currentIndex: _selectedIndex,
        selectedItemColor: Theme.of(context).colorScheme.primary,
        onTap: _onItemTapped,
      ),
    );
  }
}
