package com.expensetracker.application.repository;

import com.expensetracker.application.model.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findByUser_UserIdOrderByNextPaymentDateAsc(Long userId);
}
