import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import 'login_screen.dart';
import '../screens/employee_list .dart'; 
import '../screens/lunch_tracking.dart';  
import '../screens/reports.dart';

class StaffDashboard extends StatelessWidget {
  const StaffDashboard({Key? key}) : super(key: key);

  // Utility method to create dashboard cards
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
    
    return Scaffold(
      appBar: AppBar(
        title: const Text('Staff Dashboard'),
        actions: [
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
            
            // Dashboard Cards
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 16,
                mainAxisSpacing: 16,
                children: [
                  // Employees Card
                  _buildDashboardCard(
                    context,
                    'Manage Employees',
                    Icons.people,
                    Colors.blue,
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const EmployeeList()),
                      );
                    },
                  ),
                  
                  // Lunch Tracking Card
                  _buildDashboardCard(
                    context,
                    'Lunch Tracking',
                    Icons.lunch_dining,
                    Color.fromARGB(255, 219, 128, 53),
                    () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const LunchTracking()),
                      );
                    },
                  ),

                  // Reports Card
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

                  // Profile Card (placeholder)
                  _buildDashboardCard(
                    context,
                    'My Profile',
                    Icons.person,
                    Colors.purple,
                    () {
                      // TODO: Implement Profile Screen
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