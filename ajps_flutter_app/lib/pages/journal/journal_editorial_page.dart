import 'package:ajps_flutter_app/models/journal.dart';
import 'package:flutter/material.dart';

class EditorialMember {
  final String name;
  final String position;
  final String expertise;
  final String affiliation;
  final String email;
  final List<ExternalLink> links;

  EditorialMember({
    required this.name,
    required this.position,
    required this.expertise,
    required this.affiliation,
    this.email = '',
    this.links = const [],
  });
}

class ExternalLink {
  final String title;
  final String url;

  ExternalLink({required this.title, required this.url});
}

class JournalEditorialPage extends StatelessWidget {
  final Journal journal;

  const JournalEditorialPage({super.key, required this.journal});

  @override
  Widget build(BuildContext context) {
    // Mock data - in a real app, this would come from an API
    final editorialBoard = [
      // Editor-in-Chief
      EditorialMember(
        name: 'Dr. Chandrika Nanayakkara',
        position: 'Professor',
        expertise: 'Microbiology, Biotechnology, Bioremediation',
        affiliation:
            'Department of Plant Sciences, University of Colombo, Sri Lanka',
        email: 'chandi@pts.cmb.ac.lk',
        links: [
          ExternalLink(
            title: 'Google Scholar',
            url: 'https://scholar.google.com/citations?user=v-XTlPcAAAAJ&hl=en',
          ),
          ExternalLink(
            title: 'ResearchGate',
            url: 'https://www.researchgate.net/profile/Chandrika-Nanayakkara',
          ),
        ],
      ),
      // Executive Editors
      EditorialMember(
        name: 'Dr. Mohammad Zabed Hossain',
        position: 'Professor',
        expertise:
            'Molecular Ecology, Plant Ecology, Ecosystem Functions, Eco-physiology',
        affiliation:
            'Department of Botany, University of Dhaka, Dhaka, Bangladesh',
      ),
      EditorialMember(
        name: 'Dr. Aparna Shil',
        position: 'Associate Professor',
        expertise: 'Tissue Culture, Applied Microbiology, Biotechnology',
        affiliation:
            'Department of Botany, Jahangirnagar University, Dhaka, Bangladesh',
      ),
      // Advisory Editor
      EditorialMember(
        name: 'Md. Abdur Rahman Sarkar',
        position: 'Professor (Ret.)',
        expertise: '',
        affiliation:
            'Department of Agronomy, Bangladesh Agricultural University, Mymensingh, Bangladesh',
      ),
      // Editors
      EditorialMember(
        name: 'Dr. S.M. Mobarak Hossain',
        position: 'Professor',
        expertise: 'Plant Pathology, Plant Disease',
        affiliation:
            'Department of Plant Pathology, Hajee Mohammad Danesh Sci. & Tech. University, Dinajpur, Bangladesh',
      ),
      EditorialMember(
        name: 'Dr. Mohammad Redowan',
        position: 'Professor',
        expertise: 'Spatial Analysis, C-Estimation GIS Technologies',
        affiliation:
            'Dept. of Forestry & Environ. Science, Shahjalal University of Science & Tech., Sylhet, Bangladesh',
      ),
      EditorialMember(
        name: 'Dr. Tanzima Yeasmin',
        position: 'Professor',
        expertise: 'Plant Biochemistry and Molecular Biology',
        affiliation:
            'Dept. of Biochem. & Mol. Biology, University of Rajshahi, Rajshahi, Bangladesh',
      ),
      EditorialMember(
        name: 'Dr. Murad Ahmed Farukh',
        position: 'Professor',
        expertise: 'Extreme Weather Events',
        affiliation:
            'Department of Environmental Science, Bangladesh Agricultural University, Mymensingh, Bangladesh',
      ),
      EditorialMember(
        name: 'Mahin Afroz',
        position: 'Assistant Professor',
        expertise: 'Cytology, Cytogenetics',
        affiliation:
            'Department of Botany, University of Barishal, Barishal, Bangladesh',
      ),
      EditorialMember(
        name: 'Kazi Nazrul Islam',
        position: 'Assistant Professor',
        expertise: 'Forestry, Environments',
        affiliation:
            'Inst. of Forestry & Environ. Sciences, University of Chittagong, Chittagong, Bangladesh',
      ),
      // Editorial Assistant
      EditorialMember(
        name: 'Gagandeep',
        position: 'Postgraduate Diploma',
        expertise: '',
        affiliation: 'Northern College, Ontario, Canada',
      ),
    ];

    return Scaffold(
      // appBar: AppBar(title: Text('Editorial Board of ${journal.journalName}')),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Editor-in-Chief
            const SectionTitle('Editor-in-Chief'),
            const SizedBox(height: 8),
            _buildEditorCard(editorialBoard[0]),
            const SizedBox(height: 24),

            // Executive Editors
            const SectionTitle('Executive Editors'),
            const SizedBox(height: 8),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: MediaQuery.of(context).size.width > 600 ? 2 : 1,
              childAspectRatio: 1.5,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              children: [
                _buildEditorCard(editorialBoard[1]),
                _buildEditorCard(editorialBoard[2]),
              ],
            ),
            const SizedBox(height: 24),

            // Advisory Editor
            const SectionTitle('Advisory Editor'),
            const SizedBox(height: 8),
            _buildEditorCard(editorialBoard[3]),
            const SizedBox(height: 24),

            // Editors
            const SectionTitle('Editors'),
            const SizedBox(height: 8),
            GridView.count(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              crossAxisCount: MediaQuery.of(context).size.width > 600 ? 2 : 1,
              childAspectRatio: 1.5,
              mainAxisSpacing: 16,
              crossAxisSpacing: 16,
              children: [
                for (int i = 4; i < 10; i++)
                  _buildEditorCard(editorialBoard[i]),
              ],
            ),
            const SizedBox(height: 24),

            // Editorial Assistant
            const SectionTitle('Editorial Assistant'),
            const SizedBox(height: 8),
            _buildEditorCard(editorialBoard[10]),
            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _buildEditorCard(EditorialMember member) {
    return Card(
      elevation: 2,
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              member.name,
              style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
            ),
            const SizedBox(height: 8),
            if (member.position.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text(member.position),
              ),
            if (member.expertise.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(bottom: 4),
                child: Text('Expertise: ${member.expertise}'),
              ),
            Text(member.affiliation),
            if (member.email.isNotEmpty)
              Padding(
                padding: const EdgeInsets.only(top: 4),
                child: Text(
                  'Email: ${member.email}',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
              ),
            if (member.links.isNotEmpty) ...[
              const SizedBox(height: 8),
              Wrap(
                spacing: 8,
                children: member.links
                    .map(
                      (link) => InkWell(
                        onTap: () {},
                        child: Text(
                          link.title,
                          style: TextStyle(
                            color: Colors.blue[700],
                            decoration: TextDecoration.underline,
                          ),
                        ),
                      ),
                    )
                    .toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }
}

class SectionTitle extends StatelessWidget {
  final String title;

  const SectionTitle(this.title, {super.key});

  @override
  Widget build(BuildContext context) {
    return Text(
      title,
      style: Theme.of(
        context,
      ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.bold),
    );
  }
}
