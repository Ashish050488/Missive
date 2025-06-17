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
    addMessage: (newMessage) => {
        console.log('[Zustand] addMessage called. New message:', JSON.stringify(newMessage));
        // Access current messages directly via get() before set() is called
        // Note: `get()` is from Zustand's `create` first argument `(set, get) => ({...})`
        // If not using `get` that way, direct access to the store's state is needed.
        // `useConversation.getState()` is the standard way to get current state outside of component/hook context.
        const currentMessages = useConversation.getState().messages;
        console.log('[Zustand] Messages before adding new one:', JSON.stringify(currentMessages));
        set((state) => ({
            messages: [...state.messages, newMessage]
        }));
    },
    userGroups: [], // State for storing user's group conversations
    setUserGroups: (groups) => set({ userGroups: groups }), // Action to set user's groups
}))

export default useConversation;

