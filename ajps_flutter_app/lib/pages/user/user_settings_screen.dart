import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:ajps_flutter_app/services/user_settings_service.dart';
import 'package:provider/provider.dart';
import 'package:ajps_flutter_app/navigation/navigation_provider.dart';

class UserSettingsScreen extends StatefulWidget {
  const UserSettingsScreen({super.key});

  @override
  State<UserSettingsScreen> createState() => _UserSettingsScreenState();
}

class _UserSettingsScreenState extends State<UserSettingsScreen> {
  final _emailFormKey = GlobalKey<FormState>();
  final _passwordFormKey = GlobalKey<FormState>();

  // Email change controllers
  final _newEmailController = TextEditingController();
  final _emailOtpController = TextEditingController();

  // Password change controllers
  final _currentPasswordController = TextEditingController();
  final _newPasswordController = TextEditingController();
  final _confirmPasswordController = TextEditingController();
  final _passwordOtpController = TextEditingController();

  // Loading states
  bool _isEmailChangeLoading = false;
  bool _isPasswordChangeLoading = false;
  bool _isEmailOtpLoading = false;
  bool _isPasswordOtpLoading = false;

  // Current user data
  String userEmail = '';
  int userId = 0;

  // Modal states
  bool _showEmailOtpModal = false;
  bool _showPasswordOtpModal = false;

  @override
  void initState() {
    super.initState();
    _loadUserData();
  }

  void _loadUserData() {
    final authService = Provider.of<AuthService>(context, listen: false);
    setState(() {
      userEmail = authService.getUserEmail();
      userId = authService.getUserID();
    });
  }

  @override
  void dispose() {
    _newEmailController.dispose();
    _emailOtpController.dispose();
    _currentPasswordController.dispose();
    _newPasswordController.dispose();
    _confirmPasswordController.dispose();
    _passwordOtpController.dispose();
    super.dispose();
  }

