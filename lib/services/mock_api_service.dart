import 'dart:async';
import '../models/user.dart';
import '../models/employee.dart';
import '../models/company.dart';
import '../models/lunch_record.dart';

class MockApiService {
  // Store data in memory
  List<Company> _companies = [];
  List<Employee> _employees = [];
  List<LunchRecord> _lunchRecords = [];
  User? _currentUser;
  String? _token;

  // Constructor with sample data
  MockApiService() {
    _initSampleData();
  }

  void _initSampleData() {
    // Create sample companies
    _companies = [
      Company(id: '1', name: 'Acme Inc.', address: '123 Main St'),
      Company(id: '2', name: 'Globex Corp', address: '456 Oak Ave'),
    ];

    // Create sample employees
    _employees = [
      Employee(
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '555-1234',
        position: 'Developer',
      ),
      Employee(
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        email: 'jane@example.com',
        phoneNumber: '555-5678',
        position: 'Designer',
      ),
      Employee(
        id: '3',
        firstName: 'Bob',
        lastName: 'Johnson',
        email: 'bob@example.com',
        phoneNumber: '555-9012',
        position: 'Manager',
      ),
    ];

    // Create sample lunch records (from yesterday)
    final yesterday = DateTime.now().subtract(const Duration(days: 1));
    _lunchRecords = [
      LunchRecord(
        id: '1',
        employeeId: '1',
        employeeName: 'John Doe',
        employeeNumber: '1',
        date: yesterday,
        hasEaten: true,
        signature: null,
      ),
      LunchRecord(
        id: '2',
        employeeId: '2',
        employeeName: 'Jane Smith',
        employeeNumber: '2',
        date: yesterday,
        hasEaten: false,
        signature: null,
      ),
    ];

    // Set current user
    _currentUser = User(
      id: '1',
      email: 'admin@example.com',
      role: UserRole.staff,
      firstName: 'Admin',
      lastName: 'User',
    );
  }

  // Token management
  void setToken(String token) {
    _token = token;
  }

  String? getToken() {
    return _token;
  }

  // Authentication
  Future<User?> login(String email, String password) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 1));
    
    // Simple validation
    if (email == 'admin@example.com' && password == 'password') {
      _token = 'mock-token-123';
      return _currentUser;
    }
    
    return null;
  }

  Future<User?> getCurrentUser() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    // Check token
    if (_token != null) {
      return _currentUser;
    }
    
    return null;
  }

  // Company operations
  Future<List<Company>> getCompanies() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 800));
    
    return _companies;
  }

  Future<Company> getCompany(String companyId) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    final company = _companies.firstWhere(
      (c) => c.id == companyId,
      orElse: () => throw Exception('Company not found'),
    );
    
    return company;
  }

  Future<Company> getCurrentCompany() async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 500));
    
    return _companies.first;
  }

  // Employee operations
  Future<List<Employee>> getCompanyEmployees(String companyId) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 800));
    
    return _employees;
  }

  Future<Employee> createCompanyEmployee(String companyId, Employee employee) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 1000));
    
    // Generate ID and add to list
    final newEmployee = Employee(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phoneNumber: employee.phoneNumber,
      position: employee.position,
    );
    
    _employees.add(newEmployee);
    
    return newEmployee;
  }

  Future<Employee> updateCompanyEmployee(String companyId, String id, Employee employee) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 1000));
    
    // Find and update employee
    final index = _employees.indexWhere((e) => e.id == id);
    if (index != -1) {
      _employees[index] = employee;
      return employee;
    }
    
    throw Exception('Employee not found');
  }

  Future<bool> deleteCompanyEmployee(String companyId, String id) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 800));
    
    // Remove employee
    final initialLength = _employees.length;
    _employees.removeWhere((e) => e.id == id);
    
    return _employees.length < initialLength;
  }

  // Lunch tracking operations
  Future<List<LunchRecord>> getAttendances({DateTime? startDate, DateTime? endDate, String? employeeId}) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 800));
    
    // Filter records
    var records = List.of(_lunchRecords);
    
    if (startDate != null) {
      records = records.where((r) => r.date.isAfter(startDate) || _isSameDay(r.date, startDate)).toList();
    }
    
    if (endDate != null) {
      records = records.where((r) => r.date.isBefore(endDate) || _isSameDay(r.date, endDate)).toList();
    }
    
    if (employeeId != null) {
      records = records.where((r) => r.employeeId == employeeId).toList();
    }
    
    return records;
  }

  Future<LunchRecord> createLunchRecord(LunchRecord record) async {
    // Simulate network delay
    await Future.delayed(const Duration(milliseconds: 1000));
    
    // Generate ID and add to list
    final newRecord = LunchRecord(
      id: DateTime.now().millisecondsSinceEpoch.toString(),
      employeeId: record.employeeId,
      employeeName: record.employeeName,
      employeeNumber: record.employeeNumber,
      date: record.date,
      hasEaten: record.hasEaten,
      signature: record.signature,
      notes: record.notes,
      status: record.status ?? 'recorded',
    );
    
    _lunchRecords.add(newRecord);
    
    return newRecord;
  }

  // Helper methods
  bool _isSameDay(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }
  
  // Import methods (simplified for mock)
  Future<bool> importCompanyEmployeesFromCSV(String companyId, String csvData) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));
    
    // Pretend to process CSV
    return true;
  }

  Future<bool> importCompanyEmployees(String companyId, dynamic data) async {
    // Simulate network delay
    await Future.delayed(const Duration(seconds: 2));
    
    // Pretend to process import
    return true;
  }
}