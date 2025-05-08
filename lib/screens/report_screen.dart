import 'dart:io';
import 'package:flutter/material.dart';
import 'package:path_provider/path_provider.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:printing/printing.dart';
import 'package:intl/intl.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({Key? key}) : super(key: key);

  @override
  _ReportsScreenState createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  // Simplified report types
  final List<Map<String, dynamic>> _reportTypes = [
    {
      'title': 'Lunch Tracking',
      'icon': Icons.lunch_dining,
      'color': const Color.fromARGB(255, 218, 94, 17),
    },
    {
      'title': 'Employee Report',
      'icon': Icons.people,
      'color': const Color.fromARGB(255, 53, 219, 75),
    }
  ];

  // Report generation state
  String? _selectedReportType;
  DateTime? _startDate;
  DateTime? _endDate;
  bool _isGenerating = false;

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

    setState(() {
      _isGenerating = true;
    });

    try {
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
                'Detailed report data would be populated here from your database.',
                style: const pw.TextStyle(fontSize: 14),
              ),
              pw.SizedBox(height: 40),
              _selectedReportType == 'Lunch Tracking'
                ? _buildLunchReportTable()
                : _buildEmployeeReportTable(),
            ],
          ),
        ),
      );

      // Save PDF
      final output = await getTemporaryDirectory();
      final file = File('${output.path}/${_selectedReportType}_report.pdf');
      await file.writeAsBytes(await pdf.save());

      setState(() {
        _isGenerating = false;
      });

      // Show success dialog with option to print
      if (!mounted) return;
      
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
      setState(() {
        _isGenerating = false;
      });
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error generating report: $e')),
      );
    }
  }
  
  // Build a sample lunch report table
  pw.Widget _buildLunchReportTable() {
    return pw.Table(
      border: pw.TableBorder.all(),
      children: [
        // Header row
        pw.TableRow(
          decoration: const pw.BoxDecoration(color: PdfColors.grey300),
          children: [
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Date', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Employee', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Lunch Status', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
            ),
          ],
        ),
        // Sample data rows
        pw.TableRow(
          children: [
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('2023-01-01'),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('John Doe'),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Eaten'),
            ),
          ],
        ),
        pw.TableRow(
          children: [
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('2023-01-01'),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Jane Smith'),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Not Eaten'),
            ),
          ],
        ),
      ],
    );
  }
  
  // Build a sample employee report table
  pw.Widget _buildEmployeeReportTable() {
    return pw.Table(
      border: pw.TableBorder.all(),
      children: [
        // Header row
        pw.TableRow(
          decoration: const pw.BoxDecoration(color: PdfColors.grey300),
          children: [
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Employee Name', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Employee Number', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Position', style: pw.TextStyle(fontWeight: pw.FontWeight.bold)),
            ),
          ],
        ),
        // Sample data rows
        pw.TableRow(
          children: [
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('John Doe'),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('EMP001'),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Developer'),
            ),
          ],
        ),
        pw.TableRow(
          children: [
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Jane Smith'),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('EMP002'),
            ),
            pw.Padding(
              padding: const pw.EdgeInsets.all(8.0),
              child: pw.Text('Designer'),
            ),
          ],
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Reports'),
      ),
      body: _isGenerating
          ? const Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  CircularProgressIndicator(),
                  SizedBox(height: 16),
                  Text('Generating report...'),
                ],
              ),
            )
          : Padding(
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
                        final isSelected = _selectedReportType == report['title'];
                        
                        return Padding(
                          padding: const EdgeInsets.symmetric(horizontal: 8.0),
                          child: InkWell(
                            onTap: () {
                              setState(() {
                                _selectedReportType = report['title'];
                              });
                            },
                            child: Container(
                              width: 120,
                              decoration: BoxDecoration(
                                color: isSelected 
                                    ? report['color'] 
                                    : Colors.grey[200],
                                borderRadius: BorderRadius.circular(12),
                                border: Border.all(
                                  color: isSelected 
                                      ? report['color'] 
                                      : Colors.grey[300]!,
                                  width: 2,
                                ),
                              ),
                              child: Column(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Icon(
                                    report['icon'],
                                    color: isSelected 
                                        ? Colors.white 
                                        : report['color'],
                                    size: 40,
                                  ),
                                  const SizedBox(height: 8),
                                  Text(
                                    report['title'],
                                    style: TextStyle(
                                      color: isSelected 
                                          ? Colors.white 
                                          : Colors.black,
                                      fontWeight: FontWeight.bold,
                                    ),
                                    textAlign: TextAlign.center,
                                  ),
                                ],
                              ),
                            ),
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
                      backgroundColor: const Color.fromARGB(255, 223, 215, 106),
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