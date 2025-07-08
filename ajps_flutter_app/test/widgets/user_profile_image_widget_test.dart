// // Test script to verify the UserProfileImageWidget works correctly
// import 'package:flutter_test/flutter_test.dart';
// import 'package:ajps_flutter_app/widgets/user_profile_image_widget.dart';
// import 'package:ajps_flutter_app/services/auth_service.dart';
// import 'package:mockito/mockito.dart';

// class MockAuthService extends Mock implements AuthService {}

// void main() {
//   testWidgets('UserProfileImageWidget shows loading indicator initially', (
//     WidgetTester tester,
//   ) async {
//     final mockAuthService = MockAuthService();

//     await tester.pumpWidget(
//       MaterialApp(
//         home: UserProfileImageWidget(radius: 28, authService: mockAuthService),
//       ),
//     );

//     // Should show loading indicator initially
//     expect(find.byType(CircularProgressIndicator), findsOneWidget);
//   });

//   testWidgets('UserProfileImageWidget shows default icon when no image', (
//     WidgetTester tester,
//   ) async {
//     final mockAuthService = MockAuthService();

//     await tester.pumpWidget(
//       MaterialApp(
//         home: UserProfileImageWidget(radius: 28, authService: mockAuthService),
//       ),
//     );

//     // Wait for loading to complete
//     await tester.pump(const Duration(seconds: 1));

//     // Should show default person icon when no image
//     expect(find.byIcon(Icons.person), findsOneWidget);
//   });
// }
