import 'package:flutter/material.dart';
import '../models/lunch_record.dart';
import '../models/employee.dart';

class LunchTracking extends StatefulWidget {
  const LunchTracking({Key? key}) : super(key: key);

  @override
  _LunchTrackingState createState() => _LunchTrackingState();
}

class _LunchTrackingState extends State<LunchTracking> {
  // Placeholder list of lunch records (in a real app, this would come from a provider or API)
  List<LunchRecord> lunchRecords = [
    LunchRecord(
      id: '1',
      employeeId: '1',
      employeeName: 'John Doe',
      employeeNumber: 'EMP001',
      date: DateTime.now(),
      hasEaten: true,
    ),
    LunchRecord(
      id: '2',
      employeeId: '2',
      employeeName: 'Jane Smith',
      employeeNumber: 'EMP002',
      date: DateTime.now(),
      hasEaten: false,
    ),
  ];

  // Placeholder list of employees (in a real app, this would come from a provider or API)
  List<Employee> employees = [
    Employee(id: '1', name: 'John Doe', employeeNumber: 'EMP001'),
    Employee(id: '2', name: 'Jane Smith', employeeNumber: 'EMP002'),
    Employee(id: '3', name: 'Mike Johnson', employeeNumber: 'EMP003'),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Lunch Tracking'),
        actions: [
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: () {
              _showAddLunchRecordDialog();
            },
          ),
        ],
      ),
      body: ListView.builder(
        itemCount: lunchRecords.length,
        itemBuilder: (context, index) {
          final record = lunchRecords[index];
          return ListTile(
            title: Text(record.employeeName),
            subtitle: Text('Employee Number: ${record.employeeNumber}'),
            trailing: Icon(
              record.hasEaten ? Icons.check_circle : Icons.cancel,
              color: record.hasEaten ? Colors.green : Colors.red,
            ),
            onTap: () {
              _showLunchRecordDetails(record);
            },
          );
        },
      ),
    );
  }

  void _showAddLunchRecordDialog() {
    final TextEditingController employeeController = TextEditingController();
    
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add Lunch Record'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<Employee>(
                hint: const Text('Select Employee'),
                items: employees.map((Employee employee) {
                  return DropdownMenuItem<Employee>(
                    value: employee,
                    child: Text(employee.name),
                  );
                }).toList(),
                onChanged: (selectedEmployee) {
                  if (selectedEmployee != null) {
                    employeeController.text = selectedEmployee.name;
                  }
                },
              ),
              SwitchListTile(
                title: const Text('Has Eaten'),
                value: true,
                onChanged: (bool value) {
                  // TODO: Implement lunch tracking logic
                  
                },
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Cancel'),
            ),
            ElevatedButton(
              onPressed: () {
                // TODO: Implement save lunch record functionality
                Navigator.of(context).pop();
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(content: Text('Lunch record functionality coming soon!')),
                );
              },
              child: const Text('Save'),
            ),
          ],
        );
      },
    );
  }

  void _showLunchRecordDetails(LunchRecord record) {
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text('Lunch Record - ${record.employeeName}'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Employee Number: ${record.employeeNumber}'),
              Text('Date: ${record.date}'),
              Text('Lunch Status: ${record.hasEaten ? 'Eaten' : 'Not Eaten'}'),
              if (record.signature != null)
                Text('Signature: ${record.signature}'),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Close'),
            ),
          ],
        );
      },
    );
  }
}