package com.expensetracker.application.controller;

import com.expensetracker.application.exceptions.APIException;
import com.expensetracker.application.exceptions.ResourceNotFoundException;
import com.expensetracker.application.model.ScheduledOption;
import com.expensetracker.application.model.ScheduledTransaction;
import com.expensetracker.application.model.User;
import com.expensetracker.application.repository.ScheduledOptionRepository;
import com.expensetracker.application.repository.ScheduledTransactionRepository;
import com.expensetracker.application.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/scheduled")
@CrossOrigin(origins = "*")
public class ScheduledController {

    @Autowired
    private ScheduledTransactionRepository scheduledTransactionRepository;

    @Autowired
    private ScheduledOptionRepository scheduledOptionRepository;

    @Autowired
    private UserRepository userRepository;

    private User validateUser(Long userId) {
        if (userId == null) {
            throw new APIException("Unauthorized status: X-User-Id header missing");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    }

    // --- Options ---
    @GetMapping("/options")
    public ResponseEntity<List<ScheduledOption>> getOptions(@RequestHeader("X-User-Id") Long userId) {
        validateUser(userId);
        List<ScheduledOption> options = scheduledOptionRepository.findByUser_UserId(userId);
        return new ResponseEntity<>(options, HttpStatus.OK);
    }

    @PostMapping("/options/add")
    public ResponseEntity<ScheduledOption> addOption(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody ScheduledOption option) {
        User user = validateUser(userId);

        if (scheduledOptionRepository.existsByUser_UserIdAndOptionName(userId, option.getOptionName().trim())) {
            throw new APIException("Option already exists");
        }

        option.setOptionName(option.getOptionName().trim());
        option.setUser(user);
        ScheduledOption saved = scheduledOptionRepository.save(option);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @DeleteMapping("/options/delete/{optionId}")
    public ResponseEntity<ScheduledOption> deleteOption(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long optionId) {
        validateUser(userId);
        ScheduledOption option = scheduledOptionRepository.findById(optionId)
                .orElseThrow(() -> new ResourceNotFoundException("ScheduledOption", "optionId", optionId));

        if (option.getUser() != null && !option.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized option access");
        }

        scheduledOptionRepository.delete(option);
        return new ResponseEntity<>(option, HttpStatus.OK);
    }

    // --- Transactions ---
    @GetMapping("/get/all")
    public ResponseEntity<List<ScheduledTransaction>> getAllTransactions(@RequestHeader("X-User-Id") Long userId) {
        validateUser(userId);
        List<ScheduledTransaction> list = scheduledTransactionRepository.findByUser_UserIdOrderByDueDateAsc(userId);
        return new ResponseEntity<>(list, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<ScheduledTransaction> addTransaction(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody ScheduledTransaction st) {
        User user = validateUser(userId);
        st.setUser(user);
        if (st.getStatus() == null || st.getStatus().isBlank()) {
            st.setStatus("PENDING");
        }
        ScheduledTransaction saved = scheduledTransactionRepository.save(st);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/update/{scheduledId}")
    public ResponseEntity<ScheduledTransaction> updateTransaction(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long scheduledId,
            @Valid @RequestBody ScheduledTransaction updated) {
        validateUser(userId);

        ScheduledTransaction st = scheduledTransactionRepository.findById(scheduledId)
                .orElseThrow(() -> new ResourceNotFoundException("ScheduledTransaction", "scheduledId", scheduledId));

        if (st.getUser() != null && !st.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized scheduled transaction access");
        }

        st.setName(updated.getName());
        st.setAmount(updated.getAmount());
        st.setDueDate(updated.getDueDate());
        st.setCategoryOption(updated.getCategoryOption());
        st.setStatus(updated.getStatus());

        ScheduledTransaction saved = scheduledTransactionRepository.save(st);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{scheduledId}")
    public ResponseEntity<ScheduledTransaction> deleteTransaction(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long scheduledId) {
        validateUser(userId);

        ScheduledTransaction st = scheduledTransactionRepository.findById(scheduledId)
                .orElseThrow(() -> new ResourceNotFoundException("ScheduledTransaction", "scheduledId", scheduledId));

        if (st.getUser() != null && !st.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized scheduled transaction access");
        }

        scheduledTransactionRepository.delete(st);
        return new ResponseEntity<>(st, HttpStatus.OK);
    }

    @DeleteMapping("/delete/all")
    public ResponseEntity<String> deleteAllTransactions(@RequestHeader("X-User-Id") Long userId) {
        validateUser(userId);
        List<ScheduledTransaction> list = scheduledTransactionRepository.findByUser_UserIdOrderByDueDateAsc(userId);
        scheduledTransactionRepository.deleteAll(list);
        return new ResponseEntity<>("All scheduled transactions deleted", HttpStatus.OK);
    }
}
