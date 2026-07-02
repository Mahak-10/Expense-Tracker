package com.expensetracker.application.controller;

import com.expensetracker.application.exceptions.APIException;
import com.expensetracker.application.exceptions.ResourceNotFoundException;
import com.expensetracker.application.model.User;
import com.expensetracker.application.payload.SavingsDTO;
import com.expensetracker.application.repository.SavingRepository;
import com.expensetracker.application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;

@RestController
@RequestMapping("/savings")
public class SavingsController {

    @Autowired
    private SavingRepository savingRepository;

    @Autowired
    private UserRepository userRepository;

    private User validateUser(Long userId) {
        if (userId == null) {
            throw new APIException("Unauthorized status: X-User-Id header missing");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    }

    @GetMapping("/summary")
    public ResponseEntity<SavingsDTO> getSavingsSummary(@RequestHeader("X-User-Id") Long userId) {
        validateUser(userId);

        Double totalSavingsObj = savingRepository.getTotalSavingsByUser(userId);
        double totalSavings = totalSavingsObj != null ? totalSavingsObj : 0.0;

        LocalDate now = LocalDate.now();
        int month = now.getMonthValue();
        int year = now.getYear();

        Double monthlySavingsObj = savingRepository.getMonthlySavingsByUser(userId, month, year);
        double currentMonthSavings = monthlySavingsObj != null ? monthlySavingsObj : 0.0;

        SavingsDTO savings = new SavingsDTO(
                totalSavings,
                currentMonthSavings
        );

        return new ResponseEntity<>(savings, HttpStatus.OK);
    }
}
