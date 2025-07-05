import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/services/auth_service.dart'; // Updated import path
import 'package:provider/provider.dart';

class JournalSubmissionsScreen extends StatelessWidget {
  const JournalSubmissionsScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final authService = Provider.of<AuthService>(context, listen: false);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Journal Submissions'),
        backgroundColor: Colors.teal,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () => authService.logout(context),
          ),
        ],
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.edit_document, size: 80, color: Colors.teal),
            const SizedBox(height: 20),
            const Text(
              'Welcome, Editor!',
              style: TextStyle(
                fontSize: 28,
                fontWeight: FontWeight.bold,
                color: Colors.teal,
              ),
            ),
            const SizedBox(height: 10),
            Text(
              'Email: ${authService.getUserEmail()}',
              style: const TextStyle(fontSize: 16),
            ),
            Text(
              'Role: ${authService.getUserRole()}',
              style: const TextStyle(fontSize: 16),
            ),
            const SizedBox(height: 30),
            ElevatedButton(
              onPressed: () => authService.logout(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.redAccent,
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(
                  horizontal: 30,
                  vertical: 15,
                ),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10.0),
                ),
              ),
              child: const Text('Logout'),
            ),
          ],
        ),
      ),
    );
  }
}
