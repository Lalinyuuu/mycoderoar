// Google Analytics utility functions
export const GA_TRACKING_ID = import.meta.env.VITE_GA_TRACKING_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initGA = () => {
  if (import.meta.env.PROD && GA_TRACKING_ID) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (path, title) => {
  if (window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: path,
      page_title: title,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user interactions
export const trackUserAction = (action, details = {}) => {
  if (window.gtag) {
    window.gtag('event', action, {
      event_category: 'user_interaction',
      ...details,
    });
  }
};

// Track API calls
export const trackAPICall = (endpoint, method, status, duration) => {
  if (window.gtag) {
    window.gtag('event', 'api_call', {
      event_category: 'api',
      event_label: `${method} ${endpoint}`,
      custom_parameter_1: status,
      custom_parameter_2: duration,
    });
  }
};

// Track errors
export const trackError = (error, context = {}) => {
  if (window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      ...context,
    });
  }
};

// Track upload events
export const trackUpload = (type, status, fileSize) => {
  if (window.gtag) {
    window.gtag('event', 'upload', {
      event_category: 'file_upload',
      event_label: `${type}_${status}`,
      value: fileSize,
    });
  }
};

// Track notification events
export const trackNotification = (action, type) => {
  if (window.gtag) {
    window.gtag('event', 'notification', {
      event_category: 'notification',
      event_label: `${action}_${type}`,
    });
  }
};

// Track search events
export const trackSearch = (query, results) => {
  if (window.gtag) {
    window.gtag('event', 'search', {
      event_category: 'search',
      event_label: query,
      value: results,
    });
  }
};

// Track authentication events
export const trackAuth = (action, method) => {
  if (window.gtag) {
    window.gtag('event', 'auth', {
      event_category: 'authentication',
      event_label: `${action}_${method}`,
    });
  }
};

// Track post interactions
export const trackPostInteraction = (action, postType) => {
  if (window.gtag) {
    window.gtag('event', 'post_interaction', {
      event_category: 'content',
      event_label: `${action}_${postType}`,
    });
  }
};

export default {
  initGA,
  trackPageView,
  trackEvent,
  trackUserAction,
  trackAPICall,
  trackError,
  trackUpload,
  trackNotification,
  trackSearch,
  trackAuth,
  trackPostInteraction,
};
