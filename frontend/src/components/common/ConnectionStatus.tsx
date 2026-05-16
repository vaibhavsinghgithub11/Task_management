import React, { useState, useEffect } from 'react';
import api from '../../api/axios';

interface ConnectionStatusProps {
  showOnlyWhenOffline?: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ 
  showOnlyWhenOffline = false 
}) => {
  const [isOnline, setIsOnline] = useState(true);
  const [isChecking, setIsChecking] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);

  useEffect(() => {
    // Check connection on mount
    checkConnection();

    // Set up interval to check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);

    // Listen to online/offline events
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkConnection = async () => {
    setIsChecking(true);
    try {
      // Try to ping the API
      await api.get('/health', { timeout: 5000 });
      setIsOnline(true);
      setLastChecked(new Date());
    } catch (error) {
      setIsOnline(false);
      setLastChecked(new Date());
    } finally {
      setIsChecking(false);
    }
  };

  const handleOnline = () => {
    setIsOnline(true);
    checkConnection();
  };

  const handleOffline = () => {
    setIsOnline(false);
  };

  const handleRetry = () => {
    checkConnection();
  };

  // Don't show anything if online and showOnlyWhenOffline is true
  if (showOnlyWhenOffline && isOnline) {
    return null;
  }

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 transition-all ${
        isOnline
          ? 'bg-green-50 border border-green-200 text-green-800'
          : 'bg-red-50 border border-red-200 text-red-800'
      }`}
    >
      {/* Status Icon */}
      <div className="flex-shrink-0">
        {isChecking ? (
          <svg
            className="animate-spin h-5 w-5 text-gray-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        ) : isOnline ? (
          <svg
            className="h-5 w-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ) : (
          <svg
            className="h-5 w-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
      </div>

      {/* Status Text */}
      <div className="flex-1">
        <p className="text-sm font-medium">
          {isChecking
            ? 'Checking connection...'
            : isOnline
            ? 'Connected to server'
            : 'Connection lost'}
        </p>
        {lastChecked && (
          <p className="text-xs opacity-75">
            Last checked: {lastChecked.toLocaleTimeString()}
          </p>
        )}
      </div>

      {/* Retry Button (only when offline) */}
      {!isOnline && !isChecking && (
        <button
          onClick={handleRetry}
          className="flex-shrink-0 px-3 py-1 text-xs font-medium bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      )}

      {/* Close Button (only when online and not showOnlyWhenOffline) */}
      {isOnline && !showOnlyWhenOffline && (
        <button
          onClick={() => setIsOnline(false)}
          className="flex-shrink-0 text-green-600 hover:text-green-800"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;
