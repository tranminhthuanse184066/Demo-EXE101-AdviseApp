import { Avatar, Button, Card, Input, List, Space, Tag } from "antd";
import { BulbOutlined, RobotOutlined, ThunderboltOutlined } from "@ant-design/icons";
import { useEffect, useMemo, useRef, useState } from "react";

const quickPrompts = [
  "Gợi ý ngành phù hợp với điểm mạnh I-R",
  "Tôi muốn biết điểm chuẩn ngành Data",
  "Mẹo giữ GPA và hoạt động ngoại khóa",
];

const responseBank = [
  {
    matcher: /(gpa|điểm chuẩn|điểm chuan|điểm)/i,
    reply:
      "Dựa trên dữ liệu demo, GPA 24 trở lên có thể nhắm đến các trường top như ĐH Bách Khoa (27), ĐH Kinh Tế (25). Bạn cứ giữ mục tiêu cao hơn điểm chuẩn 1-2 điểm nhé!",
  },
  {
    matcher: /(data|ai|khoa học dữ liệu)/i,
    reply:
      "Ngành Data đang hot ở các trường: ĐH FPT, ĐH Công Nghệ TP.HCM, ĐH Khoa Học Tự Nhiên. Bạn nên bổ sung Python, SQL và 1-2 dự án dashboard để hồ sơ nổi bật.",
  },
  {
    matcher: /(hoạt động|ngoại khóa|clb)/i,
    reply:
      "Bạn có thể thử kết hợp 1 CLB kỹ thuật và 1 hoạt động cộng đồng. Ví dụ: tham gia CLB STEM xây robot mini và mentoring đàn em, vừa tăng kỹ năng vừa đẹp hồ sơ.",
  },
  {
    matcher: /(thi|ôn tập|lộ trình)/i,
    reply:
      "Hãy chia 10 tuần trước kỳ thi thành 3 chặng: củng cố kiến thức (4 tuần), luyện đề (4 tuần) và rà soát + chăm sóc sức khỏe (2 tuần). Mỗi chặng nên có checklist rõ ràng.",
  },
  {
    matcher: /(cha mẹ|phụ huynh|parent)/i,
    reply:
      "Bạn có thể chia sẻ mã liên kết phụ huynh để bố mẹ xem cùng bảng theo dõi, sau đó đặt lịch họp ngắn mỗi tuần để cập nhật tiến độ và nhận hỗ trợ kịp thời.",
  },
];

const fallbackReplies = [
  "Mình đã ghi nhận. Bạn có thể mô tả rõ hơn mục tiêu của mình để mình đề xuất cụ thể nhé!",
  "Nghe thú vị đó! Mình đề xuất bạn đặt mục tiêu ngắn hạn (2-3 tuần) và kiểm tra lại vào cuối tuần để giữ phong độ.",
  "Bạn có thể kết hợp test RIASEC + MBTI để có góc nhìn đầy đủ hơn. Nếu cần mình gợi ý cách đọc kết quả nhé!",
];

const assistantIntro = {
  name: "AI Coach",
  avatar: "https://api.dicebear.com/9.x/bottts/svg?seed=EduPath",
  message:
    "Chào bạn! Mình là AI Coach thử nghiệm của EduPath. Hãy kể mình nghe bạn đang băn khoăn gì về ngành học, lộ trình hay việc luyện thi nhé!",
};

