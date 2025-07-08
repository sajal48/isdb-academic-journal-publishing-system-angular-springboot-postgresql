import 'package:http/http.dart' as http;
import 'package:ajps_flutter_app/settings/app_config.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'dart:convert';

class UserSettingsService {
  Future<Map<String, dynamic>> requestEmailChange({
    required int userId,
    required String newEmail,
    required AuthService authService,
  }) async {
    try {
      final token = await authService.getToken();
      final response = await http.post(
        Uri.parse('${AppConfig.getApiBaseUrl}/api/user/profile/change-email'),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({'userId': userId, 'newEmail': newEmail}),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        final errorData = json.decode(response.body);
        throw Exception(
          errorData['message'] ?? 'Failed to request email change',
        );
      }
    } catch (e) {
      throw Exception('Failed to request email change: $e');
    }
  }

  Future<Map<String, dynamic>> confirmEmailChange({
    required int userId,
    required String newEmail,
    required int otp,
    required AuthService authService,
  }) async {
    try {
      final token = await authService.getToken();
      final response = await http.post(
        Uri.parse(
          '${AppConfig.getApiBaseUrl}/api/user/profile/verify-email-otp',
        ),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({'userId': userId, 'newEmail': newEmail, 'otp': otp}),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        final errorData = json.decode(response.body);
        throw Exception(
          errorData['message'] ?? 'Failed to confirm email change',
        );
      }
    } catch (e) {
      throw Exception('Failed to confirm email change: $e');
    }
  }

  Future<Map<String, dynamic>> changePassword({
    required int userId,
    required String userEmail,
    required String currentPassword,
    required AuthService authService,
  }) async {
    try {
      final token = await authService.getToken();
      final response = await http.post(
        Uri.parse(
          '${AppConfig.getApiBaseUrl}/api/user/profile/change-password',
        ),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'userId': userId,
          'userEmail': userEmail,
          'currentPassword': currentPassword,
        }),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        final errorData = json.decode(response.body);
        throw Exception(errorData['message'] ?? 'Failed to change password');
      }
    } catch (e) {
      throw Exception('Failed to change password: $e');
    }
  }

  Future<Map<String, dynamic>> confirmPasswordChange({
    required int userId,
    required String currentPassword,
    required String newPassword,
    required int otp,
    required AuthService authService,
  }) async {
    try {
      final token = await authService.getToken();
      final response = await http.post(
        Uri.parse(
          '${AppConfig.getApiBaseUrl}/api/user/profile/verify-password-otp',
        ),
        headers: {
          'Content-Type': 'application/json',
          if (token != null) 'Authorization': 'Bearer $token',
        },
        body: json.encode({
          'userId': userId,
          'currentPassword': currentPassword,
          'newPassword': newPassword,
          'otp': otp,
        }),
      );

      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        final errorData = json.decode(response.body);
        throw Exception(
          errorData['message'] ?? 'Failed to confirm password change',
        );
      }
    } catch (e) {
      throw Exception('Failed to confirm password change: $e');
    }
  }
}
