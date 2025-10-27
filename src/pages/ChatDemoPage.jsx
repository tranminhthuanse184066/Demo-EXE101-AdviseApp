import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const ChatDemoPage = () => {
  const { currentUser, state, sendChatMessage, clearChat } = useApp();
  const [message, setMessage] = useState('');
  const thread = (currentUser && state.chatThreads?.[currentUser.id]) || [];

  if (!currentUser) {
    return (
      <section className="chat-page">
        <p>Vui lòng đăng nhập để dùng thử chat demo.</p>
      </section>
    );
  }

  const handleSend = () => {
    sendChatMessage(message);
    setMessage('');
  };

  return (
    <section className="chat-page">
      <header>
        <h2>Chat tư vấn demo</h2>
        <p>Gõ từ khóa “học phí”, “điểm chuẩn” hoặc “khối xét tuyển” để nhận phản hồi mẫu.</p>
        <button className="ghost" type="button" onClick={clearChat}>
          Xóa lịch sử
        </button>
      </header>

      <div className="chat-window">
        {thread.length ? (
          thread.map((item) => (
            <div key={item.id} className={`bubble ${item.sender}`}>
              <p>{item.body}</p>
              <small>{new Date(item.timestamp).toLocaleTimeString()}</small>
            </div>
          ))
        ) : (
          <p className="empty-chat">Chưa có tin nhắn. Hãy hỏi thử chatbot.</p>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Nhập câu hỏi..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className="primary" type="button" onClick={handleSend}>
          Gửi
        </button>
      </div>
    </section>
  );
};

export default ChatDemoPage;
