import 'package:ajps_flutter_app/pages/journal/journal_current_issue_page.dart';
import 'package:ajps_flutter_app/pages/journal/journal_all_issue_page.dart';
import 'package:ajps_flutter_app/pages/journal/journal_editorial_page.dart';
import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/models/journal.dart';
import 'package:ajps_flutter_app/pages/journal/journal_detail_page.dart';

class JournalSectionPage extends StatefulWidget {
  final Journal journal;

  const JournalSectionPage({super.key, required this.journal});

  @override
  State<JournalSectionPage> createState() => _JournalSectionPageState();
}

class _JournalSectionPageState extends State<JournalSectionPage> {
  int _selectedIndex = 0;

  late final List<Widget> _pages;

  @override
  void initState() {
    super.initState();
    _pages = [
      JournalDetailPage(
        journalName: widget.journal.journalName,
        journalUrl: widget.journal.journalUrl,
        journal: widget.journal, // Pass the full journal object if needed
      ),
      JournalEditorialPage(journal: widget.journal),
      JournalCurrentIssuePage(journal: widget.journal),
      JournalAllIssuePage(journal: widget.journal),
    ];
  }

  void _onItemTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
    Navigator.pop(context); // Close the drawer
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.journal.journalName),
        backgroundColor: Theme.of(context).colorScheme.primary,
        foregroundColor: Colors.white,
      ),
      drawer: _buildDrawer(),
      body: _pages[_selectedIndex],
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          _buildDrawerHeader(),
          _buildDrawerItems(),
          const Divider(),
          _buildBackButton(),
        ],
      ),
    );
  }

  Widget _buildDrawerHeader() {
    return DrawerHeader(
      decoration: BoxDecoration(color: Theme.of(context).colorScheme.primary),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.end,
        children: [
          Text(
            widget.journal.journalName,
            style: Theme.of(
              context,
            ).textTheme.titleLarge?.copyWith(color: Colors.white),
          ),
          Text(
            'ISSN: ${widget.journal.issn}',
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(color: Colors.white70),
          ),
          Text(
            widget.journal.journalType,
            style: Theme.of(
              context,
            ).textTheme.bodyMedium?.copyWith(color: Colors.white70),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerItems() {
    return Column(
      children: [
        ListTile(
          leading: const Icon(Icons.info),
          title: const Text('Homepage'),
          selected: _selectedIndex == 0,
          onTap: () => _onItemTapped(0),
        ),
        ListTile(
          leading: const Icon(Icons.people),
          title: const Text('Editorial Board'),
          selected: _selectedIndex == 1,
          onTap: () => _onItemTapped(1),
        ),
        ListTile(
          leading: const Icon(Icons.description),
          title: const Text('Current Issue'),
          selected: _selectedIndex == 2,
          onTap: () => _onItemTapped(2),
        ),
        ListTile(
          leading: const Icon(Icons.archive),
          title: const Text('All Issue'),
          selected: _selectedIndex == 3,
          onTap: () => _onItemTapped(3),
        ),
      ],
    );
  }

  Widget _buildBackButton() {
    return ListTile(
      leading: const Icon(Icons.arrow_back),
      title: const Text('Back to Journals'),
      onTap: () {
        Navigator.pop(context); // Close drawer
        Navigator.pop(context); // Go back to journal list
      },
    );
  }
}
