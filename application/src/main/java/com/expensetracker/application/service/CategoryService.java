package com.expensetracker.application.service;

import com.expensetracker.application.payload.CategoryDTO;
import com.expensetracker.application.payload.CategoryResponse;

public interface CategoryService {

    CategoryResponse getAllCategories(Long userId);

    CategoryDTO addCategory(CategoryDTO categoryDTO, Long userId);

    CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO, Long userId);

    String deleteAllCategory(Long userId);

    CategoryDTO deleteCategory(Long categoryId, Long userId);
}
