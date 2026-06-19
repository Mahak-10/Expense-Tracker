package com.expensetracker.application.service;

import com.expensetracker.application.exceptions.APIException;
import com.expensetracker.application.exceptions.ResourceNotFoundException;
import com.expensetracker.application.model.Category;
import com.expensetracker.application.model.Expense;
import com.expensetracker.application.payload.ExpenseDTO;
import com.expensetracker.application.payload.ExpenseResponse;
import com.expensetracker.application.repository.CategoryRepository;
import com.expensetracker.application.repository.ExpenseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Month;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


@Service
public class ExpenseServiceImp implements ExpenseService {

    @Autowired
    ExpenseRepository expenseRepository;

    @Autowired
    CategoryRepository categoryRepository;

    @Override
    public ExpenseDTO addExpense(ExpenseDTO expenseDTO) {



        Long categoryId = expenseDTO.getCategoryId();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        if(expenseDTO.getAmount()==0 || expenseDTO.getAmount()<0.1 ){
            throw new APIException("Enter valid amount");
        }

        Expense expense = new Expense();
        expense.setDescription(expenseDTO.getDescription());
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(category);


        Expense savedExpense = expenseRepository.save(expense);
        return toExpenseDTO(savedExpense);
    }

    private ExpenseDTO toExpenseDTO(Expense expense) {
        ExpenseDTO dto = new ExpenseDTO();
        dto.setExpenseId(expense.getExpenseId());
        dto.setDescription(expense.getDescription());
        dto.setAmount(expense.getAmount());
        if (expense.getCategory() != null) {
            dto.setCategoryId(expense.getCategory().getCategoryId());
            dto.setCategoryName(expense.getCategory().getCategoryName());
        }
        return dto;
    }

    @Override
    public ExpenseResponse getExpenses() {

         List<ExpenseDTO> expenseDTOS = expenseRepository.findAll().stream()
                 .map(this::toExpenseDTO)
                 .toList();

         return new ExpenseResponse(expenseDTOS);
    }

    @Override
    public ExpenseDTO updateExpense(Long expenseId, ExpenseDTO expenseDTO) {
        Expense savedExpense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "expenseId", expenseId));

        Long categoryId = expenseDTO.getCategoryId();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        if (expenseDTO.getAmount() == 0 || expenseDTO.getAmount() < 0.1) {
            throw new APIException("Enter valid amount");
        }

        savedExpense.setDescription(expenseDTO.getDescription());
        savedExpense.setAmount(expenseDTO.getAmount());
        savedExpense.setCategory(category);
        savedExpense = expenseRepository.save(savedExpense);
        return toExpenseDTO(savedExpense);
    }


    @Override
    public ExpenseDTO deleteExpense(Long expenseId) {

        Expense savedExpense=expenseRepository.findById(expenseId)
                .orElseThrow(()->new ResourceNotFoundException("Expense","expenseId",expenseId));

        expenseRepository.delete(savedExpense);
        return toExpenseDTO(savedExpense);

    }

    @Override
    public String deleteAll() {

        List<Expense> savedExpense=expenseRepository.findAll();
        expenseRepository.deleteAll(savedExpense);
        return "Expense deleted successfully";

    }

    @Override
    public List<ExpenseDTO> getExpenseByCategoryName(String categoryName) {

        return expenseRepository.findByCategory_CategoryNameIgnoreCase(categoryName)
                .stream()
                .map(this::toExpenseDTO)
                .toList();

    }

    @Override
    public Double getTotalSpent() {
        return expenseRepository.getTotalAmountSpent();
    }

    @Override
    public Map<String, Double> getMonthlyExpense() {

        List<Object[]> results = expenseRepository.getMonthlyExpenses();
        Map<String, Double> monthlyData = new LinkedHashMap<>();

        for (Object[] row : results) {
            Integer month = (Integer) row[0];
            Double total = (Double) row[1];
            monthlyData.put(Month.of(month).name(), total);
        }

        return monthlyData;
    }

    @Override
    public List<ExpenseDTO> getExpenseByMonth(String month) {
        int monthNumber = Month.valueOf(month.toUpperCase()).getValue();
        List<Expense> expenses = expenseRepository.getExpensesByMonth(monthNumber);

        return expenses.stream()
                .map(this::toExpenseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, List<ExpenseDTO>> getExpensesGroupedByCategory() {
        List<Expense> allExpenses = expenseRepository.findAll();
        return allExpenses.stream()
                .map(this::toExpenseDTO)
                .collect(Collectors.groupingBy(ExpenseDTO::getCategoryName));
    }

    @Override
    public List<ExpenseDTO> getCategoryWiseExpenses() {
        List<Object[]> results = expenseRepository.getCategoryWiseExpenses();
        List<ExpenseDTO> dtos = new ArrayList<>();

        for(Object[] row : results) {
            String categoryName = (String) row[0];
            Double totalAmount = (Double) row[1];

            ExpenseDTO dto = new ExpenseDTO();
            dto.setCategoryName(categoryName);
            dto.setAmount(totalAmount != null ? totalAmount : 0.0);

            dtos.add(dto);
        }

        return dtos;
    }


}
