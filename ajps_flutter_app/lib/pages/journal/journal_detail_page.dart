import 'package:ajps_flutter_app/models/journal.dart';
import 'package:flutter/material.dart';

/// Placeholder page for displaying details of a specific journal.
class JournalDetailPage extends StatelessWidget {
  final String journalName;
  final String journalUrl;
  final Journal? journal;

  const JournalDetailPage({
    super.key,
    required this.journalName,
    required this.journalUrl,
    this.journal,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              journalName,
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 16),
            if (journal?.coverImageUrl != null)
              Center(
                child: Image.network(
                  journal!.coverImageUrl,
                  height: 200,
                  fit: BoxFit.contain,
                ),
              ),
            const SizedBox(height: 16),
            Text(
              'ISSN: ${journal?.issn ?? 'N/A'}',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'Frequency: ${journal?.frequency ?? 'N/A'}',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'Type: ${journal?.journalType ?? 'N/A'}',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 16),
            Text(
              'Journal URL: $journalUrl',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
            const SizedBox(height: 24),
            Text(
              'About this journal:',
              style: Theme.of(context).textTheme.titleLarge,
            ),
            const SizedBox(height: 8),
            Text(
              'This page will contain detailed information about the journal, '
              'such as its aims & scope, editorial board, archives, etc.',
              style: Theme.of(context).textTheme.bodyLarge,
            ),
          ],
        ),
      ),
    );
  }
}
