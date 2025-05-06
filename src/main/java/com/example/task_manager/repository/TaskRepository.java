package com.example.task_manager.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.task_manager.model.Tasks;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Tasks, Long> {
    List<Tasks> findByUserId(Long userId);
}
