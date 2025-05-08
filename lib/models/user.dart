enum UserRole {
  staff,
  employee,
}

class User {
  final String id;
  final String email;
  final UserRole role;
  final String? firstName;
  final String? lastName;
  final String? password;
  final String? token;
  final String? companyId;
  
  User({
    required this.id,
    required this.email,
    required this.role,
    this.firstName,
    this.lastName,
    this.password,
    this.token,
    this.companyId,
  });
  
  // Full name getter
  String get name => '$firstName $lastName';
  
  // Is staff manager
  bool get isStaffManager => role == UserRole.staff;
  
  factory User.fromJson(Map<String, dynamic> json) {
    // Handle role conversion
    UserRole userRole;
    if (json['role'] != null) {
      String roleStr = json['role'].toString().toLowerCase();
      userRole = roleStr == 'staff' ? UserRole.staff : UserRole.employee;
    } else {
      userRole = UserRole.employee; // Default
    }
    
    return User(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      role: userRole,
      firstName: json['firstName'],
      lastName: json['lastName'],
      password: json['password'],
      token: json['token'] ?? json['accessToken'],
      companyId: json['companyId'],
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'role': role == UserRole.staff ? 'staff' : 'employee',
      if (firstName != null) 'firstName': firstName,
      if (lastName != null) 'lastName': lastName,
      if (password != null) 'password': password,
      if (token != null) 'token': token,
      if (companyId != null) 'companyId': companyId,
    };
  }
  
  User copyWith({
    String? id,
    String? email,
    UserRole? role,
    String? firstName,
    String? lastName,
    String? password,
    String? token,
    String? companyId,
  }) {
    return User(
      id: id ?? this.id,
      email: email ?? this.email,
      role: role ?? this.role,
      firstName: firstName ?? this.firstName,
      lastName: lastName ?? this.lastName,
      password: password ?? this.password,
      token: token ?? this.token,
      companyId: companyId ?? this.companyId,
    );
  }
}