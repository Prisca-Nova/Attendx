import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'providers/auth_provider.dart';
import 'services/api_service.dart';
import 'screens/splash_screen.dart';
import 'utils/env.dart';
Future main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  final sharedPreferences = await SharedPreferences.getInstance();
  final apiService = ApiService(baseUrl: Env.apiUrl);
  final authProvider = AuthProvider(apiService: apiService);

  // Check if we have a saved token
  final token = sharedPreferences.getString('token');
  if (token != null) {
    apiService.setToken(token);
    // Try to load user
    await authProvider.checkAuth();
  }

  runApp(
    MyApp(
      authProvider: authProvider,
      apiService: apiService,
    ),
  );
}

class MyApp extends StatelessWidget {
  final AuthProvider authProvider;
  final ApiService apiService;

  const MyApp({
    Key? key,
    required this.authProvider,
    required this.apiService,
  }) : super(key: key);

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
        Provider.value(value: apiService),
      ],
      child: MaterialApp(
        title: 'Attendx',
        theme: _appTheme,
        home: const SplashScreen(),
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