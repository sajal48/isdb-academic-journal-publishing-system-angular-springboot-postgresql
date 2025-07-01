/// Represents a single journal entry with its details.
class Journal {
  final String journalName;
  final String issn;
  final String frequency;
  final String journalType;
  final String coverImageUrl;
  final String journalUrl; // Used for navigation to a specific journal's page

  Journal({
    required this.journalName,
    required this.issn,
    required this.frequency,
    required this.journalType,
    required this.coverImageUrl,
    required this.journalUrl,
  });
}
