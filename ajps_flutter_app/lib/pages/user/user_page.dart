import 'package:flutter/material.dart';

/// Placeholder widget for the User tab in the bottom navigation.
class UserPage extends StatelessWidget {
  const UserPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('User Profile'),
        centerTitle: true,
      ),
      body: Center(
        child: Text(
          'Content for User Page goes here.',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
      ),
    );
  }
}
