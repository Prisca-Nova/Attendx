import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/employee.dart';
import '../models/company.dart';
import '../services/api_service.dart';

class EmployeeList extends StatefulWidget {
  final String companyId;
  
  const EmployeeList({Key? key, required this.companyId}) : super(key: key);

  @override
  _EmployeeListState createState() => _EmployeeListState();
}

class _EmployeeListState extends State<EmployeeList> {
  List<Employee> employees = [];
  List<Employee> filteredEmployees = [];
  bool isLoading = true;
  String? error;
  Company? company;
  TextEditingController searchController = TextEditingController();
  
  @override
  void initState() {
    super.initState();
    _loadData();
    searchController.addListener(_filterEmployees);
  }
  
  @override
  void dispose() {
    searchController.dispose();
    super.dispose();
  }
  
  void _filterEmployees() {
    final query = searchController.text.toLowerCase();
    setState(() {
      if (query.isEmpty) {
        filteredEmployees = List.from(employees);
      } else {
        filteredEmployees = employees.where((employee) {
          return employee.name.toLowerCase().contains(query) ||
              employee.email.toLowerCase().contains(query) ||
              (employee.phoneNumber?.toLowerCase().contains(query) ?? false) ||
              (employee.position?.toLowerCase().contains(query) ?? false);
        }).toList();
      }
    });
  }

  Future<void> _loadData() async {
    try {
      setState(() {
        isLoading = true;
        error = null;
      });
      
      final apiService = Provider.of<ApiService>(context, listen: false);
      final results = await Future.wait([
        apiService.getCompanyEmployees(widget.companyId),
        apiService.getCompany(widget.companyId),
      ]);
      
      setState(() {
        employees = results[0] as List<Employee>;
        filteredEmployees = List.from(employees);
        company = results[1] as Company;
        isLoading = false;
        error = null;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
        error = e.toString();
      });
    }
  }

