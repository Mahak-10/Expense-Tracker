package com.expensetracker.application.payload;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExpenseDTO {

    @Size(max = 255, message = "Description must not exceed 255 characters")
    private String description;

    @DecimalMin(value = "0.01", message = "Amount must be at least 0.01")
    private double amount;

    private Long expenseId;

    @NotNull(message = "Category is required")
    private Long categoryId;

    private String categoryName;
}
