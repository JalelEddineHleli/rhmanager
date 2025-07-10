/*
package com.example.User_Service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data

public class EntityConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String entityName;

    @ManyToOne
    private Tenant tenant;

    @ElementCollection
    @CollectionTable(name="config_attributes")
    @Column(name="attribute_name")
    private Set<String> visibleAttributes;

    @Column(columnDefinition = "json")
    private String validationRules;

}
*/
