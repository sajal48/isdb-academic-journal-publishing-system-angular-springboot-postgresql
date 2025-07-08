import 'dart:developer';
import 'package:ajps_flutter_app/services/profile_service.dart';
import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:provider/provider.dart';
import 'package:url_launcher/url_launcher.dart';
// import 'edit_user_profile_screen.dart';
import 'package:ajps_flutter_app/settings/app_config.dart';

class UserProfilePageScreen extends StatefulWidget {
  const UserProfilePageScreen({Key? key}) : super(key: key);

  @override
  State<UserProfilePageScreen> createState() => _UserProfilePageScreenState();
}

class _UserProfilePageScreenState extends State<UserProfilePageScreen> {
  Map<String, dynamic>? user;
  bool loading = true;
  String? profilePictureUrl;
  String userEmail = '';

  @override
  void initState() {
    super.initState();
    final authService = Provider.of<AuthService>(context, listen: false);
    userEmail = authService.getUserEmail();
    _loadProfile();
  }

  Future<void> _loadProfile() async {
    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      final response = await ProfileService().getProfile(
        authService: authService,
      );
      // If response is a Map with user fields directly, not wrapped in 'data', use as is
      setState(() {
        user = response['data'] ?? response;
        // Get the image URL and replace its host with the base URL host
        String? rawUrl =
            user?['profileImage'] ??
            user?['profile_image'] ??
            user?['avatar'] ??
            '';
        if (rawUrl != null && rawUrl.isNotEmpty) {
          try {
            final baseUri = Uri.parse(AppConfig.getBaseUrl);
            final imgUri = Uri.parse(rawUrl);
            // Replace host and port with base URL's
            profilePictureUrl = imgUri
                .replace(
                  host: baseUri.host,
                  port: baseUri.hasPort ? baseUri.port : null,
                )
                .toString();
          } catch (_) {
            profilePictureUrl = rawUrl;
          }
        } else {
          profilePictureUrl = '';
        }
        log('Profile picture URL: ' + (profilePictureUrl ?? 'null'));
        loading = false;
      });
    } catch (e) {
      log('Failed to load profile: ' + e.toString());
      setState(() {
        loading = false;
        user = null;
      });
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Failed to load profile')));
    }
  }

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (user == null) {
      return const Center(child: Text('No profile data available'));
    }

    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Card(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              // DEBUG: Show raw user map for troubleshooting
              if (user != null)
                /*Container(
                  width: double.infinity,
                  margin: const EdgeInsets.only(bottom: 12),
                  padding: const EdgeInsets.all(8),
                  color: Colors.yellow[100],
                  child: Text(
                    'DEBUG user map:\n' + user.toString(),
                    style: const TextStyle(fontSize: 12, color: Colors.black87),
                  ),
                ),*/
                const Text(
                  'My Profile',
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.bold,
                    color: Colors.green,
                  ),
                ),
              const SizedBox(height: 8),
              /*ElevatedButton(
                onPressed: () async {
                  final result = await Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (context) => EditUserProfileScreen(
                        user: user!,
                        userEmail: userEmail,
                      ),
                    ),
                  );
                  if (result == true) {
                    _loadProfile();
                  }
                },
                child: const Text('Edit Profile'),
              ),*/
              const SizedBox(height: 16),
              // Profile Image on top
              Center(
                child: Container(
                  width: 100,
                  height: 100,
                  margin: const EdgeInsets.only(bottom: 16),
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    image: DecorationImage(
                      image:
                          (profilePictureUrl != null &&
                              profilePictureUrl!.isNotEmpty)
                          ? NetworkImage(profilePictureUrl!)
                          : const AssetImage('assets/images/avatar.png')
                                as ImageProvider,
                      fit: BoxFit.cover,
                      onError: (exception, stackTrace) {
                        log(
                          'Failed to load profile image: ' +
                              exception.toString(),
                        );
                      },
                    ),
                  ),
                ),
              ),
              // Profile Details below
              Table(
                columnWidths: const {
                  0: FlexColumnWidth(1),
                  1: FlexColumnWidth(2),
                },
                children: [
                  _buildTableRow(
                    'Name',
                    '${user?['nameTitle'] ?? ''} ${user?['firstName'] ?? ''} ${user?['middleName'] ?? ''} ${user?['lastName'] ?? ''}',
                  ),
                  _buildTableRow(
                    'Professional Title',
                    user?['professionalTitle'],
                  ),
                  _buildTableRow(
                    'Educational Qualification',
                    user?['educationalQualification'],
                  ),
                  _buildTableRow('Institute', user?['institute']),
                  _buildTableRow('Expertise', user?['expertise']),
                  _buildTableRow('Email', userEmail),
                  _buildTableRow('Mobile', user?['mobile']),
                  _buildTableRow('Telephone', user?['telephone']),
                  _buildTableRow('Country/Region', user?['country']),
                  _buildTableRow('Address', user?['address']),
                  _buildTableRow('Zip Code', user?['zipCode']),
                  _buildSocialLinksRow(),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  TableRow _buildTableRow(String label, String? value) {
    return TableRow(
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Text(
            label,
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Text((value ?? '').trim().isNotEmpty ? value!.trim() : ''),
        ),
      ],
    );
  }

  TableRow _buildSocialLinksRow() {
    return TableRow(
      children: [
        const Padding(
          padding: EdgeInsets.symmetric(vertical: 8),
          child: Text(
            'Social Links',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
        ),
        Padding(
          padding: const EdgeInsets.symmetric(vertical: 8),
          child: Wrap(
            spacing: 8,
            children: [
              if ((user?['facebookUrl'] ?? '').toString().isNotEmpty)
                _buildSocialLink('Facebook', user?['facebookUrl'] ?? ''),
              if ((user?['twitterUrl'] ?? '').toString().isNotEmpty)
                _buildSocialLink('Twitter', user?['twitterUrl'] ?? ''),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildSocialLink(String label, String url) {
    return InkWell(
      onTap: () async {
        if (await canLaunchUrl(Uri.parse(url))) {
          await launchUrl(Uri.parse(url));
        } else {
          ScaffoldMessenger.of(
            context,
          ).showSnackBar(SnackBar(content: Text('Could not launch $url')));
        }
      },
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Text(label),
          const SizedBox(width: 4),
          const Icon(Icons.link, size: 16),
        ],
      ),
    );
  }
}
