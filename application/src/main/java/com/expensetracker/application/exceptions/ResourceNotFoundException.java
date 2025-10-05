package com.expensetracker.application.exceptions;

import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;


public class ResourceNotFoundException extends RuntimeException{

    String resourceName;
    String field;
    String fieldName;
    Long fieldId;

    public ResourceNotFoundException(String resourceName, String field, String fieldName) {
        super(String.format("%s not found with %s: %s",resourceName,field,fieldName));
        this.resourceName = resourceName;
        this.field = field;
        this.fieldName = fieldName;
    }



    public ResourceNotFoundException(String resourceName, String field, Long fieldId) {
        super(String.format("%s not found with %s: %d",resourceName,field,fieldId));
    }


    public ResourceNotFoundException(String message) {
        super(message);
    }
}
