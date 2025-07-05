import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:ajps_flutter_app/models/issue.dart';
import 'package:ajps_flutter_app/models/journal.dart';

class JournalService {
  static const String _baseUrl = 'http://192.168.0.79:8090/api/journal';

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
}
