package com.expensetracker.application.repository;

import com.expensetracker.application.model.Debt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DebtRepository extends JpaRepository<Debt, Long> {
    List<Debt> findByUser_UserIdOrderByDueDateDesc(Long userId);
}
