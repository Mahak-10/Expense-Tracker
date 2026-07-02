package com.expensetracker.application.controller;

import com.expensetracker.application.exceptions.APIException;
import com.expensetracker.application.exceptions.ResourceNotFoundException;
import com.expensetracker.application.model.Subscription;
import com.expensetracker.application.model.User;
import com.expensetracker.application.repository.SubscriptionRepository;
import com.expensetracker.application.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/subscriptions")
@CrossOrigin(origins = "*")
public class SubscriptionController {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private UserRepository userRepository;

    private User validateUser(Long userId) {
        if (userId == null) {
            throw new APIException("Unauthorized status: X-User-Id header missing");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    }

    @GetMapping("/get/all")
    public ResponseEntity<List<Subscription>> getAllSubscriptions(@RequestHeader("X-User-Id") Long userId) {
        validateUser(userId);
        List<Subscription> subs = subscriptionRepository.findByUser_UserIdOrderByNextPaymentDateAsc(userId);
        return new ResponseEntity<>(subs, HttpStatus.OK);
    }

    @PostMapping("/add")
    public ResponseEntity<Subscription> addSubscription(
            @RequestHeader("X-User-Id") Long userId,
            @Valid @RequestBody Subscription sub) {
        User user = validateUser(userId);
        sub.setUser(user);
        Subscription saved = subscriptionRepository.save(sub);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/update/{subscriptionId}")
    public ResponseEntity<Subscription> updateSubscription(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long subscriptionId,
            @Valid @RequestBody Subscription updated) {
        validateUser(userId);

        Subscription sub = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", "subscriptionId", subscriptionId));

        if (sub.getUser() != null && !sub.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized subscription access");
        }

        sub.setServiceName(updated.getServiceName());
        sub.setAmount(updated.getAmount());
        sub.setBillingCycle(updated.getBillingCycle());
        sub.setNextPaymentDate(updated.getNextPaymentDate());

        Subscription saved = subscriptionRepository.save(sub);
        return new ResponseEntity<>(saved, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{subscriptionId}")
    public ResponseEntity<Subscription> deleteSubscription(
            @RequestHeader("X-User-Id") Long userId,
            @PathVariable Long subscriptionId) {
        validateUser(userId);

        Subscription sub = subscriptionRepository.findById(subscriptionId)
                .orElseThrow(() -> new ResourceNotFoundException("Subscription", "subscriptionId", subscriptionId));

        if (sub.getUser() != null && !sub.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized subscription access");
        }

        subscriptionRepository.delete(sub);
        return new ResponseEntity<>(sub, HttpStatus.OK);
    }

    @DeleteMapping("/delete/all")
    public ResponseEntity<String> deleteAllSubscriptions(@RequestHeader("X-User-Id") Long userId) {
        validateUser(userId);
        List<Subscription> subs = subscriptionRepository.findByUser_UserIdOrderByNextPaymentDateAsc(userId);
        subscriptionRepository.deleteAll(subs);
        return new ResponseEntity<>("All subscriptions deleted successfully", HttpStatus.OK);
    }
}
