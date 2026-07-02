package com.expensetracker.application.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity(name = "Debt")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Debt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long debtId;

    @NotBlank(message = "Person name is required")
    private String personName;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount cannot be 0")
    private double amount;

    @NotBlank(message = "Type is required")
    private String type; // e.g. "OWED_TO_ME" (Lent) or "OWED_TO_OTHERS" (Borrowed)

    private String description;

    @NotNull(message = "Date is required")
    private LocalDate dueDate;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;
}
