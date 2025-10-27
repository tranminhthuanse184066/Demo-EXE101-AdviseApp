import { useNavigate } from 'react-router-dom';

const featureCards = [
  {
    icon: '🧠',
    title: 'Trắc nghiệm RIASEC',
    desc: '15 câu hỏi dạng swipe, ra trait summary và nhóm ngành hot.',
  },
  {
    icon: '🎓',
    title: 'So sánh trường',
    desc: '20+ trường top, lọc theo thành phố, ngành và điểm chuẩn.',
  },
  {
    icon: '🛣️',
    title: 'Roadmap có thể tick',
    desc: 'Checklist 3 bước quan trọng giữ bạn đúng tiến độ.',
  },
  {
    icon: '💬',
    title: 'Chat FAQ siêu nhanh',
    desc: 'Bot mini trả lời ngay các câu hỏi học phí/khối xét tuyển.',
  },
];

const timelineItems = [
  { icon: '⚡', label: 'Đăng ký hoặc dùng tài khoản demo', step: '01' },
  { icon: '🧩', label: 'Làm test 5 phút, nhận Trait + gợi ý ngành', step: '02' },
  { icon: '📊', label: 'Lọc trường, chia sẻ mã cho phụ huynh & in PDF', step: '03' },
];

const landingHighlights = [
  { label: 'Responsive', detail: 'Mobile first' },
  { label: 'Mock data', detail: 'Không cần backend' },
  { label: 'GenZ friendly', detail: 'Nhiều icon + màu pastel' },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <section className="landing">
      <div className="hero hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">EduPath – Career Guidance MVP</p>
          <h1>Bắt đầu định hướng tương lai chỉ trong 5 phút.</h1>
          <p className="lead">
            Prototype giúp học sinh và phụ huynh trải nghiệm đầy đủ luồng: đăng ký, test RIASEC, xem kết quả, lọc trường
            và chia sẻ báo cáo.
          </p>
          <div className="hero-actions">
            <button className="primary" type="button" onClick={() => navigate('/auth?role=student')}>
              Tôi là Học sinh
            </button>
            <button className="secondary" type="button" onClick={() => navigate('/auth?role=parent')}>
              Tôi là Phụ huynh
            </button>
          </div>
          <div className="hero-highlights">
            {landingHighlights.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <div className="bubble big">🚀</div>
          <div className="bubble medium">🎧</div>
          <div className="bubble small">📚</div>
          <div className="visual-card">
            <p>GenZ Career Journey</p>
            <ul>
              <li>Test xong trong 5'</li>
              <li>Nhận 3 ngành đề xuất</li>
              <li>So sánh ngay 2 trường</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="section">
        <h2>Tính năng nổi bật</h2>
        <div className="grid-4">
          {featureCards.map((card) => (
            <article key={card.title} className="info-card icon-card">
              <span className="icon-bubble">{card.icon}</span>
              <div>
                <h3>{card.title}</h3>
                <p>{card.desc}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="section">
        <h2>3 bước demo</h2>
        <div className="timeline">
          {timelineItems.map((item) => (
            <div key={item.step}>
              <span className="icon-bubble">{item.icon}</span>
              <strong>{item.step}</strong>
              <p>{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
