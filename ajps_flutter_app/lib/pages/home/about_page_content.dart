import 'package:ajps_flutter_app/pages/home/contact_page_content.dart';
import 'package:ajps_flutter_app/pages/journal/journal_main_page.dart';
import 'package:flutter/gestures.dart';
import 'package:flutter/material.dart';

/// Widget for the About Us page, accessible from the Home section's drawer.
class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.only(bottom: 32.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Text(
                      'About the Publisher',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 20.0), 
                    ),
                  ),
                  Text(
                    'Founded in 2021 in Dhaka, Bangladesh, ScholarPress is an open-access publishing platform dedicated to advancing scientific discovery. Established by a group of passionate researchers, we strive to make high-quality research accessible worldwide. Our rigorous peer-review process, conducted by world-class reviewers, ensures every manuscript meets the highest standards of clarity and originality. We specialize in BioSciences and Environmental Sciences, prioritizing impactful contributions to the global research community. Our streamlined submission process and strict plagiarism policies guarantee a hassle-free and ethical publishing experience.',
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black),
                    textAlign: TextAlign.justify,
                  ),
                ],
              ),
            ),

            // Section: Our Journals
            Padding(
              padding: const EdgeInsets.only(bottom: 32.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0), 
                    child: Text(
                      'Our Journals',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 20.0),
                    ),
                  ),
                  Text.rich(
                    TextSpan(
                      text: 'ScholarPress publishes research journals in BioSciences and Environmental Sciences, adhering to international standards and fair editorial policies. Our distinguished editorial board and doctorate-holding reviewers ensure thorough, double-blind peer reviews. Each submission undergoes initial checks for plagiarism, scope, and language quality by an assigned editor, followed by a final decision from the editorial board based on reviewer feedback. Authors are encouraged to review their work for originality before submission. For detailed guidelines, visit our ',
                      children: [
                        TextSpan(
                          text: 'Journals',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary, 
                            decoration: TextDecoration.underline,
                            fontWeight: FontWeight.bold,
                          ),
                          recognizer: TapGestureRecognizer()
                            ..onTap = () {
                              Navigator.push(context, MaterialPageRoute(builder: (context) => const JournalPage()));
                            },
                        ),
                        const TextSpan(
                          text: ' section. While policies are largely consistent, individual journals may have subject-specific requirements.',
                        ),
                      ],
                    ),
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black),
                    textAlign: TextAlign.justify,
                  ),
                ],
              ),
            ),

            // Section: Book Publishing
            Padding(
              padding: const EdgeInsets.only(bottom: 32.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Text(
                      'Book Publishing',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 20.0),
                    ),
                  ),
                  Text.rich(
                    TextSpan(
                      text: 'We are currently focused on maintaining the scientific integrity of our journals and have not yet launched book publishing. However, we plan to introduce book publishing services within the next year, covering BioSciences and Environmental Sciences. For updates or inquiries, please visit our ',
                      children: [
                        TextSpan(
                          text: 'Contact',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            decoration: TextDecoration.underline,
                            fontWeight: FontWeight.bold,
                          ),
                          recognizer: TapGestureRecognizer()
                            ..onTap = () {
                              Navigator.push(context, MaterialPageRoute(builder: (context) => const ContactPage()));
                            },
                        ),
                        const TextSpan(
                          text: ' section. Note that our journals do not handle book publishing inquiries, so please direct these to the publisher.',
                        ),
                      ],
                    ),
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black),
                    textAlign: TextAlign.justify,
                  ),
                ],
              ),
            ),

            // Section: Abstracting and Indexing
            Padding(
              padding: const EdgeInsets.only(bottom: 32.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Text(
                      'Abstracting and Indexing',
                      style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 20.0),
                    ),
                  ),
                  Text.rich(
                    TextSpan(
                      text: 'Our journals are indexed by leading abstracting and indexing services, ensuring global visibility and accessibility. These services provide abstracts and assign descriptors to enhance discoverability. For specific indexing details, please refer to the respective ',
                      children: [
                        TextSpan(
                          text: 'Journal',
                          style: TextStyle(
                            color: Theme.of(context).colorScheme.primary,
                            decoration: TextDecoration.underline,
                            fontWeight: FontWeight.bold, 
                          ),
                          recognizer: TapGestureRecognizer()
                            ..onTap = () {
                              Navigator.push(context, MaterialPageRoute(builder: (context) => const JournalPage()));
                            },
                        ),
                        const TextSpan(
                          text: ' pages.',
                        ),
                      ],
                    ),
                    style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black),
                    textAlign: TextAlign.justify,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
