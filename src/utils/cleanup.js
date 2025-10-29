/**
 * Code Cleanup Utilities
 * Functions to clean up and optimize code
 */

/**
 * @param {string} code - Code string
 * @returns {string} - Cleaned code
 */
export const removeConsoleLogs = (code) => {
  return code.replace(/console\.log\([^)]*\);?\s*/g, '');
};

/**
 * Remove debug statements
 * @param {string} code - Code string
 * @returns {string} - Cleaned code
 */
export const removeDebugStatements = (code) => {
  const debugPatterns = [
    /console\.debug\([^)]*\);?\s*/g,
    /console\.info\([^)]*\);?\s*/g,
    /debugger;?\s*/g,
    /\/\*\s*DEBUG[^*]*\*\/\s*/g,
    /\/\/\s*DEBUG.*$/gm
  ];
  
  let cleanedCode = code;
  debugPatterns.forEach(pattern => {
    cleanedCode = cleanedCode.replace(pattern, '');
  });
  
  return cleanedCode;
};

/**
 * Remove unused imports
 * @param {string} code - Code string
 * @param {Array} usedImports - Array of used import names
 * @returns {string} - Cleaned code
 */
export const removeUnusedImports = (code, usedImports = []) => {
  // This is a simplified version - in a real scenario, you'd use AST parsing
  const importRegex = /import\s+{([^}]+)}\s+from\s+['"][^'"]+['"];?/g;
  
  return code.replace(importRegex, (match, imports) => {
    const importList = imports.split(',').map(imp => imp.trim());
    const usedImportsList = importList.filter(imp => 
      usedImports.some(used => imp.includes(used))
    );
    
    if (usedImportsList.length === 0) {
      return ''; // Remove entire import if no imports are used
    }
    
    return match.replace(imports, usedImportsList.join(', '));
  });
};

/**
 * Optimize object destructuring
 * @param {string} code - Code string
 * @returns {string} - Optimized code
 */
export const optimizeDestructuring = (code) => {
  // Replace verbose object access with destructuring where appropriate
  // This is a simplified example
  return code.replace(
    /const\s+(\w+)\s*=\s*(\w+)\.(\w+);\s*const\s+(\w+)\s*=\s*(\w+)\.(\w+);/g,
    'const { $3: $1, $6: $4 } = $2;'
  );
};

/**
 * Remove empty functions and unused variables
 * @param {string} code - Code string
 * @returns {string} - Cleaned code
 */
export const removeEmptyCode = (code) => {
  const patterns = [
    /const\s+\w+\s*=\s*\(\)\s*=>\s*{};?\s*/g, // Empty arrow functions
    /function\s+\w+\s*\(\s*\)\s*{\s*}\s*/g, // Empty functions
    /const\s+\w+\s*=\s*\[\];?\s*/g, // Empty arrays
    /const\s+\w+\s*=\s*{};?\s*/g, // Empty objects
    /\/\*\s*EMPTY[^*]*\*\/\s*/g, // Empty comments
  ];
  
  let cleanedCode = code;
  patterns.forEach(pattern => {
    cleanedCode = cleanedCode.replace(pattern, '');
  });
  
  return cleanedCode;
};

/**
 * Format and clean code
 * @param {string} code - Code string
 * @param {Object} options - Cleanup options
 * @returns {string} - Cleaned code
 */
export const cleanCode = (code, options = {}) => {
  const {
    removeConsoleLogs: removeLogs = true,
    removeDebug = true,
    removeEmpty = true,
    optimizeDestructuring: optimize = false
  } = options;
  
  let cleanedCode = code;
  
  if (removeLogs) {
    cleanedCode = removeConsoleLogs(cleanedCode);
  }
  
  if (removeDebug) {
    cleanedCode = removeDebugStatements(cleanedCode);
  }
  
  if (removeEmpty) {
    cleanedCode = removeEmptyCode(cleanedCode);
  }
  
  if (optimize) {
    cleanedCode = optimizeDestructuring(cleanedCode);
  }
  
  return cleanedCode;
};

/**
 * Production-ready code cleanup
 * @param {string} code - Code string
 * @returns {string} - Production-ready code
 */
export const productionCleanup = (code) => {
  return cleanCode(code, {
    removeConsoleLogs: true,
    removeDebug: true,
    removeEmpty: true,
    optimizeDestructuring: true
  });
};
