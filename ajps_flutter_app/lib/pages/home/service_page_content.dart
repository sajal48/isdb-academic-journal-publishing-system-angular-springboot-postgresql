import 'package:flutter/material.dart';

/// Widget for the Our Services page.
class ServicesPage extends StatelessWidget {
  const ServicesPage({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView( // Allows the content to scroll if it exceeds screen height
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 24.0), // Padding for the entire page content
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch, // Makes children stretch horizontally
          children: [
            // Page title: "Our Services"
            /*Padding(
              padding: const EdgeInsets.only(bottom: 40.0), // Spacing below the title
              child: Text(
                'Our Services',
                style: Theme.of(context).textTheme.headlineLarge, // Uses the large headline style from the theme
                textAlign: TextAlign.center,
              ),
            ),*/

            // Section: Services for Readers
            _buildServiceSection(
              context,
              'Services for Readers',
              'ScholarPress provides free access to all articles under our open-access policy, allowing readers to download and read content without charge. If you encounter issues accessing articles due to device or browser incompatibility, request a PDF version via email, and we’ll send it promptly at no cost. We welcome feedback, complaints, or suggestions to improve our publications. Please contact us with your input, and we’ll address concerns respectfully and efficiently.',
            ),

            // Section: Services for Authors
            _buildServiceSection(
              context,
              'Services for Authors',
              [
                TextSpan(
                  text: 'ScholarPress offers professional editing services to enhance your manuscript. Our team of English language experts corrects grammar, refines syntax, and restructures sentences to make your work clear and engaging. We provide plagiarism checks with suggestions to ensure originality, but we do not support manuscripts with similarities in data, results, or figures. Our services include:',
                ),
              ],
              numberedList: [
                'Manuscript proofreading and submission guidelines',
                'Formatting manuscripts to meet specific journal requirements',
                'Referencing adjustments to comply with citation styles',
                'Grammar, error correction, and sentence clarity improvements',
                'Plagiarism checks with actionable suggestions',
              ],
              additionalParagraphs: [
                TextSpan(
                  text: 'Contact us via ',
                  children: [
                    TextSpan(
                      text: 'email',
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.primary,
                        decoration: TextDecoration.underline,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const TextSpan(
                      text: ' to access these professional services.',
                    ),
                  ],
                ),
              ],
            ),

            // Section: Statement of Service Ethics
            _buildServiceSection(
              context,
              'Statement of Service Ethics',
              'ScholarPress is committed to ethical publishing. We conduct plagiarism checks to minimize similarities and offer editing and proofreading as part of our language services. However, we do not paraphrase or write academic papers based on provided data or materials. Our goal is to enhance your manuscript’s language, format, and style while upholding academic integrity. All service-related communications are handled through our official correspondence channels.',
            ),
          ],
        ),
      ),
    );
  }

  // Helper method to build consistent service sections
  Widget _buildServiceSection(
      BuildContext context,
      String heading,
      dynamic content, { // Can be a String or List<TextSpan>
        List<String>? numberedList,
        List<TextSpan>? additionalParagraphs,
      }) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 32.0), // Spacing between sections
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.symmetric(vertical: 8.0),
            child: Text(
              heading,
              style: Theme.of(context).textTheme.headlineMedium?.copyWith(fontSize: 20.0), // Smaller heading for sections
            ),
          ),
          if (content is String) // If content is a single string
            Text(
              content,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black), // text-muted color
              textAlign: TextAlign.justify,
            )
          else if (content is List<TextSpan>) // If content is a list of TextSpans
            Text.rich(
              TextSpan(children: content),
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black),
              textAlign: TextAlign.justify,
            ),
          if (numberedList != null && numberedList.isNotEmpty)
            Padding(
              padding: const EdgeInsets.only(left: 20.0, top: 10.0), // Indent for the list
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: numberedList.asMap().entries.map((entry) {
                  int index = entry.key + 1; // 1-based numbering
                  String item = entry.value;
                  return Padding(
                    padding: const EdgeInsets.only(bottom: 4.0), // Spacing between list items
                    child: Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          '$index. ',
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black),
                        ),
                        Expanded(
                          child: Text(
                            item,
                            style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black),
                          ),
                        ),
                      ],
                    ),
                  );
                }).toList(),
              ),
            ),
          if (additionalParagraphs != null && additionalParagraphs.isNotEmpty)
            ...additionalParagraphs.map((span) => Padding(
              padding: const EdgeInsets.only(top: 10.0), // Margin top for additional paragraphs
              child: Text.rich(
                span,
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(color: Colors.black),
                textAlign: TextAlign.justify,
              ),
            )).toList(),
        ],
      ),
    );
  }
}
