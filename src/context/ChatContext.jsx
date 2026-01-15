import React, { createContext, useContext, useState, useEffect } from 'react';
import { sendMessageToAbacus } from '../services/gemini';
import { audioManager } from '../services/audio';

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [messages, setMessages] = useState([
        { sender: 'abacus', text: "Roar! 🦁 I'm Professor Abacus. Click me if you need help!" }
    ]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [voiceEnabled, setVoiceEnabled] = useState(true);

    const toggleChat = () => setIsOpen(!isOpen);

    const sendMessage = async (text, context = '') => {
        // Add user message
        const newMessages = [...messages, { sender: 'user', text }];
        setMessages(newMessages);
        setIsLoading(true);

        // Get response
        const responseText = await sendMessageToAbacus(messages, text, context);

        setMessages(prev => [...prev, { sender: 'abacus', text: responseText }]);
        setIsLoading(false);

        // Speak if enabled
        if (voiceEnabled) {
            audioManager.speak(responseText);
        }
    };

    return (
        <ChatContext.Provider value={{
            messages,
            isOpen,
            toggleChat,
            sendMessage,
            isLoading,
            voiceEnabled,
            setVoiceEnabled
        }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
