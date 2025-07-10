package com.example.User_Service.entity.rhentities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Informations personnelles
    private String firstName;
    private String lastName;
    private LocalDate birthDate;
    private String personalEmail;
    private String phoneNumber;

    // Adresse
    private String address;
    private String city;
    private String postalCode;
    private String country;

    // Informations professionnelles
    private String position;
    @ManyToOne()
    private Department department;
    private Double salary;
    private LocalDate hireDate;

    @Enumerated(EnumType.STRING)
    private ContractType contractType; // CDI, CDD, etc.

    private Boolean active = true;
    private String workEmail;

    private LocalDateTime created_at;


    @ManyToOne
    private Employee manager;
}
