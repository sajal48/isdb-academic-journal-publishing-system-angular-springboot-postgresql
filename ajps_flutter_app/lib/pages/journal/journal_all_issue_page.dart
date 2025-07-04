import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/models/journal.dart';

class JournalAllIssuePage extends StatelessWidget {
  final Journal journal;

  const JournalAllIssuePage({super.key, required this.journal});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Archives of ${journal.journalName}',
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 16),
            Text(
              'This page will display the archives for ${journal.journalName}.',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            // Add actual archives content here
          ],
        ),
      ),
    );
  }
}
