import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/models/user.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:provider/provider.dart';
import 'package:flutter_svg/flutter_svg.dart';
import 'package:ajps_flutter_app/navigation/navigation_provider.dart';

// import 'package:ajps_flutter_app/navigation/main_navigator.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  bool _checkingAuth = true;
  // ignore: unused_field
  bool _isLoggedIn = false;

  @override
  void initState() {
    super.initState();
    _checkAuthStatus();
  }

  Future<void> _checkAuthStatus() async {
    final authService = Provider.of<AuthService>(context, listen: false);
    final isLoggedIn = await authService.isAuthenticated();
    setState(() {
      _checkingAuth = false;
      _isLoggedIn = isLoggedIn;
    });
    if (isLoggedIn) {
      // Redirect to user home (dashboard)
      // ignore: use_build_context_synchronously
      Provider.of<NavigationProvider>(context, listen: false).setTab(2);
      // Optionally, you can also pop the login screen if it was pushed
    }
  }

  void _onLoginSuccess(BuildContext context) {
    // Set the User tab as selected after login
    Provider.of<NavigationProvider>(context, listen: false).setTab(2);
  }

  @override
  Widget build(BuildContext context) {
    if (_checkingAuth) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    // If user is logged in, do not show login page (redirect handled in _checkAuthStatus)
    if (_isLoggedIn) {
      return const SizedBox.shrink(); // Prevents showing login UI after redirect
    }
    // If not logged in, show login content (bottom navigation handled by MainNavigator)
    return _LoginScreenContent(onLoginSuccess: () => _onLoginSuccess(context));
  }
}

class _LoginScreenContent extends StatefulWidget {
  final VoidCallback? onLoginSuccess;
  // ignore: use_super_parameters
  const _LoginScreenContent({Key? key, this.onLoginSuccess}) : super(key: key);

  @override
  State<_LoginScreenContent> createState() => _LoginScreenContentState();
}

class _LoginScreenContentState extends State<_LoginScreenContent> {
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
        // ignore: unused_local_variable
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
        if (widget.onLoginSuccess != null) {
          widget.onLoginSuccess!();
        }
        // Instead of pushReplacementNamed, switch to the User tab
        // ignore: use_build_context_synchronously
        Provider.of<NavigationProvider>(context, listen: false).setTab(2);
        // Optionally, you can also pop the login screen if it was pushed
        // Navigator.of(context).popUntil((route) => route.isFirst);
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
    return Container(
      color: Colors.white,
      child: Center(
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
                                // ignore: deprecated_member_use
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
                                // ignore: deprecated_member_use
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
                                // ignore: avoid_print
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
