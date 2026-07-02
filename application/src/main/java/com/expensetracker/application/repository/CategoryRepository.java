package com.expensetracker.application.repository;

import com.expensetracker.application.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category,Long> {

    Category findByCategoryNameIgnoreCase(String categoryName);
    Category findByCategoryNameIgnoreCaseAndUser_UserId(String categoryName, Long userId);
    java.util.List<Category> findByUser_UserId(Long userId);
}
