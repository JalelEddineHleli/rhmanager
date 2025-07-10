package com.example.User_Service.dto;


import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ChangePasswordRequest {
    private String ancienMotDePasse;
private String token;

    private String nouveauMotDePasse;
}
