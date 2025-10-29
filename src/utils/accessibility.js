// Accessibility utility functions

// ARIA labels for common elements
export const ARIA_LABELS = {
  // Navigation
  mainNavigation: 'Main navigation',
  userMenu: 'User menu',
  searchButton: 'Search',
  closeButton: 'Close',
  
  // Content
  articleTitle: 'Article title',
  articleContent: 'Article content',
  authorName: 'Author name',
  publishDate: 'Publish date',
  
  // Actions
  likeButton: 'Like this post',
  unlikeButton: 'Unlike this post',
  shareButton: 'Share this post',
  saveButton: 'Save this post',
  followButton: 'Follow this user',
  unfollowButton: 'Unfollow this user',
  
  // Upload
  uploadButton: 'Upload image',
  removeImageButton: 'Remove image',
  cropImageButton: 'Crop image',
  
  // Forms
  submitButton: 'Submit form',
  cancelButton: 'Cancel',
  deleteButton: 'Delete',
  editButton: 'Edit',
  
  // Status
  loading: 'Loading content',
  error: 'Error occurred',
  success: 'Operation successful',
  
  // Notifications
  notificationBell: 'Notifications',
  unreadCount: 'Unread notifications count',
  
  // Search
  searchInput: 'Search for posts',
  searchResults: 'Search results',
  clearSearch: 'Clear search',
  
  // Pagination
  nextPage: 'Go to next page',
  previousPage: 'Go to previous page',
  pageNumber: 'Page number',
};

// Keyboard navigation helpers
export const KEYBOARD_NAVIGATION = {
  // Common key codes
  ENTER: 'Enter',
  SPACE: ' ',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  ARROW_UP: 'ArrowUp',
  ARROW_DOWN: 'ArrowDown',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  
  // Focus management
  focusFirst: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  },
  
  focusLast: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  },
  
  trapFocus: (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },
};

// Screen reader announcements
export const announceToScreenReader = (message, priority = 'polite') => {
  const announcement = document.createElement('div');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
};

// Skip links for keyboard navigation
export const createSkipLink = (target, text) => {
  const skipLink = document.createElement('a');
  skipLink.href = `#${target}`;
  skipLink.textContent = text;
  skipLink.className = 'skip-link';
  skipLink.className = 'skip-link absolute -top-10 left-1.5 bg-dark-1 text-light-1 p-2 no-underline z-[1000] rounded';
  
  skipLink.addEventListener('focus', () => {
    skipLink.style.top = '6px';
  });
  
  skipLink.addEventListener('blur', () => {
    skipLink.style.top = '-40px';
  });
  
  return skipLink;
};

// Color contrast helpers
export const getContrastRatio = (color1, color2) => {
  const getLuminance = (color) => {
    const rgb = color.match(/\d+/g);
    const [r, g, b] = rgb.map(c => {
      c = parseInt(c) / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// Focus indicators
export const addFocusIndicator = (element) => {
  element.className += ' outline-2 outline-purple-6 outline-offset-2';
  element.style.outlineOffset = '2px';
};

// Remove focus indicator
export const removeFocusIndicator = (element) => {
  element.style.outline = '';
  element.style.outlineOffset = '';
};

// High contrast mode detection
export const isHighContrastMode = () => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Reduced motion detection
export const prefersReducedMotion = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// Dark mode detection
export const prefersDarkMode = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

// Accessibility testing helpers
export const accessibilityTest = {
  // Check if element has proper ARIA attributes
  hasAriaLabel: (element) => {
    return element.hasAttribute('aria-label') || 
           element.hasAttribute('aria-labelledby') ||
           element.textContent.trim() !== '';
  },
  
  // Check if element is focusable
  isFocusable: (element) => {
    const focusableElements = [
      'button', 'input', 'select', 'textarea', 'a', 'area'
    ];
    return focusableElements.includes(element.tagName.toLowerCase()) ||
           element.hasAttribute('tabindex') && element.getAttribute('tabindex') !== '-1';
  },
  
  // Check color contrast
  hasGoodContrast: (foreground, background) => {
    const ratio = getContrastRatio(foreground, background);
    return ratio >= 4.5; // WCAG AA standard
  },
};

export default {
  ARIA_LABELS,
  KEYBOARD_NAVIGATION,
  announceToScreenReader,
  createSkipLink,
  getContrastRatio,
  addFocusIndicator,
  removeFocusIndicator,
  isHighContrastMode,
  prefersReducedMotion,
  prefersDarkMode,
  accessibilityTest,
};
