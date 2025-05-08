class LunchRecord {
  final String id;
  final String employeeId;
  final String? employeeName;
  final String? employeeNumber;
  final DateTime date;
  final bool hasEaten;
  final String? signature;
  final String? notes;
  final String? status; // e.g., "open", "closed", "pending"
  
  LunchRecord({
    required this.id,
    required this.employeeId,
    this.employeeName,
    this.employeeNumber,
    required this.date,
    required this.hasEaten,
    this.signature,
    this.notes,
    this.status,
  });
  
  factory LunchRecord.fromJson(Map<String, dynamic> json) {
    return LunchRecord(
      id: json['id'] ?? '',
      employeeId: json['employeeId'] ?? '',
      employeeName: json['employeeName'],
      employeeNumber: json['employeeNumber'],
      date: json['date'] != null 
          ? DateTime.parse(json['date']) 
          : DateTime.now(),
      hasEaten: json['hasEaten'] ?? false,
      signature: json['signature'],
      notes: json['notes'],
      status: json['status'],
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employeeId': employeeId,
      if (employeeName != null) 'employeeName': employeeName,
      if (employeeNumber != null) 'employeeNumber': employeeNumber,
      'date': date.toIso8601String(),
      'hasEaten': hasEaten,
      if (signature != null) 'signature': signature,
      if (notes != null) 'notes': notes,
      if (status != null) 'status': status,
    };
  }
  
  LunchRecord copyWith({
    String? id,
    String? employeeId,
    String? employeeName,
    String? employeeNumber,
    DateTime? date,
    bool? hasEaten,
    String? signature,
    String? notes,
    String? status,
  }) {
    return LunchRecord(
      id: id ?? this.id,
      employeeId: employeeId ?? this.employeeId,
      employeeName: employeeName ?? this.employeeName,
      employeeNumber: employeeNumber ?? this.employeeNumber,
      date: date ?? this.date,
      hasEaten: hasEaten ?? this.hasEaten,
      signature: signature ?? this.signature,
      notes: notes ?? this.notes,
      status: status ?? this.status,
    );
  }
}