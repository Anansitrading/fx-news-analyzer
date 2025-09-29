import { useEffect, useRef, useState } from 'react';

interface UseDataUpdatesProps {
  enabled: boolean;
  intervalMs: number;
  onUpdate: () => Promise<void>;
  onError?: (error: Error) => void;
}

export const useDataUpdates = ({
  enabled,
  intervalMs,
  onUpdate,
  onError
}: UseDataUpdatesProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [updateCount, setUpdateCount] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const executeUpdate = async () => {
    if (isUpdating) return; // Prevent overlapping updates
    
    try {
      setIsUpdating(true);
      await onUpdate();
      setLastUpdateTime(new Date());
      setUpdateCount(prev => prev + 1);
    } catch (error) {
      console.error('Data update failed:', error);
      onError?.(error as Error);
    } finally {
      setIsUpdating(false);
    }
  };

  const startUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    intervalRef.current = setInterval(executeUpdate, intervalMs);
  };

  const stopUpdates = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const forceUpdate = async () => {
    await executeUpdate();
  };

  useEffect(() => {
    if (enabled) {
      startUpdates();
    } else {
      stopUpdates();
    }

    return () => {
      stopUpdates();
    };
  }, [enabled, intervalMs]);

  return {
    isUpdating,
    lastUpdateTime,
    updateCount,
    forceUpdate,
    startUpdates,
    stopUpdates
  };
};