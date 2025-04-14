enum UserRole {
  staff,
  employee,
}

class User {
  final String id;
  final String email;
  final UserRole role;
  final String? password;
  final String? token;

  User({
    required this.id,
    required this.email,
    required this.role,
    this.password,
    this.token,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      email: json['email'] ?? '',
      role: json['role'] == 'staff' ? UserRole.staff : UserRole.employee,
      password: json['password'],
      token: json['token'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'email': email,
      'role': role == UserRole.staff ? 'staff' : 'employee',
      'password': password,
      'token': token,
    };
  }
}