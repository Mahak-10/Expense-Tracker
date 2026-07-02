package com.expensetracker.application.repository;

import com.expensetracker.application.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    List<Expense> findByUser_UserId(Long userId);

    List<Expense> findByCategory_CategoryNameIgnoreCaseAndUser_UserId(String categoryName, Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.userId = :userId")
    Double getTotalAmountSpentByUser(@Param("userId") Long userId);

    @Query("SELECT EXTRACT(MONTH FROM e.date), SUM(e.amount) FROM Expense e WHERE e.user.userId = :userId GROUP BY EXTRACT(MONTH FROM e.date)")
    List<Object[]> getMonthlyExpensesByUser(@Param("userId") Long userId);

    @Query("SELECT e FROM Expense e WHERE e.user.userId = :userId AND EXTRACT(MONTH FROM e.date) = :monthNumber")
    List<Expense> getExpensesByMonthAndUser(@Param("userId") Long userId, @Param("monthNumber") int monthNumber);

    @Query("SELECT e.category.categoryName, SUM(e.amount) FROM Expense e WHERE e.user.userId = :userId GROUP BY e.category.categoryName")
    List<Object[]> getCategoryWiseExpensesByUser(@Param("userId") Long userId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.userId = :userId AND EXTRACT(MONTH FROM e.date) = :month AND EXTRACT(YEAR FROM e.date) = :year")
    Double getMonthlyExpenseSumByUser(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
}
