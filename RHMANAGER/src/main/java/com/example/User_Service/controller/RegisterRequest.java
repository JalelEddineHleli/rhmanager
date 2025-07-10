package com.example.User_Service.controller;

import com.example.User_Service.entity.AppRole;
import jakarta.persistence.FetchType;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Data
@NoArgsConstructor
@Builder
public class RegisterRequest {

    private String email;
    private String password;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private String tenant;
    private List<AppRole> roles;
}
