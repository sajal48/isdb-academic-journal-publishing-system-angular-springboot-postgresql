import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:ajps_flutter_app/services/profile_service.dart';
import 'package:ajps_flutter_app/settings/app_config.dart';
import 'dart:developer' as dev;

class SafeUserProfileImageWidget extends StatelessWidget {
  final double radius;
  final AuthService authService;

  const SafeUserProfileImageWidget({
    super.key,
    required this.radius,
    required this.authService,
  });

  Future<String?> _getProfileImageUrl() async {
    try {
      final profileService = ProfileService();
      final profile = await profileService.getProfile(authService: authService);

      dev.log('Profile data for safe image widget: $profile');

      // Handle both 'profileImage' and 'data.profileImage' response formats
      String? rawUrl =
          profile['profileImage'] ?? profile['data']?['profileImage'];
      dev.log('Raw profile image URL: $rawUrl');

      if (rawUrl != null && rawUrl.isNotEmpty) {
        // Process URL similar to UserProfilePageScreen
        final baseUri = Uri.parse(AppConfig.getApiBaseUrl);

        if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
          // Full URL - replace host and port
          try {
            final imgUri = Uri.parse(rawUrl);
            return imgUri
                .replace(
                  host: baseUri.host,
                  port: baseUri.hasPort ? baseUri.port : null,
                )
                .toString();
          } catch (_) {
            return rawUrl;
          }
        } else if (rawUrl.startsWith('/')) {
          // Relative path - prepend base URL
          return '${AppConfig.getApiBaseUrl}$rawUrl';
        } else {
          // No protocol - prepend base URL with slash
          return '${AppConfig.getApiBaseUrl}/$rawUrl';
        }
      }

      return null;
    } catch (e) {
      dev.log('Failed to load profile image: $e');
      return null;
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String?>(
      future: _getProfileImageUrl(),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return CircleAvatar(
            radius: radius,
            backgroundColor: Colors.grey[300],
            child: SizedBox(
              width: radius,
              height: radius,
              child: const CircularProgressIndicator(strokeWidth: 2),
            ),
          );
        }

        if (snapshot.hasError || !snapshot.hasData || snapshot.data == null) {
          return CircleAvatar(
            radius: radius,
            backgroundColor: Colors.grey[300],
            child: Icon(Icons.person, size: radius * 1.2),
          );
        }

        final imageUrl = snapshot.data!;
        // Add cache-busting parameter
        final separator = imageUrl.contains('?') ? '&' : '?';
        final finalUrl =
            '$imageUrl${separator}v=${DateTime.now().millisecondsSinceEpoch}';

        return CircleAvatar(
          radius: radius,
          backgroundColor: Colors.grey[300],
          backgroundImage: NetworkImage(finalUrl),
          child: null,
          onBackgroundImageError: (exception, stackTrace) {
            dev.log('Error loading profile image: $exception');
          },
        );
      },
    );
  }
}
