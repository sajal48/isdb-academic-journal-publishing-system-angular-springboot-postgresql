import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/pages/home/home_page_content.dart';
import 'package:ajps_flutter_app/pages/home/about_page_content.dart';
import 'package:ajps_flutter_app/pages/home/contact_page_content.dart';
import '../pages/home/service_page_content.dart';

class HomeSection extends StatefulWidget {
  const HomeSection({super.key});

  @override
  HomeSectionState createState() => HomeSectionState();
}

class HomeSectionState extends State<HomeSection> {
  int _homePageIndex = 0;
  
  final List<Widget> _homePages = <Widget>[
    const HomePageContent(),
    const AboutPage(),
    const ServicesPage(),
    const ContactPage(),
  ];

  // Method to reset to the default home page
  void reset() {
    setState(() {
      _homePageIndex = 0; // Reset to the first page (Home)
    });
  }

  String _getHomePageTitle(int index) {
    switch (index) {
      case 0: return 'Welcome to ScholarPress';
      case 1: return 'About Us';
      case 2: return 'Services';
      case 3: return 'Contact Us';
      default: return 'Home';
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
        child: ListView(
          padding: EdgeInsets.zero,
          children: <Widget>[
            DrawerHeader(
              decoration: BoxDecoration(
                color: Theme.of(context).colorScheme.primary,
              ),
              /*child: const Text(
                'Home Menu',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 24,
                  height: 10,
                ),
              ),*/
              child: Image.asset(
                'assets/images/logo.png',
                ),
            ),
            ListTile(
              leading: const Icon(Icons.article),
              title: const Text('Home'),
              selected: _homePageIndex == 0, 
              onTap: () {
                setState(() => _homePageIndex = 0);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.info),
              title: const Text('About Us'),
              selected: _homePageIndex == 1,
              onTap: () {
                setState(() => _homePageIndex = 1);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.design_services),
              title: const Text('Services'),
              selected: _homePageIndex == 2,
              onTap: () {
                setState(() => _homePageIndex = 2);
                Navigator.pop(context);
              },
            ),
            ListTile(
              leading: const Icon(Icons.contact_mail),
              title: const Text('Contact Us'),
              selected: _homePageIndex == 3,
              onTap: () {
                setState(() => _homePageIndex = 3); 
                Navigator.pop(context);
              },
            ),
          ],
        ),
      ),
      body: _homePages[_homePageIndex],
    );
  }
}