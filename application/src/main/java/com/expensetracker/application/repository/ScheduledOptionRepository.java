package com.expensetracker.application.repository;

import com.expensetracker.application.model.ScheduledOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduledOptionRepository extends JpaRepository<ScheduledOption, Long> {
    List<ScheduledOption> findByUser_UserId(Long userId);
    boolean existsByUser_UserIdAndOptionName(Long userId, String optionName);
}
