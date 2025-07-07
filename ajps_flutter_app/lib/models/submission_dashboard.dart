class SubmissionDashboard {
  final int id;
  final String manuscriptTitle;
  final String journalName;
  final String submissionStatus;
  final bool editable;
  final bool paymentDue;

  SubmissionDashboard({
    required this.id,
    required this.manuscriptTitle,
    required this.journalName,
    required this.submissionStatus,
    required this.editable,
    required this.paymentDue,
  });

  factory SubmissionDashboard.fromJson(Map<String, dynamic> json) {
    return SubmissionDashboard(
      id: json['id'],
      manuscriptTitle: json['manuscriptTitle'],
      journalName: json['journalName'],
      submissionStatus: json['submissionStatus'],
      editable: json['editable'] ?? false,
      paymentDue: json['paymentDue'] ?? false,
    );
  }
}
