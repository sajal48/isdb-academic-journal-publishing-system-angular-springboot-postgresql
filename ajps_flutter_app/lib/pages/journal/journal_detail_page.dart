import 'package:flutter/material.dart';

/// Placeholder page for displaying details of a specific journal.
class JournalDetailPage extends StatelessWidget {
  final String journalName;
  final String journalUrl;

  const JournalDetailPage({
    super.key,
    required this.journalName,
    required this.journalUrl,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: Text(journalName),
        centerTitle: true,
      ),
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text(
                'Details for $journalName',
                style: Theme.of(context).textTheme.headlineMedium,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 16),
              Text(
                'Journal URL: $journalUrl',
                style: Theme.of(context).textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              Text(
                'This page will contain detailed information about the journal, '
                'such as its aims & scope, editorial board, archives, etc.',
                style: Theme.of(context).textTheme.bodyLarge,
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
