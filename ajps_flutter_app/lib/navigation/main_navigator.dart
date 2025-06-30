import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/sections/home_section.dart';
import 'package:ajps_flutter_app/pages/journal/journal_page.dart';
import 'package:ajps_flutter_app/pages/user/user_page.dart';

/// MainNavigator manages the bottom navigation bar for the primary app sections.
class MainNavigator extends StatefulWidget {
  const MainNavigator({super.key});

  @override
  State<MainNavigator> createState() => _MainNavigatorState();
}

class _MainNavigatorState extends State<MainNavigator> {
  int _selectedIndex = 0; // Tracks the currently selected bottom navigation tab

  // List of widgets corresponding to each bottom navigation tab.
  // Each tab has its own Scaffold to manage its AppBar and potential drawers.
  final List<Widget> _pages = <Widget>[
    const HomeSection(), // The Home section with its own internal navigation (left drawer)
    const JournalPage(), // Placeholder for Journal content
    const UserPage(), // Placeholder for User content
  ];

  /// Handles tap events on the bottom navigation bar items.
  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // IndexedStack is used to preserve the state of the pages when switching tabs,
      // preventing them from rebuilding every time.
      body: IndexedStack(
        index: _selectedIndex,
        children: _pages,
      ),
      bottomNavigationBar: BottomNavigationBar(
        items: const <BottomNavigationBarItem>[
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: 'Home',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.menu_book),
            label: 'Journal',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: 'User',
          ),
        ],
        currentIndex: _selectedIndex, // The currently selected tab
        selectedItemColor: Theme.of(context).colorScheme.primary, // Color for selected icon/label
        onTap: _onItemTapped, // Callback when a tab is tapped
      ),
    );
  }
}
