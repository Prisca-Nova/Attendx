import 'dart:convert';
import 'package:http/http.dart' as http;
import '../models/user.dart';
import '../models/employee.dart';
import '../models/lunch_record.dart';

class ApiService {
  final String baseUrl;
  String? _token;

  ApiService({required this.baseUrl});

  // Set the authentication token
  void setToken(String token) {
    _token = token;
  }
    // Get the authentication token
  String? getToken() {
    return _token;
  }


  // Get headers with authorization if token exists
  Map<String, String> getHeaders() {
    final headers = {
      'Content-Type': 'application/json',
    };
    if (_token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

// Login method with corrected response parsing
Future<User?> login(String email, String password) async {
  try {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login'),
      headers: getHeaders(),
      body: jsonEncode({
        'email': email,
        'password': password,
      }),
    );

    print('Login response status: ${response.statusCode}');
    print('Login response body: ${response.body}');

    if (response.statusCode == 200 && response.body.isNotEmpty) {
      Map<String, dynamic>? decoded;
      try {
        decoded = jsonDecode(response.body) as Map<String, dynamic>;
      } catch (e) {
        print('JSON decode error: $e');
        return null;
      }

      if (decoded.containsKey('data')) {
        final data = decoded['data'] as Map<String, dynamic>;

        // Extract and store token
        _token = data['accessToken'] as String?;

        // Extract user
        if (data.containsKey('user') && data['user'] != null) {
          final userJson = data['user'] as Map<String, dynamic>;
          return User.fromJson(userJson);
        } else {
          print('User data missing in response');
        }
      } else {
        print('Missing "data" in response');
      }
    } else {
      print('Login failed with status code: ${response.statusCode}');
    }

    return null;
  } catch (e) {
    print('Login error: $e');
    return null;
  }
}


Future<User?> getCurrentUser() async {
  try {
    
    final response = await http.get(
      Uri.parse('$baseUrl/auth/login'),
      headers: getHeaders(),
    );

    print('Get current user status: ${response.statusCode}');
    print('Get current user body: ${response.body}');

    if (response.statusCode == 200 && response.body.isNotEmpty) {
      Map<String, dynamic>? decoded;
      try {
        decoded = jsonDecode(response.body) as Map<String, dynamic>;
        return User.fromJson(decoded);
      } catch (e) {
        print('JSON decode error in getCurrentUser: $e');
        return null;
      }
    }
    return null;
  } catch (e) {
    print('Get current user error: $e');
    return null;
  }
}
// Employee CRUD operations
  Future<List<Employee>> getEmployees() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/employees'),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => Employee.fromJson(e)).toList();
      }
      throw Exception('Failed to load employees');
    } catch (e) {
      print('Get employees error: $e');
      throw Exception('Failed to load employees');
    }
  }

  Future<Employee> createEmployee(Employee employee) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/employees'),
        headers: getHeaders(),
        body: jsonEncode(employee.toJson()),
      );

      if (response.statusCode == 201) {
        return Employee.fromJson(jsonDecode(response.body));
      }
      throw Exception('Failed to create employee');
    } catch (e) {
      print('Create employee error: $e');
      throw Exception('Failed to create employee');
    }
  }

  Future<Employee> updateEmployee(String id, Employee employee) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/employees/$id'),
        headers: getHeaders(),
        body: jsonEncode(employee.toJson()),
      );

      if (response.statusCode == 200) {
        return Employee.fromJson(jsonDecode(response.body));
      }
      throw Exception('Failed to update employee');
    } catch (e) {
      print('Update employee error: $e');
      throw Exception('Failed to update employee');
    }
  }

  Future<bool> deleteEmployee(String id) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/employees/$id'),
        headers: getHeaders(),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Delete employee error: $e');
      throw Exception('Failed to delete employee');
    }
  }

  // Lunch Record operations
  Future<List<LunchRecord>> getLunchRecords() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/attendance'),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => LunchRecord.fromJson(e)).toList();
      }
      throw Exception('Failed to load lunch records');
    } catch (e) {
      print('Get lunch records error: $e');
      throw Exception('Failed to load lunch records');
    }
  }

  Future<LunchRecord> createLunchRecord(LunchRecord record) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/attendance/lunch'),
        headers: getHeaders(),
        body: jsonEncode(record.toJson()),
      );

      if (response.statusCode == 201) {
        return LunchRecord.fromJson(jsonDecode(response.body));
      }
      throw Exception('Failed to create lunch record');
    } catch (e) {
      print('Create lunch record error: $e');
      throw Exception('Failed to create lunch record');
    }
  }

  Future<List<LunchRecord>> getEmployeeLunchRecords(String employeeId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/employees/$employeeId/attendance'),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => LunchRecord.fromJson(e)).toList();
      }
      throw Exception('Failed to load employee lunch records');
    } catch (e) {
      print('Get employee lunch records error: $e');
      throw Exception('Failed to load employee lunch records');
    }
  }
}