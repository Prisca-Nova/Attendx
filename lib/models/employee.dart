class Employee {
  final String id;
  final String name;
  final String employeeNumber;

  Employee({
    required this.id,
    required this.name,
    required this.employeeNumber,
  });

  factory Employee.fromJson(Map<String, dynamic> json) {
    return Employee(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      employeeNumber: json['employeeNumber'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'employeeNumber': employeeNumber,
    };
  }
  
}