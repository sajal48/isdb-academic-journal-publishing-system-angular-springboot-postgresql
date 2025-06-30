import 'package:flutter/material.dart';

/// Placeholder widget for the Journal tab in the bottom navigation.
class JournalPage extends StatelessWidget {
  const JournalPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Journal'),
        centerTitle: true,
      ),
      body: Center(
        child: Text(
          'Content for Journal Page goes here.',
          style: Theme.of(context).textTheme.headlineMedium,
        ),
      ),
    );
  }
}
