/**
 * Real-time Updates Hook
 * Provides real-time data updates for statistics
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';

const useRealTimeUpdates = (updateInterval = 300000) => { // 5 minutes default
  const [isConnected, setIsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [updateCount, setUpdateCount] = useState(0);
  const intervalRef = useRef(null);
  const onUpdateRef = useRef(null);
  const lastToastTime = useRef(0);

  const startUpdates = useCallback((onUpdate) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    onUpdateRef.current = onUpdate;
    setIsConnected(true);
    setLastUpdate(new Date());

    // Initial update
    if (onUpdate) {
      onUpdate();
    }

    // Set up interval
    intervalRef.current = setInterval(() => {
      if (onUpdateRef.current) {
        onUpdateRef.current();
        setLastUpdate(new Date());
        setUpdateCount(prev => prev + 1);
      }
    }, updateInterval);

    // Prevent duplicate toasts
    const now = Date.now();
    if (now - lastToastTime.current > 1000) {
      toast.success('Real-time updates enabled');
      lastToastTime.current = now;
    }
  }, [updateInterval]);

  const stopUpdates = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setIsConnected(false);
    onUpdateRef.current = null;
    
    // Prevent duplicate toasts
    const now = Date.now();
    if (now - lastToastTime.current > 1000) {
      toast.info('Real-time updates disabled');
      lastToastTime.current = now;
    }
  }, []);

  const forceUpdate = useCallback(() => {
    if (onUpdateRef.current) {
      onUpdateRef.current();
      setLastUpdate(new Date());
      setUpdateCount(prev => prev + 1);
      
      // Prevent duplicate toasts
      const now = Date.now();
      if (now - lastToastTime.current > 1000) {
        toast.success('Data refreshed manually');
        lastToastTime.current = now;
      }
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    isConnected,
    lastUpdate,
    updateCount,
    startUpdates,
    stopUpdates,
    forceUpdate
  };
};

export default useRealTimeUpdates;
