package com.expensetracker.application.service;

import com.expensetracker.application.payload.CategoryDTO;
import com.expensetracker.application.payload.CategoryResponse;
import com.expensetracker.application.payload.ExpenseDTO;
import org.springframework.stereotype.Service;

@Service
public interface CategoryService {


    CategoryResponse getAllCategories();

    CategoryDTO addCategory(CategoryDTO categoryDTO);

    CategoryDTO updateCategory(Long categoryId,CategoryDTO categoryDTO);

    String deleteAllCategory();

    CategoryDTO deleteCategory(Long categoryId);
}
