import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'providers/auth_provider.dart';
import 'screens/splash_screen.dart';

Future main() async {
  // Ensure Flutter binding is initialized
  WidgetsFlutterBinding.ensureInitialized();

  // Create providers outside the widget tree
  final authProvider = AuthProvider();

  runApp(
    MyApp(authProvider: authProvider),
  );
}

class MyApp extends StatelessWidget {
  final AuthProvider authProvider;

  const MyApp({Key? key, required this.authProvider}) : super(key: key);

  // Extract theme data to a separate getter for better organization
  ThemeData get _appTheme {
    const seedColor = Color.fromARGB(255, 219, 128, 53);
    final colorScheme = ColorScheme.fromSeed(seedColor: seedColor);

    return ThemeData(
      colorScheme: colorScheme,
      useMaterial3: true,
      textTheme: const TextTheme(
        headlineLarge: TextStyle(
          fontSize: 24,
          fontWeight: FontWeight.bold,
          color: Color.fromARGB(255, 219, 128, 53),
        ),
        bodyMedium: TextStyle(
          fontSize: 16,
        ),
      ),
      appBarTheme: const AppBarTheme(
        backgroundColor: seedColor,
        foregroundColor: Colors.white,
        elevation: 0,
        centerTitle: true,
      ),
      elevatedButtonTheme: ElevatedButtonThemeData(
        style: ElevatedButton.styleFrom(
          backgroundColor: seedColor,
          foregroundColor: Colors.white,
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(value: authProvider),
      ],
      child: MaterialApp(
        title: 'Attendx', // App name
        theme: _appTheme,
        home: const SplashScreen(), // Directly start with SplashScreen
        debugShowCheckedModeBanner: false,
        builder: (context, child) {
          return GestureDetector(
            behavior: HitTestBehavior.opaque,
            onTap: () => FocusManager.instance.primaryFocus?.unfocus(),
            child: child,
          );
        },
      ),
    );
  }
}