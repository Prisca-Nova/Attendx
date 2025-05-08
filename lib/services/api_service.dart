import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:new_employee_lunch_app/models/company.dart';
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

  // Login method
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

      if (response.statusCode == 200 && response.body.isNotEmpty) {
        final decoded = jsonDecode(response.body) as Map<String, dynamic>;
        
        if (decoded.containsKey('data')) {
          final data = decoded['data'] as Map<String, dynamic>;
          _token = data['accessToken'] as String?;
          
          if (data.containsKey('user') && data['user'] != null) {
            final userJson = data['user'] as Map<String, dynamic>;
            return User.fromJson(userJson);
          }
        }
      }
      return null;
    } catch (e) {
      print('Login error: $e');
      return null;
    }
  }
  Future<Company> getCurrentCompany() async {
    final response = await http.get(
      Uri.parse('$baseUrl/company/current'),
      headers: getHeaders(),
    );

    if (response.statusCode == 200) {
      return Company.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to load company');
  }
  
  Future<User?> getCurrentUser() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/auth/me'),
        headers: getHeaders(),
      );

      if (response.statusCode == 200 && response.body.isNotEmpty) {
        return User.fromJson(jsonDecode(response.body));
      }
      return null;
    } catch (e) {
      print('Get current user error: $e');
      return null;
    }
  }

  // Company Employee CRUD operations
  Future<List<Employee>> getCompanyEmployees(String companyId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/company/$companyId/employees'),
        headers: getHeaders(),
      );

    if (response.statusCode == 200) {
  final json = jsonDecode(response.body) as Map<String, dynamic>;
  final List<dynamic> data = json['data']; // 👈 access the list properly
  return data.map((e) => Employee.fromJson(e)).toList();
}
      throw Exception('Failed to load company employees');
    } catch (e) {
      print('Get company employees error: $e');
      throw Exception('Failed to load company employees');
    }
  }

  Future<Employee> createCompanyEmployee(String companyId, Employee employee) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/company/$companyId/employees'),
        headers: getHeaders(),
        body: jsonEncode(employee.toJson()),
      );

      if (response.statusCode == 201) {
        return Employee.fromJson(jsonDecode(response.body));
      }
      throw Exception('Failed to create company employee');
    } catch (e) {
      print('Create company employee error: $e');
      throw Exception('Failed to create company employee');
    }
  }

  Future<Employee> updateCompanyEmployee(String companyId, String employeeId, Employee employee) async {
    try {
      final response = await http.put(
        Uri.parse('$baseUrl/company/$companyId/employees/$employeeId'),
        headers: getHeaders(),
        body: jsonEncode(employee.toJson()),
      );

      if (response.statusCode == 200) {
        return Employee.fromJson(jsonDecode(response.body));
      }
      throw Exception('Failed to update company employee');
    } catch (e) {
      print('Update company employee error: $e');
      throw Exception('Failed to update company employee');
    }
  }

  Future<Employee> patchCompanyEmployee(String companyId, String employeeId, Map<String, dynamic> updates) async {
    try {
      final response = await http.patch(
        Uri.parse('$baseUrl/company/$companyId/employees/$employeeId'),
        headers: getHeaders(),
        body: jsonEncode(updates),
      );

      if (response.statusCode == 200) {
        return Employee.fromJson(jsonDecode(response.body));
      }
      throw Exception('Failed to patch company employee');
    } catch (e) {
      print('Patch company employee error: $e');
      throw Exception('Failed to patch company employee');
    }
  }

  Future<bool> deleteCompanyEmployee(String companyId, String employeeId) async {
    try {
      final response = await http.delete(
        Uri.parse('$baseUrl/company/$companyId/employees/$employeeId'),
        headers: getHeaders(),
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Delete company employee error: $e');
      throw Exception('Failed to delete company employee');
    }
  }

  Future<bool> importCompanyEmployees(String companyId, String csvData) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/company/$companyId/employee/import'),
        headers: {
          ...getHeaders(),
          'Content-Type': 'text/csv',
        },
        body: csvData,
      );

      return response.statusCode == 200;
    } catch (e) {
      print('Import company employees error: $e');
      throw Exception('Failed to import company employees');
    }
  }

  // Staff operations (same as employees but with /staff endpoint)
  Future<List<Employee>> getCompanyStaff(String companyId) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/company/$companyId/staff'),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => Employee.fromJson(e)).toList();
      }
      throw Exception('Failed to load company staff');
    } catch (e) {
      print('Get company staff error: $e');
      throw Exception('Failed to load company staff');
    }
  }


Future<List<Company>> getCompanies() async {
  try {
    final response = await http.get(
      Uri.parse('$baseUrl/company'),
      headers: getHeaders(),
    );

    if (response.statusCode == 200) {
      final List<dynamic> data = jsonDecode(response.body);
      return data.map((e) => Company.fromJson(e)).toList();
    }
    throw Exception('Failed to load companies');
  } catch (e) {
    print('Get companies error: $e');
    throw Exception('Failed to load companies');
  }
}

Future<Company> getCompany(String companyId) async {
  try {
    final response = await http.get(
      Uri.parse('$baseUrl/company/$companyId'),
      headers: getHeaders(),
    );

    if (response.statusCode == 200) {
      return Company.fromJson(jsonDecode(response.body));
    }
    throw Exception('Failed to load company');
  } catch (e) {
    print('Get company error: $e');
    throw Exception('Failed to load company');
  }
}

  // Similar CRUD operations for staff as employees...

  // Attendance operations
  Future<List<LunchRecord>> getAttendances() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/attendance'),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => LunchRecord.fromJson(e)).toList();
      }
      throw Exception('Failed to load attendances');
    } catch (e) {
      print('Get attendances error: $e');
      throw Exception('Failed to load attendances');
    }
  }

  Future<LunchRecord> getAttendanceById(String id) async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/attendance/$id'),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        return LunchRecord.fromJson(jsonDecode(response.body));
      }
      throw Exception('Failed to load attendance');
    } catch (e) {
      print('Get attendance by ID error: $e');
      throw Exception('Failed to load attendance');
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
}