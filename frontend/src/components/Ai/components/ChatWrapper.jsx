import React, { useState, useEffect } from "react";
import ChatCreate from "./ChatCreate";
import ChatList from "./ChatList";
import ChatView from "./ChatView";
import ChatAddMessage from "./ChatAddMessage";
import api from "../api/axiosInstance"; // Note: Changed to relative import if in same folder
import "../../../Style/Ask.css";

export default function ChatWrapper() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshChats = async () => {
    try {
      const { data } = await api.get("/chats");
      setChats(data.chats);
    } catch (err) {
      console.error("Error refreshing chats:", err.message);
    }
  };

  useEffect(() => {
    refreshChats();
  }, []);

  const handleNewChat = () => {
    setSelectedChat(null);
    setIsCreating(true);
  };

  const handleChatCreated = (chat) => {
    setIsCreating(false);
    setSelectedChat(chat.id);
    refreshChats();
  };

  const handleDeleteChat = (id) => {
    refreshChats();
    if (selectedChat === id) {
      setSelectedChat(null);
    }
  };

  const handleSelectChat = (id) => {
    setIsCreating(false);
    setSelectedChat(id);
  };

  const refreshCurrentChat = () => {
    setRefreshCount((prev) => prev + 1);
  };

  return (
    <div className="ask-chat-container">
      <div className="ask-chat-header">
        <h1 className="ask-chat-title">AI Chat Assistant</h1>
      </div>

      <div className="ask-main-layout">
        <div className="ask-sidebar">
          <button onClick={handleNewChat} className="ask-new-chat-button">
            New Chat
          </button>
          <ChatList
            chats={chats}
            selectedChat={selectedChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
          />
        </div>

        <div className="ask-chat-area">
          {isCreating && <ChatCreate onChatCreated={handleChatCreated} />}
          {selectedChat && (
            <>
              <ChatView chatId={selectedChat} refreshKey={refreshCount} />
              <ChatAddMessage chatId={selectedChat} onNewMessages={refreshCurrentChat} />
            </>
          )}
          {!isCreating && !selectedChat && (
            <div className="ask-empty-chat">Select a chat or start a new one</div>
          )}
        </div>
      </div>
    </div>
  );
}