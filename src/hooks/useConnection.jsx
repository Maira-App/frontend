import { createContext, useContext, useState, useCallback } from 'react';

export const ConnectionModes = {
  CLOUD: 'cloud',
  MANUAL: 'manual', 
  ENV: 'env'
};

const ConnectionContext = createContext(undefined);

export function ConnectionProvider({ children }) {
  const [connectionDetails, setConnectionDetails] = useState({
    wsUrl: '',
    token: '',
    shouldConnect: false,
    mode: ConnectionModes.MANUAL
  });

  const connect = useCallback(async (mode = ConnectionModes.ENV) => {
    let token = '';
    let url = '';
    
    if (mode === ConnectionModes.ENV) {
      // Use environment variables for LiveKit URL
      url = import.meta.env.VITE_LIVEKIT_URL || 'ws://localhost:7880';
      
      // Generate token from backend
      try {
        const response = await fetch('/api/livekit/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            roomName: 'maira-voice-room',
            participantName: 'User',
            participantId: 'user-' + Date.now(),
            agentName: 'MAIRA Assistant'
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to generate token');
        }
        
        const data = await response.json();
        token = data.accessToken;
      } catch (error) {
        console.error('Token generation failed:', error);
        // Fallback for development
        if (import.meta.env.DEV) {
          console.log('Using development fallback mode');
          token = 'dev-token';
        } else {
          throw error;
        }
      }
    }
    
    setConnectionDetails({
      wsUrl: url,
      token,
      shouldConnect: true,
      mode
    });
  }, []);

  const disconnect = useCallback(async () => {
    setConnectionDetails(prev => ({
      ...prev,
      shouldConnect: false
    }));
  }, []);

  return (
    <ConnectionContext.Provider value={{
      wsUrl: connectionDetails.wsUrl,
      token: connectionDetails.token,
      shouldConnect: connectionDetails.shouldConnect,
      mode: connectionDetails.mode,
      connect,
      disconnect
    }}>
      {children}
    </ConnectionContext.Provider>
  );
}

export function useConnection() {
  const context = useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error('useConnection must be used within a ConnectionProvider');
  }
  return context;
}