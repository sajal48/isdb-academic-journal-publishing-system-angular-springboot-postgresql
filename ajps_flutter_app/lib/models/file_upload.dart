class FileUpload {
  final int id;
  final String fileOrigin;
  final String storedName;
  final String originalName;
  final int size;
  final String type;
  final String fileUrl;

  FileUpload({
    required this.id,
    required this.fileOrigin,
    required this.storedName,
    required this.originalName,
    required this.size,
    required this.type,
    required this.fileUrl,
  });

  factory FileUpload.fromJson(Map<String, dynamic> json) {
    return FileUpload(
      id: json['id'],
      fileOrigin: json['fileOrigin'],
      storedName: json['storedName'],
      originalName: json['originalName'],
      size: json['size'],
      type: json['type'],
      fileUrl: json['fileUrl'],
    );
  }
}
