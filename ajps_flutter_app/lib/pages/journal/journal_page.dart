import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/models/journal.dart';
import 'package:ajps_flutter_app/pages/journal/journal_detail_page.dart';
import 'package:http/http.dart' as http; // Import the http package
import 'dart:convert'; // Required for JSON decoding

/// Widget for displaying a list of published journals, fetched from an API.
class JournalPage extends StatefulWidget {
  const JournalPage({super.key});

  @override
  State<JournalPage> createState() => _OurJournalsPageState();
}

class _OurJournalsPageState extends State<JournalPage> {
  bool _isLoading = true; // State to manage loading spinner
  List<Journal> _journals = []; // List to hold journal data
  String? _errorMessage; // To store any error messages

  @override
  void initState() {
    super.initState();
    _fetchJournals(); // Fetch data when the widget initializes
  }

  /// Fetches journal data from a specified API endpoint.
  Future<void> _fetchJournals() async {
    setState(() {
      _isLoading = true; // Show loading spinner
      _errorMessage = null; // Clear previous errors
    });

    try {
      // TODO: Replace with your actual API endpoint
      // final response = await http.get(Uri.parse('http://10.0.2.2:8090/api/journal/get-all-journals'));
      final response = await http.get(Uri.parse('http://192.168.0.79:8090/api/journal/get-all-journals'));

      if (response.statusCode == 200) {
        // If the server returns a 200 OK response, parse the JSON.
        List<dynamic> jsonResponse = jsonDecode(response.body);
        _journals = jsonResponse.map((data) => Journal(
          journalName: data['journalName'] ?? 'N/A', // Provide default if null
          issn: data['issn'] ?? 'N/A',
          frequency: data['frequency'] ?? 'N/A',
          journalType: data['journalType'] ?? 'N/A',
          coverImageUrl: data['coverImageUrl'] ?? 'https://placehold.co/150x200/E0E0E0/000000?text=No+Image', // Fallback image
          journalUrl: data['journalUrl'] ?? 'no-url',
        )).toList();
      } else {
        // If the server did not return a 200 OK response,
        // throw an exception or set an error message.
        _errorMessage = 'Failed to load journals: Server responded with status code ${response.statusCode}';
        debugPrint('API Error: ${response.statusCode} - ${response.body}');
      }
    } catch (e) {
      // Catch any network or parsing errors
      _errorMessage = 'Failed to load journals: $e';
      debugPrint('Error fetching journals: $e');
    } finally {
      setState(() {
        _isLoading = false; // Hide loading spinner regardless of success or failure
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar( // This is the AppBar for the JournalPage
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        title: const Text('Our Journals'), // Title displayed in the AppBar
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Page title: "Our Journals"
              /*Padding(
                padding: const EdgeInsets.only(bottom: 40.0),
                child: Text(
                  'Our Journals',
                  style: Theme.of(context).textTheme.headlineLarge,
                  textAlign: TextAlign.center,
                ),
              ),*/
      
              // Section heading: "Our Currently Published Journals"
              /*Padding(
                padding: const EdgeInsets.only(bottom: 24.0),
                child: Text(
                  'Our Currently Published Journals',
                  style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 20.0),
                ),
              ),*/
      
              // Conditional rendering based on loading state, error, and journal data
              if (_isLoading)
                const Center(
                  child: Padding(
                    padding: EdgeInsets.symmetric(vertical: 50.0),
                    child: CircularProgressIndicator(), // Loading Spinner
                  ),
                )
              else if (_errorMessage != null)
                Center(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(vertical: 50.0),
                    child: Column(
                      children: [
                        Icon(Icons.error_outline, color: Colors.red, size: 40),
                        const SizedBox(height: 10),
                        Text(
                          _errorMessage!,
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.red),
                          textAlign: TextAlign.center,
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton(
                          onPressed: _fetchJournals, // Retry button
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
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black54),
                    textAlign: TextAlign.center,
                  ),
                )
              else
                // Journal Cards Grid/Wrap layout
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
                                            if (loadingProgress == null) return child;
                                            return Center(
                                              child: CircularProgressIndicator(
                                                value: loadingProgress.expectedTotalBytes != null
                                                    ? loadingProgress.cumulativeBytesLoaded / loadingProgress.expectedTotalBytes!
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
                                    ),
                                    const SizedBox(width: 12.0),
                                    Expanded(
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
                                              style: Theme.of(context).textTheme.bodySmall?.copyWith(fontWeight: FontWeight.bold),
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
                                      backgroundColor: Theme.of(context).colorScheme.secondary,
                                      foregroundColor: Colors.white,
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(8.0),
                                      ),
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
      ),
    );
  }
}
