/**
 * Shared validation utilities for the application
 * Used by both frontend and backend for consistent validation
 */

/**
 * Validates password strength
 * @param {string} password - Password to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password) {
    errors.push("Password is required");
    return { isValid: false, errors };
  }
  
  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }
  
  if (password.length > 50) {
    errors.push("Password must not exceed 50 characters");
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push("Password must contain at least one number");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates email format
 * @param {string} email - Email to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateEmail = (email) => {
  const errors = [];
  
  if (!email) {
    errors.push("Email is required");
    return { isValid: false, errors };
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errors.push("Please enter a valid email address");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates username
 * @param {string} username - Username to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateUsername = (username) => {
  const errors = [];
  
  if (!username) {
    errors.push("Username is required");
    return { isValid: false, errors };
  }
  
  if (username.length < 3) {
    errors.push("Username must be at least 3 characters");
  }
  
  if (username.length > 20) {
    errors.push("Username must not exceed 20 characters");
  }
  
  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.push("Username can only contain letters, numbers and underscore");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates name
 * @param {string} name - Name to validate
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validateName = (name) => {
  const errors = [];
  
  if (!name || !name.trim()) {
    errors.push("Name is required");
    return { isValid: false, errors };
  }
  
  if (name.trim().length < 2) {
    errors.push("Name must be at least 2 characters");
  }
  
  if (name.trim().length > 50) {
    errors.push("Name must not exceed 50 characters");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates password confirmation
 * @param {string} password - Original password
 * @param {string} confirmPassword - Confirmation password
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export const validatePasswordConfirmation = (password, confirmPassword) => {
  const errors = [];
  
  if (!confirmPassword) {
    errors.push("Please confirm your password");
    return { isValid: false, errors };
  }
  
  if (password !== confirmPassword) {
    errors.push("Passwords do not match");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Validates form data for registration
 * @param {Object} formData - Form data object
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validateRegistrationForm = (formData) => {
  const errors = {};
  
  // Validate name
  const nameValidation = validateName(formData.name);
  if (!nameValidation.isValid) {
    errors.name = nameValidation.errors[0];
  }
  
  // Validate username
  const usernameValidation = validateUsername(formData.username);
  if (!usernameValidation.isValid) {
    errors.username = usernameValidation.errors[0];
  }
  
  // Validate email
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.errors[0];
  }
  
  // Validate password
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.errors[0];
  }
  
  // Validate password confirmation
  const confirmPasswordValidation = validatePasswordConfirmation(
    formData.password, 
    formData.confirmPassword
  );
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.errors[0];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Validates form data for password reset
 * @param {Object} formData - Form data object
 * @returns {Object} - { isValid: boolean, errors: Object }
 */
export const validatePasswordResetForm = (formData) => {
  const errors = {};
  
  // Validate current password
  if (!formData.currentPassword) {
    errors.currentPassword = "Current password is required";
  }
  
  // Validate new password
  const passwordValidation = validatePassword(formData.newPassword);
  if (!passwordValidation.isValid) {
    errors.newPassword = passwordValidation.errors[0];
  }
  
  // Validate password confirmation
  const confirmPasswordValidation = validatePasswordConfirmation(
    formData.newPassword, 
    formData.confirmPassword
  );
  if (!confirmPasswordValidation.isValid) {
    errors.confirmPassword = confirmPasswordValidation.errors[0];
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
