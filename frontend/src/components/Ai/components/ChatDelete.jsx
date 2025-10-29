import React from "react";
import api from "../api/axiosInstance";

export default function ChatDelete({ chatId, onDeleted }) {
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this chat?")) return;
    try {
      await api.delete(`/chats/${chatId}`);
      onDeleted(chatId);
    } catch (err) {
      alert(err.response?.data?.error || "Failed to delete chat");
    }
  };

  return (
    <button onClick={handleDelete} className="ask-delete-button">
      🗑️
    </button>
  );
}