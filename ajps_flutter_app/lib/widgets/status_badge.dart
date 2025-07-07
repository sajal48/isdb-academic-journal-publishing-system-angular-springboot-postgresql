import 'package:flutter/material.dart';

class StatusBadge extends StatelessWidget {
  final String status;
  const StatusBadge({required this.status, super.key});

  @override
  Widget build(BuildContext context) {
    Color color;
    switch (status) {
      case 'SAVED':
        color = Colors.grey;
        break;
      case 'SUBMITTED':
        color = Colors.blue;
        break;
      case 'ACCEPTED':
        color = Colors.green;
        break;
      case 'REJECTED':
        color = Colors.red;
        break;
      case 'REVISION_REQUIRED':
        color = Colors.orange;
        break;
      default:
        color = Colors.black45;
    }
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        border: Border.all(color: color),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Text(
        status,
        style: TextStyle(
          color: color,
          fontWeight: FontWeight.bold,
          fontSize: 12,
        ),
      ),
    );
  }
}
