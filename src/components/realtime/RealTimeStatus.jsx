/**
 * Real-time Status Component
 * Shows real-time update status and controls
 */

import { useState } from 'react';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Clock, 
  Settings,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';
import Button from '@/components/ui/Button';
import IconButton from '@/components/ui/IconButton';

const RealTimeStatus = ({ 
  isConnected, 
  lastUpdate, 
  updateCount, 
  onStart, 
  onStop, 
  onForceUpdate,
  updateInterval = 300000
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [customInterval, setCustomInterval] = useState(updateInterval / 1000 / 60); // Convert to minutes
  const [lastActionTime, setLastActionTime] = useState(0);

  const formatLastUpdate = (date) => {
    if (!date) return 'Never';
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s ago`;
    } else {
      return `${seconds}s ago`;
    }
  };

  const handleAction = (action, ...args) => {
    // Prevent multiple actions within 1 second
    const now = Date.now();
    if (now - lastActionTime < 1000) {
      return;
    }
    setLastActionTime(now);
    action(...args);
  };

  const handleIntervalChange = (minutes) => {
    setCustomInterval(minutes);
    const newInterval = minutes * 60 * 1000; // Convert to milliseconds
    handleAction(onStart, newInterval);
    setShowSettings(false);
  };

  const intervalOptions = [
    { label: '30 seconds', value: 0.5 },
    { label: '1 minute', value: 1 },
    { label: '2 minutes', value: 2 },
    { label: '5 minutes', value: 5 },
    { label: '10 minutes', value: 10 },
    { label: '15 minutes', value: 15 },
    { label: '30 minutes', value: 30 }
  ];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-dark-1">Real-time Updates</h3>
        <div className="flex items-center gap-2">
          <IconButton
            onClick={() => setShowSettings(!showSettings)}
            icon={<Settings className="w-4 h-4" />}
            variant="ghost"
            size="sm"
            tooltip="Settings"
            className="text-gray-6 hover:text-gray-8 hover:bg-gray-1"
          />
        </div>
      </div>

      {/* Status */}
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-5' : 'bg-gray-4'}`} />
        <span className="text-sm font-medium text-gray-7">
          {isConnected ? 'Connected' : 'Disconnected'}
        </span>
        {isConnected && (
          <span className="text-xs text-gray-5">
            ({updateCount} updates)
          </span>
        )}
      </div>

      {/* Last Update */}
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-gray-5" />
        <span className="text-sm text-gray-6">
          Last update: {formatLastUpdate(lastUpdate)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex gap-2">
        {!isConnected ? (
          <Button
            onClick={() => handleAction(onStart)}
            variant="primary"
            size="md"
            icon={<Play className="w-4 h-4" />}
          >
            Start Updates
          </Button>
        ) : (
          <Button
            onClick={() => handleAction(onStop)}
            variant="danger"
            size="md"
            icon={<Pause className="w-4 h-4" />}
          >
            Stop Updates
          </Button>
        )}
        
        <Button
          onClick={() => handleAction(onForceUpdate)}
          variant="success"
          size="md"
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Refresh Now
        </Button>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="mt-4 p-4 bg-gray-1 rounded-lg">
          <h4 className="text-sm font-semibold text-gray-7 mb-3">Update Interval</h4>
          <div className="grid grid-cols-2 gap-2">
            {intervalOptions.map((option) => (
              <Button
                key={option.value}
                onClick={() => handleIntervalChange(option.value)}
                variant={customInterval === option.value ? "primary" : "outline"}
                size="sm"
                className="text-sm"
              >
                {option.label}
              </Button>
            ))}
          </div>
          <div className="mt-3">
            <label className="block text-xs text-gray-6 mb-1">Custom (minutes)</label>
            <input
              type="number"
              min="0.5"
              max="60"
              step="0.5"
              value={customInterval}
              onChange={(e) => setCustomInterval(parseFloat(e.target.value))}
              className="w-full px-2 py-1 text-sm border border-gray-3 rounded focus:outline-none focus:ring-2 focus:ring-purple-5"
            />
            <Button
              onClick={() => handleIntervalChange(customInterval)}
              variant="primary"
              size="sm"
              className="mt-2 w-full"
            >
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RealTimeStatus;