  bool _validateEmail(String email) {
    return RegExp(
      r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
    ).hasMatch(email);
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isError ? Colors.red : Colors.green,
        duration: const Duration(seconds: 3),
      ),
    );
  }

  Future<void> _onEmailSubmit() async {
    if (!_emailFormKey.currentState!.validate()) return;

    if (!_validateEmail(_newEmailController.text)) {
      _showSnackBar('Please enter a valid email.', isError: true);
      return;
    }

    setState(() => _isEmailChangeLoading = true);

    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      final userSettingsService = UserSettingsService();

      final response = await userSettingsService.requestEmailChange(
        userId: userId,
        newEmail: _newEmailController.text,
        authService: authService,
      );

      if (response['code'] == 200) {
        _showSnackBar(response['message'] ?? 'OTP sent successfully');
        setState(() => _showEmailOtpModal = true);
      } else {
        _showSnackBar(
          response['message'] ?? 'Failed to send OTP',
          isError: true,
        );
      }
    } catch (e) {
      _showSnackBar('Failed to send OTP: $e', isError: true);
    } finally {
      setState(() => _isEmailChangeLoading = false);
    }
  }

  Future<void> _onEmailOtpVerify() async {
    if (_emailOtpController.text.isEmpty) {
      _showSnackBar('Please enter OTP', isError: true);
      return;
    }

    setState(() => _isEmailOtpLoading = true);

    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      final userSettingsService = UserSettingsService();

      final response = await userSettingsService.confirmEmailChange(
        userId: userId,
        newEmail: _newEmailController.text,
        otp: int.tryParse(_emailOtpController.text) ?? 0,
        authService: authService,
      );

      if (response['code'] == 200) {
        setState(() {
          _showEmailOtpModal = false;
          _newEmailController.clear();
          _emailOtpController.clear();
        });

        _showSnackBar('Email changed successfully');

        // Show logout notification
        await Future.delayed(const Duration(milliseconds: 500));
        _showSnackBar('You will be signed out in 2 seconds.');

        // Logout after 2 seconds
        await Future.delayed(const Duration(seconds: 2));
        if (mounted) {
          await authService.logout(context);
          Provider.of<NavigationProvider>(context, listen: false).setTab(2);
        }
      } else {
        _showSnackBar(
          response['message'] ?? 'OTP verification failed',
          isError: true,
        );
      }
    } catch (e) {
      _showSnackBar('OTP verification failed: $e', isError: true);
    } finally {
      if (mounted) {
        setState(() => _isEmailOtpLoading = false);
      }
    }
  }

  Future<void> _onPasswordSubmit() async {
    if (!_passwordFormKey.currentState!.validate()) return;

    if (_newPasswordController.text != _confirmPasswordController.text) {
      _showSnackBar('Passwords do not match', isError: true);
      return;
    }

    if (_newPasswordController.text.length < 6) {
      _showSnackBar('Password must be at least 6 characters', isError: true);
      return;
    }

    setState(() => _isPasswordChangeLoading = true);

    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      final userSettingsService = UserSettingsService();

      final response = await userSettingsService.changePassword(
        userId: userId,
        userEmail: userEmail,
        currentPassword: _currentPasswordController.text,
        authService: authService,
      );

      if (response['code'] == 200) {
        _showSnackBar(response['message'] ?? 'OTP sent successfully');
        setState(() => _showPasswordOtpModal = true);
      } else {
        _showSnackBar(
          response['message'] ?? 'Failed to send OTP',
          isError: true,
        );
      }
    } catch (e) {
      _showSnackBar('Failed to send OTP: $e', isError: true);
    } finally {
      setState(() => _isPasswordChangeLoading = false);
    }
  }

  Future<void> _onPasswordOtpVerify() async {
    if (_passwordOtpController.text.isEmpty) {
      _showSnackBar('Please enter OTP', isError: true);
      return;
    }

    setState(() => _isPasswordOtpLoading = true);

    try {
      final authService = Provider.of<AuthService>(context, listen: false);
      final userSettingsService = UserSettingsService();

      final response = await userSettingsService.confirmPasswordChange(
        userId: userId,
        currentPassword: _currentPasswordController.text,
        newPassword: _newPasswordController.text,
        otp: int.tryParse(_passwordOtpController.text) ?? 0,
        authService: authService,
      );

      if (response['code'] == 200) {
        setState(() {
          _showPasswordOtpModal = false;
          _currentPasswordController.clear();
          _newPasswordController.clear();
          _confirmPasswordController.clear();
          _passwordOtpController.clear();
        });

        _showSnackBar('Password changed successfully');

        // Show logout notification
        await Future.delayed(const Duration(milliseconds: 500));
        _showSnackBar('You will be signed out in 2 seconds.');

        // Logout after 2 seconds
        await Future.delayed(const Duration(seconds: 2));
        if (mounted) {
          await authService.logout(context);
          Provider.of<NavigationProvider>(context, listen: false).setTab(2);
        }
      } else {
        _showSnackBar(
          response['message'] ?? 'OTP verification failed',
          isError: true,
        );
      }
    } catch (e) {
      _showSnackBar('OTP verification failed: $e', isError: true);
    } finally {
      if (mounted) {
        setState(() => _isPasswordOtpLoading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Stack(
        children: [
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                _buildEmailChangeCard(),
                const SizedBox(height: 16),
                _buildPasswordChangeCard(),
              ],
            ),
          ),
          if (_showEmailOtpModal) _buildEmailOtpModal(),
          if (_showPasswordOtpModal) _buildPasswordOtpModal(),
        ],
      ),
    );
  }

  Widget _buildEmailChangeCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Change Email',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Form(
              key: _emailFormKey,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Current Email',
                    style: TextStyle(fontWeight: FontWeight.w500),
                  ),
                  const SizedBox(height: 4),
                  Text(userEmail, style: const TextStyle(fontSize: 16)),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _newEmailController,
                    decoration: const InputDecoration(
                      labelText: 'New Email',
                      border: OutlineInputBorder(),
                    ),
                    keyboardType: TextInputType.emailAddress,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter new email';
                      }
                      if (!_validateEmail(value)) {
                        return 'Please enter a valid email';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isEmailChangeLoading ? null : _onEmailSubmit,
                      child: _isEmailChangeLoading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text('Change'),
                                SizedBox(width: 8),
                                Icon(Icons.arrow_forward_ios),
                              ],
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildPasswordChangeCard() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Change Password',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 16),
            Form(
              key: _passwordFormKey,
              child: Column(
                children: [
                  TextFormField(
                    controller: _currentPasswordController,
                    decoration: const InputDecoration(
                      labelText: 'Current Password',
                      border: OutlineInputBorder(),
                    ),
                    obscureText: true,
                    validator: (value) {
                      if (value == null || value.isEmpty) {
                        return 'Please enter current password';
                      }
                      return null;
                    },
                  ),
                  const SizedBox(height: 16),
                  Row(
                    children: [
                      Expanded(
                        child: TextFormField(
                          controller: _newPasswordController,
                          decoration: const InputDecoration(
                            labelText: 'New Password',
                            border: OutlineInputBorder(),
                          ),
                          obscureText: true,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please enter new password';
                            }
                            if (value.length < 6) {
                              return 'Password must be at least 6 characters';
                            }
                            return null;
                          },
                        ),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: TextFormField(
                          controller: _confirmPasswordController,
                          decoration: const InputDecoration(
                            labelText: 'Retype New Password',
                            border: OutlineInputBorder(),
                          ),
                          obscureText: true,
                          validator: (value) {
                            if (value == null || value.isEmpty) {
                              return 'Please confirm password';
                            }
                            if (value != _newPasswordController.text) {
                              return 'Passwords do not match';
                            }
                            return null;
                          },
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 16),
                  SizedBox(
                    width: double.infinity,
                    child: ElevatedButton(
                      onPressed: _isPasswordChangeLoading
                          ? null
                          : _onPasswordSubmit,
                      child: _isPasswordChangeLoading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Text('Change'),
                                SizedBox(width: 8),
                                Icon(Icons.arrow_forward_ios),
                              ],
                            ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmailOtpModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Card(
          margin: const EdgeInsets.all(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Verify Your Request',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                Text('We sent a 6-digit OTP to: ${_newEmailController.text}'),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _emailOtpController,
                  decoration: const InputDecoration(
                    labelText: 'Enter OTP',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    TextButton(
                      onPressed: () =>
                          setState(() => _showEmailOtpModal = false),
                      child: const Text('Cancel'),
                    ),
                    ElevatedButton(
                      onPressed: _isEmailOtpLoading ? null : _onEmailOtpVerify,
                      child: _isEmailOtpLoading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Verify & Change Email'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildPasswordOtpModal() {
    return Container(
      color: Colors.black54,
      child: Center(
        child: Card(
          margin: const EdgeInsets.all(16),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Text(
                  'Verify Your Request',
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
                const SizedBox(height: 16),
                Text('We sent a 6-digit OTP to: $userEmail'),
                const SizedBox(height: 16),
                TextFormField(
                  controller: _passwordOtpController,
                  decoration: const InputDecoration(
                    labelText: 'Enter OTP',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.number,
                  maxLength: 6,
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                  children: [
                    TextButton(
                      onPressed: () =>
                          setState(() => _showPasswordOtpModal = false),
                      child: const Text('Cancel'),
                    ),
                    ElevatedButton(
                      onPressed: _isPasswordOtpLoading
                          ? null
                          : _onPasswordOtpVerify,
                      child: _isPasswordOtpLoading
                          ? const SizedBox(
                              width: 20,
                              height: 20,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Text('Verify & Change Password'),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
