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
      contactEmail: json['contactEmail'] ?? json['email'],
      phoneNumber: json['phoneNumber'] ?? json['phone'],
    );
  }
  
  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      if (address != null) 'address': address,
      if (contactEmail != null) 'contactEmail': contactEmail,
      if (phoneNumber != null) 'phoneNumber': phoneNumber,
    };
  }
  
  Company copyWith({
    String? id,
    String? name,
    String? address,
    String? contactEmail,
    String? phoneNumber,
  }) {
    return Company(
      id: id ?? this.id,
      name: name ?? this.name,
      address: address ?? this.address,
      contactEmail: contactEmail ?? this.contactEmail,
      phoneNumber: phoneNumber ?? this.phoneNumber,
    );
  }
}