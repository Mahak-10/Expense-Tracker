package com.expensetracker.application.controller;

import com.expensetracker.application.exceptions.APIException;
import com.expensetracker.application.exceptions.ResourceNotFoundException;
import com.expensetracker.application.model.Debt;
import com.expensetracker.application.model.User;
import com.expensetracker.application.repository.DebtRepository;
import com.expensetracker.application.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/debts")
@CrossOrigin(origins = "*")
public class DebtController {

    @Autowired
    private DebtRepository debtRepository;

    @Autowired
    private UserRepository userRepository;

    private User validateUser(Long userId) {
        if (userId == null) {
            throw new APIException("Unauthorized status: X-User-Id header missing");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    }

    @PostMapping("/add")
    public ResponseEntity<Debt> addDebt(@RequestHeader("X-User-Id") Long userId, @Valid @RequestBody Debt debt) {
        User user = validateUser(userId);
        debt.setUser(user);
        Debt savedDebt = debtRepository.save(debt);
        return new ResponseEntity<>(savedDebt, HttpStatus.CREATED);
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<Debt>> getAllDebts(@RequestHeader("X-User-Id") Long userId) {
        validateUser(userId);
        List<Debt> debts = debtRepository.findByUser_UserIdOrderByDueDateDesc(userId);
        return new ResponseEntity<>(debts, HttpStatus.OK);
    }

    @PutMapping("/update/{debtId}")
    public ResponseEntity<Debt> updateDebt(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long debtId,
            @Valid @RequestBody Debt updatedDebt) {
        validateUser(userId);

        Debt debt = debtRepository.findById(debtId)
                .orElseThrow(() -> new ResourceNotFoundException("Debt", "debtId", debtId));

        if (debt.getUser() != null && !debt.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized debt access");
        }

        debt.setPersonName(updatedDebt.getPersonName());
        debt.setAmount(updatedDebt.getAmount());
        debt.setType(updatedDebt.getType());
        debt.setDescription(updatedDebt.getDescription());
        debt.setDueDate(updatedDebt.getDueDate());

        Debt saved = debtRepository.save(debt);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{debtId}")
    public ResponseEntity<Debt> deleteDebt(@RequestHeader("X-User-Id") Long userId, @PathVariable Long debtId) {
        validateUser(userId);

        Debt debt = debtRepository.findById(debtId)
                .orElseThrow(() -> new ResourceNotFoundException("Debt", "debtId", debtId));

        if (debt.getUser() != null && !debt.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized debt access");
        }

        debtRepository.delete(debt);
        return new ResponseEntity<>(debt, HttpStatus.OK);
    }

    @DeleteMapping("/delete/all")
    public ResponseEntity<String> deleteAllDebts(@RequestHeader("X-User-Id") Long userId) {
        validateUser(userId);
        List<Debt> userDebts = debtRepository.findByUser_UserIdOrderByDueDateDesc(userId);
        debtRepository.deleteAll(userDebts);
        return new ResponseEntity<>("All debts deleted successfully", HttpStatus.OK);
    }
}
