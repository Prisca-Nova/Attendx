import 'package:flutter/material.dart';
import 'package:new_employee_lunch_app/screens/employee_list%20.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import 'login_screen.dart';
import '../screens/employee_list .dart'; 
import 'lunch_tracking.dart';  
import 'reports.dart';
import '../models/company.dart';

class StaffDashboard extends StatefulWidget {
  const StaffDashboard({Key? key}) : super(key: key);

  @override
  _StaffDashboardState createState() => _StaffDashboardState();
}

class _StaffDashboardState extends State<StaffDashboard> {
  List<Company> companies = [];
  Company? selectedCompany;
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCompanies();
  }

  Future<void> _loadCompanies() async {
    try {
      final apiService = Provider.of<ApiService>(context, listen: false);
      final loadedCompanies = await apiService.getCompanies(); 
      setState(() {
        companies = loadedCompanies;
        if (loadedCompanies.isNotEmpty) {
          selectedCompany = loadedCompanies.first;
        }
        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Failed to load companies: $e')),
      );
    }
  }

  Widget _buildDashboardCard(
    BuildContext context,
    String title,
    IconData icon,
    Color color,
    VoidCallback onTap,
  ) {
    return Card(
      elevation: 4,
      color: color,
      child: InkWell(
        onTap: onTap,
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(
                icon,
                size: 50,
                color: Colors.white,
              ),
              const SizedBox(height: 10),
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    
    if (isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Staff Dashboard'),
        actions: [
          if (companies.isNotEmpty)
            DropdownButton<Company>(
              value: selectedCompany,
              items: companies.map((Company company) {
                return DropdownMenuItem<Company>(
                  value: company,
                  child: Text(company.name),
                );
              }).toList(),
              onChanged: (Company? newValue) {
                setState(() {
                  selectedCompany = newValue;
                });
              },
              underline: Container(),
              dropdownColor: Colors.white,
              icon: const Icon(Icons.arrow_drop_down, color: Colors.white),
            ),
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await authProvider.logout();
              if (!context.mounted) return;
              Navigator.of(context).pushReplacement(
                MaterialPageRoute(builder: (_) => const LoginScreen()),
              );
            },
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text(
              'Welcome, Staff',
              style: TextStyle(
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color.fromARGB(255, 219, 128, 53),
              ),
            ),
            const SizedBox(height: 32),
            
            if (selectedCompany != null) ...[
              Text(
                'Selected Company: ${selectedCompany!.name}',
                style: const TextStyle(fontSize: 16),
              ),
              const SizedBox(height: 16),
            ],
            
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  _buildDashboardCard(
                    context,
                    'Manage Employees',
                    Icons.people,
                    Colors.blue,
                    () {
                      if (selectedCompany == null) return;
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => EmployeeList(companyId: selectedCompany!.id),
                        ),
                      );
                    },
                  ),
                  
                  _buildDashboardCard(
                    context,
                    'Lunch Tracking',
                    Icons.lunch_dining,
                    Color.fromARGB(255, 219, 128, 53),
                    () {
                      if (selectedCompany == null) return;
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => LunchTracking(companyId: selectedCompany!.id),
                        ),
                      );
                    },
                  ),

                  _buildDashboardCard(
                    context,
                    'View Reports',
                    Icons.analytics_outlined,
                    Colors.green,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ReportsScreen()),
                      );
                    },
                  ),

                  _buildDashboardCard(
                    context,
                    'My Profile',
                    Icons.person,
                    Colors.purple,
                    () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Profile screen coming soon!')),
                      );
                    },
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}