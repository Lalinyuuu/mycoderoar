import * as Sentry from '@sentry/react';
import { BrowserTracing } from '@sentry/tracing';

// Initialize Sentry
export const initSentry = () => {
  // Only initialize in production
  if (import.meta.env.PROD) {
    Sentry.init({
      dsn: import.meta.env.VITE_SENTRY_DSN || 'YOUR_SENTRY_DSN_HERE',
      environment: import.meta.env.MODE,
      integrations: [
        new BrowserTracing(),
      ],
      tracesSampleRate: 0.1, // 10% of transactions for performance monitoring
      beforeSend(event, hint) {
        // Filter out development errors
        if (event.exception) {
          const error = hint.originalException;
          if (error && error.message && error.message.includes('ResizeObserver loop limit exceeded')) {
            return null; // Don't send ResizeObserver errors
          }
        }
        return event;
      },
    });
  }
};

// Error boundary component - simplified
export const SentryErrorBoundary = ({ children, fallback }) => {
  return children;
};

// Custom error reporting
export const reportError = (error, context = {}) => {
  
  Sentry.withScope((scope) => {
    // Add context
    Object.keys(context).forEach(key => {
      scope.setContext(key, context[key]);
    });
    
    // Capture the error
    Sentry.captureException(error);
  });
};

// Performance monitoring - using new API
export const startTransaction = (name, op = 'navigation') => {
  return Sentry.startSpan({ name, op });
};

// User context
export const setUserContext = (user) => {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.name,
  });
};

// Clear user context
export const clearUserContext = () => {
  Sentry.setUser(null);
};

// Custom breadcrumbs
export const addBreadcrumb = (message, category = 'custom', level = 'info') => {
  Sentry.addBreadcrumb({
    message,
    category,
    level,
    timestamp: Date.now() / 1000,
  });
};

export default Sentry;
