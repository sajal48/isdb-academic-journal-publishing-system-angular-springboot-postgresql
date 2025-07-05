import 'package:ajps_flutter_app/models/file_upload.dart';
import 'package:ajps_flutter_app/models/submission.dart';

class Paper {
  final int id;
  final Submission submission;
  final FileUpload fileUpload;

  Paper({required this.id, required this.submission, required this.fileUpload});

  factory Paper.fromJson(Map<String, dynamic> json) {
    return Paper(
      id: json['id'],
      submission: Submission.fromJson(json['submission']),
      fileUpload: FileUpload.fromJson(json['fileUpload']),
    );
  }
}
