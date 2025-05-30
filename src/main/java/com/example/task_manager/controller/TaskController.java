package com.example.task_manager.controller;

import com.example.task_manager.model.Task;
import com.example.task_manager.model.User;
import com.example.task_manager.service.TaskService;
import com.example.task_manager.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserService userService;

    @PostMapping
    public ResponseEntity<Task> createTask(@RequestBody Task task, Principal principal) {
        String email = principal.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        task.setUser(user);
        return ResponseEntity.ok(taskService.createTask(task));
    }


    @GetMapping
    public ResponseEntity<List<Task>> getAllTasksForCurrentUser(Principal principal) {
        String email = principal.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return ResponseEntity.ok(taskService.getTasksByUserId(user.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id, Principal principal) {
        String email = principal.getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Task task = taskService.getTaskById(id);
        if (!task.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to view this task.");
        }

        return ResponseEntity.ok(task);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @RequestBody Task taskDetails,
            Principal principal
    ) {
        Task updatedTask = taskService.updateTask(id, taskDetails, principal.getName());
        return ResponseEntity.ok(updatedTask);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        taskService.deleteTask(id, user);
        return ResponseEntity.noContent().build();
    }
}