import 'package:flutter/material.dart';
import '../models/employee.dart';

class EmployeeList extends StatefulWidget {
  const EmployeeList({Key? key}) : super(key: key);

  @override
  _EmployeeListState createState() => _EmployeeListState();
}

class _EmployeeListState extends State<EmployeeList> {
  // Placeholder list of employees ( this will come from a provider or API)
  List<Employee> employees = [
    Employee(id: '1', name: 'Yann Bin Musawa', employeeNumber: 'EMP001'),
    Employee(id: '2', name: 'Nova Prisca', employeeNumber: 'EMP002'),
    Employee(id: '3', name: 'Anais Binti Musawa', employeeNumber: 'EMP003'),
    Employee(id: '4', name: 'Michel-Ange Bin Musawa', employeeNumber: 'EMP004'),
    Employee(id: '5', name: 'Stephanie Binti Musawa', employeeNumber: 'EMP005'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Manage Employees'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              
              
              // TODO: Implement add employee functionality
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(content: Text('Add Employee functionality coming soon!')),
              );
            },
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
                  onPressed: () {
                    // TODO: Implement edit employee functionality
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Edit Employee functionality coming soon!')),
                    );
                  },
                ),
                IconButton(
                  icon: const Icon(Icons.delete),
                  onPressed: () {
                    // TODO: Implement delete employee functionality
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Delete Employee functionality coming soon!')),
                    );
                  },
                ),
              ],
            ),
          );
        },
      ),
    );
  }
}