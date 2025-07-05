class AuthRegisterLoginRequest {
  String email;
  String password;

  AuthRegisterLoginRequest({required this.email, required this.password});

  Map<String, dynamic> toJson() {
    return {'email': email, 'password': password};
  }
}
