package com.expensetracker.application.controller;

import com.expensetracker.application.exceptions.APIException;
import com.expensetracker.application.exceptions.ResourceNotFoundException;
import com.expensetracker.application.model.Saving;
import com.expensetracker.application.model.User;
import com.expensetracker.application.payload.SavingDTO;
import com.expensetracker.application.payload.SavingResponse;
import com.expensetracker.application.repository.SavingRepository;
import com.expensetracker.application.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/savings")
public class SavingController {

    @Autowired
    private SavingRepository savingRepository;

    @Autowired
    private UserRepository userRepository;

    private SavingDTO toSavingDTO(Saving saving) {
        SavingDTO dto = new SavingDTO();
        dto.setSavingId(saving.getSavingId());
        dto.setAmount(saving.getAmount());
        dto.setDescription(saving.getDescription());
        dto.setDate(saving.getDate());
        return dto;
    }

    private User validateUser(Long userId) {
        if (userId == null) {
            throw new APIException("Unauthorized status: X-User-Id header missing");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    }

    @PostMapping("/add")
    public ResponseEntity<SavingDTO> addSaving(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody SavingDTO dto) {
        User user = validateUser(userId);

        Saving saving = new Saving();
        saving.setAmount(dto.getAmount());
        saving.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : "");
        saving.setUser(user);
        if (dto.getDate() != null) {
            saving.setDate(dto.getDate());
        }

        Saving savedSaving = savingRepository.save(saving);
        return new ResponseEntity<>(toSavingDTO(savedSaving), HttpStatus.CREATED);
    }

    @GetMapping("/get/all")
    public ResponseEntity<SavingResponse> getAllSavings(@RequestHeader("X-User-Id") Long userId) {
        validateUser(userId);
        List<SavingDTO> list = savingRepository.findByUser_UserIdOrderByDateDesc(userId).stream()
                .map(this::toSavingDTO)
                .toList();
        return new ResponseEntity<>(new SavingResponse(list), HttpStatus.OK);
    }

    @PutMapping("/update/{savingId}")
    public ResponseEntity<SavingDTO> updateSaving(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long savingId,
            @Valid @RequestBody SavingDTO dto) {
        validateUser(userId);
        Saving saving = savingRepository.findById(savingId)
                .orElseThrow(() -> new ResourceNotFoundException("Saving", "savingId", savingId));

        if (saving.getUser() != null && !saving.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized saving access");
        }

        saving.setAmount(dto.getAmount());
        saving.setDescription(dto.getDescription() != null ? dto.getDescription().trim() : "");
        if (dto.getDate() != null) {
            saving.setDate(dto.getDate());
        }

        Saving updatedSaving = savingRepository.save(saving);
        return new ResponseEntity<>(toSavingDTO(updatedSaving), HttpStatus.OK);
    }

    @DeleteMapping("/delete/{savingId}")
    public ResponseEntity<SavingDTO> deleteSaving(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long savingId) {
        validateUser(userId);
        Saving saving = savingRepository.findById(savingId)
                .orElseThrow(() -> new ResourceNotFoundException("Saving", "savingId", savingId));

        if (saving.getUser() != null && !saving.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized saving access");
        }

        savingRepository.delete(saving);
        return new ResponseEntity<>(toSavingDTO(saving), HttpStatus.OK);
    }

    @DeleteMapping("/delete/all")
    public ResponseEntity<String> deleteAllSavings(@RequestHeader("X-User-Id") Long userId) {
        validateUser(userId);
        List<Saving> userSavings = savingRepository.findByUser_UserIdOrderByDateDesc(userId);
        savingRepository.deleteAll(userSavings);
        return new ResponseEntity<>("Savings deleted successfully", HttpStatus.OK);
    }
}
