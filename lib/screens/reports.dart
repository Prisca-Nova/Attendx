import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({Key? key}) : super(key: key);

  @override
  _ReportsScreenState createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  // Simplified report types
  final List<Map<String, dynamic>> _reportTypes = [
    
    {
      'title': 'Attendance Report',
      'icon': Icons.lunch_dining,
      'color': Color.fromARGB(255, 53, 219, 75),
    },
    {
      'title': 'Lunch Tracking',
      'icon': Icons.people,
      'color': Color.fromARGB(255, 218, 94, 17),
    }

  ];

  // Report generation state
  String? _selectedReportType;
  DateTime? _startDate;
  DateTime? _endDate;

  // Method to show date picker
  Future<void> _selectDate(BuildContext context, bool isStartDate) async {
    final DateTime? picked = await showDatePicker(
      context: context,
      initialDate: DateTime.now(),
      firstDate: DateTime(2020),
      lastDate: DateTime(2030),
    );

    if (picked != null) {
      setState(() {
        if (isStartDate) {
          _startDate = picked;
        } else {
          _endDate = picked;
        }
      });
    }
  }

  // Method to generate and download PDF
  Future<void> _generatePdfReport() async {
    if (_selectedReportType == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select a report type')),
      );
      return;
    }

    if (_startDate == null || _endDate == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select start and end dates')),
      );
      return;
    }

    // Create a new PDF document
    final pdf = pw.Document();

    // Add a page to the PDF
    pdf.addPage(
      pw.Page(
        build: (pw.Context context) => pw.Column(
          crossAxisAlignment: pw.CrossAxisAlignment.start,
          children: [
            pw.Text(
              '$_selectedReportType Report',
              style: pw.TextStyle(
                fontSize: 24,
                fontWeight: pw.FontWeight.bold,
              ),
            ),
            pw.SizedBox(height: 20),
            pw.Text(
              'Report Period: ${_startDate?.toLocal().toString().split(' ')[0]} - ${_endDate?.toLocal().toString().split(' ')[0]}',
              style: const pw.TextStyle(fontSize: 16),
            ),
            pw.SizedBox(height: 20),
            pw.Text(
              'Detailed report data would be populated here.',
              style: const pw.TextStyle(fontSize: 14),
            ),
          ],
        ),
      ),
    );

    // Save PDF
    try {
      final output = await getTemporaryDirectory();
      final file = File('${output.path}/${_selectedReportType}_report.pdf');
      await file.writeAsBytes(await pdf.save());

      // Show success dialog with option to print
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Report Generated'),
          content: Text('PDF saved to ${file.path}'),
          actions: [
            TextButton(
              onPressed: () async {
                // Print the PDF
                await Printing.layoutPdf(
                  onLayout: (PdfPageFormat format) async => pdf.save(),
                );
              },
              child: const Text('Print'),
            ),
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Close'),
            ),
          ],
        ),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error generating report: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reports'),
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Report Type Selection
            const Text(
              'Select Report Type',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.bold,
              ),
            ),
            const SizedBox(height: 16),
            SizedBox(
              height: 100,
              child: ListView.builder(
                scrollDirection: Axis.horizontal,
                itemCount: _reportTypes.length,
                itemBuilder: (context, index) {
                  final report = _reportTypes[index];
                  return Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 8.0),
                    child: ChoiceChip(
                      label: Text(report['title']),
                      avatar: Icon(report['icon'], color: Colors.white),
                      selected: _selectedReportType == report['title'],
                      onSelected: (bool selected) {
                        setState(() {
                          _selectedReportType = selected ? report['title'] : null;
                        });
                      },
                      selectedColor: report['color'],
                      backgroundColor: report['color'].withOpacity(0.5),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 24),

            // Date Range Selection
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _selectDate(context, true),
                    child: Text(
                      _startDate == null
                          ? 'Select Start Date'
                          : 'Start: ${_startDate?.toLocal().toString().split(' ')[0]}',
                    ),
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => _selectDate(context, false),
                    child: Text(
                      _endDate == null
                          ? 'Select End Date'
                          : 'End: ${_endDate?.toLocal().toString().split(' ')[0]}',
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 32),

            // Generate Report Button
            ElevatedButton(
              onPressed: _generatePdfReport,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                backgroundColor: Color.fromARGB(255, 223, 215, 106),
              ),
              child: const Text(
                'Generate PDF Report',
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}