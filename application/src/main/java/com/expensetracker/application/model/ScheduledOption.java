package com.expensetracker.application.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "ScheduledOption")
@NoArgsConstructor
@AllArgsConstructor
@Data
public class ScheduledOption {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long optionId;

    @NotBlank(message = "Option name is required")
    private String optionName;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;
}
