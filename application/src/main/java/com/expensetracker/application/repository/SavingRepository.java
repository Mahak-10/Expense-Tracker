package com.expensetracker.application.repository;

import com.expensetracker.application.model.Saving;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SavingRepository extends JpaRepository<Saving, Long> {
    List<Saving> findByUser_UserIdOrderByDateDesc(Long userId);

    @Query("SELECT SUM(s.amount) FROM Saving s WHERE s.user.userId = :userId")
    Double getTotalSavingsByUser(@Param("userId") Long userId);

    @Query("SELECT SUM(s.amount) FROM Saving s WHERE s.user.userId = :userId AND EXTRACT(MONTH FROM s.date) = :month AND EXTRACT(YEAR FROM s.date) = :year")
    Double getMonthlySavingsByUser(@Param("userId") Long userId, @Param("month") int month, @Param("year") int year);
}
