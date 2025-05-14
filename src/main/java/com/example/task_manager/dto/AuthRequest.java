package com.example.task_manager.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class AuthRequest {
    private String email;
    private String password;
}