import React, { useState } from 'react';
import { MessageCircle, Sparkles, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ChatBanner({ onOpenChat }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="mb-8">
      <div 
        className="relative overflow-hidden bg-gradient-to-r from-cyan-500/10 to-blue-600/10 border border-cyan-500/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:border-cyan-500/40 hover:bg-gradient-to-r hover:from-cyan-500/15 hover:to-blue-600/15"
        onClick={onOpenChat}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-8 -translate-y-8">
          <div className="w-full h-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-white">Ask MAIRA</h3>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <p className="text-gray-300 text-sm">
                Get instant answers about your clients, schedule, and market insights
              </p>
            </div>
          </div>
          
          <div className="flex-shrink-0">
            <Button 
              variant="ghost" 
              size="sm"
              className={`text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-all duration-200 ${
                isHovered ? 'translate-x-1' : ''
              }`}
            >
              <span className="mr-2">Chat now</span>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Animated pulse effect */}
        <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
      </div>
    </div>
  );
}