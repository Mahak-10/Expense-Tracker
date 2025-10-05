package com.expensetracker.application.controller;


import com.expensetracker.application.model.Expense;
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


    //CRUD OPERATIONS

      //Add an expense
     @PostMapping("/add/expense")
    public ResponseEntity<ExpenseDTO> addExpense(@Valid @RequestBody ExpenseDTO expenseDTO)
     {
             ExpenseDTO status=expenseService.addExpense(expenseDTO);
             return new ResponseEntity<>(status,HttpStatus.OK);

     }

     //get all expense
     @GetMapping("/get/expenses")
    public ResponseEntity<ExpenseResponse> getExpenses()
     {
            ExpenseResponse expenseResponse= expenseService.getExpenses();
             return new ResponseEntity<ExpenseResponse>(expenseResponse, HttpStatus.OK);
     }

     //update an expense
    @PutMapping("/update/{expenseId}")
    public ResponseEntity<ExpenseDTO> updateExpense(@Valid @PathVariable Long expenseId,@Valid @RequestBody ExpenseDTO expenseDTO)
    {
           ExpenseDTO status=expenseService.updateExpense(expenseId, expenseDTO);
           return new ResponseEntity<>(status, HttpStatus.CREATED);

    }

    //delete an expense
    @DeleteMapping("/delete/expenseid/{expenseId}")
    public ResponseEntity<ExpenseDTO> deleteExpense(@Valid @PathVariable Long expenseId)
    {
            ExpenseDTO status=expenseService.deleteExpense(expenseId);
            return new ResponseEntity<>(status, HttpStatus.OK);
    }

    //delete all expense
    @DeleteMapping("/delete/allexpenses")
    public ResponseEntity<String> deleteAll()
    {
            String status = expenseService.deleteAll();
            return new ResponseEntity<>(status, HttpStatus.OK);

    }


    //custom queries


    //view all expense categorywise
    @GetMapping("/expense/category")
    public ResponseEntity<Map<String, List<Expense>>> getExpensesByCategory() {
        Map<String, List<Expense>> status = expenseService.getExpensesGroupedByCategory();
        return new ResponseEntity<>(status,HttpStatus.OK);
    }

    //view expense by category
    @GetMapping("/expense/{categoryName}")
    public ResponseEntity<ExpenseResponse> getCategoryExpense(@PathVariable String categoryName)
    {
        List<ExpenseDTO> expenses=expenseService.getExpenseByCategoryName(categoryName);
        ExpenseResponse status= new ExpenseResponse(expenses);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    //view total spent
    @GetMapping("/expenses/total")
    public ResponseEntity<Double> getTotalExpense() {

         Double expenses=expenseService.getTotalSpent();
         return new ResponseEntity<>(expenses, HttpStatus.OK);
    }


    //view monthly spent
    @GetMapping("/monthwise")
    public ResponseEntity<Map<String,Double>> getExpenseMonthly()
    {
        Map<String,Double> expenses=expenseService.getMonthlyExpense();
        return new ResponseEntity<>(expenses, HttpStatus.OK);
    }

    //view spent by month
    @GetMapping("/{month}")
    public ResponseEntity<ExpenseResponse> getExpenseByMonthName(@PathVariable String month)
    {
        List<ExpenseDTO> expenses=expenseService.getExpenseByMonth(month);
        ExpenseResponse status= new ExpenseResponse(expenses);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }

    //view total spent in each category
    @GetMapping("/category-expenses")
    public ResponseEntity<ExpenseResponse> getCategoryWiseExpenses() {
        List<ExpenseDTO> expenses = expenseService.getCategoryWiseExpenses();
        ExpenseResponse status= new ExpenseResponse(expenses);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }






}
