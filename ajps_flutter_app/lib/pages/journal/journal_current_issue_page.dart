import 'package:ajps_flutter_app/models/author.dart';
import 'package:ajps_flutter_app/pages/journal/journal_article_page.dart';
import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/models/journal.dart';
import 'package:ajps_flutter_app/models/issue.dart';
import 'package:ajps_flutter_app/models/paper.dart';
import 'package:ajps_flutter_app/services/journal_service.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';

class JournalCurrentIssuePage extends StatefulWidget {
  final Journal journal;

  const JournalCurrentIssuePage({super.key, required this.journal});

  @override
  State<JournalCurrentIssuePage> createState() =>
      _JournalCurrentIssuePageState();
}

class _JournalCurrentIssuePageState extends State<JournalCurrentIssuePage> {
  final JournalService _journalService = JournalService();
  late Future<List<Issue>> _issuesFuture;
  bool _isLoading = true;
  String? _error;
  Issue? _currentIssue; // Added to store the current issue

  @override
  void initState() {
    super.initState();
    _issuesFuture = _loadIssues();
  }

  Future<List<Issue>> _loadIssues() async {
    try {
      final issues = await _journalService.getIssuesByJournalUrl(
        widget.journal.journalUrl,
      );
      setState(() {
        _isLoading = false;
        // Store the current issue when data is loaded
        if (issues.isNotEmpty) {
          final publishedIssues = issues
              .where((issue) => issue.status == 'PUBLISHED')
              .toList();
          if (publishedIssues.isNotEmpty) {
            publishedIssues.sort(
              (a, b) => b.publicationDate.compareTo(a.publicationDate),
            );
            _currentIssue = publishedIssues.first;
          }
        }
      });
      return issues;
    } catch (e) {
      setState(() {
        _error = e.toString();
        _isLoading = false;
      });
      return [];
    }
  }

  String _formatDate(DateTime date) {
    return DateFormat.yMMMMd().format(date);
  }

  String _formatAuthors(List<Author> authors) {
    if (authors.isEmpty) return '';
    return authors.map((author) => author.name).join(', ');
  }

  String _getCategoryDisplayName(String category) {
    switch (category) {
      case 'research':
        return 'Research Articles';
      case 'review':
        return 'Review Articles';
      case 'short':
        return 'Short Communications';
      case 'editorial':
        return 'Editorial';
      default:
        return 'Articles';
    }
  }

  Map<String, List<Paper>> _groupPapersByCategory(List<Paper> papers) {
    final groups = <String, List<Paper>>{};

    for (final paper in papers) {
      final category = paper.submission.manuscriptCategory;
      final displayName = _getCategoryDisplayName(category);

      groups.putIfAbsent(displayName, () => []);
      groups[displayName]!.add(paper);
    }

    return groups;
  }

  Future<void> _launchUrl(String url) async {
    if (!await launchUrl(Uri.parse(url))) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: FutureBuilder<List<Issue>>(
        future: _issuesFuture,
        builder: (context, snapshot) {
          if (_isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          if (_error != null) {
            return Center(child: Text(_error!));
          }

          if (!snapshot.hasData || snapshot.data!.isEmpty) {
            return const Center(child: Text('No issues available'));
          }

          if (_currentIssue == null) {
            return const Center(child: Text('No published issues available'));
          }

          final papers = _currentIssue!.papers;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Volume ${_currentIssue!.volume}, Issue ${_currentIssue!.number}',
                  style: Theme.of(context).textTheme.headlineSmall,
                ),
                Text(
                  'Published: ${_formatDate(_currentIssue!.publicationDate)}',
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const Divider(),

                if (papers.isEmpty)
                  const Padding(
                    padding: EdgeInsets.all(16.0),
                    child: Text('No articles found in this issue.'),
                  ),

                ..._buildPaperSections(papers),
              ],
            ),
          );
        },
      ),
    );
  }

  List<Widget> _buildPaperSections(List<Paper> papers) {
    final groupedPapers = _groupPapersByCategory(papers);
    final sections = <Widget>[];

    groupedPapers.forEach((category, papers) {
      if (papers.isNotEmpty) {
        sections.addAll([
          Text(
            category,
            style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          ...papers.map((paper) => _buildPaperCard(paper)),
          const SizedBox(height: 16),
        ]);
      }
    });

    return sections;
  }

  Widget _buildPaperCard(Paper paper) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: InkWell(
        onTap: () {
          if (_currentIssue != null) {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => ArticlePage(
                  paper: paper,
                  issue: _currentIssue!,
                  journal: widget.journal,
                ),
              ),
            );
          }
        },
        child: Padding(
          padding: const EdgeInsets.all(16.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                paper.submission.manuscriptTitle,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              const SizedBox(height: 8),
              Text(_formatAuthors(paper.submission.authors)),
              const SizedBox(height: 16),
              Row(
                children: [
                  ElevatedButton(
                    onPressed: () {
                      if (_currentIssue != null) {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => ArticlePage(
                              paper: paper,
                              issue: _currentIssue!,
                              journal: widget.journal,
                            ),
                          ),
                        );
                      }
                    },
                    child: const Text('Abstract'),
                  ),
                  const SizedBox(width: 8),
                  OutlinedButton(
                    onPressed: () => _launchUrl(paper.fileUpload.fileUrl),
                    child: const Text('Download PDF'),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