const AiChatPage = () => {
  const [messages, setMessages] = useState([
    {
      id: "welcome",
      role: "assistant",
      text: assistantIntro.message,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const listRef = useRef(null);

  const displayMessages = useMemo(
    () =>
      messages.map((item) => ({
        ...item,
        timeLabel: new Date(item.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      })),
    [messages],
  );

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [displayMessages, isThinking]);

  const generateReply = (content) => {
    const matched = responseBank.find((item) => item.matcher.test(content));
    if (matched) return matched.reply;
    const randomIndex = Math.floor(Math.random() * fallbackReplies.length);
    return fallbackReplies[randomIndex];
  };

  const pushMessage = (role, text) => {
    setMessages((prev) => [
      ...prev,
      { id: `${role}-${Date.now()}`, role, text, timestamp: new Date().toISOString() },
    ]);
  };

  const handleSend = (value) => {
    const content = value?.trim();
    if (!content) return;
    pushMessage("user", content);
    setInput("");
    setIsThinking(true);
    setTimeout(() => {
      const reply = generateReply(content.toLowerCase());
      pushMessage("assistant", reply);
      setIsThinking(false);
    }, 700 + Math.random() * 600);
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card
        bordered={false}
        className="shadow-lg"
        bodyStyle={{ padding: "2.25rem" }}
        title={
          <Space size="small">
            <RobotOutlined />
            <span>AI Coach thử nghiệm</span>
          </Space>
        }
        extra={<Tag color="blue">Beta</Tag>}
      >
        <Space direction="vertical" size="large" className="w-full">
          <Space direction="vertical" size="small">
            <h2 className="text-2xl font-semibold text-slate-900">Trao đổi cùng AI về học tập & định hướng</h2>
            <p className="text-sm text-slate-500">
              Chatbox này mô phỏng trợ lý AI. Nội dung chỉ mang tính gợi ý, hãy kiểm chứng trước khi ra quyết định quan trọng nhé.
            </p>
          </Space>
          <Space wrap>
            {quickPrompts.map((prompt) => (
              <Tag
                key={prompt}
                icon={<ThunderboltOutlined />}
                color="purple"
                className="cursor-pointer select-none"
                onClick={() => handleSend(prompt)}
              >
                {prompt}
              </Tag>
            ))}
          </Space>
        </Space>
      </Card>

      <Card bordered={false} className="shadow-lg" bodyStyle={{ padding: "0" }}>
        <div className="flex h-[520px] flex-col">
          <div ref={listRef} className="flex-1 space-y-4 overflow-y-auto bg-slate-50 px-6 py-5">
            <div className="flex items-start gap-3">
              <Avatar src={assistantIntro.avatar} size={44} icon={<RobotOutlined />} />
              <div>
                <div className="font-semibold text-slate-700">{assistantIntro.name}</div>
                <div className="text-sm text-slate-500">Thử nghiệm tại EduPath Next</div>
              </div>
            </div>
            <List
              dataSource={displayMessages}
              renderItem={(item) => (
                <List.Item className="border-0 px-0 py-0">
                  <div
                    className={`flex w-full ${
                      item.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-xl rounded-3xl px-4 py-3 text-sm shadow-sm ${
                        item.role === "user"
                          ? "bg-blue-500 text-white"
                          : "bg-white text-slate-700"
                      }`}
                    >
                      <p className="whitespace-pre-line leading-relaxed">{item.text}</p>
                      <span className="mt-1 block text-[10px] uppercase tracking-wide opacity-60">
                        {item.timeLabel}
                      </span>
                    </div>
                  </div>
                </List.Item>
              )}
            />
            {isThinking && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-3xl bg-white px-4 py-3 text-sm text-slate-500 shadow-sm">
                  <BulbOutlined className="animate-pulse" />
                  <span>AI đang soạn câu trả lời...</span>
                </div>
              </div>
            )}
          </div>
          <div className="border-t border-slate-200 bg-white px-6 py-4">
            <Space className="w-full" align="start">
              <Input.TextArea
                autoSize={{ minRows: 1, maxRows: 3 }}
                placeholder="Nhập câu hỏi của bạn..."
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onPressEnter={(event) => {
                  if (!event.shiftKey) {
                    event.preventDefault();
                    handleSend(input);
                  }
                }}
              />
              <Button type="primary" shape="round" onClick={() => handleSend(input)}>
                Gửi
              </Button>
            </Space>
          </div>
        </div>
      </Card>
    </Space>
  );
};

export default AiChatPage;
