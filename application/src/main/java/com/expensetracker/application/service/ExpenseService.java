package com.expensetracker.application.service;

import com.expensetracker.application.model.Expense;
import com.expensetracker.application.payload.ExpenseDTO;
import com.expensetracker.application.payload.ExpenseResponse;

import java.util.List;
import java.util.Map;


public interface ExpenseService {


    ExpenseDTO addExpense(ExpenseDTO expenseDTO);
    ExpenseResponse getExpenses();
    ExpenseDTO updateExpense(Long expenseId, ExpenseDTO expenseDTO);
    ExpenseDTO deleteExpense(Long expenseId);

    String deleteAll();


    List<ExpenseDTO> getExpenseByCategoryName(String categoryName);

    Double getTotalSpent();

    Map<String, Double> getMonthlyExpense();

    List<ExpenseDTO> getExpenseByMonth(String month);

    Map<String, List<Expense>> getExpensesGroupedByCategory();

    List<ExpenseDTO> getCategoryWiseExpenses();
}
