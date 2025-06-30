import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/pages/home/home_page_content.dart';
import 'package:ajps_flutter_app/pages/home/about_page.dart';
import 'package:ajps_flutter_app/pages/home/contact_page.dart';

import '../pages/home/service_page.dart';

/// HomeSection manages the left drawer navigation for its sub-pages.
class HomeSection extends StatefulWidget {
  const HomeSection({super.key});

  @override
  State<HomeSection> createState() => _HomeSectionState();
}

class _HomeSectionState extends State<HomeSection> {
  int _homePageIndex = 0; // Tracks the currently selected page within the Home section.

  // List of widgets corresponding to each page accessible via the left drawer.
  final List<Widget> _homePages = <Widget>[
    const HomePageContent(), // The main homepage content
    const AboutPage(), // The About Us page
    const ServicesPage(),
    const ContactUsPage(), // The Contact Us page
  ];

  /// Returns the appropriate AppBar title based on the currently selected home page.
  String _getHomePageTitle(int index) {
    switch (index) {
      case 0:
        return 'Welcome to ScholarPress';
      case 1:
        return 'About Us';
      case 2:
        return 'Services';
      case 3:
        return 'Contact Us';
      default:
        return 'Home';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(_getHomePageTitle(_homePageIndex)),
        centerTitle: true,
      ),
      drawer: Drawer(
        // The Drawer is the left-hand navigation menu.
        child: ListView(
          padding: EdgeInsets.zero, // Remove default ListView padding
          children: <Widget>[
            // Custom header for the drawer.
            DrawerHeader(
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
              ),
              child: const Text(
                'Home Menu',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                ),
              ),
            ),
            // Navigation item for the Homepage.
            ListTile(
              leading: const Icon(Icons.article),
              title: const Text('Home'),
              selected: _homePageIndex == 0, // Highlights the item if it's the current page
              onTap: () {
                setState(() {
                  _homePageIndex = 0; // Update the index to show Homepage
                });
                Navigator.pop(context); // Close the drawer after selection
              },
            ),
            // Navigation item for the About Page.
            ListTile(
              leading: const Icon(Icons.info),
              title: const Text('About Us'),
              selected: _homePageIndex == 1,
              onTap: () {
                setState(() {
                  _homePageIndex = 1; // Update the index to show About Page
                });
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.design_services),
              title: const Text('Services'),
              selected: _homePageIndex == 2,
              onTap: () {
                setState(() {
                  _homePageIndex = 2; // Update the index to show About Page
                });
                Navigator.pop(context);
              },
            ),
            // Navigation item for the Contact Page.
            ListTile(
              leading: const Icon(Icons.contact_mail),
              title: const Text('Contact Us'),
              selected: _homePageIndex == 3,
              onTap: () {
                setState(() {
                  _homePageIndex = 3; // Update the index to show Contact Page
                });
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
      // Displays the content of the currently selected page from the left drawer.
      body: _homePages[_homePageIndex],
    );
  }
}
