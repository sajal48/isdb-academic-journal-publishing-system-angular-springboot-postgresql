class AuthResponse {
  final int code;
  final String message;
  final String? accessToken;

  AuthResponse({required this.code, required this.message, this.accessToken});

  factory AuthResponse.fromJson(Map<String, dynamic> json) {
    return AuthResponse(
      code: json['code'] as int,
      message: json['message'] as String,
      accessToken: json['access_token'] as String?,
    );
  }
}
