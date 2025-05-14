package com.example.task_manager.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users") // optional, but common
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String password;
}