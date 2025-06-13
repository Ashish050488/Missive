import {create} from 'zustand';


const useConversation = create((set)=>({
    // selectedConversation can hold a User object (for DMs)
    // or a GroupConversation object (from backend's GroupConversation model for group chats)
    selectedConversation:null,
    setSelectedConversations:(selectedConversation)=>set({selectedConversation}),
    messages:[],
    setMessages: (update) => set((state) => ({ // Can be used to set all messages or append
        messages: typeof update === "function" ? update(state.messages) : update
    })),
    addMessage: (newMessage) => set((state) => ({ // Convenience action to append a single message
        messages: [...state.messages, newMessage]
    })),
    userGroups: [], // State for storing user's group conversations
    setUserGroups: (groups) => set({ userGroups: groups }), // Action to set user's groups
}))

export default useConversation;

