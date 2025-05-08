import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../services/api_service.dart';
import 'login_screen.dart';
import 'lunch_tracking.dart';
import 'report_screen.dart';
import '../models/company.dart';
import 'employee_list .dart';

class StaffDashboard extends StatefulWidget {
  const StaffDashboard({Key? key}) : super(key: key);

  @override
  _StaffDashboardState createState() => _StaffDashboardState();
}

class _StaffDashboardState extends State<StaffDashboard> {
  List<Company> companies = [];
  Company? selectedCompany;
  bool isLoading = true;
  String? error;

  @override
  void initState() {
    super.initState();
    _loadCompanies();
  }

  Future<void> _loadCompanies() async {
    try {
      setState(() {
        isLoading = true;
        error = null;
      });

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
        error = e.toString();
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
    VoidCallback onTap, {
    String? subtitle,
  }) {
    return Card(
      elevation: 4,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
      ),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(16),
            gradient: LinearGradient(
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
              colors: [
                color.withOpacity(0.8),
                color,
              ],
            ),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.3),
                  shape: BoxShape.circle,
                ),
                child: Icon(
                  icon,
                  size: 40,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 12),
              Text(
                title,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
                textAlign: TextAlign.center,
              ),
              if (subtitle != null) ...[
                const SizedBox(height: 4),
                Text(
                  subtitle,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.8),
                    fontSize: 12,
                  ),
                  textAlign: TextAlign.center,
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final user = authProvider.currentUser;
    final theme = Theme.of(context);

    if (isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Staff Dashboard'),
          elevation: 0,
        ),
        body: const Center(
          child: CircularProgressIndicator(),
        ),
      );
    }

    if (error != null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Staff Dashboard'),
          elevation: 0,
        ),
        body: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Icon(
                Icons.error_outline,
                size: 60,
                color: Colors.red,
              ),
              const SizedBox(height: 16),
              Text(
                'Error loading data',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Colors.red[800],
                ),
              ),
              const SizedBox(height: 8),
              Text(
                error!,
                style: const TextStyle(color: Colors.grey),
                textAlign: TextAlign.center,
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                onPressed: _loadCompanies,
                icon: const Icon(Icons.refresh),
                label: const Text('Retry'),
              ),
            ],
          ),
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Staff Dashboard'),
        actions: [
          if (companies.isNotEmpty)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: DropdownButton<Company>(
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
                          builder: (_) =>
                              EmployeeList(companyId: selectedCompany!.id),
                        ),
                      );
                    },
                    subtitle: 'Add, edit, remove employees',
                  ),
                  _buildDashboardCard(
                    context,
                    'Lunch Tracking',
                    Icons.lunch_dining,
                    const Color.fromARGB(255, 219, 128, 53),
                    () {
                      if (selectedCompany == null) return;
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) =>
                              LunchTracking(companyId: selectedCompany!.id),
                        ),
                      );
                    },
                    subtitle: 'Track employee lunches',
                  ),
                  _buildDashboardCard(
                    context,
                    'View Reports',
                    Icons.analytics_outlined,
                    Colors.green,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (_) => const ReportsScreen()),
                      );
                    },
                    subtitle: 'Generate lunch reports',
                  ),
                  _buildDashboardCard(
                    context,
                    'My Profile',
                    Icons.person,
                    Colors.purple,
                    () {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                            content: Text('Profile screen coming soon!')),
                      );
                    },
                    subtitle: 'View and edit profile',
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
