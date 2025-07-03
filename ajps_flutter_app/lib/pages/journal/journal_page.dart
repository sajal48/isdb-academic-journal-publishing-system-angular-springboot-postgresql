import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/models/journal.dart';
import 'package:ajps_flutter_app/pages/journal/journal_detail_page.dart';
import 'package:ajps_flutter_app/pages/journal/journal_submissions_page.dart';
import 'package:ajps_flutter_app/pages/journal/journal_policies_page.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

/// Widget for displaying journal-related content with drawer navigation
class JournalPage extends StatefulWidget {
  const JournalPage({super.key});

  @override
  State<JournalPage> createState() => _JournalPageState();
}

class _JournalPageState extends State<JournalPage> {
  int _journalMenuIndex = 0; // Track selected drawer menu item
  List<Journal> _journals = [];
  bool _isLoading = true;
  String? _errorMessage;

  // List of pages corresponding to each drawer menu item
  final List<Widget> _journalPages = [];

  @override
  void initState() {
    super.initState();
    _fetchJournals();

    // Initialize pages (we'll update the journals page after data loads)
    _journalPages.addAll([
      const Center(child: CircularProgressIndicator()), // Temporary placeholder
      const JournalSubmissionsPage(),
      const JournalPoliciesPage(),
    ]);
  }

