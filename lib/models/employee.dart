class Employee {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String? phoneNumber;
  final String? departmentId;
  final String? position;
  final String? status;
  final String? address;
  
  Employee({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.phoneNumber,
    this.departmentId,
    this.position,
    this.status,
    this.address,
  });

  // Full name getter
  String get name => '$firstName $lastName';
  
  // Get employee number (using email as fallback if no ID is available)
  String get employeeNumber => id.isNotEmpty ? id : email;

  // Convert Employee to JSON
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      if (phoneNumber != null) 'phoneNumber': phoneNumber,
      if (departmentId != null) 'departmentId': departmentId,
      if (position != null) 'position': position,
      if (status != null) 'status': status,
      if (address != null) 'address': address,
    };
  }

  // Create Employee from JSON
  factory Employee.fromJson(Map<String, dynamic> json) {
    // Handle the case where we might get a name as a single field or as first/last name
    String firstName = json['firstName'] ?? '';
    String lastName = json['lastName'] ?? '';
    
    // If we have a single 'name' field but no first/last name, try to split it
    if ((firstName.isEmpty || lastName.isEmpty) && json['name'] != null) {
      final nameParts = (json['name'] as String).split(' ');
      if (nameParts.length > 1) {
        firstName = nameParts.first;
        lastName = nameParts.skip(1).join(' ');
      } else if (nameParts.isNotEmpty) {
        firstName = nameParts.first;
        lastName = '';
      }
    }
    
    return Employee(
      id: json['id'] ?? '',
      firstName: firstName,
      lastName: lastName,
      email: json['email'] ?? '',
      phoneNumber: json['phoneNumber'] ?? json['contact'],
      departmentId: json['departmentId'],
      position: json['position'],
      status: json['status'],
      address: json['address'],
    );
  }

  // Create a copy of Employee with some changes
  Employee copyWith({
    String? id,
    String? firstName,
    String? lastName,
    String? email,
    String? phoneNumber,
    String? departmentId,
    String? position,
    String? status,
    String? address,
  }) {
    return Employee(
      id: id ?? this.id,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      email: email ?? this.email,
      phoneNumber: phoneNumber ?? this.phoneNumber,
      departmentId: departmentId ?? this.departmentId,
      position: position ?? this.position,
      status: status ?? this.status,
      address: address ?? this.address,
    );
  }
}