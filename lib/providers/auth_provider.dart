import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/user.dart';
import '../services/api_service.dart';

class AuthProvider extends ChangeNotifier {
  User? _currentUser;
  bool _isLoading = false;
  final ApiService _apiService;

  AuthProvider({required ApiService apiService}) : _apiService = apiService;

  User? get currentUser => _currentUser;
  bool get isLoading => _isLoading;
  bool get isAuthenticated => _currentUser != null;
  bool get isStaff => _currentUser?.role == UserRole.staff;

  SharedPreferences? _prefs;
 
  Future<SharedPreferences> get _preferences async {
    _prefs ??= await SharedPreferences.getInstance();
    return _prefs!;
  }
  Future<bool> login(String email, String password) async {
    _isLoading = true;
    notifyListeners();

    try {
      final user = await _apiService.login(email, password);
      if (user != null) {
        _currentUser = user;

        // Save token to preferences
        final prefs = await _preferences;

        // Get token from the API service using a proper getter method
        final token = _apiService.getToken();
        await prefs.setString('token', token ?? '');

        _isLoading = false;
        notifyListeners();
        return true;
      }
      _isLoading = false;
      notifyListeners();
      return false;
    } catch (e) {
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    final prefs = await _preferences;
    await prefs.remove('token');
    _currentUser = null;
    _apiService.setToken('');
    notifyListeners();
  }

  Future<void> checkAuth() async {
    final prefs = await _preferences;
    final token = prefs.getString('token');

    if (token != null) {
      try {
        _apiService.setToken(token);
        final user = await _apiService.getCurrentUser();
        _currentUser = user;
      } catch (e) {
        await prefs.remove('token');
        _currentUser = null;
      }
      notifyListeners();
    }
  }
}