  Future<void> _addEmployee(Employee employee) async {
    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final newEmployee = await apiService.createCompanyEmployee(widget.companyId, employee);
      
      setState(() {
        employees.add(newEmployee);
        _filterEmployees();
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${newEmployee.name} added successfully')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to add employee: $e')),
      );
    }
  }

  Future<void> _deleteEmployee(String id) async {
    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final success = await apiService.deleteCompanyEmployee(widget.companyId, id);
      
      if (success) {
        setState(() {
          employees.removeWhere((employee) => employee.id == id);
          _filterEmployees();
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete employee: $e')),
      );
    }
  }

  void _showAddEmployeeDialog(BuildContext context) {
    final firstNameController = TextEditingController();
    final lastNameController = TextEditingController();
    final emailController = TextEditingController();
    final phoneController = TextEditingController();
    final positionController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add New Employee'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: firstNameController,
                  decoration: const InputDecoration(
                    labelText: 'First Name*',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: lastNameController,
                  decoration: const InputDecoration(
                    labelText: 'Last Name*',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    labelText: 'Email*',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: phoneController,
                  decoration: const InputDecoration(
                    labelText: 'Phone Number',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: positionController,
                  decoration: const InputDecoration(
                    labelText: 'Position',
                    border: OutlineInputBorder(),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                if (firstNameController.text.isEmpty ||
                    lastNameController.text.isEmpty ||
                    emailController.text.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Please fill in all required fields')),
                  );
                  return;
                }
                
                final newEmployee = Employee(
                  id: '',
                  firstName: firstNameController.text.trim(),
                  lastName: lastNameController.text.trim(),
                  email: emailController.text.trim(),
                  phoneNumber: phoneController.text.trim(),
                  position: positionController.text.trim(),
                );
                
                _addEmployee(newEmployee);
                Navigator.pop(context);
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
  }

  void _showEditEmployeeDialog(BuildContext context, Employee employee) {
    final firstNameController = TextEditingController(text: employee.firstName);
    final lastNameController = TextEditingController(text: employee.lastName);
    final emailController = TextEditingController(text: employee.email);
    final phoneController = TextEditingController(text: employee.phoneNumber ?? '');
    final positionController = TextEditingController(text: employee.position ?? '');
    
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Edit ${employee.name}'),
          content: SingleChildScrollView(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: firstNameController,
                  decoration: const InputDecoration(
                    labelText: 'First Name*',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: lastNameController,
                  decoration: const InputDecoration(
                    labelText: 'Last Name*',
                    border: OutlineInputBorder(),
                  ),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: emailController,
                  decoration: const InputDecoration(
                    labelText: 'Email*',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: phoneController,
                  decoration: const InputDecoration(
                    labelText: 'Phone Number',
                    border: OutlineInputBorder(),
                  ),
                  keyboardType: TextInputType.phone,
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: positionController,
                  decoration: const InputDecoration(
                    labelText: 'Position',
                    border: OutlineInputBorder(),
                  ),
                ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                if (firstNameController.text.isEmpty ||
                    lastNameController.text.isEmpty ||
                    emailController.text.isEmpty) {
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Please fill in all required fields')),
                  );
                  return;
                }
                
                final updatedEmployee = Employee(
                  id: employee.id,
                  firstName: firstNameController.text.trim(),
                  lastName: lastNameController.text.trim(),
                  email: emailController.text.trim(),
                  phoneNumber: phoneController.text.trim(),
                  position: positionController.text.trim(),
                );
                
                _updateEmployee(employee.id, updatedEmployee);
                Navigator.pop(context);
              },
              child: const Text('Update'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _updateEmployee(String id, Employee employee) async {
    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final updatedEmployee = await apiService.updateCompanyEmployee(widget.companyId, id, employee);
      
      setState(() {
        final index = employees.indexWhere((e) => e.id == id);
        if (index != -1) {
          employees[index] = updatedEmployee;
          _filterEmployees();
        }
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to update employee: $e')),
      );
    }
  }

  void _showImportDialog(BuildContext context) {
    // Simplified import dialog without CSV functionality
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Import Employees'),
          content: const Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Import feature is currently under development.',
                style: TextStyle(fontSize: 16),
              ),
              SizedBox(height: 16),
              Text(
                'This feature will allow you to import employees from CSV files.',
                style: TextStyle(fontSize: 14),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (error != null) {
      return Center(child: Text('Error: $error'));
    }

    return Scaffold(
      appBar: AppBar(
        title: Text('Employees${company != null ? ' - ${company!.name}' : ''}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.upload),
            onPressed: () => _showImportDialog(context),
          ),
        ],
      ),
      body: Column(
        children: [
          // Search bar
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: TextField(
              controller: searchController,
              decoration: InputDecoration(
                hintText: 'Search employees...',
                prefixIcon: const Icon(Icons.search),
                suffixIcon: searchController.text.isNotEmpty
                    ? IconButton(
                        icon: const Icon(Icons.clear),
                        onPressed: () {
                          searchController.clear();
                        },
                      )
                    : null,
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
          ),
          
          // Stats row
          Container(
            color: Colors.grey[200],
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              children: [
                Text(
                  'Total: ${employees.length} employees',
                  style: const TextStyle(fontWeight: FontWeight.bold),
                ),
                const Spacer(),
                if (searchController.text.isNotEmpty)
                  Text(
                    'Found: ${filteredEmployees.length}',
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
              ],
            ),
          ),
          
          // Employee list
          Expanded(
            child: filteredEmployees.isEmpty
                ? Center(
                    child: searchController.text.isNotEmpty
                        ? Text('No employees match "${searchController.text}"')
                        : const Text('No employees found'),
                  )
                : ListView.builder(
                    itemCount: filteredEmployees.length,
                    itemBuilder: (context, index) {
                      final employee = filteredEmployees[index];
                      return ListTile(
                        title: Text(employee.name),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(employee.email),
                            if (employee.position != null && employee.position!.isNotEmpty)
                              Text('Position: ${employee.position}'),
                          ],
                        ),
                        isThreeLine: employee.position != null && employee.position!.isNotEmpty,
                        trailing: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            IconButton(
                              icon: const Icon(Icons.edit),
                              onPressed: () => _showEditEmployeeDialog(context, employee),
                            ),
                            IconButton(
                              icon: const Icon(Icons.delete),
                              onPressed: () => _deleteEmployee(employee.id),
                            ),
                          ],
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddEmployeeDialog(context),
        child: const Icon(Icons.add),
      ),
    );
  }
}