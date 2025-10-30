import ChatDelete from "./ChatDelete";

export default function ChatList({ chats, selectedChat, onSelectChat, onDeleteChat }) {
  return (
    <div className="ask-chat-list">
      {chats.map((chat) => (
        <div
          key={chat.id}
          className={`ask-chat-item ${selectedChat === chat.id ? "ask-chat-item-selected" : ""}`}
          onClick={() => onSelectChat(chat.id)}
        >
          <div className="ask-chat-item-title">{chat.title || "Untitled Chat"}</div>
          <div className="ask-chat-item-date">{new Date(chat.created_at).toLocaleDateString()}</div>
          <ChatDelete chatId={chat.id} onDeleted={() => onDeleteChat(chat.id)} />
        </div>
      ))}
    </div>
  );
}