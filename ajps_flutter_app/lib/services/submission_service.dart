import 'package:ajps_flutter_app/models/submission_dashboard.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:ajps_flutter_app/settings/app_config.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';

class SubmissionService {
  Future<List<SubmissionDashboard>> getUserSubmissions({
    required int userId,
    required AuthService authService,
  }) async {
    final token = await authService.getToken();
    final response = await http.get(
      Uri.parse('${AppConfig.getBaseUrl}/api/user/submission/list/$userId'),
      headers: token != null ? {'Authorization': 'Bearer $token'} : {},
    );

    if (response.statusCode == 200) {
      final data = json.decode(response.body) as Map<String, dynamic>;
      final submissions = data['data'] as List;
      return submissions
          .map((json) => SubmissionDashboard.fromJson(json))
          .toList();
    } else {
      throw Exception('Failed to load submissions');
    }
  }

  Future<void> deleteSubmission(
    String id, {
    required AuthService authService,
  }) async {
    final token = await authService.getToken();
    final response = await http.delete(
      Uri.parse('${AppConfig.getBaseUrl}/api/user/submission/delete/$id'),
      headers: token != null ? {'Authorization': 'Bearer $token'} : {},
    );

    if (response.statusCode != 200) {
      throw Exception('Failed to delete submission');
    }
  }
}
