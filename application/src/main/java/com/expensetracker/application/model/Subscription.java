package com.expensetracker.application.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity(name = "Subscription")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subscriptionId;

    @NotBlank(message = "Service name is required")
    private String serviceName; // e.g. Netflix, Spotify, LinkedIn, etc.

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount cannot be 0")
    private double amount;

    @NotBlank(message = "Billing cycle is required")
    private String billingCycle; // e.g. "MONTHLY", "YEARLY"

    @NotNull(message = "Next payment date is required")
    private LocalDate nextPaymentDate;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;
}
