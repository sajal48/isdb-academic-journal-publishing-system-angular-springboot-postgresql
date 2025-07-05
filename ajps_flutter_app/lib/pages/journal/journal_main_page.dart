import 'package:ajps_flutter_app/sections/journal_section.dart';
import 'package:ajps_flutter_app/settings/app_config.dart';
import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/models/journal.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class JournalPage extends StatefulWidget {
  const JournalPage({super.key});

  @override
  State<JournalPage> createState() => _JournalPageState();
}

class _JournalPageState extends State<JournalPage> {
  List<Journal> _journals = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchJournals();
  }

  Future<void> _fetchJournals() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final baseUrl = AppConfig.getBaseUrl;

    try {
      final response = await http.get(
        Uri.parse('$baseUrl/api/journal/get-all-journals'),
      );

      if (response.statusCode == 200) {
        final jsonResponse = jsonDecode(response.body) as List;
        setState(() {
          _journals = jsonResponse
              .map(
                (data) => Journal(
                  journalName: data['journalName'] ?? 'N/A',
                  issn: data['issn'] ?? 'N/A',
                  frequency: data['frequency'] ?? 'N/A',
                  journalType: data['journalType'] ?? 'N/A',
                  coverImageUrl:
                      data['coverImageUrl'] ??
                      'https://placehold.co/150x200/E0E0E0/000000?text=No+Image',
                  journalUrl: data['journalUrl'] ?? 'no-url',
                  aboutJournal: data['aboutJournal'] ?? 'N/A',
                  aimsScopes: data['aimsScopes'] ?? 'N/A',
                ),
              )
              .toList();
        });
      } else {
        setState(() {
          _errorMessage =
              'Failed to load journals: Server responded with status code ${response.statusCode}';
        });
        debugPrint('API Error: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to load journals: ${e.toString()}';
      });
      debugPrint('Error fetching journals: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Our Journals'),
        centerTitle: true,
      ),
      body: _buildJournalsContent(),
    );
  }

  Widget _buildJournalsContent() {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            if (_isLoading)
              const Center(
                child: Padding(
                  padding: EdgeInsets.symmetric(vertical: 50.0),
                  child: CircularProgressIndicator(),
                ),
              )
            else if (_errorMessage != null)
              Center(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 50.0),
                  child: Column(
                    children: [
                      const Icon(
                        Icons.error_outline,
                        color: Colors.red,
                        size: 40,
                      ),
                      const SizedBox(height: 10),
                      Text(
                        _errorMessage!,
                        style: Theme.of(
                          context,
                        ).textTheme.bodyLarge?.copyWith(color: Colors.red),
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: _fetchJournals,
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                ),
              )
            else if (_journals.isEmpty)
              Padding(
                padding: const EdgeInsets.symmetric(vertical: 50.0),
                child: Text(
                  'No journal published yet.',
                  style: Theme.of(
                    context,
                  ).textTheme.bodyLarge?.copyWith(color: Colors.black54),
                  textAlign: TextAlign.center,
                ),
              )
            else
              Wrap(
                spacing: 16.0,
                runSpacing: 16.0,
                alignment: WrapAlignment.center,
                children: _journals
                    .map((journal) => _buildJournalCard(journal))
                    .toList(),
              ),
          ],
        ),
      ),
    );
  }

  Widget _buildJournalCard(Journal journal) {
    return SizedBox(
      width: MediaQuery.of(context).size.width,
      child: Card(
        elevation: 2.0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8.0)),
        child: InkWell(
          onTap: () => _navigateToJournalSection(journal),
          borderRadius: BorderRadius.circular(8.0),
          child: Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              children: [
                Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildJournalImage(journal),
                    const SizedBox(width: 12.0),
                    _buildJournalInfo(journal),
                  ],
                ),
                const SizedBox(height: 16.0),
                _buildVisitButton(journal),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildJournalImage(Journal journal) {
    return SizedBox(
      width: 100,
      height: 130,
      child: ClipRRect(
        borderRadius: BorderRadius.circular(4.0),
        child: Image.network(
          journal.coverImageUrl,
          fit: BoxFit.cover,
          loadingBuilder: (context, child, loadingProgress) {
            if (loadingProgress == null) return child;
            return Center(
              child: CircularProgressIndicator(
                value: loadingProgress.expectedTotalBytes != null
                    ? loadingProgress.cumulativeBytesLoaded /
                          loadingProgress.expectedTotalBytes!
                    : null,
              ),
            );
          },
          errorBuilder: (context, error, stackTrace) {
            return Container(
              color: Colors.grey[200],
              child: const Icon(Icons.image_not_supported, color: Colors.grey),
            );
          },
        ),
      ),
    );
  }

  Widget _buildJournalInfo(Journal journal) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            journal.journalName,
            style: Theme.of(context).textTheme.headlineSmall,
            maxLines: 2,
            overflow: TextOverflow.ellipsis,
          ),
          const SizedBox(height: 4.0),
          Text.rich(
            TextSpan(
              text: 'ISSN: ',
              style: Theme.of(
                context,
              ).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold),
              children: [
                TextSpan(
                  text: journal.issn,
                  style: Theme.of(context).textTheme.bodySmall,
                ),
              ],
            ),
          ),
          const SizedBox(height: 2.0),
          Text(
            'Frequency: ${journal.frequency}',
            style: Theme.of(context).textTheme.bodySmall,
          ),
          const SizedBox(height: 2.0),
          Text(
            journal.journalType,
            style: Theme.of(context).textTheme.bodySmall,
          ),
        ],
      ),
    );
  }

  Widget _buildVisitButton(Journal journal) {
    return Align(
      alignment: Alignment.bottomRight,
      child: ElevatedButton.icon(
        onPressed: () => _navigateToJournalSection(journal),
        icon: const Icon(Icons.link, size: 18),
        label: const Text('Visit This Journal'),
        style: ElevatedButton.styleFrom(
          backgroundColor: Theme.of(context).colorScheme.secondary,
          foregroundColor: Colors.white,
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8.0),
          ),
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          textStyle: const TextStyle(fontSize: 14),
        ),
      ),
    );
  }

  void _navigateToJournalSection(Journal journal) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => JournalSectionPage(journal: journal),
      ),
    );
  }
}
