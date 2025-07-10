import 'package:ajps_flutter_app/models/issue.dart';

class Journal {
  final int? id;
  final String journalName;
  final String journalUrl;
  final String issn;
  final String frequency;
  final String journalType;
  final String coverImageUrl;
  final String aboutJournal;
  final String aimsScopes;
  final Issue? issues;

  Journal({
    this.id,
    required this.journalName,
    required this.journalUrl,
    required this.issn,
    required this.frequency,
    required this.journalType,
    required this.coverImageUrl,
    required this.aboutJournal,
    required this.aimsScopes,
    this.issues,
  });

  factory Journal.fromJson(Map<String, dynamic> json) {
    return Journal(
      id: json['id'] is String ? int.tryParse(json['id']) : json['id'],
      journalName: json['journalName'],
      journalUrl: json['journalUrl'],
      issn: json['issn'],
      frequency: json['frequency'],
      journalType: json['journalType'],
      coverImageUrl: json['coverImageUrl'],
      aboutJournal: json['aboutJournal'],
      aimsScopes: json['aimsScopes'],
      issues: json['issues'],
    );
  }
}
