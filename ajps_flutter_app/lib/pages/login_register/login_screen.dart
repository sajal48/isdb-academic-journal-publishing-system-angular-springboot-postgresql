import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/models/user.dart'; // Updated import path
import 'package:ajps_flutter_app/services/auth_service.dart'; // Updated import path
import 'package:provider/provider.dart';
import 'package:flutter_svg/flutter_svg.dart'; // For SVG image

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  String? _serverError;
  String? _serverSuccess;
  bool _isLoading = false;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  void _onSubmit() async {
    setState(() {
      _serverError = null;
      _serverSuccess = null;
      _isLoading = true;
    });

    if (_emailController.text.isEmpty || _passwordController.text.isEmpty) {
      setState(() {
        _serverError = 'All fields are required.';
        _isLoading = false;
      });
      return;
    }

    final authService = Provider.of<AuthService>(context, listen: false);
    final user = AuthRegisterLoginRequest(
      email: _emailController.text,
      password: _passwordController.text,
    );

    final response = await authService.login(user);

    if (response.code == 200) {
      setState(() {
        _serverSuccess = 'Login successful. Please wait...';
        _emailController.clear();
        _passwordController.clear();
      });

      // Navigate based on role after a short delay for the message to show
      Future.delayed(const Duration(seconds: 1), () {
        final userRole = authService.getUserRole();
        String route = '/user'; // Default route

        switch (userRole) {
          case 'admin':
            route = '/user/admin-dashboard';
            break;
          case 'editor':
            route = '/user/journal-submissions';
            break;
          case 'reviewer':
            route = '/user/reviewer-dashboard';
            break;
          default:
            route = '/user';
            break;
        }
        // Use pushReplacementNamed to navigate and remove the login screen from the stack
        Navigator.of(context).pushReplacementNamed(route);
      });
    } else {
      setState(() {
        _serverError = response.message;
      });
    }
    setState(() {
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16.0),
          child: LayoutBuilder(
            builder: (context, constraints) {
              // Determine if we are on a small screen (e.g., mobile)
              bool isSmallScreen = constraints.maxWidth < 600;

              return Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  // Image on top for all screens
                  Padding(
                    padding: const EdgeInsets.only(bottom: 24.0),
                    child: SvgPicture.asset(
                      'assets/images/login-page-image.svg',
                      height: isSmallScreen ? 180 : 250,
                      fit: BoxFit.contain,
                      placeholderBuilder: (BuildContext context) => Container(
                        height: isSmallScreen ? 180 : 250,
                        width: isSmallScreen ? 180 : 250,
                        color: Colors.grey[200],
                        alignment: Alignment.center,
                        child: const Text('Loading Image...'),
                      ),
                    ),
                  ),
                  // Form Card
                  Card(
                    margin: isSmallScreen
                        ? EdgeInsets.zero
                        : const EdgeInsets.symmetric(horizontal: 20.0),
                    elevation: 8.0,
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(15.0),
                    ),
                    child: Padding(
                      padding: const EdgeInsets.all(24.0),
                      child: Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.stretch,
                        children: [
                          const Text(
                            'Login to Your Account',
                            textAlign: TextAlign.center,
                            style: TextStyle(
                              fontSize: 24,
                              fontWeight: FontWeight.bold,
                              color: Colors.blueAccent,
                            ),
                          ),
                          const SizedBox(height: 20),
                          if (_serverError != null)
                            Container(
                              padding: const EdgeInsets.all(10),
                              margin: const EdgeInsets.only(bottom: 15),
                              decoration: BoxDecoration(
                                color: Colors.red.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.red),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.error_outline,
                                    color: Colors.red,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      _serverError!,
                                      style: const TextStyle(
                                        color: Colors.red,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          if (_serverSuccess != null)
                            Container(
                              padding: const EdgeInsets.all(10),
                              margin: const EdgeInsets.only(bottom: 15),
                              decoration: BoxDecoration(
                                color: Colors.green.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: Colors.green),
                              ),
                              child: Row(
                                children: [
                                  const Icon(
                                    Icons.check_circle_outline,
                                    color: Colors.green,
                                    size: 20,
                                  ),
                                  const SizedBox(width: 8),
                                  Expanded(
                                    child: Text(
                                      _serverSuccess!,
                                      style: const TextStyle(
                                        color: Colors.green,
                                        fontSize: 14,
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          TextFormField(
                            controller: _emailController,
                            decoration: InputDecoration(
                              labelText: 'Email',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10.0),
                              ),
                              prefixIcon: const Icon(Icons.email),
                            ),
                            keyboardType: TextInputType.emailAddress,
                          ),
                          const SizedBox(height: 15),
                          TextFormField(
                            controller: _passwordController,
                            decoration: InputDecoration(
                              labelText: 'Password',
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10.0),
                              ),
                              prefixIcon: const Icon(Icons.lock),
                            ),
                            obscureText: true,
                          ),
                          const SizedBox(height: 10),
                          Align(
                            alignment: Alignment.centerRight,
                            child: TextButton(
                              onPressed: () {
                                // Handle forgot password navigation
                                print('Forgot Password?');
                              },
                              child: Text(
                                'Forgot Password?',
                                style: TextStyle(
                                  color: Theme.of(context).colorScheme.primary,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(height: 20),
                          ElevatedButton.icon(
                            onPressed: _isLoading ? null : _onSubmit,
                            icon: _isLoading
                                ? const SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      color: Colors.white,
                                      strokeWidth: 2,
                                    ),
                                  )
                                : const Icon(Icons.login),
                            label: Text(_isLoading ? 'Logging in...' : 'Login'),
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Theme.of(
                                context,
                              ).colorScheme.primary,
                              foregroundColor: Colors.white,
                              padding: const EdgeInsets.symmetric(vertical: 15),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10.0),
                              ),
                              textStyle: const TextStyle(fontSize: 18),
                            ),
                          ),
                          const SizedBox(height: 15),
                          const SizedBox(height: 20),
                          Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Text(
                                "Don't have an account?",
                                style: TextStyle(fontSize: 14),
                              ),
                              TextButton(
                                onPressed: () {
                                  Navigator.of(context).pushNamed('/register');
                                },
                                child: Text(
                                  'Register Now',
                                  style: TextStyle(
                                    color: Theme.of(
                                      context,
                                    ).colorScheme.primary,
                                    fontSize: 14,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }
}
