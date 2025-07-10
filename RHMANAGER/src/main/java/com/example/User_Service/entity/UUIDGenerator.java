package com.example.User_Service.entity;

import java.util.UUID;

public class UUIDGenerator {
    public static String generateUUIDForEntity(String entityPrefix) {
        return entityPrefix + "-" + UUID.randomUUID().toString();
    }
}
