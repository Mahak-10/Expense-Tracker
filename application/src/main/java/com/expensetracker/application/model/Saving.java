package com.expensetracker.application.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity(name = "Saving")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Saving {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long savingId;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.01", message = "Amount cannot be 0")
    private double amount;

    @Size(max = 255, message = "Size should not exceed 255")
    private String description;

    @NotNull(message = "Date is required")
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @PrePersist
    public void prePersist() {
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }
}
