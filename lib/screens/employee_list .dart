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
  bool isLoading = true;
  String? error;
  Company? company;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final results = await Future.wait([
        apiService.getCompanyEmployees(widget.companyId),
        apiService.getCompany(widget.companyId), // Add this method to ApiService
      ]);
      
      setState(() {
        employees = results[0] as List<Employee>;
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
      });
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
        });
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to delete employee: $e')),
      );
    }
  }

  void _showAddEmployeeDialog(BuildContext context) {
    final nameController = TextEditingController();
    final employeeNumberController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add New Employee'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              TextField(
                controller: nameController,
                decoration: const InputDecoration(labelText: 'Name'),
              ),
              TextField(
                controller: employeeNumberController,
                decoration: const InputDecoration(labelText: 'Employee Number'),
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(context),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                final newEmployee = Employee(
                  id: '',
                  name: nameController.text,
                  employeeNumber: employeeNumberController.text,
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
        title: Text('Employees - ${company?.name ?? ''}'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () => _showAddEmployeeDialog(context),
          ),
          IconButton(
            icon: const Icon(Icons.upload),
            onPressed: () => _showImportDialog(context),
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: employees.length,
        itemBuilder: (context, index) {
          final employee = employees[index];
          return ListTile(
            title: Text(employee.name),
            subtitle: Text('Employee Number: ${employee.employeeNumber}'),
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
    );
  }

  void _showImportDialog(BuildContext context) {
    // Implement CSV import functionality
  }

  void _showEditEmployeeDialog(BuildContext context, Employee employee) {
    // Implement edit functionality
  }
}