import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';

class ApiService {
  final String baseUrl = 'http://backend-api.com/api'; 
  
  // Login
  Future<User?> login(String username, String password) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'username': username, 'password': password}),
      );

      if (response.statusCode == 200) {
        final userData = jsonDecode(response.body);
        return User.fromJson(userData);
      } else {
        return null;
      }
    } catch (e) {
      print('Login error: $e');
      return null;
    }
  }


  Future<User?> getCurrentUser() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/me'),
        headers: {
          'Content-Type': 'application/json',
        },
      );

      if (response.statusCode == 200) {
        return User.fromJson(jsonDecode(response.body));
      } else {
        return null;
      }
    } catch (e) {
      print('Get current user error: $e');
      return null;
    }
  }
}
