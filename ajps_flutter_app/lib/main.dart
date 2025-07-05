import 'package:ajps_flutter_app/pages/user/admin_dashboard_screen.dart';
import 'package:ajps_flutter_app/pages/user/journal_submissions_screen.dart';
import 'package:ajps_flutter_app/pages/user/reviewer_dashboard_screen.dart';
import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/navigation/main_navigator.dart';
import 'package:ajps_flutter_app/services/auth_service.dart'; // Import AuthService
import 'package:ajps_flutter_app/pages/login_register/login_screen.dart'; // Import LoginScreen
import 'package:ajps_flutter_app/pages/login_register/register_screen.dart'; // Import RegisterScreen
import 'package:ajps_flutter_app/pages/user/user_home_screen.dart';
import 'package:provider/provider.dart'; // Import HomeScreen (for general user)

void main() {
  runApp(
    MultiProvider(
      providers: [
        // Provide AuthService globally
        Provider<AuthService>(create: (_) => AuthService()),
      ],
      child: const MyApp(),
    ),
  );
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'ScholarPress - AJPS',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        textTheme: const TextTheme(
          headlineLarge: TextStyle(
            fontSize: 28.0,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
          headlineMedium: TextStyle(
            fontSize: 22.0,
            fontWeight: FontWeight.bold,
            color: Colors.black,
          ),
          bodyLarge: TextStyle(
            fontSize: 16.0,
            height: 1.5,
            color: Colors.black,
          ),
        ),
      ),
      // The home property now directly points to MainNavigator
      // The authentication check will be handled within MainNavigator's UserAuthWrapper
      home: const MainNavigator(),
      // Define routes for navigation
      routes: {
        '/login': (context) => const LoginScreen(),
        '/register': (context) => const RegisterScreen(),
        '/user': (context) =>
            const HomeScreen(), // Default user page after login
        '/user/admin-dashboard': (context) => const AdminDashboardScreen(),
        '/user/journal-submissions': (context) =>
            const JournalSubmissionsScreen(),
        '/user/reviewer-dashboard': (context) =>
            const ReviewerDashboardScreen(),
      },
    );
  }
}
