/**
 * Simple form validation utilities
 * Provides validation functions for common form fields
 */

// Validation result type
export class ValidationResult {
  constructor(isValid, errors = []) {
    this.isValid = isValid;
    this.errors = errors;
  }

  static success() {
    return new ValidationResult(true, []);
  }

  static failure(errors) {
    return new ValidationResult(false, Array.isArray(errors) ? errors : [errors]);
  }
}

// Individual field validators
export const validators = {
  required(value, fieldName = 'Field') {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return ValidationResult.failure(`${fieldName} is required`);
    }
    return ValidationResult.success();
  },

  email(value) {
    if (!value) return ValidationResult.success(); // Allow empty if not required
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return ValidationResult.failure('Please enter a valid email address');
    }
    return ValidationResult.success();
  },

  phone(value) {
    if (!value) return ValidationResult.success(); // Allow empty if not required
    
    // Simple phone validation - allows various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
    
    if (!phoneRegex.test(cleanPhone)) {
      return ValidationResult.failure('Please enter a valid phone number');
    }
    return ValidationResult.success();
  },

  minLength(value, minLength) {
    if (!value) return ValidationResult.success(); // Allow empty if not required
    
    if (value.length < minLength) {
      return ValidationResult.failure(`Must be at least ${minLength} characters`);
    }
    return ValidationResult.success();
  },

  maxLength(value, maxLength) {
    if (!value) return ValidationResult.success(); // Allow empty if not required
    
    if (value.length > maxLength) {
      return ValidationResult.failure(`Must be no more than ${maxLength} characters`);
    }
    return ValidationResult.success();
  },

  numeric(value) {
    if (!value) return ValidationResult.success(); // Allow empty if not required
    
    if (isNaN(value) || isNaN(parseFloat(value))) {
      return ValidationResult.failure('Must be a valid number');
    }
    return ValidationResult.success();
  },

  range(value, min, max) {
    if (!value) return ValidationResult.success(); // Allow empty if not required
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return ValidationResult.failure('Must be a valid number');
    }
    
    if (numValue < min || numValue > max) {
      return ValidationResult.failure(`Must be between ${min} and ${max}`);
    }
    return ValidationResult.success();
  },
};

// Form validator class
export class FormValidator {
  constructor() {
    this.rules = {};
  }

  // Add validation rule for a field
  addRule(fieldName, validationFn) {
    if (!this.rules[fieldName]) {
      this.rules[fieldName] = [];
    }
    this.rules[fieldName].push(validationFn);
    return this; // For chaining
  }

  // Validate all fields
  validate(formData) {
    const errors = {};
    let isValid = true;

    for (const [fieldName, validationFns] of Object.entries(this.rules)) {
      const fieldValue = formData[fieldName];
      const fieldErrors = [];

      for (const validationFn of validationFns) {
        const result = validationFn(fieldValue);
        if (!result.isValid) {
          fieldErrors.push(...result.errors);
          isValid = false;
        }
      }

      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
      }
    }

    return {
      isValid,
      errors,
    };
  }

  // Validate single field
  validateField(fieldName, value) {
    const validationFns = this.rules[fieldName] || [];
    const fieldErrors = [];

    for (const validationFn of validationFns) {
      const result = validationFn(value);
      if (!result.isValid) {
        fieldErrors.push(...result.errors);
      }
    }

    return {
      isValid: fieldErrors.length === 0,
      errors: fieldErrors,
    };
  }
}

// Predefined validators for common entities
export const clientValidator = new FormValidator()
  .addRule('full_name', (value) => validators.required(value, 'Full name'))
  .addRule('full_name', (value) => validators.minLength(value, 2))
  .addRule('email', (value) => validators.email(value))
  .addRule('phone', (value) => validators.required(value, 'Phone number'))
  .addRule('phone', (value) => validators.phone(value))
  .addRule('budget_min', (value) => validators.numeric(value))
  .addRule('budget_max', (value) => validators.numeric(value));

export const activityValidator = new FormValidator()
  .addRule('title', (value) => validators.required(value, 'Title'))
  .addRule('title', (value) => validators.minLength(value, 3))
  .addRule('description', (value) => validators.maxLength(value, 500))
  .addRule('action_type', (value) => validators.required(value, 'Action type'));

// Utility function to format validation errors for display
export function formatValidationErrors(errors) {
  const formatted = {};
  
  for (const [fieldName, fieldErrors] of Object.entries(errors)) {
    formatted[fieldName] = fieldErrors.join(', ');
  }
  
  return formatted;
}

// Hook for form validation
export function useFormValidation(validator) {
  const [errors, setErrors] = React.useState({});
  const [isValid, setIsValid] = React.useState(true);

  const validateForm = (formData) => {
    const result = validator.validate(formData);
    setErrors(formatValidationErrors(result.errors));
    setIsValid(result.isValid);
    return result;
  };

  const validateField = (fieldName, value) => {
    const result = validator.validateField(fieldName, value);
    setErrors(prev => ({
      ...prev,
      [fieldName]: result.errors.join(', ') || undefined
    }));
    return result;
  };

  const clearErrors = () => {
    setErrors({});
    setIsValid(true);
  };

  const clearFieldError = (fieldName) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[fieldName];
      return newErrors;
    });
  };

  return {
    errors,
    isValid,
    validateForm,
    validateField,
    clearErrors,
    clearFieldError,
  };
}