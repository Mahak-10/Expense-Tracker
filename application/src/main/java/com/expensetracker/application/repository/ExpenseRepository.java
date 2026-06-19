package com.expensetracker.application.repository;

import com.expensetracker.application.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByCategory_CategoryNameIgnoreCase(String categoryName);

    @Query("SELECT SUM(e.amount) FROM Expense e")
    Double getTotalAmountSpent();

    @Query("SELECT MONTH(e.date), SUM(e.amount) FROM Expense e GROUP BY MONTH(e.date)")
    List<Object[]> getMonthlyExpenses();

    @Query("SELECT e FROM Expense e WHERE MONTH(e.date) = :monthNumber")
    List<Expense> getExpensesByMonth(int monthNumber);

    @Query("SELECT e.category.categoryName, SUM(e.amount) FROM Expense e GROUP BY e.category.categoryName")
    List<Object[]> getCategoryWiseExpenses();
}
