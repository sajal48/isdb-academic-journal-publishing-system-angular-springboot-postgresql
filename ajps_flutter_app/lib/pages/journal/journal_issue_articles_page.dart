import 'package:ajps_flutter_app/models/author.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:ajps_flutter_app/models/journal.dart';
import 'package:ajps_flutter_app/models/issue.dart';
import 'package:ajps_flutter_app/models/paper.dart';
import 'package:ajps_flutter_app/pages/journal/journal_article_page.dart';
import 'package:ajps_flutter_app/services/journal_service.dart';
import 'package:url_launcher/url_launcher.dart';

class IssueArticlesPage extends StatefulWidget {
  final String journalUrl;
  final String issueNumber;
  final Journal journal;

  const IssueArticlesPage({
    super.key,
    required this.journalUrl,
    required this.issueNumber,
    required this.journal,
  });

  @override
  State<IssueArticlesPage> createState() => _IssueArticlesPageState();
}

class _IssueArticlesPageState extends State<IssueArticlesPage> {
  late Issue? issue;
  late List<Paper> papers = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadIssue();
  }

  Future<void> _loadIssue() async {
    setState(() {
      isLoading = true;
      error = null;
    });

    try {
      final issues = await JournalService().getIssuesByJournalUrl(widget.journalUrl);

      if (issues.isNotEmpty) {
        final match = RegExp(r'vol(\d+)issue(\d+)', caseSensitive: false)
            .firstMatch(widget.issueNumber);
        
        if (match != null) {
          final volume = int.parse(match.group(1)!);
          final number = int.parse(match.group(2)!);

          final foundIssue = issues.firstWhere(
            (issue) => issue.volume == volume && issue.number == number
            // orElse: () => Issue(),
          );

          // ignore: unnecessary_null_comparison
          if (foundIssue.id != null) {
            setState(() {
              issue = foundIssue;
              papers = foundIssue.papers;
            });
          } else {
            setState(() {
              error = 'Issue not found';
            });
          }
        } else {
          setState(() {
            error = 'Invalid issue format';
          });
        }
      } else {
        setState(() {
          error = 'No issues found for this journal';
        });
      }
    } catch (e) {
      setState(() {
        error = 'Failed to load issue';
      });
      debugPrint('Error loading issue: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  String _formatDate(DateTime? date) {
    if (date == null) return 'Not published';
    return DateFormat.yMMMMd().format(date);
  }

  String _formatAuthors(List<Author>? authors) {
    if (authors == null || authors.isEmpty) return '';
    return authors.map((author) => author.name).join(', ');
  }

  String _getCategoryDisplayName(String? category) {
    switch (category?.toLowerCase()) {
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

  Map<String, List<Paper>> _groupPapersByCategory() {
    final groups = <String, List<Paper>>{};

    for (final paper in papers) {
      final category = paper.submission.manuscriptCategory.toLowerCase();
      final displayName = _getCategoryDisplayName(category);

      if (!groups.containsKey(displayName)) {
        groups[displayName] = [];
      }
      groups[displayName]!.add(paper);
    }

    return groups;
  }

  Future<void> _launchUrl(String url) async {
    if (await canLaunchUrl(Uri.parse(url))) {
      await launchUrl(Uri.parse(url));
    } else {
      throw 'Could not launch $url';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.journal.journalName),
      ),
      body: _buildBody(),
    );
  }

  Widget _buildBody() {
    if (isLoading) {
      return const Center(
        child: CircularProgressIndicator(),
      );
    }

    if (error != null) {
      return Center(
        child: Text(
          error!,
          style: Theme.of(context).textTheme.bodyLarge,
        ),
      );
    }

    if (issue == null) {
      return const Center(
        child: Text('Issue not found'),
      );
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildIssueHeader(),
          const SizedBox(height: 16),
          _buildArticlesList(),
        ],
      ),
    );
  }

  Widget _buildIssueHeader() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            const Icon(Icons.bookmark_outlined),
            const SizedBox(width: 8),
            Text(
              'Volume ${issue!.volume}, Issue ${issue!.number}',
              style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text(
          'Published: ${_formatDate(issue!.publicationDate)}',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
        const Divider(),
      ],
    );
  }

  Widget _buildArticlesList() {
    if (papers.isEmpty) {
      return const Card(
        child: Padding(
          padding: EdgeInsets.all(16.0),
          child: Text('No articles found in this issue'),
        ),
      );
    }

    final groupedPapers = _groupPapersByCategory();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: groupedPapers.entries.map((entry) {
        return Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              entry.key,
              style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            ...entry.value.map((paper) => _buildArticleCard(paper)),
            const SizedBox(height: 16),
          ],
        );
      }).toList(),
    );
  }

  Widget _buildArticleCard(Paper paper) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              paper.submission.manuscriptTitle,
              style: Theme.of(context).textTheme.titleMedium?.copyWith(
                    fontWeight: FontWeight.bold,
                  ),
            ),
            const SizedBox(height: 8),
            Text(
              _formatAuthors(paper.submission.authors),
              style: Theme.of(context).textTheme.bodyMedium,
            ),
            const SizedBox(height: 16),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: [
                ElevatedButton(
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (context) => ArticlePage(
                          paper: paper,
                          journal: widget.journal,
                          issue: issue!,
                        ),
                      ),
                    );
                  },
                  child: const Text('Abstract'),
                ),
                /*ElevatedButton(
                  onPressed: () {
                    final pdfUrl = paper.fileUpload?.fileUrl;
                    if (pdfUrl != null) {
                      _launchUrl(pdfUrl);
                    }
                  },
                  child: const Text('View PDF'),
                ),*/
                OutlinedButton(
                  onPressed: () {
                    final pdfUrl = paper.fileUpload.fileUrl;
                    // ignore: unnecessary_null_comparison
                    if (pdfUrl != null) {
                      _launchUrl(pdfUrl);
                    }
                  },
                  child: const Text('Download PDF'),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}