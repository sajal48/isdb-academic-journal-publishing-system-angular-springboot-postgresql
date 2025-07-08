import 'dart:io';
import 'package:ajps_flutter_app/settings/app_config.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:ajps_flutter_app/services/profile_service.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:image_picker/image_picker.dart';

class EditUserProfileScreen extends StatefulWidget {
  final Map<String, dynamic> user;
  final String userEmail;

  const EditUserProfileScreen({
    Key? key,
    required this.user,
    required this.userEmail,
  }) : super(key: key);

  @override
  State<EditUserProfileScreen> createState() => _EditUserProfileScreenState();
}

class _EditUserProfileScreenState extends State<EditUserProfileScreen> {
  final _formKey = GlobalKey<FormState>();
  late Map<String, dynamic> _formData;
  bool _loading = false;
  File? _selectedImage;
  String? _profileImageUrl;

  // Regex patterns matching backend DTO
  static final RegExp _mobilePattern = RegExp(r'^\+?[0-9\s]{7,15}$');
  static final RegExp _zipCodePattern = RegExp(r'^[0-9A-Za-z\s-]{3,10}$');
  static final RegExp _facebookPattern = RegExp(
    r'^(https?://)?(www\.)?facebook\.com/.*$',
  );
  static final RegExp _twitterPattern = RegExp(
    r'^(https?://)?(www\.)?twitter\.com/.*$',
  );

  @override
  void initState() {
    super.initState();
    _formData = Map<String, dynamic>.from(widget.user);
    // Always use the correct image URL logic as in the profile page
    String? rawUrl =
        widget.user['profileImage'] ??
        widget.user['profile_image'] ??
        widget.user['avatar'] ??
        '';
    if (rawUrl != null && rawUrl.isNotEmpty) {
      try {
        final baseUri = Uri.parse(AppConfig.getBaseUrl);
        final imgUri = Uri.parse(rawUrl);
        _profileImageUrl = imgUri
            .replace(
              host: baseUri.host,
              port: baseUri.hasPort ? baseUri.port : null,
            )
            .toString();
      } catch (_) {
        _profileImageUrl = rawUrl;
      }
    } else {
      _profileImageUrl = '';
    }
  }

