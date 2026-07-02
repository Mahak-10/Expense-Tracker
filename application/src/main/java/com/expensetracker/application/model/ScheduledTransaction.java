package com.expensetracker.application.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity(name = "ScheduledTransaction")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ScheduledTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long scheduledId;

    @NotBlank(message = "Name is required")
    private String name;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount cannot be 0")
    private double amount;

    @NotNull(message = "Due date is required")
    private LocalDate dueDate;

    @NotBlank(message = "Category option is required")
    private String categoryOption; // e.g. Water bill, Electricity, Wifi bill, etc.

    @NotBlank(message = "Status option is required")
    private String status; // "PENDING" / "PAID"

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;
}
