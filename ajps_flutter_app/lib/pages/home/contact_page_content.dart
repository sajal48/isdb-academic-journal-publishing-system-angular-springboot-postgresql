import 'package:flutter/material.dart';

/// Widget for the Contact Us page.
class ContactPage extends StatelessWidget {
  const ContactPage({super.key});

  // Helper method to build a section with a heading and an email link
  Widget _buildEmailContactSection(BuildContext context, String heading, String email) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            heading,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 20.0), // h4 styling
          ),
          const SizedBox(height: 4.0),
          GestureDetector( // Makes the entire text span tappable
            // onTap: () => _launchEmail(context, email),
            child: Text(
              email,
              style: TextStyle(
                color: Theme.of(context).colorScheme.primary, 
                decoration: TextDecoration.underline,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [         
            // Introductory paragraph section
            Padding(
              padding: const EdgeInsets.only(bottom: 32.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Text(
                      'ScholarPress is a leading open-access publishing platform for journals and books. We are committed to supporting authors and readers with any issues they encounter. Feel free to reach out to our team via email, and our professional staff will respond promptly to assist you.',
                      style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black), 
                      textAlign: TextAlign.justify,
                    ),
                  ),
                ],
              ),
            ),
            Wrap( 
              spacing: 16.0, // horizontal spacing between items
              runSpacing: 16.0, // vertical spacing between lines of items
              children: [
                // Left column: Contact Details and Postal Address
                SizedBox( // Constrain width for columns
                  // width: (MediaQuery.of(context).size.width / 2) - 24, // Roughly col-md-6
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // For Professional Services
                      _buildEmailContactSection(context, 'For Professional Services', 'services@example.com'),
                      // For Complaints
                      _buildEmailContactSection(context, 'For Complaints', 'support@example.com'),
                      // General Inquiries
                      _buildEmailContactSection(context, 'General Inquiries', 'info@example.com'),

                      // Postal Address
                      Padding(
                        padding: const EdgeInsets.symmetric(vertical: 8.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Postal Address',
                              style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 20.0),
                            ),
                            const SizedBox(height: 4.0),
                            Text(
                              'Momtaz Plaza 3rd Floor\n'
                                  'House #7, Road #4,\n'
                                  'Dhanmondi, Dhaka - 1205.\n'
                                  'Bangladesh\n'
                                  'Phone: Not Available',
                              style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black),
                            ),
                            GestureDetector( // Tappable email in address
                              // onTap: () => _launchEmail(context, 'info@example.com'),
                              child: Text(
                                'Email: info@example.com',
                                style: TextStyle(
                                  color: Theme.of(context).colorScheme.primary,
                                  decoration: TextDecoration.underline,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}
