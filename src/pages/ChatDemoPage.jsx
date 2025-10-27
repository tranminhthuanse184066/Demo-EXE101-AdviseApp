import { Button, Card, Empty, Input, List, Space, Tag } from 'antd';
import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const ChatDemoPage = () => {
  const { currentUser, state, sendChatMessage, clearChat } = useApp();
  const [message, setMessage] = useState('');
  const thread = (currentUser && state.chatThreads?.[currentUser.id]) || [];

  if (!currentUser) {
    return (
      <Card bordered={false} className="shadow-lg">
        <Empty description="Đăng nhập để sử dụng chat" />
      </Card>
    );
  }

  const handleSend = () => {
    if (!message.trim()) return;
    sendChatMessage(message);
    setMessage('');
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card bordered={false} className="shadow-lg" title="Chat tư vấn nhanh">
        <Space size="small" className="w-full justify-between">
          <Tag color="blue">Trả lời mẫu</Tag>
          <Button type="text" onClick={clearChat}>
            Xóa đoạn chat
          </Button>
        </Space>
        <List
          className="mt-4 h-80 overflow-y-auto rounded-2xl border border-slate-100 bg-slate-50 p-4"
          dataSource={thread}
          locale={{ emptyText: 'Chưa có tin nhắn. Hỏi thử về học phí, điểm chuẩn, khối thi...' }}
          renderItem={(item) => (
            <List.Item className={`border-none ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-xs rounded-2xl px-4 py-3 text-sm shadow-sm ${
                  item.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-white text-slate-700'
                }`}
              >
                <p>{item.body}</p>
                <span className="mt-1 block text-[10px] opacity-70">{new Date(item.timestamp).toLocaleTimeString()}</span>
              </div>
            </List.Item>
          )}
        />
        <Space className="mt-4 w-full" align="center">
          <Input
            size="large"
            placeholder="Gõ câu hỏi của bạn"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onPressEnter={handleSend}
          />
          <Button type="primary" size="large" shape="round" onClick={handleSend}>
            Gửi
          </Button>
        </Space>
      </Card>
    </Space>
  );
};

export default ChatDemoPage;
