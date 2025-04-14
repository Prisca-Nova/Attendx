import 'dart:js_interop_unsafe';

import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../models/lunch_record.dart';
import '../models/employee.dart';
import '../services/api_service.dart';

class LunchTracking extends StatefulWidget {
  const LunchTracking({Key? key}) : super(key: key);

  @override
  _LunchTrackingState createState() => _LunchTrackingState();
}

class _LunchTrackingState extends State<LunchTracking> {
  List<LunchRecord> lunchRecords = [];
  List<Employee> employees = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

    Future<void> _loadData() async {
    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      
      // Use Future.wait correctly and store the result in a variable
      final results = await Future.wait([
        apiService.getLunchRecords(),
        apiService.getEmployees(),
      ]);
      
      // Access the results by index
      final loadedRecords = results[0] as List<LunchRecord>;
      final loadedEmployees = results[1] as List<Employee>;
     
      setState(() {
        lunchRecords = loadedRecords;
        employees = loadedEmployees;
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


  Future<void> _addLunchRecord(String employeeId, bool hasEaten) async {
    try {
      final employee = employees.firstWhere((e) => e.id == employeeId);
      final newRecord = LunchRecord(
        id: '',
        employeeId: employeeId,
        employeeName: employee.name,
        employeeNumber: employee.employeeNumber,
        date: DateTime.now(),
        hasEaten: hasEaten,
      );
      
      final apiService = Provider.of<ApiService>(context, listen: false);
      final createdRecord = await apiService.createLunchRecord(newRecord);
      
      setState(() {
        lunchRecords.add(createdRecord);
      });
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to add lunch record: $e')),
      );
    }
  }

  void _showAddLunchRecordDialog() {
    String? selectedEmployeeId;
    bool hasEaten = true;

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text('Add Lunch Record'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              DropdownButtonFormField<String>(
                hint: const Text('Select Employee'),
                items: employees.map((Employee employee) {
                  return DropdownMenuItem<String>(
                    value: employee.id,
                    child: Text(employee.name),
                  );
                }).toList(),
                onChanged: (value) => selectedEmployeeId = value,
              ),
              SwitchListTile(
                title: const Text('Has Eaten'),
                value: hasEaten,
                onChanged: (value) => hasEaten = value,
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
                if (selectedEmployeeId != null) {
                  _addLunchRecord(selectedEmployeeId!, hasEaten);
                  Navigator.pop(context);
                }
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
        title: const Text('Lunch Tracking'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
          IconButton(
            icon: const Icon(Icons.add),
            onPressed: _showAddLunchRecordDialog,
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
              // Show details if needed
              
            },
          );
        },
      ),
    );
  }
}