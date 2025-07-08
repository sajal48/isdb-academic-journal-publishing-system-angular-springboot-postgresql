import 'package:ajps_flutter_app/models/submission_dashboard.dart';
import 'package:flutter/material.dart';
import 'package:ajps_flutter_app/services/submission_service.dart';
import 'package:ajps_flutter_app/widgets/confirmation_dialog.dart';
import 'package:ajps_flutter_app/widgets/status_badge.dart';
import 'package:provider/provider.dart';
import 'package:ajps_flutter_app/services/auth_service.dart';
import 'package:url_launcher/url_launcher.dart';

class UserDashboardScreen extends StatefulWidget {
  const UserDashboardScreen({super.key});

  @override
  State<UserDashboardScreen> createState() => _UserDashboardScreenState();
}

class _UserDashboardScreenState extends State<UserDashboardScreen> {
  late Future<List<SubmissionDashboard>> _submissionsFuture;
  final SubmissionService _submissionService = SubmissionService();

  @override
  void initState() {
    super.initState();
    _loadSubmissions();
  }

  void _loadSubmissions() {
    final authService = Provider.of<AuthService>(context, listen: false);
    final userId = authService.getUserID();
    _submissionsFuture = _submissionService.getUserSubmissions(
      userId: userId,
      authService: authService,
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const _DashboardHeader(),
            const SizedBox(height: 20),
            // Uncomment to add stats cards
            // const _StatsCards(),
            // const SizedBox(height: 20),
            _buildSubmissionsTable(),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmissionsTable() {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'My Submissions',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
                color: Color(0xFF2e7d32),
              ),
            ),
            const SizedBox(height: 16),
            FutureBuilder<List<SubmissionDashboard>>(
              future: _submissionsFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return const Padding(
                    padding: EdgeInsets.symmetric(vertical: 16.0),
                    child: Row(
                      children: [
                        Icon(Icons.info_outline, color: Colors.grey),
                        SizedBox(width: 8),
                        Text(
                          'No submissions found',
                          style: TextStyle(
                            color: Colors.grey,
                            fontStyle: FontStyle.italic,
                          ),
                        ),
                      ],
                    ),
                  );
                } else {
                  return _buildSubmissionsList(snapshot.data!);
                }
              },
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildSubmissionsList(List<SubmissionDashboard> submissions) {
    return Table(
      columnWidths: const {0: FlexColumnWidth(3), 1: FlexColumnWidth(1)},
      border: TableBorder.all(color: Colors.transparent),
      children: [
        const TableRow(
          decoration: BoxDecoration(
            border: Border(bottom: BorderSide(color: Colors.grey)),
          ),
          children: [
            Padding(
              padding: EdgeInsets.only(bottom: 8.0),
              child: Text(
                'Manuscript Title',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
            Padding(
              padding: EdgeInsets.only(bottom: 8.0),
              child: Text(
                'Status',
                style: TextStyle(fontWeight: FontWeight.bold),
              ),
            ),
          ],
        ),
        ...submissions.expand(
          (submission) => [
            TableRow(
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(vertical: 8.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        submission.manuscriptTitle,
                        style: const TextStyle(fontWeight: FontWeight.w500),
                      ),
                      const SizedBox(height: 4),
                      // journalName not in model, so skip or show '-'
                      Text(
                        // '-',
                        submission.journalName,
                        style: TextStyle(fontSize: 12, color: Colors.grey),
                      ),
                    ],
                  ),
                ),
                StatusBadge(status: submission.submissionStatus),
              ],
            ),
            TableRow(
              children: [
                Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: _buildActionButtons(submission),
                ),
                const SizedBox.shrink(),
              ],
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildActionButtons(SubmissionDashboard submission) {
    return Wrap(
      spacing: 8.0,
      runSpacing: 4.0,
      children: [
        // editable not in model, so always show Edit for now
        ActionButton(
          icon: Icons.edit,
          label: 'Edit',
          onPressed: () => _editManuscript(submission.id.toString()),
        ),
        ActionButton(
          icon: Icons.visibility,
          label: 'View',
          onPressed: () => _viewManuscript(submission.id.toString()),
        ),
        if (submission.submissionStatus != 'SAVED') ...[
          // paymentDue not in model, so skip
          ActionButton(
            icon: Icons.work,
            label: 'Workflow',
            onPressed: () => _viewWorkflow(submission.id.toString()),
          ),
        ],
        if (submission.submissionStatus == 'SAVED')
          ActionButton(
            icon: Icons.delete,
            label: 'Delete',
            color: Colors.red,
            onPressed: () => _deleteManuscript(submission.id.toString()),
          ),
        if (submission.submissionStatus == 'REVISION_REQUIRED')
          const Padding(
            padding: EdgeInsets.only(top: 4.0),
            child: Row(
              children: [
                Icon(Icons.warning_amber, color: Colors.orange, size: 16),
                SizedBox(width: 4),
                Text(
                  'Revision required!',
                  style: TextStyle(color: Colors.orange, fontSize: 12),
                ),
              ],
            ),
          ),
      ],
    );
  }

  void _editManuscript(String id) {
    _showWebVersionDialog(
      'Edit Manuscript',
      'To edit your manuscript, please use the web version for the best experience.',
    );
  }

  void _viewManuscript(String id) {
    _showWebVersionDialog(
      'View Manuscript',
      'To view your manuscript details, please use the web version for the best experience.',
    );
  }

  // ignore: unused_element
  void _makePayment(String id) {
    _showWebVersionDialog(
      'Make Payment',
      'To process payment, please use the web version for secure transactions.',
    );
  }

  void _viewWorkflow(String id) {
    _showWebVersionDialog(
      'View Workflow',
      'To view the manuscript workflow, please use the web version for detailed information.',
    );
  }

  void _showWebVersionDialog(String title, String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(
                Icons.info_outline,
                size: 48,
                color: Theme.of(context).primaryColor,
              ),
              const SizedBox(height: 16),
              Text(
                message,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 16),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton.icon(
              onPressed: () {
                Navigator.of(context).pop();
                _openWebVersion();
              },
              icon: const Icon(Icons.open_in_new),
              label: const Text('Use Web Version'),
              style: ElevatedButton.styleFrom(
                backgroundColor: Theme.of(context).primaryColor,
                foregroundColor: Colors.white,
              ),
            ),
          ],
        );
      },
    );
  }

  void _openWebVersion() async {
    const url = 'http://localhost:4500/user/dashboard';
    try {
      final uri = Uri.parse(url);
      if (await canLaunchUrl(uri)) {
        await launchUrl(uri, mode: LaunchMode.externalApplication);
      } else {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text(
                'Could not launch web browser. Please manually navigate to: http://localhost:4500/user/dashboard',
              ),
              duration: Duration(seconds: 5),
            ),
          );
        }
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Error opening web version. Please manually navigate to: http://localhost:4500/user/dashboard',
            ),
            duration: Duration(seconds: 5),
          ),
        );
      }
    }
  }

  Future<void> _deleteManuscript(String id) async {
    final authService = Provider.of<AuthService>(context, listen: false);
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (context) => ConfirmationDialog(
        title: 'Delete Manuscript',
        message: 'Are you sure you want to delete this manuscript permanently?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      ),
    );

    if (confirmed == true) {
      try {
        await _submissionService.deleteSubmission(id, authService: authService);
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Manuscript deleted successfully')),
          );
          setState(() {
            _loadSubmissions();
          });
        }
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to delete manuscript: $e')),
          );
        }
      }
    }
  }
}

class _DashboardHeader extends StatelessWidget {
  const _DashboardHeader();

  @override
  Widget build(BuildContext context) {
    return const Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'User Dashboard',
          style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: Color(0xFF2e7d32),
          ),
        ),
        SizedBox(height: 8),
        Text(
          'Welcome back! Here\'s an overview of your submissions.',
          style: TextStyle(color: Colors.grey),
        ),
      ],
    );
  }
}

class ActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color? color;
  final VoidCallback onPressed;

  const ActionButton({
    required this.icon,
    required this.label,
    required this.onPressed,
    this.color,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    return TextButton(
      style: TextButton.styleFrom(
        foregroundColor: color ?? Theme.of(context).primaryColor,
        padding: EdgeInsets.zero,
        minimumSize: const Size(50, 30),
        tapTargetSize: MaterialTapTargetSize.shrinkWrap,
      ),
      onPressed: onPressed,
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [Icon(icon, size: 16), const SizedBox(width: 4), Text(label)],
      ),
    );
  }
}
