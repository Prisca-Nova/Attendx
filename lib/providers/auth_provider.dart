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
  bool get isStaffManager => _currentUser?.role == UserRole.staff;

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
      print('Login error: $e');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }

  Future<void> logout() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final prefs = await _preferences;
      await prefs.remove('token');
      _currentUser = null;
      _apiService.setToken('');
    } catch (e) {
      print('Logout error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<void> checkAuth() async {
    _isLoading = true;
    notifyListeners();
    
    try {
      final prefs = await _preferences;
      final token = prefs.getString('token');

      if (token != null) {
        _apiService.setToken(token);
        final user = await _apiService.getCurrentUser();
        _currentUser = user;
      }
    } catch (e) {
      final prefs = await _preferences;
      await prefs.remove('token');
      _currentUser = null;
      print('Auth check error: $e');
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
  
  // Helper to check if current user has access to a specific company
  Future<bool> hasCompanyAccess(String companyId) async {
    try {
      if (_currentUser == null) return false;
      
      // For staff users, we assume they have access to all companies
      if (_currentUser!.role == UserRole.staff) return true;
      
      // For employee users, check if their companyId matches
      return _currentUser!.companyId == companyId;
    } catch (e) {
      print('Company access check error: $e');
      return false;
    }
  }
  
  // Update user profile
  Future<bool> updateProfile({
    String? firstName,
    String? lastName,
    String? email,
  }) async {
    if (_currentUser == null) return false;
    
    _isLoading = true;
    notifyListeners();
    
    try {
      // In a real app, you would call an API endpoint to update the user profile
      // For now, just update the local user object
      _currentUser = _currentUser!.copyWith(
        firstName: firstName ?? _currentUser!.firstName,
        lastName: lastName ?? _currentUser!.lastName,
        email: email ?? _currentUser!.email,
      );
      
      _isLoading = false;
      notifyListeners();
      return true;
    } catch (e) {
      print('Update profile error: $e');
      _isLoading = false;
      notifyListeners();
      return false;
    }
  }
}