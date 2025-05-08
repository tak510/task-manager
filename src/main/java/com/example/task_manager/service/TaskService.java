package com.example.task_manager.service;

import com.example.task_manager.model.Task;

import java.util.List;

public interface TaskService {
    Task createTask(Task task);
    List<Task> getTasksByUserId(Long userId);
    Task getTaskById(Long id);
    Task updateTask(Long id, Task taskDetails);
    void deleteTask(Long id);
}
