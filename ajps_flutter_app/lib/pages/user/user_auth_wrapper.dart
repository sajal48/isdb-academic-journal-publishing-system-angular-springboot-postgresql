import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:ajps_flutter_app/pages/login_register/login_screen.dart';
import 'package:ajps_flutter_app/pages/user/user_home_screen.dart';
import 'package:ajps_flutter_app/pages/user/admin_dashboard_screen.dart';
import 'package:ajps_flutter_app/pages/user/journal_submissions_screen.dart';
import 'package:ajps_flutter_app/pages/user/reviewer_dashboard_screen.dart';
import 'package:provider/provider.dart';

class UserAuthWrapper extends StatefulWidget {
  const UserAuthWrapper({super.key});

  @override
  State<UserAuthWrapper> createState() => _UserAuthWrapperState();
}

class _UserAuthWrapperState extends State<UserAuthWrapper> {
  late Future<bool> _isAuthenticatedFuture;

  @override
  void initState() {
    super.initState();
    _isAuthenticatedFuture = Provider.of<AuthService>(
      context,
      listen: false,
    ).isAuthenticated();
  }

  // This method is called when the widget's dependencies change.
  // We use it to re-check authentication status if the AuthService changes (e.g., after logout).
  @override
  void didChangeDependencies() {
    super.didChangeDependencies();
    // Re-evaluate authentication status whenever dependencies change
    _isAuthenticatedFuture = Provider.of<AuthService>(
      context,
      listen: false,
    ).isAuthenticated();
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<bool>(
      future: _isAuthenticatedFuture,
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Scaffold(
            body: Center(child: CircularProgressIndicator()),
          );
        } else if (snapshot.hasError) {
          return Scaffold(
            body: Center(child: Text('Error: ${snapshot.error}')),
          );
        } else {
          if (snapshot.data == true) {
            // User is authenticated, show appropriate dashboard based on role
            final authService = Provider.of<AuthService>(
              context,
              listen: false,
            );
            final userRole = authService.getUserRole();

            switch (userRole) {
              case 'admin':
                return const AdminDashboardScreen();
              case 'editor':
                return const JournalSubmissionsScreen();
              case 'reviewer':
                return const ReviewerDashboardScreen();
              default:
                return const HomeScreen(); // Default for 'user' role or unhandled roles
            }
          } else {
            // User is not authenticated, show login screen
            return const LoginScreen();
          }
        }
      },
    );
  }
}
