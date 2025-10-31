import { useState, useEffect } from "react";
import ChatCreate from "./ChatCreate";
import ChatList from "./ChatList";
import ChatView from "./ChatView";
import ChatAddMessage from "./ChatAddMessage";
import api from "../api/axiosInstance";
import "../../../Style/Ask.css";

export default function ChatWrapper() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // Fetch all chats
  const refreshChats = async () => {
    try {
      const { data } = await api.get("/chats");
      setChats(data.chats || []);
    } catch (err) {
      console.error("Error refreshing chats:", err.message);
    }
  };

  // Initial load
  useEffect(() => {
    refreshChats();
  }, []);

  // Create new chat
  const handleNewChat = () => {
    setSelectedChat(null);
    setIsCreating(true);
  };

  // After chat is created
  const handleChatCreated = async (chat) => {
    setIsCreating(false);
    await refreshChats();
    setSelectedChat(chat.id);
  };

  // Delete a chat and refresh
  const handleDeleteChat = async (id) => {
    try {
      await api.delete(`/chats/${id}`);
      await refreshChats();
      if (selectedChat === id) setSelectedChat(null);
    } catch (err) {
      console.error("Error deleting chat:", err.message);
    }
  };

  // Select chat
  const handleSelectChat = (id) => {
    setIsCreating(false);
    setSelectedChat(id);
  };

  // Refresh current chat messages
  const refreshCurrentChat = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <div className="ask-chat-container">
      <header className="ask-chat-header">
        <h1 className="ask-chat-title">AI Chat Assistant</h1>
      </header>

      <div className="ask-main-layout">
        {/* Sidebar */}
        <aside className="ask-sidebar">
          <button onClick={handleNewChat} className="ask-new-chat-button">
            + New Chat
          </button>
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
          />
        </aside>

        {/* Chat Area */}
        <main className="ask-chat-area">
          {isCreating && <ChatCreate onChatCreated={handleChatCreated} />}

          {selectedChat && !isCreating && (
            <>
              <ChatView chatId={selectedChat} refreshKey={refreshCount} />
              <ChatAddMessage
                chatId={selectedChat}
                onNewMessages={refreshCurrentChat}
              />
            </>
          )}

          {!isCreating && !selectedChat && (
            <div className="ask-empty-chat">
              Select a chat or start a new one
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
