import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  User? _currentUser;
  bool _isLoading = false;
  final ApiService _apiService = ApiService();
  
  // Mock data flag
  final bool _useMockData = true; // Set to false when backend is ready
  
  // Mock users for testing
  final List<User> _mockUsers = [
    User(
      id: '1',
      username: 'employee',
      password: 'employee',
      role: UserRole.employee,
    ),
    User(
      id: '2',
      username: 'staff',
      password: 'staff',
      role: UserRole.staff,
    ),
    User(
      id: '3',
      username: 'admin',
      password: 'admin',
      role: UserRole.staff,
    ),
  ];

  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _currentUser != null;
  bool get isStaff => _currentUser?.role == UserRole.staff;

  SharedPreferences? _prefs;

  Future<SharedPreferences> get _preferences async {
    _prefs ??= await SharedPreferences.getInstance();
    return _prefs!;
  }
  
  Future<bool> login(String username, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      if (_useMockData) {
        // Simulate network delay
        await Future.delayed(const Duration(seconds: 1));
        
        // Find user in mock data (in real app, you'd check password too)
        final user = _mockUsers.firstWhere(
          (u) => u.username == username,
          orElse: () => throw Exception('User not found'),
        );
        
        _currentUser = user;
        
        // Save mock token to preferences
        final prefs = await _preferences;
        await prefs.setString('token', 'mock_token_${user.id}');
        
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        // Real implementation
        final user = await _apiService.login(username, password);
        _currentUser = user;
        _isLoading = false;
        notifyListeners();
        return user != null;
      }
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    _currentUser = null;
    notifyListeners();
  }

  Future<void> checkAuth() async {
    final prefs = await _preferences;
    final token = prefs.getString('token');

    if (token != null) {
      try {
        if (_useMockData) {
          // Parse user ID from mock token
          final userId = token.split('_').last;
          _currentUser = _mockUsers.firstWhere(
            (u) => u.id == userId,
            orElse: () => throw Exception('Invalid token'),
          );
        } else {
          _currentUser = await _apiService.getCurrentUser();
        }
      } catch (e) {
        await prefs.remove('token');
        _currentUser = null;
      }
      notifyListeners();
    }
  }
}
