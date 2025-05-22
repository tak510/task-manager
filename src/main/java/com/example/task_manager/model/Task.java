package com.example.task_manager.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;
    private LocalDateTime dueDate;
    private boolean completed = false;
    private String category;
    private LocalDateTime reminderTime;
    @JsonIgnore
    private boolean reminderSent = false;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}