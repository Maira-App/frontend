import {
  LiveKitRoom,
  RoomAudioRenderer,
  StartAudio,
  BarVisualizer,
  useConnectionState,
  useVoiceAssistant,
  useLocalParticipant,
  useRoomInfo,
  useTracks,
} from '@livekit/components-react';
import '@livekit/components-styles';
import { ConnectionState, Track } from 'livekit-client';
import { Mic, MicOff, PhoneCall, PhoneOff } from 'lucide-react';
import { useConnection } from '../../hooks/useConnection.jsx';
import { useState, useEffect } from 'react';

function VoiceAssistantRoom() {
  const roomState = useConnectionState();
  const voiceAssistant = useVoiceAssistant();
  const { localParticipant } = useLocalParticipant();
  const { name: roomName } = useRoomInfo();
  const tracks = useTracks();
  const [isMicEnabled, setIsMicEnabled] = useState(true);

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(isMicEnabled);
    }
  }, [isMicEnabled, localParticipant, roomState]);

  const toggleMicrophone = () => {
    setIsMicEnabled(!isMicEnabled);
  };

  const audioVisualizerContent = () => {
    if (roomState === ConnectionState.Disconnected) {
      return (
        <div className="flex items-center justify-center text-gray-400 text-center w-full h-48">
          <PhoneOff className="w-12 h-12 mb-2" />
          <div>Not connected to voice assistant</div>
        </div>
      );
    }

    if (roomState === ConnectionState.Connecting) {
      return (
        <div className="flex flex-col items-center justify-center text-blue-400 text-center w-full h-48">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mb-2"></div>
          <div>Connecting to MAIRA...</div>
        </div>
      );
    }

    if (!voiceAssistant.audioTrack) {
      return (
        <div className="flex flex-col items-center justify-center text-yellow-400 text-center w-full h-48">
          <PhoneCall className="w-12 h-12 mb-2 animate-pulse" />
          <div>Waiting for voice assistant...</div>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center w-full h-48">
        <BarVisualizer
          state={voiceAssistant.state}
          trackRef={voiceAssistant.audioTrack}
          barCount={7}
          options={{ minHeight: 20 }}
          className="text-blue-400"
        />
      </div>
    );
  };

  const getConnectionStatus = () => {
    switch (roomState) {
      case ConnectionState.Connected:
        return { text: 'Connected', color: 'text-green-400' };
      case ConnectionState.Connecting:
        return { text: 'Connecting...', color: 'text-yellow-400' };
      case ConnectionState.Disconnected:
        return { text: 'Disconnected', color: 'text-gray-400' };
      case ConnectionState.Reconnecting:
        return { text: 'Reconnecting...', color: 'text-yellow-400' };
      default:
        return { text: 'Unknown', color: 'text-gray-400' };
    }
  };

  const status = getConnectionStatus();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="bg-gray-800 p-4 rounded-t-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">MAIRA Voice Assistant</h2>
            <p className="text-sm text-gray-300">Room: {roomName || 'maira-voice-room'}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`text-sm ${status.color}`}>{status.text}</span>
            <div className={`w-3 h-3 rounded-full ${
              roomState === ConnectionState.Connected ? 'bg-green-400' : 
              roomState === ConnectionState.Connecting ? 'bg-yellow-400' : 
              'bg-gray-400'
            }`}></div>
          </div>
        </div>
      </div>

      {/* Voice Visualizer */}
      <div className="flex-1 bg-gray-900 p-6">
        {audioVisualizerContent()}
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4 rounded-b-lg">
        <div className="flex justify-center space-x-4">
          <button
            onClick={toggleMicrophone}
            disabled={roomState !== ConnectionState.Connected}
            className={`p-3 rounded-full transition-colors ${
              isMicEnabled 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            } ${roomState !== ConnectionState.Connected ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isMicEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </button>
        </div>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-400">
            {roomState === ConnectionState.Connected 
              ? (isMicEnabled ? 'Microphone is active' : 'Microphone is muted')
              : 'Connect to enable voice controls'
            }
          </p>
        </div>
      </div>

      {/* Audio Components */}
      <RoomAudioRenderer />
      <StartAudio label="Click to enable audio playback" />
    </div>
  );
}

export default function VoiceAssistant() {
  const { wsUrl, token, shouldConnect, connect, disconnect } = useConnection();
  const [isConnecting, setIsConnecting] = useState(false);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  if (!shouldConnect) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-gray-900 rounded-lg p-8">
        <div className="text-center">
          <PhoneCall className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">MAIRA Voice Assistant</h2>
          <p className="text-gray-400 mb-6">
            Connect to start a voice conversation with your AI real estate assistant
          </p>
          <button
            onClick={handleConnect}
            disabled={isConnecting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isConnecting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <PhoneCall className="w-4 h-4" />
                <span>Start Voice Session</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <LiveKitRoom
        className="h-full"
        serverUrl={wsUrl}
        token={token}
        connect={shouldConnect}
        onError={(error) => {
          console.error('LiveKit error:', error);
        }}
        onDisconnected={() => {
          console.log('Disconnected from LiveKit room');
        }}
      >
        <VoiceAssistantRoom />
        <div className="fixed top-4 right-4">
          <button
            onClick={handleDisconnect}
            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
            title="Disconnect"
          >
            <PhoneOff className="w-4 h-4" />
          </button>
        </div>
      </LiveKitRoom>
    </div>
  );
}