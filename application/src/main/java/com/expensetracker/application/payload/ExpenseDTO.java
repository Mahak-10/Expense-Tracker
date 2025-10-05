package com.expensetracker.application.payload;

import com.expensetracker.application.model.Category;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {


    private String description;
    private double amount;
    private Long expenseId;
    private Long categoryId;
    private String categoryName;
}
