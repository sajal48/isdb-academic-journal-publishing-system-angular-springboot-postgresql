import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:ajps_flutter_app/services/profile_service.dart';
import 'package:ajps_flutter_app/settings/app_config.dart';
import 'dart:developer' as dev;

class UserProfileImageWidget extends StatefulWidget {
  final double radius;
  final AuthService authService;

  const UserProfileImageWidget({
    super.key,
    required this.radius,
    required this.authService,
  });

  @override
  State<UserProfileImageWidget> createState() => UserProfileImageWidgetState();
}

class UserProfileImageWidgetState extends State<UserProfileImageWidget> {
  String? profilePictureUrl;
  bool loading = true;
  bool hasError = false;

  @override
  void initState() {
    super.initState();
    _loadProfileImage();
  }

  Future<void> _loadProfileImage() async {
    try {
      final profileService = ProfileService();
      final profile = await profileService.getProfile(
        authService: widget.authService,
      );

      dev.log('Profile data for image widget: $profile');

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
            profilePictureUrl = imgUri
                .replace(
                  host: baseUri.host,
                  port: baseUri.hasPort ? baseUri.port : null,
                )
                .toString();
          } catch (_) {
            profilePictureUrl = rawUrl;
          }
        } else if (rawUrl.startsWith('/')) {
          // Relative path - prepend base URL
          profilePictureUrl = '${AppConfig.getApiBaseUrl}$rawUrl';
        } else {
          // No protocol - prepend base URL with slash
          profilePictureUrl = '${AppConfig.getApiBaseUrl}/$rawUrl';
        }

        // Add cache-busting parameter
        final separator = profilePictureUrl!.contains('?') ? '&' : '?';
        profilePictureUrl =
            '$profilePictureUrl${separator}v=${DateTime.now().millisecondsSinceEpoch}';
      }

      dev.log('Final profile image URL for widget: $profilePictureUrl');

      if (mounted) {
        setState(() {
          loading = false;
          hasError = false;
        });
      }
    } catch (e) {
      dev.log('Failed to load profile image: $e');
      if (mounted) {
        setState(() {
          loading = false;
          hasError = true;
          profilePictureUrl = null;
        });
      }
    }
  }

  void refresh() {
    setState(() {
      loading = true;
      hasError = false;
    });
    _loadProfileImage();
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return CircleAvatar(
        radius: widget.radius,
        backgroundColor: Colors.grey[300],
        child: SizedBox(
          width: widget.radius,
          height: widget.radius,
          child: const CircularProgressIndicator(strokeWidth: 2),
        ),
      );
    }

    // Use a safe image provider that handles errors
    ImageProvider? imageProvider;
    if (profilePictureUrl != null &&
        profilePictureUrl!.isNotEmpty &&
        !hasError) {
      try {
        imageProvider = NetworkImage(profilePictureUrl!);
      } catch (e) {
        dev.log('Error creating NetworkImage: $e');
        imageProvider = null;
      }
    }

    return CircleAvatar(
      radius: widget.radius,
      backgroundColor: Colors.grey[300],
      backgroundImage: imageProvider,
      child: imageProvider == null
          ? Icon(Icons.person, size: widget.radius * 1.2)
          : null,
      onBackgroundImageError: (exception, stackTrace) {
        dev.log('Error loading profile image: $exception');
        if (mounted) {
          setState(() {
            hasError = true;
          });
        }
      },
    );
  }
}
