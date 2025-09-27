import { default as VoiceAssistant } from '../components/voice/VoiceAssistant.jsx';
import { ConnectionProvider } from '../hooks/useConnection.jsx';

export default function Voice() {
  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Voice Assistant</h1>
        <p className="text-gray-400">
          Connect with MAIRA through voice conversation to get real estate assistance
        </p>
      </div>
      
      <div className="h-[calc(100%-5rem)]">
        <ConnectionProvider>
          <VoiceAssistant />
        </ConnectionProvider>
      </div>
    </div>
  );
}