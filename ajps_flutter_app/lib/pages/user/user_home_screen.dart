import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/sections/user_section.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    // Show the operational user section (dashboard, profile, etc.)
    return const UserSectionPage();
  }
}
