import 'package:ajps_flutter_app/models/journal.dart';
import 'package:flutter/material.dart';

class JournalDetailPage extends StatefulWidget {
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
  State<JournalDetailPage> createState() => _JournalDetailPageState();
}

class _JournalDetailPageState extends State<JournalDetailPage> {
  bool isLoading = true;
  Journal? journal;
  String? error;

  @override
  void initState() {
    super.initState();
    // Simulate loading journal details
    Future.delayed(const Duration(seconds: 1), () {
      setState(() {
        isLoading = false;
        journal =
            widget.journal ??
            Journal(
              journalName: widget.journalName,
              journalUrl: widget.journalUrl,
              issn: widget.journal!.issn,
              frequency: widget.journal!.frequency,
              journalType: widget.journal!.journalType,
              aboutJournal: widget.journal!.aboutJournal,
              aimsScopes: widget.journal!.aimsScopes,
              coverImageUrl: widget.journal!.coverImageUrl,
            );
      });
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(title: Text(widget.journalName)),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
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
                    'Frequency: ${journal?.frequency ?? 'One issue per year, with the flexibility to adjust based on the volume of high-quality submissions'}',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 8),
                  Text(
                    'Type: ${journal?.journalType ?? 'N/A'}',
                    style: Theme.of(context).textTheme.bodyLarge,
                  ),
                  const SizedBox(height: 24),
                  const SectionTitle('About the Journal'),
                  const SizedBox(height: 8),
                  HtmlText(journal?.aboutJournal ?? 'No description available'),
                  const SizedBox(height: 24),
                  const SectionTitle('Publication Frequency'),
                  const SizedBox(height: 8),
                  const Text(
                    'One issue per year, with the flexibility to adjust based on the volume of high-quality submissions.',
                  ),
                  const SizedBox(height: 24),
                  const SectionTitle('Manuscript Categories'),
                  const SizedBox(height: 8),
                  const Text(
                    'We publish a diverse range of works to cater to various research needs:',
                  ),
                  const SizedBox(height: 8),
                  Container(
                    padding: const EdgeInsets.all(16),
                    decoration: BoxDecoration(
                      color: Theme.of(
                        context,
                      ).colorScheme.surfaceContainerHighest,
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Original Research Articles:',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const Text(
                          'Showcase your groundbreaking research with scientific excellence.',
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Review Articles:',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const Text(
                          'Provide in-depth analyses of contemporary issues or specific research questions.',
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Short Communications:',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const Text(
                          'Share novel, significant findings in a concise format.',
                        ),
                        const SizedBox(height: 8),
                        const Text(
                          'Case Reports:',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        const Text(
                          'Present detailed studies from any science and technology discipline.',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  RichText(
                    text: TextSpan(
                      style: Theme.of(context).textTheme.bodyMedium,
                      children: [
                        const TextSpan(
                          text: 'Note: ',
                          style: TextStyle(fontWeight: FontWeight.bold),
                        ),
                        TextSpan(
                          text:
                              'We encourage concise manuscripts without strict page or word limits. ',
                        ),
                        TextSpan(
                          text: 'Visit our Author Guidelines for details.',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          // Add recognizer for tap gesture if needed
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const SectionTitle('Aims and Scope'),
                  const SizedBox(height: 8),
                  HtmlText(
                    journal?.aimsScopes ??
                        'No aims and scope information available',
                  ),
                  const SizedBox(height: 24),
                  const SectionTitle('Our Editorial Team'),
                  const SizedBox(height: 8),
                  const Text(
                    'The editorial team comprises the Editor-in-Chief, Executive Editor, Advisory Editorial Members, and Editorial Members, supported by a Managing Editor and Editorial Assistant. Appointments last three years, with the possibility of renewal. Selection criteria include expertise, a strong Google Scholar H-index, and relevant experience. The Editor-in-Chief must be an active professor at a reputable university with at least two years of editorial experience. Other members require a doctorate or over five years of research experience. We strive for geographical diversity and comprehensive expertise to maintain a balanced and dynamic team.',
                  ),
                  const SizedBox(height: 24),
                  const SectionTitle('Funding and Sustainability'),
                  const SizedBox(height: 8),
                  RichText(
                    text: TextSpan(
                      style: Theme.of(context).textTheme.bodyMedium,
                      children: [
                        const TextSpan(text: 'Published by '),
                        TextSpan(
                          text: 'ScholarPress',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                        const TextSpan(
                          text:
                              ', the journal sustains its operations through an ',
                        ),
                        TextSpan(
                          text: 'Article Processing Charge (APC)',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                        const TextSpan(
                          text:
                              ' applied to accepted manuscripts. This ensures the journal remains freely accessible to readers worldwide while covering essential maintenance costs.',
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                ],
              ),
            ),
    );
  }
}

class SectionTitle extends StatelessWidget {
  final String title;

  const SectionTitle(this.title, {super.key});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: Theme.of(
        context,
      ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
    );
  }
}

class HtmlText extends StatelessWidget {
  final String html;

  const HtmlText(this.html, {super.key});

  @override
  Widget build(BuildContext context) {
    // For simplicity, we're just displaying the text directly
    // In a real app, you might want to use a package like flutter_html
    // to properly render HTML content
    return Text(html);
  }
}
