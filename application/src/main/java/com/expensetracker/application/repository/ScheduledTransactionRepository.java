package com.expensetracker.application.repository;

import com.expensetracker.application.model.ScheduledTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScheduledTransactionRepository extends JpaRepository<ScheduledTransaction, Long> {
    List<ScheduledTransaction> findByUser_UserIdOrderByDueDateAsc(Long userId);
}
