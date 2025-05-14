package com.example.task_manager.service;

import com.example.task_manager.model.Task;
import com.example.task_manager.model.User;
import com.example.task_manager.repository.TaskRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final UserService userService;

    @Override
    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    @Override
    public List<Task> getTasksByUserId(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    @Override
    public Task getTaskById(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task not found with id: " + id));
    }

    @Override
    public Task updateTask(Long id, Task taskDetails, String userEmail) {
        User user = userService.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Task task = getTaskById(id);

        if (!task.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You are not authorized to update this task");
        }

        Task current = getTaskById(id);
        current.setTitle(taskDetails.getTitle());
        current.setDescription(taskDetails.getDescription());
        current.setDueDate(taskDetails.getDueDate());
        current.setCompleted(taskDetails.isCompleted());
        current.setCategory(taskDetails.getCategory());
        return taskRepository.save(current);
    }

    @Override
    public void deleteTask(Long taskId, User user) {
        Task task = getTaskById(taskId);
        if (!task.getUser().getId().equals(user.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this task.");
        }
        taskRepository.deleteById(taskId);
    }
}