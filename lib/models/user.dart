enum UserRole {
  staff,
  employee,
}

class User {
  final String id;
  final String username;
  final UserRole role;
  final String? password;
  //final String? token;

  User({
    
    required this.id,
    required this.username,
    required this.role,
    required this.password,
    //this.token,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'] ?? '',
      username: json['username'] ?? '',
      role: json['role'] == 'staff' ? UserRole.staff : UserRole.employee,
      password: json['password'],
      //token: json['token'],
    );
  }
}

