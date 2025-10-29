/**
 * Performance Optimization Hooks
 * Custom hooks for optimizing React performance
 */

import { useMemo, useCallback, useRef, useEffect, useState } from 'react';

/**
 * Hook for memoizing expensive calculations
 * @param {Function} calculation - Expensive calculation function
 * @param {Array} dependencies - Dependencies array
 * @returns {any} - Memoized result
 */
export const useExpensiveCalculation = (calculation, dependencies) => {
  return useMemo(() => {
    return calculation();
  }, dependencies);
};

/**
 * Hook for debouncing values
 * @param {any} value - Value to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {any} - Debounced value
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

/**
 * Hook for throttling function calls
 * @param {Function} callback - Function to throttle
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Throttled function
 */
export const useThrottle = (callback, delay) => {
  const lastRun = useRef(Date.now());

  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

/**
 * Hook for intersection observer (lazy loading)
 * @param {Object} options - Intersection observer options
 * @returns {Object} - { ref, inView, entry }
 */
export const useIntersectionObserver = (options = {}) => {
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState(null);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [options]);

  return { ref, inView, entry };
};

/**
 * Hook for measuring component performance
 * @param {string} componentName - Name of the component
 * @returns {Object} - Performance measurement utilities
 */
export const usePerformanceMeasurement = (componentName) => {
  const renderCount = useRef(0);
  const startTime = useRef(Date.now());

  useEffect(() => {
    renderCount.current += 1;
    
    if (process.env.NODE_ENV === 'development') {
      const renderTime = Date.now() - startTime.current;
    }
  });

  const measureFunction = useCallback((fn, name) => {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    
    if (process.env.NODE_ENV === 'development') {
    }
    
    return result;
  }, [componentName]);

  return {
    renderCount: renderCount.current,
    measureFunction
  };
};

/**
 * Hook for optimizing list rendering
 * @param {Array} items - Array of items to render
 * @param {Object} options - Options for optimization
 * @returns {Object} - Optimized list utilities
 */
export const useOptimizedList = (items, options = {}) => {
  const {
    itemHeight = 50,
    containerHeight = 400,
    overscan = 5
  } = options;

  const [scrollTop, setScrollTop] = useState(0);
  const [containerRef, setContainerRef] = useState(null);

  const visibleRange = useMemo(() => {
    if (!items.length) return { start: 0, end: 0 };
    
    const start = Math.floor(scrollTop / itemHeight);
    const end = Math.min(
      start + Math.ceil(containerHeight / itemHeight) + overscan,
      items.length
    );
    
    return {
      start: Math.max(0, start - overscan),
      end
    };
  }, [scrollTop, itemHeight, containerHeight, overscan, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end);
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;
  const offsetY = visibleRange.start * itemHeight;

  const handleScroll = useCallback((e) => {
    setScrollTop(e.target.scrollTop);
  }, []);

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setContainerRef,
    handleScroll,
    visibleRange
  };
};

/**
 * Hook for preventing unnecessary re-renders
 * @param {Object} props - Props object
 * @returns {Object} - Memoized props
 */
export const useStableProps = (props) => {
  return useMemo(() => props, Object.values(props));
};

/**
 * Hook for optimizing API calls
 * @param {Function} apiCall - API function
 * @param {Array} dependencies - Dependencies array
 * @param {Object} options - Options
 * @returns {Object} - Optimized API call utilities
 */
export const useOptimizedApiCall = (apiCall, dependencies, options = {}) => {
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus = false
  } = options;

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const cache = useRef(new Map());

  const isStale = useMemo(() => {
    if (!lastFetch) return true;
    return Date.now() - lastFetch > staleTime;
  }, [lastFetch, staleTime]);

  const shouldFetch = enabled && (isStale || !data);

  const fetchData = useCallback(async () => {
    if (!shouldFetch) return;

    const cacheKey = JSON.stringify(dependencies);
    const cached = cache.current.get(cacheKey);

    if (cached && !isStale) {
      setData(cached);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiCall();
      setData(result);
      setLastFetch(Date.now());
      cache.current.set(cacheKey, result);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiCall, dependencies, shouldFetch, isStale]);

  useEffect(() => {
    fetchData();
  }, [apiCall, dependencies, shouldFetch, isStale]);

  // Remove setInterval to prevent hanging
  // Clean up old cache entries on component unmount only
  useEffect(() => {
    return () => {
      cache.current.clear();
    };
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: fetchData,
    isStale
  };
};
