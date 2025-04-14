class LunchRecord {
  final String id;
  final String employeeId;
  final String employeeName;
  final String employeeNumber;
  final DateTime date;
  final bool hasEaten;
  final String? signature;

  LunchRecord({
    required this.id,
    required this.employeeId,
    required this.employeeName,
    required this.employeeNumber,
    required this.date,
    required this.hasEaten,
    this.signature,
  });

  factory LunchRecord.fromJson(Map<String, dynamic> json) {
    return LunchRecord(
      id: json['id'] ?? '',
      employeeId: json['employeeId'] ?? '',
      employeeName: json['employeeName'] ?? '',
      employeeNumber: json['employeeNumber'] ?? '',
      date: DateTime.parse(json['date']),
      hasEaten: json['hasEaten'] ?? false,
      signature: json['signature'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employeeId': employeeId,
      'employeeName': employeeName,
      'employeeNumber': employeeNumber,
      'date': date.toIso8601String(),
      'hasEaten': hasEaten,
      'signature': signature,
    };
  }
}