import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:intl/intl.dart';
import '../models/lunch_record.dart';
import '../models/employee.dart';
import '../services/api_service.dart';
import 'signature_pad.dart';

class LunchTracking extends StatefulWidget {
  final String companyId;
  
  const LunchTracking({Key? key, required this.companyId}) : super(key: key);

  @override
  _LunchTrackingState createState() => _LunchTrackingState();
}

class _LunchTrackingState extends State<LunchTracking> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  List<LunchRecord> lunchRecords = [];
  List<Employee> employees = [];
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _loadData();
  }
  
  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    try {
      setState(() {
        isLoading = true;
        error = null;
      });
      
      final apiService = Provider.of<ApiService>(context, listen: false);

      final results = await Future.wait([
        apiService.getAttendances(),
        apiService.getCompanyEmployees(widget.companyId),
      ]);
      
      setState(() {
        lunchRecords = results[0] as List<LunchRecord>;
        employees = results[1] as List<Employee>;
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

  // Show signature pad and add lunch record
  Future<void> _recordLunch(Employee employee, bool hasEaten) async {
    try {
      // Show signature pad
      final signature = await Navigator.push<String>(
        context,
        MaterialPageRoute(
          builder: (context) => SignaturePad(employeeName: employee.name),
        ),
      );
      
      // If user cancelled, do nothing
      if (signature == null) return;
      
      // Create lunch record with signature
      final newRecord = LunchRecord(
        id: '',
        employeeId: employee.id,
        employeeName: employee.name,
        employeeNumber: employee.id, // Using ID as employee number if needed
        date: DateTime.now(),
        hasEaten: hasEaten,
        signature: signature,
        status: 'recorded',
      );

      // Save to API
      final apiService = Provider.of<ApiService>(context, listen: false);
      final createdRecord = await apiService.createLunchRecord(newRecord);

      // Update state and show success message
      setState(() {
        lunchRecords.add(createdRecord);
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${employee.name}\'s lunch record added successfully')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to add lunch record: $e')),
      );
    }
  }

  Widget _buildEmployeeList() {
    if (employees.isEmpty) {
      return const Center(child: Text('No employees found'));
    }
    
    // Get today's lunch records for filtering
    final DateTime now = DateTime.now();
    final Map<String, LunchRecord> todayRecordsByEmployeeId = {};
    
    for (var record in lunchRecords) {
      if (record.date.year == now.year && 
          record.date.month == now.month && 
          record.date.day == now.day) {
        todayRecordsByEmployeeId[record.employeeId] = record;
      }
    }
    
    return ListView.builder(
      itemCount: employees.length,
      itemBuilder: (context, index) {
        final employee = employees[index];
        final hasRecord = todayRecordsByEmployeeId.containsKey(employee.id);
        final lunchRecord = hasRecord ? todayRecordsByEmployeeId[employee.id] : null;
        
        return Card(
          margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12),
          ),
          elevation: 2,
          child: ListTile(
            contentPadding: const EdgeInsets.all(12),
            leading: CircleAvatar(
              backgroundColor: Colors.primaries[index % Colors.primaries.length],
              child: Text(
                employee.name.isNotEmpty 
                  ? employee.name.substring(0, 1).toUpperCase() 
                  : '?',
                style: const TextStyle(
                  color: Colors.white,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
            title: Text(
              employee.name,
              style: const TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 16,
              ),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 4),
                Text(employee.email),
                const SizedBox(height: 2),
                if (hasRecord)
                  Text(
                    lunchRecord!.hasEaten ? 'Has eaten lunch' : 'Has not eaten lunch',
                    style: TextStyle(
                      color: lunchRecord.hasEaten ? Colors.green.shade700 : Colors.red.shade700,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
              ],
            ),
            isThreeLine: true,
            trailing: hasRecord
              ? Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    Icon(
                      lunchRecord!.hasEaten ? Icons.check_circle : Icons.cancel,
                      color: lunchRecord.hasEaten ? Colors.green : Colors.red,
                      size: 30,
                    ),
                    if (lunchRecord.signature != null)
                      IconButton(
                        icon: const Icon(Icons.fingerprint),
                        onPressed: () {
                          // Show signature
                          showDialog(
                            context: context,
                            builder: (context) => AlertDialog(
                              title: Text('${employee.name}\'s Signature'),
                              content: Container(
                                width: 300,
                                height: 200,
                                decoration: BoxDecoration(
                                  border: Border.all(color: Colors.grey),
                                ),
                                child: Image.memory(
                                  Uri.parse(lunchRecord.signature!).data!.contentAsBytes(),
                                ),
                              ),
                              actions: [
                                TextButton(
                                  onPressed: () => Navigator.pop(context),
                                  child: const Text('Close'),
                                ),
                              ],
                            ),
                          );
                        },
                      ),
                  ],
                )
              : Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    ElevatedButton(
                      onPressed: () => _recordLunch(employee, true),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.green,
                        minimumSize: const Size(40, 36),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                      child: const Text('Ate'),
                    ),
                    const SizedBox(width: 8),
                    ElevatedButton(
                      onPressed: () => _recordLunch(employee, false),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.red,
                        minimumSize: const Size(40, 36),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(20),
                        ),
                      ),
                      child: const Text('No'),
                    ),
                  ],
                ),
          ),
        );
      },
    );
  }

  Widget _buildHistoryView() {
    // Group records by date, newest first
    final recordsByDate = <DateTime, List<LunchRecord>>{};
    
    for (final record in lunchRecords) {
      final date = DateTime(record.date.year, record.date.month, record.date.day);
      if (!recordsByDate.containsKey(date)) {
        recordsByDate[date] = [];
      }
      recordsByDate[date]!.add(record);
    }
    
    final sortedDates = recordsByDate.keys.toList()
      ..sort((a, b) => b.compareTo(a));
    
    if (sortedDates.isEmpty) {
      return const Center(child: Text('No lunch records found'));
    }
    
    return ListView.builder(
      itemCount: sortedDates.length,
      itemBuilder: (context, index) {
        final date = sortedDates[index];
        final records = recordsByDate[date]!;
        
        // Format date as "Monday, January 1, 2023"
        final dateStr = DateFormat('EEEE, MMMM d, yyyy').format(date);
        
        return ExpansionTile(
          title: Text(dateStr),
          subtitle: Text('${records.length} records'),
          children: records.map((record) {
            final employeeName = record.employeeName ?? 'Unknown Employee';
            
            return Card(
              margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: ListTile(
                leading: Icon(
                  record.hasEaten ? Icons.check_circle : Icons.cancel,
                  color: record.hasEaten ? Colors.green : Colors.red,
                ),
                title: Text(employeeName),
                subtitle: Text(
                  record.hasEaten 
                    ? 'Has eaten lunch' 
                    : 'Has not eaten lunch'
                ),
                trailing: record.signature != null
                  ? IconButton(
                      icon: const Icon(Icons.fingerprint),
                      onPressed: () {
                        // Show signature
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: Text('$employeeName\'s Signature'),
                            content: Container(
                              width: 300,
                              height: 200,
                              decoration: BoxDecoration(
                                border: Border.all(color: Colors.grey),
                              ),
                              child: Image.memory(
                                Uri.parse(record.signature!).data!.contentAsBytes(),
                              ),
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('Close'),
                              ),
                            ],
                          ),
                        );
                      },
                    )
                  : null,
              ),
            );
          }).toList(),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }

    if (error != null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Lunch Tracking'),
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                Icons.error_outline,
                size: 64,
                color: Colors.red,
              ),
              const SizedBox(height: 16),
              Text('Error: $error'),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _loadData,
                child: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Lunch Tracking'),
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          tabs: const [
            Tab(text: 'Today'),
            Tab(text: 'History'),
          ],
        ),
      ),
      body: TabBarView(
        controller: _tabController,
        children: [
          _buildEmployeeList(),
          _buildHistoryView(),
        ],
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => _showAddLunchRecordDialog(),
        child: const Icon(Icons.add),
        tooltip: 'Add Lunch Record',
      ),
    );
  }
  
  void _showAddLunchRecordDialog() {
    String? selectedEmployeeId;
    bool hasEaten = true;
    final notesController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setState) {
            return AlertDialog(
              title: const Text('Add Lunch Record'),
              content: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    DropdownButtonFormField<String>(
                      hint: const Text('Select Employee'),
                      isExpanded: true,
                      items: employees.map((Employee employee) {
                        return DropdownMenuItem<String>(
                          value: employee.id,
                          child: Text(employee.name),
                        );
                      }).toList(),
                      onChanged: (value) {
                        selectedEmployeeId = value;
                      },
                    ),
                    const SizedBox(height: 16),
                    SwitchListTile(
                      title: const Text('Has Eaten'),
                      value: hasEaten,
                      onChanged: (value) {
                        setState(() {
                          hasEaten = value;
                        });
                      },
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: notesController,
                      decoration: const InputDecoration(
                        labelText: 'Notes (Optional)',
                        border: OutlineInputBorder(),
                      ),
                      maxLines: 3,
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
                  onPressed: () async {
                    if (selectedEmployeeId == null) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Please select an employee')),
                      );
                      return;
                    }
                    
                    // Get selected employee
                    final employee = employees.firstWhere(
                      (e) => e.id == selectedEmployeeId,
                    );
                    
                    // Close dialog
                    Navigator.pop(context);
                    
                    // Record with signature
                    await _recordLunch(employee, hasEaten);
                  },
                  child: const Text('Continue to Signature'),
                ),
              ],
            );
          }
        );
      },
    );
  }
}