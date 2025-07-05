import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';
import 'package:ajps_flutter_app/settings/app_config.dart'; // Updated import path
import 'package:ajps_flutter_app/models/user.dart'; // Updated import path
import 'package:ajps_flutter_app/models/auth_response.dart'; // Updated import path
import 'package:jwt_decoder/jwt_decoder.dart'; // For decoding JWT
import 'package:flutter/material.dart'; // Required for BuildContext in logout

class AuthService {
  final String _tokenKey = 'ajps_access_token';
  String? _userRole;
  String? _userEmail;
  int? _userId;

  AuthService() {
    _loadTokenAndUserData();
  }

  Future<void> _loadTokenAndUserData() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_tokenKey);
    if (token != null) {
      _decodeTokenAndSetUserData(token);
    }
  }

  void _decodeTokenAndSetUserData(String token) {
    try {
      final Map<String, dynamic> payload = JwtDecoder.decode(token);
      _userRole = payload['role']?.toLowerCase();
      _userEmail = payload['email']?.toLowerCase();
      _userId = payload['id'] as int?;
    } catch (e) {
      print('Error decoding token: $e');
      _userRole = null;
      _userEmail = null;
      _userId = null;
    }
  }

  Future<AuthResponse> register(
    AuthRegisterLoginRequest registerRequest,
  ) async {
    final url = Uri.parse('${AppConfig.getBaseUrl}/api/auth/register');
    try {
      final response = await http.post(
        url,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(registerRequest.toJson()),
      );
      return AuthResponse.fromJson(jsonDecode(response.body));
    } catch (e) {
      return AuthResponse(code: 500, message: 'Network error: $e');
    }
  }

  Future<AuthResponse> login(AuthRegisterLoginRequest loginRequest) async {
    final url = AppConfig.getBaseUrl + "/api/auth/login";
    final uri = Uri.parse(url);
    try {
      print("login called!");
      print(loginRequest.email);
      print(loginRequest.password);
      final response = await http.post(
        uri,
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(loginRequest.toJson()),
      );
      final authResponse = AuthResponse.fromJson(jsonDecode(response.body));
      if (authResponse.code == 200 && authResponse.accessToken != null) {
        await setToken(authResponse.accessToken!);
      }
      return authResponse;
    } catch (e) {
      return AuthResponse(code: 500, message: 'Network error: $e');
    }
  }

  Future<void> setToken(String token) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    _decodeTokenAndSetUserData(token);
  }

  Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_tokenKey);
  }

  Future<bool> isAuthenticated() async {
    final token = await getToken();
    if (token == null) {
      return false;
    }
    final url = Uri.parse('${AppConfig.getBaseUrl}/api/auth/validate-token');
    try {
      final response = await http.get(
        url,
        headers: {'Authorization': 'Bearer $token'},
      );
      // Assuming your validate-token endpoint returns a boolean true/false
      return response.statusCode == 200 && jsonDecode(response.body) == true;
    } catch (e) {
      print('Error validating token: $e');
      return false;
    }
  }

  String getUserRole() {
    return _userRole ?? '';
  }

  String getUserEmail() {
    return _userEmail ?? '';
  }

  int getUserID() {
    return _userId ?? 0;
  }

  Future<void> logout(
    BuildContext context, {
    String targetUrl = '/login',
  }) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    _userRole = null;
    _userEmail = null;
    _userId = null;
    // Use Navigator to push and remove all previous routes
    Navigator.of(context).pushNamedAndRemoveUntil(targetUrl, (route) => false);
  }

  Future<void> deleteToken() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    _userRole = null;
    _userEmail = null;
    _userId = null;
  }
}
