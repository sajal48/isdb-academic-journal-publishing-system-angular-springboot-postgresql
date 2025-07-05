import 'package:ajps_flutter_app/models/paper.dart';

class Issue {
  final int id;
  final int volume;
  final int number;
  final DateTime publicationDate;
  final String status;
  final List<Paper> papers;

  Issue({
    required this.id,
    required this.volume,
    required this.number,
    required this.publicationDate,
    required this.status,
    required this.papers,
  });

  factory Issue.fromJson(Map<String, dynamic> json) {
    return Issue(
      id: json['id'],
      volume: json['volume'],
      number: json['number'],
      publicationDate: DateTime.parse(json['publicationDate']),
      status: json['status'],
      papers: (json['papers'] as List).map((p) => Paper.fromJson(p)).toList(),
    );
  }
}
