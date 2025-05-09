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

  // Debugging method for API endpoints
  Future<Map<String, dynamic>> debugApiEndpoint(String endpoint, {String method = 'GET', Map<String, dynamic>? body}) async {
    try {
      final url = '$baseUrl$endpoint';
      print('DEBUG: Testing $method request to $url');
      
      http.Response response;
      
      switch (method) {
        case 'GET':
          response = await http.get(Uri.parse(url), headers: getHeaders());
          break;
        case 'POST':
          response = await http.post(
            Uri.parse(url), 
            headers: getHeaders(),
            body: body != null ? jsonEncode(body) : null
          );
          break;
        case 'PUT':
          response = await http.put(
            Uri.parse(url), 
            headers: getHeaders(),
            body: body != null ? jsonEncode(body) : null
          );
          break;
        case 'DELETE':
          response = await http.delete(Uri.parse(url), headers: getHeaders());
          break;
        default:
          throw Exception('Unsupported method: $method');
      }
      
      return {
        'statusCode': response.statusCode,
        'body': response.body.isNotEmpty ? jsonDecode(response.body) : null,
        'headers': response.headers,
        'requestUrl': url,
        'requestMethod': method,
        'requestBody': body,
      };
    } catch (e) {
      print('DEBUG API error: $e');
      return {
        'error': e.toString(),
        'requestUrl': '$baseUrl$endpoint',
        'requestMethod': method,
        'requestBody': body,
      };
    }
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
      } else {
        print('Login failed with status: ${response.statusCode}');
        print('Response body: ${response.body}');
      }
      return null;
    } catch (e) {
      print('Login error: $e');
      return null;
    }
  }

  Future<Company> getCurrentCompany() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/company/current'),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        return Company.fromJson(jsonDecode(response.body));
      }
      
      print('Get current company failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to load company');
    } catch (e) {
      print('Get current company error: $e');
      throw Exception('Failed to load company');
    }
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
      
      print('Get current user failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      return null;
    } catch (e) {
      print('Get current user error: $e');
      return null;
    }
  }

  // Company Employee CRUD operations
  Future<List<Employee>> getCompanyEmployees(String companyId) async {
    try {
      final url = '$baseUrl/company/$companyId/employees';
      print('Fetching employees from: $url');
      
      final response = await http.get(
        Uri.parse(url),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        final json = jsonDecode(response.body) as Map<String, dynamic>;
        if (json.containsKey('data') && json['data'] is List) {
          final List<dynamic> data = json['data']; 
          return data.map((e) => Employee.fromJson(e)).toList();
        } else {
          print('Unexpected response format: $json');
          return [];
        }
      }
      
      print('Get company employees failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to load company employees');
    } catch (e) {
      print('Get company employees error: $e');
      throw Exception('Failed to load company employees');
    }
  }

  Future<Employee> createCompanyEmployee(String companyId, Employee employee) async {
    try {
      final url = '$baseUrl/company/$companyId/employees';
      print('Creating employee at: $url');
      
      // Create a copy of the employee data WITHOUT the id field
      final employeeMap = employee.toJson();
      employeeMap.remove('id'); // Always remove id when creating
      
      print('Employee data for creation: ${jsonEncode(employeeMap)}');
      
      final response = await http.post(
        Uri.parse(url),
        headers: getHeaders(),
        body: jsonEncode(employeeMap),
      );

      if (response.statusCode == 201) {
        // The backend should return the employee with the generated UUID
        final responseData = jsonDecode(response.body);
        print('Employee created with backend ID: ${responseData['id']}');
        return Employee.fromJson(responseData);
      }
      
      print('Create employee failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to create company employee: ${response.statusCode}');
    } catch (e) {
      print('Create company employee error: $e');
      throw Exception('Failed to create company employee');
    }
  }

  Future<Employee> updateCompanyEmployee(String companyId, String employeeId, Employee employee) async {
    try {
      if (employeeId.isEmpty) {
        throw Exception('Employee ID cannot be empty');
      }
      
      final url = '$baseUrl/company/$companyId/employees/$employeeId';
      print('Update employee URL: $url');
      print('Update employee data: ${jsonEncode(employee.toJson())}');
      
      final response = await http.put(
        Uri.parse(url),
        headers: getHeaders(),
        body: jsonEncode(employee.toJson()),
      );

      if (response.statusCode == 200) {
        return Employee.fromJson(jsonDecode(response.body));
      }
      
      print('Update failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to update company employee: ${response.statusCode}');
    } catch (e) {
      print('Update company employee error: $e');
      throw Exception('Failed to update company employee');
    }
  }

  Future<Employee> patchCompanyEmployee(String companyId, String employeeId, Map<String, dynamic> updates) async {
    try {
      if (employeeId.isEmpty) {
        throw Exception('Employee ID cannot be empty');
      }
      
      final url = '$baseUrl/company/$companyId/employees/$employeeId';
      print('Patch employee URL: $url');
      print('Patch employee data: ${jsonEncode(updates)}');
      
      final response = await http.patch(
        Uri.parse(url),
        headers: getHeaders(),
        body: jsonEncode(updates),
      );

      if (response.statusCode == 200) {
        return Employee.fromJson(jsonDecode(response.body));
      }
      
      print('Patch failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to patch company employee: ${response.statusCode}');
    } catch (e) {
      print('Patch company employee error: $e');
      throw Exception('Failed to patch company employee');
    }
  }

  Future<bool> deleteCompanyEmployee(String companyId, String employeeId) async {
    try {
      if (employeeId.isEmpty) {
        throw Exception('Employee ID cannot be empty');
      }
      
      final url = '$baseUrl/company/$companyId/employees/$employeeId';
      print('Delete employee URL: $url');
      
      final response = await http.delete(
        Uri.parse(url),
        headers: getHeaders(),
      );

      if (response.statusCode == 200 || response.statusCode == 204) {
        return true;
      }
      
      print('Delete failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      return false;
    } catch (e) {
      print('Delete company employee error: $e');
      throw Exception('Failed to delete company employee');
    }
  }

  Future<bool> importCompanyEmployees(String companyId, String csvData) async {
    try {
      final url = '$baseUrl/company/$companyId/employee/import';
      print('Import employees URL: $url');
      
      final response = await http.post(
        Uri.parse(url),
        headers: {
          ...getHeaders(),
          'Content-Type': 'text/csv',
        },
        body: csvData,
      );

      if (response.statusCode == 200) {
        return true;
      }
      
      print('Import failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      return false;
    } catch (e) {
      print('Import company employees error: $e');
      throw Exception('Failed to import company employees');
    }
  }

  // Staff operations (same as employees but with /staff endpoint)
  Future<List<Employee>> getCompanyStaff(String companyId) async {
    try {
      final url = '$baseUrl/company/$companyId/staff';
      print('Fetching staff from: $url');
      
      final response = await http.get(
        Uri.parse(url),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => Employee.fromJson(e)).toList();
      }
      
      print('Get company staff failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to load company staff');
    } catch (e) {
      print('Get company staff error: $e');
      throw Exception('Failed to load company staff');
    }
  }

  Future<List<Company>> getCompanies() async {
    try {
      final url = '$baseUrl/company';
      print('Fetching companies from: $url');
      
      final response = await http.get(
        Uri.parse(url),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        final List<dynamic> data = jsonDecode(response.body);
        return data.map((e) => Company.fromJson(e)).toList();
      }
      
      print('Get companies failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to load companies');
    } catch (e) {
      print('Get companies error: $e');
      throw Exception('Failed to load companies');
    }
  }

  Future<Company> getCompany(String companyId) async {
    try {
      final url = '$baseUrl/company/$companyId';
      print('Fetching company from: $url');
      
      final response = await http.get(
        Uri.parse(url),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        return Company.fromJson(jsonDecode(response.body));
      }
      
      print('Get company failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to load company');
    } catch (e) {
      print('Get company error: $e');
      throw Exception('Failed to load company');
    }
  }

  // Attendance operations
  Future<List<LunchRecord>> getAttendances() async {
    try {
      final url = '$baseUrl/attendance';
      print('Fetching attendances from: $url');
      
      final response = await http.get(
        Uri.parse(url),
        headers: getHeaders(),
      );

      print('Attendance response status: ${response.statusCode}');
      
      if (response.statusCode == 200) {
        if (response.body.isEmpty) {
          print('Warning: Empty response body');
          return [];
        }
        
        try {
          final List<dynamic> data = jsonDecode(response.body);
          return data.map((e) => LunchRecord.fromJson(e)).toList();
        } catch (parseError) {
          print('Error parsing attendance data: $parseError');
          print('Response body: ${response.body}');
          return [];
        }
      }
      
      // Enhanced error reporting
      print('Attendance API error: ${response.statusCode}');
      print('Response body: ${response.body}');
      
      // Return empty list instead of throwing for better UX
      if (response.statusCode == 500) {
        print('Server error encountered. Returning empty list.');
        return [];
      }
      
      throw Exception('Failed to load attendances: ${response.statusCode}');
    } catch (e) {
      print('Get attendances error: $e');
      // Return empty list instead of throwing exception for better UX
      return [];
    }
  }

  Future<LunchRecord> getAttendanceById(String id) async {
    try {
      final url = '$baseUrl/attendance/$id';
      print('Fetching attendance from: $url');
      
      final response = await http.get(
        Uri.parse(url),
        headers: getHeaders(),
      );

      if (response.statusCode == 200) {
        return LunchRecord.fromJson(jsonDecode(response.body));
      }
      
      print('Get attendance by ID failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to load attendance');
    } catch (e) {
      print('Get attendance by ID error: $e');
      throw Exception('Failed to load attendance');
    }
  }

  Future<LunchRecord> createLunchRecord(LunchRecord record) async {
    try {
      final url = '$baseUrl/attendance/lunch';
      print('Creating lunch record at: $url');
      print('Lunch record data: ${jsonEncode(record.toJson())}');
      
      final response = await http.post(
        Uri.parse(url),
        headers: getHeaders(),
        body: jsonEncode(record.toJson()),
      );

      if (response.statusCode == 201) {
        return LunchRecord.fromJson(jsonDecode(response.body));
      }
      
      print('Create lunch record failed with status: ${response.statusCode}');
      print('Response body: ${response.body}');
      throw Exception('Failed to create lunch record: ${response.statusCode}');
    } catch (e) {
      print('Create lunch record error: $e');
      throw Exception('Failed to create lunch record');
    }
  }
  
  // Health check method to test API connectivity
  Future<bool> checkApiHealth() async {
    try {
      final response = await http.get(
        Uri.parse('$baseUrl/health'),
        headers: getHeaders(),
      ).timeout(const Duration(seconds: 5));
      
      return response.statusCode >= 200 && response.statusCode < 300;
    } catch (e) {
      print('API health check failed: $e');
      return false;
    }
  }
}