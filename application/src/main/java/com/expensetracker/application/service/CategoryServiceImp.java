package com.expensetracker.application.service;

import com.expensetracker.application.exceptions.APIException;
import com.expensetracker.application.exceptions.ResourceNotFoundException;
import com.expensetracker.application.model.Category;
import com.expensetracker.application.model.Expense;
import com.expensetracker.application.payload.CategoryDTO;
import com.expensetracker.application.payload.CategoryResponse;
import com.expensetracker.application.payload.ExpenseDTO;
import com.expensetracker.application.payload.ExpenseResponse;
import com.expensetracker.application.repository.CategoryRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoryServiceImp implements CategoryService {

    @Autowired
    CategoryRepository categoryRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public CategoryResponse getAllCategories() {
        List<CategoryDTO> categoryDTOS= categoryRepository.findAll().stream()
                .map(category->modelMapper.map(category, CategoryDTO.class))
                .toList();

        CategoryResponse categoryResponse= new CategoryResponse();
        categoryResponse.setCategory(categoryDTOS);
        return categoryResponse;
    }

    @Override
    public CategoryDTO addCategory(CategoryDTO categoryDTO) {
        Category category=modelMapper.map(categoryDTO,Category.class);

        Category existingCategory=categoryRepository.findByCategoryNameIgnoreCase(category.getCategoryName());

        if(existingCategory!=null){
            throw new APIException("Category with name  " + existingCategory.getCategoryName()+ " already exists");
        }

        Category savedCategory = categoryRepository.save(category);
        return modelMapper.map(savedCategory,CategoryDTO.class);
    }

    @Override
    public CategoryDTO updateCategory(Long categoryId,CategoryDTO categoryDTO) {

        Category updatedCategory=modelMapper.map(categoryDTO,Category.class);
        Category savedCategory=categoryRepository.findById(categoryId)
                .orElseThrow(()->new ResourceNotFoundException("Category","categoryId",categoryId));

        savedCategory.setCategoryName(updatedCategory.getCategoryName());
        savedCategory=categoryRepository.save(savedCategory);
        return modelMapper.map(savedCategory,CategoryDTO.class);

  
    }

    @Override
    public String deleteAllCategory() {
        List<Category> savedCategory=categoryRepository.findAll();
        categoryRepository.deleteAll(savedCategory);
        return "Expense deleted successfully";
    }

    @Override
    public CategoryDTO deleteCategory(Long categoryId) {
        Category savedCategory=categoryRepository.findById(categoryId)
                .orElseThrow(()->new ResourceNotFoundException("Expense","expenseId",categoryId));

        categoryRepository.delete(savedCategory);
        return modelMapper.map(savedCategory,CategoryDTO.class);
    }
}
