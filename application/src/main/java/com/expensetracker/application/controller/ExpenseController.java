package com.expensetracker.application.controller;


import com.expensetracker.application.payload.ExpenseDTO;
import com.expensetracker.application.payload.ExpenseResponse;
import com.expensetracker.application.service.ExpenseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/expense")
public class ExpenseController {

    @Autowired
    ExpenseService expenseService;

    @PostMapping("/add/expense")
    public ResponseEntity<ExpenseDTO> addExpense(@RequestHeader("X-User-Id") Long userId, @Valid @RequestBody ExpenseDTO expenseDTO) {
        ExpenseDTO status = expenseService.addExpense(expenseDTO, userId);
        return new ResponseEntity<>(status, HttpStatus.CREATED);
    }

    @GetMapping("/get/expenses")
    public ResponseEntity<ExpenseResponse> getExpenses(@RequestHeader("X-User-Id") Long userId) {
        ExpenseResponse expenseResponse = expenseService.getExpenses(userId);
        return new ResponseEntity<>(expenseResponse, HttpStatus.OK);
    }

    @PutMapping("/update/{expenseId}")
    public ResponseEntity<ExpenseDTO> updateExpense(@RequestHeader("X-User-Id") Long userId, @PathVariable Long expenseId, @Valid @RequestBody ExpenseDTO expenseDTO) {
        ExpenseDTO status = expenseService.updateExpense(expenseId, expenseDTO, userId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @DeleteMapping("/delete/expenseid/{expenseId}")
    public ResponseEntity<ExpenseDTO> deleteExpense(@RequestHeader("X-User-Id") Long userId, @PathVariable Long expenseId) {
        ExpenseDTO status = expenseService.deleteExpense(expenseId, userId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @DeleteMapping("/delete/allexpenses")
    public ResponseEntity<String> deleteAll(@RequestHeader("X-User-Id") Long userId) {
        String status = expenseService.deleteAll(userId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    @GetMapping("/expense/category")
    public ResponseEntity<Map<String, List<ExpenseDTO>>> getExpensesByCategory(@RequestHeader("X-User-Id") Long userId) {
        Map<String, List<ExpenseDTO>> status = expenseService.getExpensesGroupedByCategory(userId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    //view expense by category
    @GetMapping("/expense/{categoryName}")
    public ResponseEntity<ExpenseResponse> getCategoryExpense(@RequestHeader("X-User-Id") Long userId, @PathVariable String categoryName)
    {
        List<ExpenseDTO> expenses=expenseService.getExpenseByCategoryName(categoryName, userId);
        ExpenseResponse status= new ExpenseResponse(expenses);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    //view total spent
    @GetMapping("/expenses/total")
    public ResponseEntity<Double> getTotalExpense(@RequestHeader("X-User-Id") Long userId) {

         Double expenses=expenseService.getTotalSpent(userId);
         return new ResponseEntity<>(expenses, HttpStatus.OK);
    }


    //view monthly spent
    @GetMapping("/monthwise")
    public ResponseEntity<Map<String,Double>> getExpenseMonthly(@RequestHeader("X-User-Id") Long userId)
    {
        Map<String,Double> expenses=expenseService.getMonthlyExpense(userId);
        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }

    //view spent by month
    @GetMapping("/{month}")
    public ResponseEntity<ExpenseResponse> getExpenseByMonthName(@RequestHeader("X-User-Id") Long userId, @PathVariable String month)
    {
        List<ExpenseDTO> expenses=expenseService.getExpenseByMonth(month, userId);
        ExpenseResponse status= new ExpenseResponse(expenses);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    //view total spent in each category
    @GetMapping("/category-expenses")
    public ResponseEntity<ExpenseResponse> getCategoryWiseExpenses(@RequestHeader("X-User-Id") Long userId) {
        List<ExpenseDTO> expenses = expenseService.getCategoryWiseExpenses(userId);
        ExpenseResponse status= new ExpenseResponse(expenses);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }






}
