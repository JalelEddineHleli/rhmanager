package com.example.User_Service.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor

public class AppRole {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String uuid  ;

    private String role;
    @ManyToMany (mappedBy = "roles")
    @JsonIgnore
    List<AppUser> users;

    @PrePersist
    protected void onCreate() {
        if (this.uuid == null) {
            this.uuid = UUIDGenerator.generateUUIDForEntity("Role");
        }

    }
    public class RoleConstants {
        public static final String ADMIN = "ADMIN";
    }
}
