import 'package:ajps_flutter_app/models/author.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import 'package:ajps_flutter_app/models/paper.dart';
import 'package:ajps_flutter_app/models/issue.dart';
import 'package:ajps_flutter_app/models/journal.dart';

class ArticlePage extends StatelessWidget {
  final Paper paper;
  final Issue issue;
  final Journal journal;

  const ArticlePage({
    super.key,
    required this.paper,
    required this.issue,
    required this.journal,
  });

  String _formatDate(DateTime date) {
    return DateFormat.yMMMMd().format(date);
  }

  String _getArticleType(String category) {
    switch (category) {
      case 'research':
        return 'Research Article';
      case 'review':
        return 'Review Article';
      case 'short':
        return 'Short Communication';
      case 'editorial':
        return 'Editorial';
      default:
        return 'Article';
    }
  }

  Map<String, String> _formatAuthors(List<Author> authors) {
    if (authors.isEmpty) return {'names': '', 'details': ''};

    final namesBuffer = StringBuffer();
    final detailsBuffer = StringBuffer();

    for (var i = 0; i < authors.length; i++) {
      final author = authors[i];
      final sup = _superscript(i + 1);

      // Build names string
      namesBuffer.write(author.name);
      if (author.corresponding) {
        namesBuffer.write('*');
      }
      namesBuffer.write(sup);

      // Add comma if not last author
      if (i < authors.length - 1) {
        namesBuffer.write(', ');
      }

      // Build details string
      detailsBuffer.write('$sup${author.institution}');

      // Add comma if not last author
      if (i < authors.length - 1) {
        detailsBuffer.write(', ');
      }
    }

    return {
      'names': namesBuffer.toString(),
      'details': detailsBuffer.toString(),
    };
  }

  String _superscript(int number) {
    final superscripts = ['⁰', '¹', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹'];
    return number
        .toString()
        .split('')
        .map((d) => superscripts[int.parse(d)])
        .join('');
  }

  Author? _getCorrespondingAuthor(List<Author> authors) {
    return authors.firstWhere(
      (a) => a.corresponding,
      orElse: () => authors.first,
    );
  }

  String _getCitation() {
    final firstAuthor = paper.submission.authors.isNotEmpty
        ? paper.submission.authors.first.name.split(' ').last
        : '';
    final year = paper.submission.submittedAt.year;

    return '$firstAuthor et al. ($year). ${paper.submission.manuscriptTitle}. '
        '${journal.journalName}, ${issue.volume}(${issue.number})';
  }

  /*Map<String, String> _getShareLinks(String currentUrl) {
    return {
      'facebook':
          'https://www.facebook.com/sharer.php?u=${Uri.encodeComponent(currentUrl)}',
      'twitter':
          'https://twitter.com/share?text=${Uri.encodeComponent(paper.submission.manuscriptTitle)}'
          '&url=${Uri.encodeComponent(currentUrl)}',
      'linkedin':
          'https://www.linkedin.com/sharing/share-offsite/?url=${Uri.encodeComponent(currentUrl)}',
    };
  }*/

  Future<void> _launchUrl(String url) async {
    if (!await launchUrl(Uri.parse(url))) {
      throw Exception('Could not launch $url');
    }
  }

  @override
  Widget build(BuildContext context) {
    // final currentUrl = ''; // You might want to get this dynamically
    final formattedAuthors = _formatAuthors(paper.submission.authors);
    final correspondingAuthor = _getCorrespondingAuthor(
      paper.submission.authors,
    );
    // final shareLinks = _getShareLinks(currentUrl);

    return Scaffold(
      appBar: AppBar(title: Text(journal.journalName)),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Article type and social share
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  _getArticleType(paper.submission.manuscriptCategory),
                  style: const TextStyle(fontStyle: FontStyle.italic),
                ),
                /*Row(
                  children: [
                    const Text('Share this article:'),
                    IconButton(
                      icon: Image.asset(
                        'assets/images/facebook-icon.png',
                        width: 24,
                      ),
                      onPressed: () => _launchUrl(shareLinks['facebook']!),
                    ),
                    IconButton(
                      icon: Image.asset('assets/images/twitter.png', width: 24),
                      onPressed: () => _launchUrl(shareLinks['twitter']!),
                    ),
                    IconButton(
                      icon: Image.asset(
                        'assets/images/linkedin-icon.png',
                        width: 24,
                      ),
                      onPressed: () => _launchUrl(shareLinks['linkedin']!),
                    ),
                  ],
                ),*/
              ],
            ),

            // Article title
            Text(
              paper.submission.manuscriptTitle,
              style: Theme.of(context).textTheme.headlineMedium,
            ),
            const SizedBox(height: 16),

            // Authors information
            if (paper.submission.authors.isNotEmpty) ...[
              Text(formattedAuthors['names']!),
              const SizedBox(height: 8),
              Text(formattedAuthors['details']!),
              if (correspondingAuthor != null) ...[
                const SizedBox(height: 8),
                RichText(
                  text: TextSpan(
                    style: DefaultTextStyle.of(context).style,
                    children: [
                      const TextSpan(
                        text: 'Contact: ',
                        style: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: Colors.black,
                          fontSize: 16,
                        ),
                      ),
                      TextSpan(
                        text: correspondingAuthor.email,
                        style: const TextStyle(
                          color: Colors.blue,
                          fontSize: 16,
                        ),
                        recognizer: TapGestureRecognizer()
                          ..onTap = () =>
                              _launchUrl('mailto:${correspondingAuthor.email}'),
                      ),
                    ],
                  ),
                ),
              ],
              const Divider(height: 32),
            ],

            // Article history
            const Text(
              'Article History',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text('Received: ${_formatDate(paper.submission.createdAt)}'),
            Text('Published: ${_formatDate(paper.submission.submittedAt)}'),
            const Divider(height: 32),

            // Abstract
            const Text(
              'Abstract',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(paper.submission.abstractContent),
            const Divider(height: 32),

            // Keywords
            if (paper.submission.manuscriptKeywords.isNotEmpty) ...[
              const Text(
                'Keywords',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(paper.submission.manuscriptKeywords),
              const Divider(height: 32),
            ],

            // Citation
            const Text(
              'Citation',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 8),
            Text(_getCitation()),
            const Divider(height: 32),

            // Download button
            Center(
              child: ElevatedButton.icon(
                icon: const Icon(Icons.download),
                label: const Text('Download PDF'),
                onPressed: () => _launchUrl(paper.fileUpload.fileUrl),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
