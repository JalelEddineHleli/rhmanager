package com.example.User_Service.entity.rhentities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Contract {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String contractReference;
    private LocalDate startDate;
    private LocalDate endDate;
    private Double salary;

    @Enumerated(EnumType.STRING)
    private ContractType contractType; // CDI, CDD, Stage, etc.

    @ManyToOne
    private Employee employee;

    // Autres détails du contrat
}
