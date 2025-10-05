package com.expensetracker.application.controller;

import com.expensetracker.application.model.Category;
import com.expensetracker.application.payload.CategoryDTO;
import com.expensetracker.application.payload.CategoryResponse;
import com.expensetracker.application.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/category")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    //view all categories
    @GetMapping("/get/categories")
    public ResponseEntity<CategoryResponse> getCategories(){

        CategoryResponse status= categoryService.getAllCategories();
        return new ResponseEntity<>(status, HttpStatus.OK);

    }

    //add a category
    @PostMapping("/add/category")
    public ResponseEntity<CategoryDTO> addCategory(@RequestBody CategoryDTO categoryDTO){

        CategoryDTO status= categoryService.addCategory(categoryDTO);
        return new ResponseEntity<>(status, HttpStatus.OK);

    }

    //update catgeory
    @PutMapping("/update/category/{categoryId}")
    public ResponseEntity<CategoryDTO> updateCategory(@Valid @PathVariable Long categoryId, @RequestBody CategoryDTO categoryDTO){

        CategoryDTO status= categoryService.updateCategory(categoryId,categoryDTO);
        return new ResponseEntity<>(status, HttpStatus.OK);

    }

    //delete all category
    @DeleteMapping("/delete/all")
    public ResponseEntity<String> deleteAll(){

        String status= categoryService.deleteAllCategory();
        return new ResponseEntity<>(status, HttpStatus.OK);

    }

    //delete category
    @DeleteMapping("/delete/id/{categoryId}")
    public ResponseEntity<CategoryDTO> deleteCategory(@PathVariable Long categoryId){

        CategoryDTO status= categoryService.deleteCategory(categoryId);
        return new ResponseEntity<>(status, HttpStatus.OK);
    }
}
