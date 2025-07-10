package com.example.User_Service.service.email;

import lombok.Getter;

@Getter
public enum EmailTemplateName {
    ACTIVATE_ACCOUNT("activate_account"),
    RESET_PASSWORD("reset_password"),
    ACTIVATE_OTP("activate_otp"),
    REGISTRATION_TEMPLATE("registration_template"),
    ;


    private final String name;

    EmailTemplateName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }
}
