import 'package:ajps_flutter_app/pages/journal/journal_issue_articles_page.dart';
import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/models/journal.dart';
import 'package:ajps_flutter_app/models/issue.dart';
import 'package:intl/intl.dart';
import 'package:ajps_flutter_app/services/journal_service.dart';

class JournalAllIssuePage extends StatefulWidget {
  final Journal journal;

  const JournalAllIssuePage({
    super.key,
    required this.journal,
  });

  @override
  State<JournalAllIssuePage> createState() => _JournalAllIssuePageState();
}

class _JournalAllIssuePageState extends State<JournalAllIssuePage> {
  late List<Issue> issues = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadIssues();
  }

  Future<void> _loadIssues() async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      final issues = await JournalService().getIssuesByJournalUrl(widget.journal.journalUrl);
      setState(() {
        this.issues = issues;
      });
    } catch (e) {
      setState(() {
        error = 'Failed to load issues';
      });
      debugPrint('Error loading issues: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    final publishedIssues = issues.where((issue) => issue.status == 'PUBLISHED').toList()
      ..sort((a, b) {
        // Sort by volume DESC, then issue number DESC
        return b.volume != a.volume
            ? b.volume.compareTo(a.volume)
            : b.number.compareTo(a.number);
      });

    return Scaffold(
      body: _buildBody(publishedIssues),
    );
  }

  Widget _buildBody(List<Issue> publishedIssues) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (error != null) {
      return Center(child: Text(error!));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.only(bottom: 16.0),
            child: Row(
              children: [
                const Icon(Icons.bookmark_outlined),
                const SizedBox(width: 8),
                Text(
                  'All Issues List',
                  style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                ),
              ],
            ),
          ),
          if (publishedIssues.isNotEmpty)
            Column(
              children: publishedIssues.map((issue) => 
                _buildIssueCard(context, issue)
              ).toList(),
            )
          else
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 32.0),
              child: Center(
                child: Text(
                  'No issues found for this journal',
                  style: Theme.of(context).textTheme.bodyLarge,
                ),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildIssueCard(BuildContext context, Issue issue) {
    final dateFormat = DateFormat('MMMM d, y');
    // ignore: unnecessary_null_comparison
    final publicationDate = issue.publicationDate != null
        ? dateFormat.format(issue.publicationDate)
        : 'Not published';

    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Volume ${issue.volume}, Issue ${issue.number}',
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              'Published: $publicationDate',
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => IssueArticlesPage(
                        journalUrl: widget.journal.journalUrl,
                        issueNumber: 'vol${issue.volume}issue${issue.number}',
                        journal: widget.journal,
                      ),
                    ),
                  );
                },
                child: const Text('View Issue'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}