  /// This method is called when the widget is tapped from the bottom navigation
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    final ModalRoute<dynamic>? parentRoute = ModalRoute.of(context);
    if (parentRoute is PageRoute &&
        parentRoute.isCurrent &&
        _journalMenuIndex == 0) {
      _fetchJournals();
    }
  }

  Future<void> _fetchJournals() async {
    if (_journalMenuIndex != 0) return; // Only fetch if on journals page

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await http.get(
        Uri.parse('http://192.168.0.155:8090/api/journal/get-all-journals'),
      );

      if (response.statusCode == 200) {
        List<dynamic> jsonResponse = jsonDecode(response.body);
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
                ),
              )
              .toList();

          // Update the journals page in our pages list
          _journalPages[0] = _buildJournalsContent();
        });
      } else {
        _errorMessage =
            'Failed to load journals: Server responded with status code ${response.statusCode}';
        debugPrint('API Error: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      _errorMessage = 'Failed to load journals: $e';
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
        title: _getAppBarTitle(),
        centerTitle: true,
      ),
      drawer: _buildDrawer(),
      body: _journalPages[_journalMenuIndex],
    );
  }

  Widget _getAppBarTitle() {
    switch (_journalMenuIndex) {
      case 0:
        return const Text('Our Journals');
      case 1:
        return const Text('Journal Submissions');
      case 2:
        return const Text('Journal Policies');
      default:
        return const Text('Journal');
    }
  }

  Widget _buildDrawer() {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: <Widget>[
          DrawerHeader(
            decoration: BoxDecoration(
              color: Theme.of(context).colorScheme.primary,
            ),
            child: const Text(
              'Journal Menu',
              style: TextStyle(color: Colors.white, fontSize: 24),
            ),
          ),
          ListTile(
            leading: const Icon(Icons.menu_book),
            title: const Text('Our Journals'),
            selected: _journalMenuIndex == 0,
            onTap: () {
              setState(() {
                _journalMenuIndex = 0;
                _fetchJournals(); // Reload journals when this item is selected
              });
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.send),
            title: const Text('Submissions'),
            selected: _journalMenuIndex == 1,
            onTap: () {
              setState(() {
                _journalMenuIndex = 1;
              });
              Navigator.pop(context);
            },
          ),
          ListTile(
            leading: const Icon(Icons.policy),
            title: const Text('Policies'),
            selected: _journalMenuIndex == 2,
            onTap: () {
              setState(() {
                _journalMenuIndex = 2;
              });
              Navigator.pop(context);
            },
          ),
        ],
      ),
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
                children: _journals.map((journal) {
                  return SizedBox(
                    width: (MediaQuery.of(context).size.width),
                    child: Card(
                      elevation: 2.0,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8.0),
                      ),
                      child: InkWell(
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) => JournalDetailPage(
                                journalName: journal.journalName,
                                journalUrl: journal.journalUrl,
                              ),
                            ),
                          );
                        },
                        borderRadius: BorderRadius.circular(8.0),
                        child: Padding(
                          padding: const EdgeInsets.all(12.0),
                          child: Column(
                            children: [
                              Row(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  SizedBox(
                                    width: 100,
                                    height: 130,
                                    child: ClipRRect(
                                      borderRadius: BorderRadius.circular(4.0),
                                      child: Image.network(
                                        journal.coverImageUrl,
                                        fit: BoxFit.cover,
                                        loadingBuilder: (context, child, loadingProgress) {
                                          if (loadingProgress == null)
                                            return child;
                                          return Center(
                                            child: CircularProgressIndicator(
                                              value:
                                                  loadingProgress
                                                          .expectedTotalBytes !=
                                                      null
                                                  ? loadingProgress
                                                            .cumulativeBytesLoaded /
                                                        loadingProgress
                                                            .expectedTotalBytes!
                                                  : null,
                                            ),
                                          );
                                        },
                                        errorBuilder:
                                            (context, error, stackTrace) {
                                              return Container(
                                                color: Colors.grey[200],
                                                child: const Icon(
                                                  Icons.image_not_supported,
                                                  color: Colors.grey,
                                                ),
                                              );
                                            },
                                      ),
                                    ),
                                  ),
                                  const SizedBox(width: 12.0),
                                  Expanded(
                                    child: Column(
                                      crossAxisAlignment:
                                          CrossAxisAlignment.start,
                                      children: [
                                        Text(
                                          journal.journalName,
                                          style: Theme.of(
                                            context,
                                          ).textTheme.headlineSmall,
                                          maxLines: 2,
                                          overflow: TextOverflow.ellipsis,
                                        ),
                                        const SizedBox(height: 4.0),
                                        Text.rich(
                                          TextSpan(
                                            text: 'ISSN: ',
                                            style: Theme.of(context)
                                                .textTheme
                                                .bodySmall
                                                ?.copyWith(
                                                  fontWeight: FontWeight.bold,
                                                ),
                                            children: [
                                              TextSpan(
                                                text: journal.issn,
                                                style: Theme.of(
                                                  context,
                                                ).textTheme.bodySmall,
                                              ),
                                            ],
                                          ),
                                        ),
                                        const SizedBox(height: 2.0),
                                        Text(
                                          'Frequency: ${journal.frequency}',
                                          style: Theme.of(
                                            context,
                                          ).textTheme.bodySmall,
                                        ),
                                        const SizedBox(height: 2.0),
                                        Text(
                                          journal.journalType,
                                          style: Theme.of(
                                            context,
                                          ).textTheme.bodySmall,
                                        ),
                                      ],
                                    ),
                                  ),
                                ],
                              ),
                              const SizedBox(height: 16.0),
                              Align(
                                alignment: Alignment.bottomRight,
                                child: ElevatedButton.icon(
                                  onPressed: () {
                                    Navigator.push(
                                      context,
                                      MaterialPageRoute(
                                        builder: (context) => JournalDetailPage(
                                          journalName: journal.journalName,
                                          journalUrl: journal.journalUrl,
                                        ),
                                      ),
                                    );
                                  },
                                  icon: const Icon(Icons.link, size: 18),
                                  label: const Text('Visit This Journal'),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: Theme.of(
                                      context,
                                    ).colorScheme.secondary,
                                    foregroundColor: Colors.white,
                                    shape: RoundedRectangleBorder(
                                      borderRadius: BorderRadius.circular(8.0),
                                    ),
                                    padding: const EdgeInsets.symmetric(
                                      horizontal: 16,
                                      vertical: 8,
                                    ),
                                    textStyle: const TextStyle(fontSize: 14),
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ),
                  );
                }).toList(),
              ),
          ],
        ),
      ),
    );
  }
}
