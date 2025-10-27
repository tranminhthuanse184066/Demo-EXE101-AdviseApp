import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const ParentDashboard = () => {
  const {
    currentUser,
    linkParentToStudent,
    getLinkedStudentForParent,
    findProfile,
    findTestResult,
    majorGroups,
    universities,
  } = useApp();
  const [code, setCode] = useState('');
  const [feedback, setFeedback] = useState('');
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'parent') {
    return (
      <section className="parent-dashboard">
        <p>Đăng nhập bằng tài khoản phụ huynh để sử dụng tính năng này.</p>
      </section>
    );
  }

  const linkedStudent = getLinkedStudentForParent(currentUser.id);
  const profile = linkedStudent ? findProfile(linkedStudent.id) : null;
  const result = linkedStudent ? findTestResult(linkedStudent.id) : null;

  const topMajors = useMemo(() => {
    if (!result) return [];
    return result.topMajorGroupCodes
      .map((codeItem) => majorGroups.find((group) => group.code === codeItem))
      .filter(Boolean);
  }, [result, majorGroups]);

  const suggestedUniversities = useMemo(() => {
    if (!result) return [];
    return universities
      .filter((uni) => uni.majors.some((codeItem) => result.topMajorGroupCodes.includes(codeItem)))
      .slice(0, 3);
  }, [result, universities]);

  const handleLink = (event) => {
    event.preventDefault();
    const res = linkParentToStudent(code);
    if (!res?.ok) {
      setFeedback(res.message);
      return;
    }
    setFeedback(`Đã liên kết với ${res.student.fullName}`);
  };

  return (
    <section className="parent-dashboard">
      <header>
        <h2>Trung tâm phụ huynh</h2>
        <p>Theo dõi tiến độ con bạn và tải báo cáo PDF.</p>
      </header>

      {!linkedStudent ? (
        <div className="panel icon-card link-card">
          <span className="icon-bubble">🔗</span>
          <form className="form" onSubmit={handleLink}>
            <label>
              Nhập mã liên kết do con cung cấp
              <input type="text" value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} />
            </label>
            <button className="primary" type="submit">
              Liên kết ngay
            </button>
            {feedback && <p className="form-message">{feedback}</p>}
            <p className="small-note">Ví dụ: mã của Minh Anh là MA7285.</p>
          </form>
        </div>
      ) : (
        <>
          <div className="panel profile-summary">
            <div className="profile-head">
              <img src={linkedStudent.avatar} alt={linkedStudent.fullName} />
              <div>
                <p className="eyebrow">Đang theo dõi</p>
                <h3>{linkedStudent.fullName}</h3>
                <p>Lớp {profile?.gradeLevel} · Điểm TB {profile?.avgScore}</p>
              </div>
            </div>
            <div className="parent-badges">
              <span className="icon-bubble">📘</span>
              <div>
                <p>Tổ hợp</p>
                <strong>{profile?.stream}</strong>
              </div>
              <span className="icon-bubble">🧾</span>
              <div>
                <p>Mã phụ huynh</p>
                <strong>{linkedStudent.linkedParentCode}</strong>
              </div>
            </div>
          </div>

          <article className="panel icon-card">
            <span className="icon-bubble">📊</span>
            <header>
              <h3>Kết quả trắc nghiệm</h3>
            </header>
            {result ? (
              <>
                <p className="trait-highlight">{result.traitSummary}</p>
                <div className="tag-row">
                  {topMajors.map((major) => (
                    <span key={major.code} className="tag">
                      {major.name}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p>Học sinh chưa hoàn thành bài test.</p>
            )}
          </article>

          <article className="panel icon-card">
            <span className="icon-bubble">🎓</span>
            <header>
              <h3>3 trường gợi ý</h3>
            </header>
            <div className="grid-3">
              {suggestedUniversities.map((uni) => (
                <div key={uni.id} className="info-card">
                  <h4>{uni.name}</h4>
                  <p>
                    Điểm chuẩn {uni.minScore} · Học phí {uni.tuitionPerYear} triệu
                  </p>
                </div>
              ))}
            </div>
          </article>

          <button
            className="secondary"
            type="button"
            onClick={() => navigate(`/report?studentId=${linkedStudent.id}`)}
          >
            Tải PDF report
          </button>
        </>
      )}
    </section>
  );
};

export default ParentDashboard;
