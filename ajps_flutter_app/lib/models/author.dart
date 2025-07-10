class Author {
  final int id;
  final String name;
  final String email;
  final String institution;
  final bool corresponding;

  Author({
    required this.id,
    required this.name,
    required this.email,
    required this.institution,
    required this.corresponding,
  });

  factory Author.fromJson(Map<String, dynamic> json) {
    return Author(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      institution: json['institution'],
      corresponding: json['corresponding'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'email': email,
      'institution': institution,
      'corresponding': corresponding,
    };
  }
}
