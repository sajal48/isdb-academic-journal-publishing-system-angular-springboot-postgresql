import 'dart:convert';
import 'package:ajps_flutter_app/settings/app_config.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:http/http.dart' as http;
import 'package:ajps_flutter_app/models/issue.dart';
import 'package:ajps_flutter_app/models/journal.dart';

class JournalService {
  static final String _baseUrl = '${AppConfig.getBaseUrl}/api/journal';

  Future<List<Journal>> getAllJournals() async {
    final response = await http.get(Uri.parse('$_baseUrl/get-all-journals'));
    if (response.statusCode == 200) {
      final List<dynamic> jsonList = json.decode(response.body);
      return jsonList.map((json) => Journal.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load journals');
    }
  }

  Future<List<Issue>> getIssuesByJournalUrl(String journalUrl) async {
    final response = await http.get(
      Uri.parse('$_baseUrl/get-journal/$journalUrl/issues'),
    );
    if (response.statusCode == 200) {
      final List<dynamic> jsonList = json.decode(response.body);
      return jsonList.map((json) => Issue.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load issues');
    }
  }

  Future<List<Journal>> getJournals({required AuthService authService}) async {
    return await getAllJournals();
  }
}
