/**
 * Connection utilities for checking network health
 */

/**
 * Check if backend is reachable
 * @param {string} baseUrl - API base URL
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<boolean>} True if backend is reachable
 */
export const checkBackendHealth = async (baseUrl, timeout = 5000) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(`${baseUrl}/health`, {
      method: 'GET',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    return false;
  }
};

/**
 * Check specific upload endpoint
 * @param {string} baseUrl - API base URL
 * @param {string} endpoint - Upload endpoint
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Object>} Endpoint check result
 */
export const checkUploadEndpoint = async (baseUrl, endpoint = '/health', timeout = 10000) => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    // Use GET instead of OPTIONS to avoid CORS issues
    const response = await fetch(`${baseUrl}${endpoint}`, {
      method: 'GET', // Use GET to check if endpoint exists
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    clearTimeout(timeoutId);
    
    return {
      reachable: true,
      status: response.status,
      headers: Object.fromEntries(response.headers.entries()),
      endpoint: endpoint
    };
  } catch (error) {
    return {
      reachable: false,
      error: error.message,
      endpoint: endpoint
    };
  }
};

/**
 * Check network connection quality
 * @param {string} apiBaseUrl - API base URL
 * @returns {Promise<Object>} Connection quality info
 */
export const checkConnectionQuality = async (apiBaseUrl = 'http://localhost:3000') => {
  const startTime = performance.now();
  
  try {
    // Test with our own API health endpoint instead of external service
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    const response = await fetch(`${apiBaseUrl}/health`, {
      method: 'GET',
      mode: 'cors',
      cache: 'no-cache',
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    const endTime = performance.now();
    const responseTime = endTime - startTime;
    
    return {
      isOnline: navigator.onLine,
      responseTime: Math.round(responseTime),
      quality: responseTime < 1000 ? 'good' : responseTime < 3000 ? 'fair' : 'poor',
      status: response.ok ? 'success' : 'error'
    };
  } catch (error) {
    // Fallback to basic connection check if API is not available
    return {
      isOnline: navigator.onLine,
      responseTime: null,
      quality: 'unknown',
      status: 'error',
      error: error.message
    };
  }
};

/**
 * Simple connection check without external requests
 * @returns {Object} Basic connection info
 */
export const checkBasicConnection = () => {
  return {
    isOnline: navigator.onLine,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    quality: 'unknown' // Will be determined by actual upload attempt
  };
};

/**
 * Get upload recommendations based on connection quality
 * @param {Object} connectionInfo - Connection quality info
 * @returns {Object} Upload recommendations
 */
export const getUploadRecommendations = (connectionInfo) => {
  const { quality, responseTime } = connectionInfo;
  
  if (quality === 'good') {
    return {
      maxFileSize: 2 * 1024 * 1024, // 2MB
      timeout: 60000, // 1 minute
      retries: 2,
      mode: 'base64'
    };
  } else if (quality === 'fair') {
    return {
      maxFileSize: 1 * 1024 * 1024, // 1MB
      timeout: 120000, // 2 minutes
      retries: 3,
      mode: 'formdata'
    };
  } else {
    return {
      maxFileSize: 500 * 1024, // 500KB
      timeout: 180000, // 3 minutes
      retries: 5,
      mode: 'formdata'
    };
  }
};

/**
 * Pre-upload connection check
 * @param {string} apiBaseUrl - API base URL
 * @returns {Promise<Object>} Pre-upload check results
 */
export const preUploadCheck = async (apiBaseUrl) => {
  try {
    const [backendHealth, connectionQuality] = await Promise.all([
      checkBackendHealth(apiBaseUrl),
      checkConnectionQuality()
    ]);
    
    const recommendations = getUploadRecommendations(connectionQuality);
    
    // Don't block upload if endpoint check fails due to CORS
    // Only require backend to be reachable
    const result = {
      backendReachable: backendHealth,
      connectionQuality,
      recommendations,
      shouldProceed: backendHealth && connectionQuality.isOnline
    };
    
    return result;
  } catch (error) {
    
    // Fallback to basic connection check
    const basicConnection = checkBasicConnection();
    const recommendations = getUploadRecommendations(basicConnection);
    
    return {
      backendReachable: true, // Assume backend is reachable
      uploadEndpointReachable: false, // Unknown due to CORS
      connectionQuality: basicConnection,
      recommendations,
      shouldProceed: basicConnection.isOnline, // Only require online status
      uploadEndpointStatus: { reachable: false, error: 'CORS check failed' }
    };
  }
};
