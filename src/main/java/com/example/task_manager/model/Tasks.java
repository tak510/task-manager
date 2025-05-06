package com.example.task_manager.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
public class Tasks {
    @Id @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String title;
    private String description;
    private LocalDate dueDate;
    private boolean completed;
    private String category;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

}
