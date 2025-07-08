import 'package:http/http.dart' as http;
import 'package:ajps_flutter_app/settings/app_config.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'dart:convert';
import 'dart:io';

class ProfileService {
  Future<Map<String, dynamic>> getProfile({
    required AuthService authService,
  }) async {
    try {
      final token = await authService.getToken();
      final userId = authService.getUserID();
      final response = await http.get(
        Uri.parse(
          '${AppConfig.getApiBaseUrl}/api/user/profile/details/$userId',
        ),
        headers: token != null ? {'Authorization': 'Bearer $token'} : {},
      );
      if (response.statusCode == 200) {
        return json.decode(response.body) as Map<String, dynamic>;
      } else {
        throw Exception('Failed to load profile');
      }
    } catch (e) {
      throw Exception('Failed to load profile: $e');
    }
  }

  Future<String?> uploadProfilePicture({
    required AuthService authService,
    required int userId,
    required String filePath,
  }) async {
    try {
      final file = File(filePath);
      if (!file.existsSync()) {
        throw Exception('File does not exist');
      }

      // Check file size (5MB limit)
      final fileSize = file.lengthSync();
      if (fileSize > 5 * 1024 * 1024) {
        throw Exception('File size exceeds 5MB limit');
      }

      final token = await authService.getToken();
      if (token == null) throw Exception('Not authenticated');

      var uri = Uri.parse(
        '${AppConfig.getApiBaseUrl}/api/user/profile/picture-upload',
      );
      var request = http.MultipartRequest('POST', uri);
      request.headers['Authorization'] = 'Bearer $token';

      request.files.add(await http.MultipartFile.fromPath('picture', filePath));

      // Fix: userId must be sent as a String
      request.fields['userId'] = userId.toString();

      final response = await request.send();
      final responseString = await response.stream.bytesToString();

      if (response.statusCode == 200 || response.statusCode == 201) {
        final responseData = json.decode(responseString);
        // Use 'profileImage' as the returned field for the new image URL
        return responseData['profileImage'];
      } else {
        throw Exception(
          'Failed to upload: ${response.statusCode} - $responseString',
        );
      }
    } catch (e) {
      print('Upload error: $e');
      rethrow;
    }
  }

  Future<void> updateProfile({
    required AuthService authService,
    required Map<String, dynamic> profileData,
  }) async {
    try {
      final token = await authService.getToken();
      if (token == null) throw Exception('Not authenticated');

      // Validate required fields
      if (profileData['firstName'] == null ||
          profileData['firstName'].toString().isEmpty) {
        throw Exception('First name is required');
      }
      if (profileData['lastName'] == null ||
          profileData['lastName'].toString().isEmpty) {
        throw Exception('Last name is required');
      }

      // Always get userId from authService
      final userId = authService.getUserID();
      if (userId == 0) {
        throw Exception('User ID is required and must be a number.');
      }
      final payload = <String, dynamic>{
        'userId': userId,
        'nameTitle': profileData['nameTitle']?.toString(),
        'firstName': profileData['firstName']?.toString(),
        'middleName': profileData['middleName']?.toString(),
        'lastName': profileData['lastName']?.toString(),
        'professionalTitle': profileData['professionalTitle']?.toString(),
        'educationalQualification': profileData['educationalQualification']
            ?.toString(),
        'institute': profileData['institute']?.toString(),
        'expertise': profileData['expertise']?.toString(),
        'mobile': profileData['mobile']?.toString(),
        'telephone': profileData['telephone']?.toString(),
        'country': profileData['country']?.toString(),
        'address': profileData['address']?.toString(),
        'zipCode': profileData['zipCode']?.toString(),
        'facebookUrl': profileData['facebookUrl']?.toString(),
        'twitterUrl': profileData['twitterUrl']?.toString(),
      };
      // Remove null and empty string values from payload
      payload.removeWhere(
        (key, value) =>
            value == null || (value is String && value.trim().isEmpty),
      );

      final response = await http.put(
        Uri.parse('${AppConfig.getApiBaseUrl}/api/user/profile/update'),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer $token',
        },
        body: json.encode(payload),
      );

      if (response.statusCode != 200 && response.statusCode != 201) {
        final error = json.decode(response.body)['message'] ?? 'Update failed';
        throw Exception(error);
      }
    } catch (e) {
      print('Update error: $e');
      rethrow;
    }
  }
}
