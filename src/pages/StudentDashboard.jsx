import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const StudentDashboard = () => {
  const { currentUser, findProfile, findTestResult, majorGroups, universities } = useApp();
  const navigate = useNavigate();

  const profile = currentUser ? findProfile(currentUser.id) : null;
  const testResult = currentUser ? findTestResult(currentUser.id) : null;

  const topMajors = useMemo(() => {
    if (!testResult) return [];
    return testResult.topMajorGroupCodes
      .map((code) => majorGroups.find((group) => group.code === code))
      .filter(Boolean);
  }, [testResult, majorGroups]);

  const actionCards = [
    { icon: '🧠', label: 'Làm trắc nghiệm', desc: '10-15 câu vibe GenZ', to: '/take-test' },
    { icon: '✨', label: 'Kết quả & ngành', desc: 'Top 3 nhóm nổi bật', to: '/test-result' },
    { icon: '🎓', label: 'Tìm trường', desc: 'Lọc & so sánh 20+ trường', to: '/universities' },
    { icon: '🗺️', label: 'Roadmap', desc: 'Tick trạng thái tiến độ', to: '/roadmap' },
    { icon: '💬', label: 'Chat tư vấn', desc: 'Bot trả lời FAQ', to: '/chat' },
  ];

  if (!currentUser || currentUser.role !== 'student') {
    return (
      <section className="dashboard">
        <p>Vui lòng đăng nhập bằng tài khoản học sinh để xem dashboard.</p>
      </section>
    );
  }

  return (
    <section className="dashboard">
      <div className="dashboard-hero">
        <div className="profile-head">
          <img src={currentUser.avatar} alt={currentUser.fullName} />
          <div>
            <p className="eyebrow">Xin chào</p>
            <h2>{currentUser.fullName}</h2>
            <p>Lớp {profile?.gradeLevel || '--'} · Điểm TB {profile?.avgScore ?? '--'}</p>
            <small>Mã liên kết phụ huynh: {currentUser.linkedParentCode || 'Đang tạo...'}</small>
          </div>
        </div>
        <div className="guidance-card">
          <h3>3 bước ngay</h3>
          <div className="guidance-list">
            <span>1️⃣ Test RIASEC</span>
            <span>2️⃣ Nhận ngành</span>
            <span>3️⃣ Share phụ huynh</span>
          </div>
        </div>
      </div>

      <div className="grid-4">
        {actionCards.map((card) => (
          <button key={card.to} className="action-card icon-card" type="button" onClick={() => navigate(card.to)}>
            <span className="icon-bubble">{card.icon}</span>
            <div>
              <span>{card.label}</span>
              <p>{card.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <div className="insight-row">
        <article className="panel mini">
          <span className="icon-bubble">📚</span>
          <div>
            <p>Tổ hợp mạnh</p>
            <strong>{profile?.stream || 'N/A'}</strong>
          </div>
        </article>
        <article className="panel mini">
          <span className="icon-bubble">🔥</span>
          <div>
            <p>Nhóm ngành top</p>
            <strong>{topMajors[0]?.name || 'Chưa có'}</strong>
          </div>
        </article>
        <article className="panel mini">
          <span className="icon-bubble">❤️</span>
          <div>
            <p>Trường đã lưu</p>
            <strong>{profile?.savedUniversities?.length || 0}</strong>
          </div>
        </article>
      </div>

      <div className="panel-grid">
        <article className="panel">
          <header>
            <h3>Hồ sơ học sinh</h3>
          </header>
          <ul className="profile-list">
            <li>
              <span>Khối lớp</span>
              <strong>{profile?.gradeLevel || '-'}</strong>
            </li>
            <li>
              <span>Tổ hợp</span>
              <strong>{profile?.stream || '-'}</strong>
            </li>
            <li>
              <span>Sở thích</span>
              <strong>{profile?.interests?.join(', ') || 'Cập nhật thêm'}</strong>
            </li>
          </ul>
        </article>

        <article className="panel">
          <header>
            <h3>Kết quả mới nhất</h3>
          </header>
          {testResult ? (
            <>
              <p className="trait-highlight">{testResult.traitSummary}</p>
              <div className="tag-row">
                {topMajors.map((major) => (
                  <span key={major.code} className="tag">
                    {major.name}
                  </span>
                ))}
              </div>
              <button className="secondary" type="button" onClick={() => navigate('/test-result')}>
                Xem chi tiết
              </button>
            </>
          ) : (
            <>
              <p>Chưa có bài test. Hãy bắt đầu để nhận gợi ý ngành.</p>
              <button className="primary" type="button" onClick={() => navigate('/take-test')}>
                Làm trắc nghiệm
              </button>
            </>
          )}
        </article>
      </div>

      <article className="panel">
        <header>
          <h3>Trường đã lưu</h3>
        </header>
        {profile?.savedUniversities?.length ? (
          <div className="grid-3">
            {universities
              .filter((uni) => profile.savedUniversities.includes(uni.id))
              .map((uni) => (
                <div key={uni.id} className="info-card icon-card">
                  <span className="icon-bubble">🎓</span>
                  <div>
                    <h4>{uni.name}</h4>
                    <p>
                      {uni.city} · Điểm chuẩn {uni.minScore}
                    </p>
                    <a href={uni.url} target="_blank" rel="noreferrer">
                      Website trường
                    </a>
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p>Chưa lưu trường nào. Hãy khám phá ở mục Tìm & So sánh Trường.</p>
        )}
      </article>
    </section>
  );
};

export default StudentDashboard;
