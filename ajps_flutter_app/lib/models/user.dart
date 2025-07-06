class AuthRegisterLoginRequest {
  String email;
  String password;
  String? userRole = 'USER';

  AuthRegisterLoginRequest({
    required this.email,
    required this.password,
    this.userRole,
  });

  Map<String, dynamic> toJson() {
    return {'email': email, 'password': password, 'userRole': 'USER'};
  }
}
