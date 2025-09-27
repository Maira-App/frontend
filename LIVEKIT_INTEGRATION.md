# LiveKit Voice Assistant Integration

This document describes the LiveKit integration added to the MAIRA frontend, based on the implementation patterns from the `/demo` directory.

## Overview

The LiveKit integration transforms the MAIRA frontend from a basic admin interface into a full voice-enabled real estate assistant. Users can now interact with MAIRA through real-time voice conversations using LiveKit's WebRTC technology.

## Components Added

### 1. Voice Assistant Component (`src/components/voice/VoiceAssistant.jsx`)

A comprehensive voice assistant interface that provides:

- **Real-time Audio Visualization**: Uses `BarVisualizer` to show voice activity
- **Connection Management**: Handles connection states (disconnected, connecting, connected)
- **Microphone Controls**: Toggle microphone on/off during conversations
- **LiveKit Room Integration**: Manages WebRTC connections to voice agents

**Key Features:**
- Visual feedback for connection status
- Audio waveform visualization during conversations
- Microphone control with visual indicators
- Graceful handling of connection failures

### 2. Connection Management Hook (`src/hooks/useConnection.jsx`)

Manages LiveKit room connections and token generation:

- **Token Generation**: Requests access tokens from backend API
- **Connection Modes**: Supports environment-based and manual connection modes
- **Error Handling**: Provides fallbacks for development and production scenarios
- **State Management**: Tracks connection status and room details

### 3. Voice Page (`src/pages/Voice.jsx`)

A dedicated page for voice interactions:

- Integrates the VoiceAssistant component
- Provides context and instructions for users
- Uses the ConnectionProvider for state management

## Architecture Integration

### Frontend Navigation

The Voice Assistant is integrated into the main navigation:

- **Desktop Sidebar**: Added as a prominent navigation item with microphone icon
- **Mobile Bottom Navigation**: Included in the mobile navigation grid
- **Route Integration**: Accessible via `/voice` URL path

### Backend API Integration

The integration expects these backend endpoints:

- `POST /api/livekit/token` - Generate LiveKit access tokens
- WebSocket connection to LiveKit server (configurable via environment)

### Environment Configuration

New environment variables added:

```bash
# LiveKit Configuration
VITE_LIVEKIT_URL=ws://localhost:7880
VITE_LIVEKIT_API_KEY=
VITE_LIVEKIT_SECRET_KEY=
```

## Usage Flow

1. **Access Voice Assistant**: User navigates to the Voice page via navigation
2. **Initialize Connection**: Click "Start Voice Session" to connect to LiveKit room
3. **Voice Interaction**: Speak with the MAIRA assistant through real-time audio
4. **Visual Feedback**: See audio visualization and connection status
5. **Microphone Control**: Toggle microphone during conversation
6. **Disconnect**: End session using the disconnect button

## Technical Features

### Real-time Communication
- WebRTC-based audio streaming
- Low-latency voice interaction
- Real-time audio visualization

### Error Handling
- Graceful fallbacks for connection failures
- Development mode with mock responses
- User-friendly error messages

### Responsive Design
- Works on desktop and mobile devices
- Appropriate sizing for different screen sizes
- Touch-friendly controls for mobile

### Integration with MAIRA Backend
- Token-based authentication
- Agent context management
- Room-based voice sessions

## Dependencies Added

```json
{
  "@livekit/components-react": "^2.9.3",
  "@livekit/components-styles": "^1.1.5", 
  "livekit-client": "^2.9.5",
  "framer-motion": "^10.18.0"
}
```

## Future Enhancements

The current implementation provides a solid foundation that can be extended with:

- **Real-time Transcription**: Add speech-to-text display
- **Agent Video**: Include video streams from AI agents
- **Database Activity Monitoring**: Show real-time backend operations
- **RPC Integration**: Direct communication with voice agents
- **Screen Sharing**: Allow sharing of documents/screens during calls
- **Recording**: Save voice interactions for later review

## Deployment Considerations

For production deployment:

1. **LiveKit Server**: Set up a LiveKit server instance
2. **Token Generation**: Implement secure token generation on backend
3. **Environment Variables**: Configure LiveKit URL and credentials
4. **HTTPS/WSS**: Ensure secure connections for WebRTC to work
5. **Firewall**: Open necessary ports for WebRTC traffic

## Testing

The integration supports testing in development mode with:

- Mock token generation when backend is unavailable
- Fallback responses for voice interactions
- Local development server compatibility

## Performance

The LiveKit integration adds approximately 500KB to the bundle size but provides:

- Efficient WebRTC streaming
- Real-time audio processing
- Optimized React components
- Lazy loading capabilities

This transforms MAIRA from a simple admin interface into a sophisticated voice-enabled AI assistant platform.