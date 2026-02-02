import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { sendMessageToGemini, ChatMessage } from '@/lib/gemini';

const QUICK_SUGGESTIONS = [
    'Explain the laws of thermodynamics',
    'How do I calculate heat transfer?',
    "What is Bernoulli's principle?",
    'How does a heat engine work?'
];

export const ThermoBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    const handleSend = async (messageText?: string) => {
        const text = messageText || input.trim();
        if (!text || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: text };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await sendMessageToGemini(text, messages);
            const assistantMessage: ChatMessage = { role: 'assistant', content: response };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again!'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30 flex items-center justify-center hover:scale-110 transition-transform"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div
                            key="close"
                            initial={{ rotate: -90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: 90, opacity: 0 }}
                        >
                            <X className="w-7 h-7 text-white" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="bot"
                            initial={{ rotate: 90, opacity: 0 }}
                            animate={{ rotate: 0, opacity: 1 }}
                            exit={{ rotate: -90, opacity: 0 }}
                            className="relative"
                        >
                            <Bot className="w-8 h-8 text-white" />
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border border-white/10 backdrop-blur-xl bg-gradient-to-br from-slate-900/95 to-slate-800/95"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 bg-gradient-to-r from-cyan-600/20 to-blue-600/20">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white flex items-center gap-2">
                                        Chat with ThermoBot
                                        <Sparkles className="w-4 h-4 text-cyan-400" />
                                    </h3>
                                    <p className="text-xs text-white/60">Your engineering assistant</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 h-[340px] overflow-y-auto p-4 space-y-4">
                            {messages.length === 0 ? (
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                                            <Bot className="w-4 h-4 text-white" />
                                        </div>
                                        <div className="bg-white/10 rounded-2xl rounded-tl-none p-3 max-w-[280px]">
                                            <p className="text-sm text-white/90">
                                                Hello! I'm ThermoBot, your virtual assistant. How can I help you today?
                                            </p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mt-4">
                                        <p className="text-xs text-white/40 px-2">Quick suggestions:</p>
                                        {QUICK_SUGGESTIONS.map((suggestion, i) => (
                                            <button
                                                key={i}
                                                onClick={() => handleSend(suggestion)}
                                                className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white/80 transition-colors flex items-center justify-between group"
                                            >
                                                <span>{suggestion}</span>
                                                <Send className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity text-cyan-400" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                messages.map((msg, i) => (
                                    <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-purple-500 to-pink-500'
                                                : 'bg-gradient-to-br from-cyan-400 to-blue-500'
                                            }`}>
                                            {msg.role === 'user' ? (
                                                <User className="w-4 h-4 text-white" />
                                            ) : (
                                                <Bot className="w-4 h-4 text-white" />
                                            )}
                                        </div>
                                        <div className={`rounded-2xl p-3 max-w-[280px] ${msg.role === 'user'
                                                ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-tr-none'
                                                : 'bg-white/10 rounded-tl-none'
                                            }`}>
                                            <p className="text-sm text-white/90 whitespace-pre-wrap">{msg.content}</p>
                                        </div>
                                    </div>
                                ))
                            )}

                            {isLoading && (
                                <div className="flex gap-3">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white/10 rounded-2xl rounded-tl-none p-3">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-4 border-t border-white/10 bg-black/20">
                            <div className="flex gap-2">
                                <Input
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Type your message here..."
                                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/40 focus-visible:ring-cyan-500"
                                    disabled={isLoading}
                                />
                                <Button
                                    onClick={() => handleSend()}
                                    disabled={!input.trim() || isLoading}
                                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white"
                                >
                                    <Send className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
