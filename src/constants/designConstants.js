// Design System Constants
export const COLORS = {
  // Primary Colors
  PURPLE: {
    1: '#f3e8ff',
    2: '#e9d5ff', 
    3: '#d8b4fe',
    4: '#c084fc',
    5: '#a855f7',
    6: '#8b5cf6',
    7: '#7c3aed',
    8: '#6d28d9',
    9: '#5b21b6',
    10: '#4c1d95'
  },
  EMERALD: {
    1: '#d1fae5',
    2: '#a7f3d0',
    3: '#6ee7b7', 
    4: '#34d399',
    5: '#10b981',
    6: '#059669',
    7: '#047857',
    8: '#065f46',
    9: '#064e3b',
    10: '#064e3b'
  },
  GRAY: {
    1: '#ffffff',
    2: '#f8f9fa',
    3: '#f1f3f5',
    4: '#e9ecef',
    5: '#dee2e6',
    6: '#ced4da',
    7: '#adb5bd',
    8: '#868e96',
    9: '#495057',
    10: '#343a40'
  },
  RED: {
    5: '#ef4444',
    6: '#dc2626',
    7: '#b91c1c'
  },
  YELLOW: {
    5: '#f59e0b',
    6: '#d97706',
    7: '#b45309'
  },
  CYAN: {
    5: '#06b6d4'
  }
};

export const SIZES = {
  // Spacing
  SPACING: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },
  // Font Sizes
  FONT: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  // Component Sizes
  COMPONENT: {
    button: {
      sm: '2rem',     // 32px
      md: '2.5rem',   // 40px
      lg: '3rem',     // 48px
    },
    input: {
      sm: '2rem',     // 32px
      md: '2.5rem',   // 40px
      lg: '3rem',     // 48px
    },
    avatar: {
      sm: '1.5rem',   // 24px
      md: '2rem',     // 32px
      lg: '2.5rem',   // 40px
      xl: '3rem',     // 48px
    }
  }
};

export const ANIMATIONS = {
  DURATION: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.5,
    slower: 1.0,
    slowest: 2.0
  },
  EASING: {
    easeInOut: 'ease-in-out',
    easeOut: 'ease-out',
    easeIn: 'ease-in',
    linear: 'linear'
  }
};

export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  glow: '0 10px 30px color-mix(in srgb, var(--emerald-4) 50%, transparent)'
};

export const BORDER_RADIUS = {
  sm: '0.25rem',     // 4px
  md: '0.5rem',      // 8px
  lg: '0.75rem',     // 12px
  xl: '1rem',        // 16px
  full: '9999px'
};

export const Z_INDEX = {
  dropdown: 1000,
  sticky: 1020,
  fixed: 1030,
  modal: 1040,
  popover: 1050,
  tooltip: 1060,
  toast: 9999
};
