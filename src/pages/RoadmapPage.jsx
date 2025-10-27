import { useApp } from '../context/AppContext.jsx';

const statusLabel = {
  todo: 'Chưa bắt đầu',
  doing: 'Đang thực hiện',
  done: 'Hoàn thành',
};

const RoadmapPage = () => {
  const { currentUser, findProfile, toggleRoadmapStep } = useApp();
  const profile = currentUser ? findProfile(currentUser.id) : null;

  if (!currentUser || currentUser.role !== 'student') {
    return (
      <section className="roadmap-page">
        <p>Chỉ học sinh mới có thể chỉnh sửa lộ trình.</p>
      </section>
    );
  }

  return (
    <section className="roadmap-page">
      <header>
        <h2>Lộ trình mục tiêu</h2>
        <p>Bấm vào từng bước để chuyển trạng thái (todo → doing → done).</p>
      </header>
      <div className="roadmap-list">
        {profile?.roadmap?.length ? (
          profile.roadmap.map((step) => (
            <button
              key={step.id}
              className={`roadmap-step ${step.status}`}
              type="button"
              onClick={() => toggleRoadmapStep(currentUser.id, step.id)}
            >
              <div>
                <h4>{step.title}</h4>
                <p>Hạn: {step.dueDate}</p>
              </div>
              <span>{statusLabel[step.status]}</span>
            </button>
          ))
        ) : (
          <p>Chưa có roadmap. Hãy tạo hồ sơ học sinh.</p>
        )}
      </div>
    </section>
  );
};

export default RoadmapPage;
