package com.example.User_Service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@Builder
public class UserDto {
    private String uuid;
    private String email;
    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private LocalDate createdAt;
    private List<RoleDto> roles;
    private Boolean enabled ;

}
