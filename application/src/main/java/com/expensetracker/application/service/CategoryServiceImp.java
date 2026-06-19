package com.expensetracker.application.service;

import com.expensetracker.application.exceptions.APIException;
import com.expensetracker.application.exceptions.ResourceNotFoundException;
import com.expensetracker.application.model.Category;
import com.expensetracker.application.payload.CategoryDTO;
import com.expensetracker.application.payload.CategoryResponse;
import com.expensetracker.application.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImp implements CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    private CategoryDTO toCategoryDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setCategoryName(category.getCategoryName());
        return dto;
    }

    @Override
    public CategoryResponse getAllCategories() {
        List<CategoryDTO> categoryDTOS = categoryRepository.findAll().stream()
                .map(this::toCategoryDTO)
                .toList();
        return new CategoryResponse(categoryDTOS);
    }

    @Override
    public CategoryDTO addCategory(CategoryDTO categoryDTO) {
        Category existingCategory = categoryRepository.findByCategoryNameIgnoreCase(categoryDTO.getCategoryName());

        if (existingCategory != null) {
            throw new APIException("Category with name " + existingCategory.getCategoryName() + " already exists");
        }

        Category category = new Category();
        category.setCategoryName(categoryDTO.getCategoryName().trim());
        Category savedCategory = categoryRepository.save(category);
        return toCategoryDTO(savedCategory);
    }

    @Override
    public CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO) {
        Category savedCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        savedCategory.setCategoryName(categoryDTO.getCategoryName().trim());
        savedCategory = categoryRepository.save(savedCategory);
        return toCategoryDTO(savedCategory);
    }

    @Override
    public String deleteAllCategory() {
        categoryRepository.deleteAll();
        return "Categories deleted successfully";
    }

    @Override
    public CategoryDTO deleteCategory(Long categoryId) {
        Category savedCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        categoryRepository.delete(savedCategory);
        return toCategoryDTO(savedCategory);
    }
}
