import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/date_symbol_data_local.dart';
import 'providers/auth_provider.dart';
import 'services/api_service.dart';
import 'screens/splash_screen.dart';
import 'utils/env.dart';

Future<void> main() async {
  // Ensure Flutter is initialized
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize date formatting
  await initializeDateFormatting();
  
  // Set preferred orientations
  await SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
  ]);
  
  // Get shared preferences
  final sharedPreferences = await SharedPreferences.getInstance();
  
  // Create API Service and Auth Provider
  final apiService = ApiService(baseUrl: Env.apiUrl);
  final authProvider = AuthProvider(apiService: apiService);
  
  // Check if we have a saved token
  final token = sharedPreferences.getString('token');
  if (token != null) {
    apiService.setToken(token);
    // Try to load user
    await authProvider.checkAuth();
  }
  
  // Set system overlay style
  SystemChrome.setSystemUIOverlayStyle(
    const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.light,
      systemNavigationBarColor: Color.fromARGB(255, 219, 128, 53),
      systemNavigationBarIconBrightness: Brightness.light,
    ),
  );
  
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
            borderRadius: BorderRadius.circular(12),
          ),
        ),
      ),
      // Additional theme improvements
      cardTheme: CardTheme(
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        elevation: 2,
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: Colors.white,
        contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: BorderSide(color: Colors.grey.shade300),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: seedColor, width: 2),
        ),
      ),
      tabBarTheme: const TabBarTheme(
        labelColor: Colors.white,
        unselectedLabelColor: Colors.white70,
        indicatorSize: TabBarIndicatorSize.tab,
        indicator: BoxDecoration(
          border: Border(
            bottom: BorderSide(color: Colors.white, width: 3),
          ),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: const Color(0xFF323232),
        contentTextStyle: const TextStyle(color: Colors.white),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        behavior: SnackBarBehavior.floating,
      ),
      chipTheme: ChipThemeData(
        backgroundColor: Colors.grey.shade200,
        disabledColor: Colors.grey.shade300,
        selectedColor: seedColor,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
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