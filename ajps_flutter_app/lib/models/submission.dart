import 'package:ajps_flutter_app/models/author.dart';

class Submission {
  final int id;
  final int submissionNumber;
  final String manuscriptTitle;
  final String manuscriptCategory;
  final String abstractContent;
  final String manuscriptKeywords;
  final String submissionStatus;
  final DateTime createdAt;
  final DateTime submittedAt;
  final List<Author> authors;

  Submission({
    required this.id,
    required this.submissionNumber,
    required this.manuscriptTitle,
    required this.manuscriptCategory,
    required this.abstractContent,
    required this.manuscriptKeywords,
    required this.submissionStatus,
    required this.createdAt,
    required this.submittedAt,
    required this.authors,
  });

  factory Submission.fromJson(Map<String, dynamic> json) {
    return Submission(
      id: json['id'],
      submissionNumber: json['submissionNumber'],
      manuscriptTitle: json['manuscriptTitle'],
      manuscriptCategory: json['manuscriptCategory'],
      abstractContent: json['abstractContent'],
      manuscriptKeywords: json['manuscriptKeywords'],
      submissionStatus: json['submissionStatus'],
      createdAt: DateTime.parse(json['createdAt']),
      submittedAt: DateTime.parse(json['submittedAt']),
      authors: (json['authors'] as List)
          .map((a) => Author.fromJson(a))
          .toList(),
    );
  }
}
