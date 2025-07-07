import 'package:flutter/material.dart';

class StatusBadge extends StatelessWidget {
  final String status;

  const StatusBadge({required this.status, super.key});

  @override
  Widget build(BuildContext context) {
    final (bgColor, textColor) = _getStatusColors(status);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: bgColor,
        borderRadius: BorderRadius.circular(12),
      ),
      child: Text(
        status.replaceAll('_', ' '),
        style: TextStyle(
          color: textColor,
          fontSize: 12,
          fontWeight: FontWeight.w500,
        ),
      ),
    );
  }

  (Color, Color) _getStatusColors(String status) {
    switch (status) {
      case 'SAVED':
        return (Colors.grey, Colors.white);
      case 'SUBMITTED':
        return (const Color(0xFF4682B4), Colors.white);
      case 'UNDER_REVIEW':
        return (const Color(0xFFFFD700), Colors.black);
      case 'REVISION_REQUIRED':
        return (const Color(0xFFFFA500), Colors.white);
      case 'ACCEPTED':
        return (const Color(0xFF228B22), Colors.white);
      case 'DUE_PAYMENT':
        return (const Color(0xFFDC143C), Colors.white);
      case 'COPY_EDITING':
        return (const Color(0xFF1E90FF), Colors.white);
      case 'PUBLICATION':
        return (const Color(0xFF8A2BE2), Colors.white);
      case 'PUBLISHED':
        return (const Color(0xFF008000), Colors.white);
      case 'REJECTED':
        return (const Color(0xFFBB2D3B), Colors.white);
      default:
        return (Colors.grey, Colors.white);
    }
  }
}
