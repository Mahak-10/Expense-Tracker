package com.expensetracker.application.service;

import com.expensetracker.application.exceptions.APIException;
import com.expensetracker.application.exceptions.ResourceNotFoundException;
import com.expensetracker.application.model.Category;
import com.expensetracker.application.model.Expense;
import com.expensetracker.application.model.User;
import com.expensetracker.application.payload.ExpenseDTO;
import com.expensetracker.application.payload.ExpenseResponse;
import com.expensetracker.application.repository.CategoryRepository;
import com.expensetracker.application.repository.ExpenseRepository;
import com.expensetracker.application.repository.UserRepository;
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

    @Autowired
    UserRepository userRepository;

    private User validateUser(Long userId) {
        if (userId == null) {
            throw new APIException("Unauthorized status: X-User-Id header missing");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    }

    @Override
    public ExpenseDTO addExpense(ExpenseDTO expenseDTO, Long userId) {
        User user = validateUser(userId);

        Long categoryId = expenseDTO.getCategoryId();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category not found with id: " + categoryId));

        if (category.getUser() != null && !category.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized category access");
        }

        if (expenseDTO.getAmount() == 0 || expenseDTO.getAmount() < 0.01) {
            throw new APIException("Enter valid amount");
        }

        Expense expense = new Expense();
        expense.setDescription(expenseDTO.getDescription());
        expense.setAmount(expenseDTO.getAmount());
        expense.setCategory(category);
        expense.setUser(user);

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
    public ExpenseResponse getExpenses(Long userId) {
        validateUser(userId);
        List<ExpenseDTO> expenseDTOS = expenseRepository.findByUser_UserId(userId).stream()
                .map(this::toExpenseDTO)
                .toList();

        return new ExpenseResponse(expenseDTOS);
    }

    @Override
    public ExpenseDTO updateExpense(Long expenseId, ExpenseDTO expenseDTO, Long userId) {
        validateUser(userId);
        Expense savedExpense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "expenseId", expenseId));

        if (savedExpense.getUser() != null && !savedExpense.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized expense access");
        }

        Long categoryId = expenseDTO.getCategoryId();
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        if (category.getUser() != null && !category.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized category access");
        }

        if (expenseDTO.getAmount() == 0 || expenseDTO.getAmount() < 0.01) {
            throw new APIException("Enter valid amount");
        }

        savedExpense.setDescription(expenseDTO.getDescription());
        savedExpense.setAmount(expenseDTO.getAmount());
        savedExpense.setCategory(category);
        savedExpense = expenseRepository.save(savedExpense);
        return toExpenseDTO(savedExpense);
    }


    @Override
    public ExpenseDTO deleteExpense(Long expenseId, Long userId) {
        validateUser(userId);
        Expense savedExpense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new ResourceNotFoundException("Expense", "expenseId", expenseId));

        if (savedExpense.getUser() != null && !savedExpense.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized expense access");
        }

        expenseRepository.delete(savedExpense);
        return toExpenseDTO(savedExpense);
    }

    @Override
    public String deleteAll(Long userId) {
        validateUser(userId);
        List<Expense> userExpenses = expenseRepository.findByUser_UserId(userId);
        expenseRepository.deleteAll(userExpenses);
        return "Expenses deleted successfully";
    }

    @Override
    public List<ExpenseDTO> getExpenseByCategoryName(String categoryName, Long userId) {
        validateUser(userId);
        return expenseRepository.findByCategory_CategoryNameIgnoreCaseAndUser_UserId(categoryName, userId)
                .stream()
                .map(this::toExpenseDTO)
                .toList();
    }

    @Override
    public Double getTotalSpent(Long userId) {
        validateUser(userId);
        Double sum = expenseRepository.getTotalAmountSpentByUser(userId);
        return sum != null ? sum : 0.0;
    }

    @Override
    public Map<String, Double> getMonthlyExpense(Long userId) {
        validateUser(userId);
        List<Object[]> results = expenseRepository.getMonthlyExpensesByUser(userId);
        Map<String, Double> monthlyData = new LinkedHashMap<>();

        for (Object[] row : results) {
            int month = ((Number) row[0]).intValue();
            double total = ((Number) row[1]).doubleValue();
            monthlyData.put(Month.of(month).name(), total);
        }

        return monthlyData;
    }

    @Override
    public List<ExpenseDTO> getExpenseByMonth(String month, Long userId) {
        validateUser(userId);
        int monthNumber = Month.valueOf(month.toUpperCase()).getValue();
        List<Expense> expenses = expenseRepository.getExpensesByMonthAndUser(userId, monthNumber);

        return expenses.stream()
                .map(this::toExpenseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Map<String, List<ExpenseDTO>> getExpensesGroupedByCategory(Long userId) {
        validateUser(userId);
        List<Expense> allExpenses = expenseRepository.findByUser_UserId(userId);
        return allExpenses.stream()
                .map(this::toExpenseDTO)
                .collect(Collectors.groupingBy(ExpenseDTO::getCategoryName));
    }

    @Override
    public List<ExpenseDTO> getCategoryWiseExpenses(Long userId) {
        validateUser(userId);
        List<Object[]> results = expenseRepository.getCategoryWiseExpensesByUser(userId);
        List<ExpenseDTO> dtos = new ArrayList<>();

        for (Object[] row : results) {
            String categoryName = (String) row[0];
            double totalAmount = ((Number) row[1]).doubleValue();

            ExpenseDTO dto = new ExpenseDTO();
            dto.setCategoryName(categoryName);
            dto.setAmount(totalAmount);

            dtos.add(dto);
        }

        return dtos;
    }
}
