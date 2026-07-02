package com.expensetracker.application.service;

import com.expensetracker.application.payload.ExpenseDTO;
import com.expensetracker.application.payload.ExpenseResponse;

import java.util.List;
import java.util.Map;


public interface ExpenseService {


    ExpenseDTO addExpense(ExpenseDTO expenseDTO, Long userId);
    ExpenseResponse getExpenses(Long userId);
    ExpenseDTO updateExpense(Long expenseId, ExpenseDTO expenseDTO, Long userId);
    ExpenseDTO deleteExpense(Long expenseId, Long userId);

    String deleteAll(Long userId);


    List<ExpenseDTO> getExpenseByCategoryName(String categoryName, Long userId);

    Double getTotalSpent(Long userId);

    Map<String, Double> getMonthlyExpense(Long userId);

    List<ExpenseDTO> getExpenseByMonth(String month, Long userId);

    Map<String, List<ExpenseDTO>> getExpensesGroupedByCategory(Long userId);

    List<ExpenseDTO> getCategoryWiseExpenses(Long userId);
}
