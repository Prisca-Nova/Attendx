class Company {
  final String id;
  final String name;
  final String? address;
  final String? contactEmail;
  final String? phoneNumber;

  Company({
    required this.id,
    required this.name,
    this.address,
    this.contactEmail,
    this.phoneNumber,
  });

  factory Company.fromJson(Map<String, dynamic> json) {
    return Company(
      id: json['id'] ?? '',
      name: json['name'] ?? '',
      address: json['address'],
      contactEmail: json['contactEmail'],
      phoneNumber: json['phoneNumber'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'address': address,
      'contactEmail': contactEmail,
      'phoneNumber': phoneNumber,
    };
  }
}