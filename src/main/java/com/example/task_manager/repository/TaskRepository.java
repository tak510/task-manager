package com.example.task_manager.repository;

import com.example.task_manager.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.task_manager.model.Task;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long id);
    List<Task> findByUser(User user);
    List<Task> findByReminderTimeBeforeAndReminderSentFalse(LocalDateTime time);
    @Query("SELECT t FROM Task t WHERE t.reminderTime <= :now AND t.reminderSent = false AND t.reminderTime IS NOT NULL")
    List<Task> findPendingReminders(@Param("now") LocalDateTime now);
}