  Future<void> _pickImage() async {
    try {
      final picker = ImagePicker();
      final pickedFile = await picker.pickImage(
        source: ImageSource.gallery,
        maxWidth: 800,
        maxHeight: 800,
        imageQuality: 85,
      );

      if (pickedFile != null) {
        final file = File(pickedFile.path);
        final fileSize = await file.length();

        // Validate file size (5MB limit)
        if (fileSize > 5 * 1024 * 1024) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('Image size should be less than 5MB'),
              ),
            );
          }
          return;
        }

        setState(() {
          _selectedImage = file;
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to pick image: ${e.toString()}')),
        );
      }
    }
  }

  Future<void> _uploadProfilePicture() async {
    if (_selectedImage == null) return;

    setState(() => _loading = true);
    final authService = Provider.of<AuthService>(context, listen: false);
    final userId = authService.getUserID();
    if (userId == 0) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Invalid user ID for profile picture upload.'),
          ),
        );
      }
      setState(() => _loading = false);
      return;
    }
    try {
      await ProfileService().uploadProfilePicture(
        authService: authService,
        userId: userId,
        filePath: _selectedImage!.path,
      );

      if (mounted) {
        // Fetch the latest profile after upload to get the updated URL
        final updatedProfile = await ProfileService().getProfile(
          authService: authService,
        );

        String? displayUrl =
            updatedProfile['profileImage'] ??
            updatedProfile['profile_image'] ??
            updatedProfile['avatar'] ??
            '';

        debugPrint(
          'Profile upload: fetched profileImage = ' + (displayUrl ?? 'NULL'),
        );

        if (displayUrl != null && displayUrl.isNotEmpty) {
          // Add a cache-busting parameter to ensure the image reloads
          // This is crucial for NetworkImage to fetch the new image from the URL
          final cacheBuster = displayUrl.contains('?')
              ? '&t=${DateTime.now().millisecondsSinceEpoch}'
              : '?t=${DateTime.now().millisecondsSinceEpoch}';
          displayUrl += cacheBuster;
        }

        setState(() {
          _selectedImage = null; // Clear the selected image as it's uploaded
          _profileImageUrl = displayUrl ?? ''; // Update the displayed image URL
        });

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Profile picture updated successfully')),
        );

        // A small delay before popping to allow SnackBar to be seen
        await Future.delayed(const Duration(milliseconds: 500));
        if (mounted && Navigator.canPop(context)) {
          // Signal the parent widget (e.g., ProfileScreen) to reload its data
          // by passing 'true' back.
          Navigator.of(context).pop(true);
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to upload: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  void _saveProfile() async {
    if (!_formKey.currentState!.validate()) return;
    _formKey.currentState!.save();
    setState(() => _loading = true);

    final authService = Provider.of<AuthService>(context, listen: false);
    final userId = authService.getUserID();
    if (userId == 0) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Invalid user ID for profile update.')),
        );
      }
      setState(() => _loading = false);
      return;
    }

    // Only include fields present in the DTO
    final Map<String, dynamic> payload = {
      'userId': userId,
      'nameTitle': _formData['nameTitle'] ?? '',
      'firstName': _formData['firstName'] ?? '',
      'middleName': _formData['middleName'] ?? '',
      'lastName': _formData['lastName'] ?? '',
      'professionalTitle': _formData['professionalTitle'] ?? '',
      'educationalQualification': _formData['educationalQualification'] ?? '',
      'institute': _formData['institute'] ?? '',
      'expertise': _formData['expertise'] ?? '',
      'mobile': _formData['mobile'] ?? '',
      'telephone': _formData['telephone'] ?? '',
      'country': _formData['country'] ?? '',
      'address': _formData['address'] ?? '',
      'zipCode': _formData['zipCode'] ?? '',
      'facebookUrl': _formData['facebookUrl'] ?? '',
      'twitterUrl': _formData['twitterUrl'] ?? '',
    };

    try {
      await ProfileService().updateProfile(
        authService: authService,
        profileData: payload,
      );

      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Profile updated successfully')),
      );
      Future.microtask(() {
        if (mounted && Navigator.canPop(context)) {
          Navigator.of(context).pop(true);
        }
      });
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update profile: ${e.toString()}')),
        );
      }
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      /*appBar: AppBar(
        title: const Text('Edit Profile'),
        actions: [
          if (_loading)
            Padding(
              padding: const EdgeInsets.only(right: 16.0),
              child: Center(
                child: SizedBox(
                  width: 20,
                  height: 20,
                  child: CircularProgressIndicator(
                    strokeWidth: 2,
                    valueColor: AlwaysStoppedAnimation<Color>(
                      Theme.of(context).colorScheme.onPrimary,
                    ),
                  ),
                ),
              ),
            ),
        ],
      ),*/
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Form(
          key: _formKey,
          child: Column(
            children: [
              Text(
                'Profile Picture',
                style: Theme.of(context).textTheme.titleMedium,
              ),
              const SizedBox(height: 8),
              Center(
                child: Stack(
                  children: [
                    // Added ValueKey here to ensure CircleAvatar rebuilds when _profileImageUrl changes
                    CircleAvatar(
                      key: ValueKey(_profileImageUrl ?? ''),
                      radius: 50,
                      backgroundColor: Colors.grey[200],
                      backgroundImage: _selectedImage != null
                          ? FileImage(_selectedImage!)
                          : (_profileImageUrl != null &&
                                _profileImageUrl!.isNotEmpty)
                          ? NetworkImage(_profileImageUrl!) as ImageProvider
                          : const AssetImage('assets/images/avatar.png'),
                      child:
                          _selectedImage == null &&
                              (_profileImageUrl == null ||
                                  _profileImageUrl!.isEmpty)
                          ? const Icon(Icons.person, size: 50)
                          : null,
                    ),
                    Positioned(
                      bottom: 0,
                      right: 0,
                      child: Container(
                        decoration: BoxDecoration(
                          color: Colors.blue,
                          shape: BoxShape.circle,
                        ),
                        child: IconButton(
                          icon: const Icon(Icons.edit, color: Colors.white),
                          onPressed: _pickImage,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 8),
              ElevatedButton.icon(
                // Only enable the upload button if an image is selected
                onPressed: _selectedImage != null
                    ? _uploadProfilePicture
                    : null,
                icon: const Icon(Icons.upload),
                label: const Text('Upload Picture'),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 48),
                ),
              ),
              const Divider(height: 32),
              _buildTextField('nameTitle', 'Title'),
              _buildTextField('firstName', 'First Name', requiredField: true),
              _buildTextField('middleName', 'Middle Name'),
              _buildTextField('lastName', 'Last Name', requiredField: true),
              _buildTextField('professionalTitle', 'Professional Title'),
              _buildTextField(
                'educationalQualification',
                'Educational Qualification',
              ),
              _buildTextField('institute', 'Institute'),
              _buildTextField('expertise', 'Expertise'),
              _buildTextField('mobile', 'Mobile'),
              _buildTextField('telephone', 'Telephone'),
              _buildTextField('country', 'Country/Region'),
              _buildTextField('address', 'Address'),
              _buildTextField('zipCode', 'Zip Code'),
              _buildTextField('facebookUrl', 'Facebook URL'),
              _buildTextField('twitterUrl', 'Twitter URL'),
              const SizedBox(height: 24),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton(
                  onPressed: _loading ? null : _saveProfile,
                  style: ElevatedButton.styleFrom(
                    padding: const EdgeInsets.symmetric(vertical: 16),
                  ),
                  child: _loading
                      ? const SizedBox(
                          width: 20,
                          height: 20,
                          child: CircularProgressIndicator(
                            strokeWidth: 2,
                            color: Colors.white,
                          ),
                        )
                      : const Text('Save Profile'),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(
    String key,
    String label, {
    bool requiredField = false,
  }) {
    String? Function(String?)? validator;
    switch (key) {
      case 'mobile':
        validator = (v) {
          if (v == null || v.trim().isEmpty) return null;
          return _mobilePattern.hasMatch(v.trim())
              ? null
              : 'Invalid mobile number';
        };
        break;
      case 'telephone':
        validator = (v) {
          if (v == null || v.trim().isEmpty) return null;
          return _mobilePattern.hasMatch(v.trim())
              ? null
              : 'Invalid telephone number';
        };
        break;
      case 'zipCode':
        validator = (v) {
          if (v == null || v.trim().isEmpty) return null;
          return _zipCodePattern.hasMatch(v.trim()) ? null : 'Invalid zip code';
        };
        break;
      case 'facebookUrl':
        validator = (v) {
          if (v == null || v.trim().isEmpty) return null;
          return _facebookPattern.hasMatch(v.trim())
              ? null
              : 'Invalid Facebook URL';
        };
        break;
      case 'twitterUrl':
        validator = (v) {
          if (v == null || v.trim().isEmpty) return null;
          return _twitterPattern.hasMatch(v.trim())
              ? null
              : 'Invalid Twitter URL';
        };
        break;
      default:
        validator = requiredField
            ? (v) => (v == null || v.trim().isEmpty) ? 'Required field' : null
            : null;
    }
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8),
      child: TextFormField(
        initialValue: _formData[key]?.toString() ?? '',
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(),
          filled: true,
          fillColor: Colors.grey[50],
        ),
        validator: validator,
        onChanged: (v) => _formData[key] = v.trim(),
        onSaved: (v) => _formData[key] = v?.trim(),
      ),
    );
  }
}
