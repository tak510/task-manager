package com.example.task_manager.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class AuthResponse {
    private String token;

    public AuthResponse(String token) {
        this.token = token;
    }

}