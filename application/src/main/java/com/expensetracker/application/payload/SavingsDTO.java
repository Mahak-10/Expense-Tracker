package com.expensetracker.application.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SavingsDTO {
    private double totalSavings;
    private double currentMonthSavings;
}
