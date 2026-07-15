import { create } from 'zustand';

interface Message {
  role: 'user' | 'ai';
  content: string;
}

interface ChatState {
  isOpen: boolean;
  messages: Message[];
  isStreaming: boolean;
  toggleChat: () => void;
  setIsOpen: (isOpen: boolean) => void;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setStreaming: (isStreaming: boolean) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  messages: [],
  isStreaming: false,
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  setIsOpen: (isOpen) => set({ isOpen }),
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  updateLastMessage: (content) => set((state) => {
    const newMessages = [...state.messages];
    if (newMessages.length > 0) {
      newMessages[newMessages.length - 1].content += content;
    }
    return { messages: newMessages };
  }),
  setStreaming: (isStreaming) => set({ isStreaming })
}));
