package com.example.task_manager.service;
import com.example.task_manager.repository.TaskRepository;
import com.example.task_manager.model.Task;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;


@Service
public class ReminderService {

    private final TaskRepository taskRepository;

    public ReminderService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Scheduled(fixedRate = 60000) // every 60 seconds
    public void checkReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<Task> tasksToRemind = taskRepository.findByReminderTimeBeforeAndReminderSentFalse(now);

        for (Task task : tasksToRemind) {
            // For now, just log the reminder
            System.out.println("Reminder: Task \"" + task.getTitle() + "\" is due on " + task.getDueDate());

            // Mark as sent
            task.setReminderSent(true);
            taskRepository.save(task);
        }
    }
}