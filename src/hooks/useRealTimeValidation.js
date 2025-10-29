/**
 * Custom hook for real-time validation
 * Combines frontend validation with backend validation
 */

import { useState, useCallback, useRef } from 'react';

// Custom debounce function
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
import { 
  validateEmail, 
  validateUsername, 
  validatePassword,
  validateName 
} from '@/utils/validation';
import { 
  checkEmail, 
  checkUsername, 
  checkPassword 
} from '@/services/validation';

export const useRealTimeValidation = () => {
  const [validationResults, setValidationResults] = useState({});
  const [isValidating, setIsValidating] = useState(false);
  const debounceTimers = useRef({});

  // Debounced validation functions
  const debouncedEmailValidation = useCallback(
    debounce(async (email) => {
      if (!email) return;
      
      setIsValidating(true);
      
      // Frontend validation first
      const frontendResult = validateEmail(email);
      if (!frontendResult.isValid) {
        setValidationResults(prev => ({
          ...prev,
          email: { isValid: false, message: frontendResult.errors[0], source: 'frontend' }
        }));
        setIsValidating(false);
        return;
      }
      
      // Backend validation
      try {
        const backendResult = await checkEmail(email);
        setValidationResults(prev => ({
          ...prev,
          email: { ...backendResult, source: 'backend' }
        }));
      } catch (error) {
        setValidationResults(prev => ({
          ...prev,
          email: { isValid: false, message: 'Network error', source: 'backend' }
        }));
      }
      
      setIsValidating(false);
    }, 500),
    []
  );

  const debouncedUsernameValidation = useCallback(
    debounce(async (username) => {
      if (!username) return;
      
      setIsValidating(true);
      
      // Frontend validation first
      const frontendResult = validateUsername(username);
      if (!frontendResult.isValid) {
        setValidationResults(prev => ({
          ...prev,
          username: { isValid: false, message: frontendResult.errors[0], source: 'frontend' }
        }));
        setIsValidating(false);
        return;
      }
      
      // Backend validation
      try {
        const backendResult = await checkUsername(username);
        setValidationResults(prev => ({
          ...prev,
          username: { ...backendResult, source: 'backend' }
        }));
      } catch (error) {
        setValidationResults(prev => ({
          ...prev,
          username: { isValid: false, message: 'Network error', source: 'backend' }
        }));
      }
      
      setIsValidating(false);
    }, 500),
    []
  );

  const debouncedPasswordValidation = useCallback(
    debounce(async (password) => {
      if (!password) return;
      
      setIsValidating(true);
      
      // Frontend validation first
      const frontendResult = validatePassword(password);
      if (!frontendResult.isValid) {
        setValidationResults(prev => ({
          ...prev,
          password: { isValid: false, message: frontendResult.errors[0], source: 'frontend' }
        }));
        setIsValidating(false);
        return;
      }
      
      // Backend validation
      try {
        const backendResult = await checkPassword(password);
        setValidationResults(prev => ({
          ...prev,
          password: { ...backendResult, source: 'backend' }
        }));
      } catch (error) {
        setValidationResults(prev => ({
          ...prev,
          password: { isValid: false, message: 'Network error', source: 'backend' }
        }));
      }
      
      setIsValidating(false);
    }, 500),
    []
  );

  // Validation functions
  const validateField = useCallback((field, value) => {
    // Clear previous timer
    if (debounceTimers.current[field]) {
      clearTimeout(debounceTimers.current[field]);
    }
    
    switch (field) {
      case 'email':
        debouncedEmailValidation(value);
        break;
      case 'username':
        debouncedUsernameValidation(value);
        break;
      case 'password':
        debouncedPasswordValidation(value);
        break;
      case 'name':
        // Name validation is simple, no need for backend
        const nameResult = validateName(value);
        setValidationResults(prev => ({
          ...prev,
          name: { 
            isValid: nameResult.isValid, 
            message: nameResult.isValid ? '' : nameResult.errors[0],
            source: 'frontend'
          }
        }));
        break;
      default:
        break;
    }
  }, [debouncedEmailValidation, debouncedUsernameValidation, debouncedPasswordValidation]);

  // Clear validation results
  const clearValidation = useCallback((field) => {
    setValidationResults(prev => {
      const newResults = { ...prev };
      delete newResults[field];
      return newResults;
    });
  }, []);

  // Get validation result for a field
  const getValidationResult = useCallback((field) => {
    return validationResults[field] || { isValid: true, message: '', source: 'none' };
  }, [validationResults]);

  // Check if all fields are valid
  const isFormValid = useCallback((fields) => {
    return fields.every(field => {
      const result = validationResults[field];
      return result ? result.isValid : true;
    });
  }, [validationResults]);

  return {
    validationResults,
    isValidating,
    validateField,
    clearValidation,
    getValidationResult,
    isFormValid
  };
};
