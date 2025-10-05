package com.expensetracker.application.model;


import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;


import java.time.LocalDate;

@Entity(name="Expense")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Expense {


    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long expenseId;

    @NotNull(message="Amount is required")
    @DecimalMin(value="0.01",message = "Amount cannot be 0")
    private double amount;

    @Size(max=255, message = "Size should not exceed 255")
    private String description;

    @NotNull(message="Date is required")
    private LocalDate date;

    @ManyToOne
    @JoinColumn(name = "categoryId", nullable = false)
    @JsonBackReference
    private Category category;

    @PrePersist
    public void prePersist() {
        if (this.date == null) {
            this.date = LocalDate.now();
        }
    }


}
