package com.expensetracker.application.service;

import com.expensetracker.application.exceptions.APIException;
import com.expensetracker.application.exceptions.ResourceNotFoundException;
import com.expensetracker.application.model.Category;
import com.expensetracker.application.model.User;
import com.expensetracker.application.payload.CategoryDTO;
import com.expensetracker.application.payload.CategoryResponse;
import com.expensetracker.application.repository.CategoryRepository;
import com.expensetracker.application.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImp implements CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    UserRepository userRepository;

    private CategoryDTO toCategoryDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setCategoryName(category.getCategoryName());
        return dto;
    }

    private User validateUser(Long userId) {
        if (userId == null) {
            throw new APIException("Unauthorized status: X-User-Id header missing");
        }
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));
    }

    @Override
    public CategoryResponse getAllCategories(Long userId) {
        validateUser(userId);
        List<CategoryDTO> categoryDTOS = categoryRepository.findByUser_UserId(userId).stream()
                .map(this::toCategoryDTO)
                .toList();
        return new CategoryResponse(categoryDTOS);
    }

    @Override
    public CategoryDTO addCategory(CategoryDTO categoryDTO, Long userId) {
        User user = validateUser(userId);
        Category existingCategory = categoryRepository.findByCategoryNameIgnoreCaseAndUser_UserId(categoryDTO.getCategoryName(), userId);

        if (existingCategory != null) {
            throw new APIException("Category with name " + existingCategory.getCategoryName() + " already exists");
        }

        Category category = new Category();
        category.setCategoryName(categoryDTO.getCategoryName().trim());
        category.setUser(user);
        Category savedCategory = categoryRepository.save(category);
        return toCategoryDTO(savedCategory);
    }

    @Override
    public CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO, Long userId) {
        validateUser(userId);
        Category savedCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        if (savedCategory.getUser() != null && !savedCategory.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized category access");
        }

        savedCategory.setCategoryName(categoryDTO.getCategoryName().trim());
        savedCategory = categoryRepository.save(savedCategory);
        return toCategoryDTO(savedCategory);
    }

    @Override
    public String deleteAllCategory(Long userId) {
        validateUser(userId);
        List<Category> categories = categoryRepository.findByUser_UserId(userId);
        categoryRepository.deleteAll(categories);
        return "Categories deleted successfully";
    }

    @Override
    public CategoryDTO deleteCategory(Long categoryId, Long userId) {
        validateUser(userId);
        Category savedCategory = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", categoryId));

        if (savedCategory.getUser() != null && !savedCategory.getUser().getUserId().equals(userId)) {
            throw new APIException("Unauthorized category access");
        }

        categoryRepository.delete(savedCategory);
        return toCategoryDTO(savedCategory);
    }
}
