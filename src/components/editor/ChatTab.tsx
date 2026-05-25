"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../../services/coachService';

interface ChatTabProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onSendMessage: (text: string) => void;
}

export const ChatTab: React.FC<ChatTabProps> = ({
  messages,
  isTyping,
  onSendMessage
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  const formatMessageText = (text: string) => {
    if (!text) return '';
    
    // Escape basic HTML
    let html = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
    
    // Replace **bold** with <strong>bold</strong>
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Replace *italic* with <em>italic</em>
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert newlines to <br>
    html = html.replace(/\n/g, '<br>');
    
    return html;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Messages area */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '16px' }}>
        <div className="chat-messages">
          {messages.map((msg) => {
            const isCoach = msg.sender === 'coach';
            return (
              <div key={msg.id} className={`chat-msg ${isCoach ? 'coach' : 'user'}`}>
                {isCoach && <div className="chat-sender">Essay Coach</div>}
                <div 
                  className="chat-bubble"
                  dangerouslySetInnerHTML={{ __html: formatMessageText(msg.text) }}
                />
              </div>
            );
          })}
          {isTyping && (
            <div className="chat-msg coach">
              <div className="chat-sender">Essay Coach</div>
              <div className="chat-bubble" style={{ fontStyle: 'italic', color: 'var(--muted)' }}>
                Thinking...
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <form onSubmit={handleSend} className="chat-input-area" style={{ margin: '0 -16px -16px -16px' }}>
        <textarea
          className="chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask your coach..."
          rows={1}
        />
        <button type="submit" className="send-btn" disabled={!inputText.trim() || isTyping}>
          ↑
        </button>
      </form>
    </div>
  );
};

export default ChatTab;
