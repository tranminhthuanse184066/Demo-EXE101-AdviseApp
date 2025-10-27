import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const TestResultPage = () => {
  const { currentUser, findProfile, findTestResult, majorGroups, universities, getRecommendation } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const profile = currentUser ? findProfile(currentUser.id) : null;
  const result = currentUser ? findTestResult(currentUser.id) : null;
  const recommendation = currentUser ? getRecommendation(currentUser.id) : null;

  const scores = useMemo(() => {
    if (!result?.scoresJson) return [];
    return Object.entries(JSON.parse(result.scoresJson));
  }, [result]);

  const topMajors = useMemo(
    () =>
      result
        ? result.topMajorGroupCodes
            .map((code) => majorGroups.find((group) => group.code === code))
            .filter(Boolean)
        : [],
    [result, majorGroups],
  );

  const suggestedUniversities = useMemo(() => {
    if (!result) return [];
    return universities
      .filter(
        (uni) =>
          uni.majors.some((code) => result.topMajorGroupCodes.includes(code)) &&
          (!profile?.avgScore || uni.minScore <= Number(profile.avgScore) + 3),
      )
      .slice(0, 3);
  }, [profile, result, universities]);

  if (!currentUser || !result) {
    return (
      <section className="test-result">
        <p>Chưa có dữ liệu trắc nghiệm. Hãy làm bài test để xem gợi ý.</p>
        <button className="primary" type="button" onClick={() => navigate('/take-test')}>
          Làm trắc nghiệm
        </button>
      </section>
    );
  }

  return (
    <section className={`test-result ${location.state?.highlight ? 'highlight' : ''}`}>
      <header>
        <h2>Kết quả trắc nghiệm của bạn</h2>
        <p>
          Hồ sơ {currentUser.fullName} · Điểm TB hiện tại {profile?.avgScore || '--'} · Tổ hợp{' '}
          {profile?.stream || '--'}
        </p>
      </header>

      <div className="result-summary">
        <div>
          <span>Trait summary</span>
          <h1>{result.traitSummary}</h1>
        </div>
        <div>
          <span>Top nhóm ngành</span>
          <div className="tag-row">
            {topMajors.map((major) => (
              <span key={major.code} className="tag">
                {major.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      <article className="panel">
        <header>
          <h3>Điểm từng nhóm RIASEC</h3>
        </header>
        <ul className="score-list">
          {scores.map(([trait, value]) => (
            <li key={trait}>
              <span>{trait}</span>
              <progress max="12" value={value}></progress>
              <strong>{value}</strong>
            </li>
          ))}
        </ul>
      </article>

      <article className="panel">
        <header>
          <h3>Gợi ý ngành nghề</h3>
        </header>
        <div className="grid-3">
          {topMajors.map((major) => (
            <div key={major.code} className="info-card">
              <h4>{major.name}</h4>
              <p>{major.shortDesc}</p>
            </div>
          ))}
        </div>
        {recommendation && <p className="small-note">{recommendation.explanation}</p>}
      </article>

      <article className="panel">
        <header>
          <h3>Top trường đề xuất</h3>
        </header>
        {suggestedUniversities.length ? (
          <div className="grid-3">
            {suggestedUniversities.map((uni) => (
              <div key={uni.id} className="info-card">
                <h4>{uni.name}</h4>
                <p>
                  {uni.city} · Điểm tối thiểu {uni.minScore}
                </p>
                <small>Học phí ~ {uni.tuitionPerYear} triệu/năm</small>
              </div>
            ))}
          </div>
        ) : (
          <p>Chưa có trường phù hợp. Thử giảm điều kiện lọc.</p>
        )}
      </article>

      <div className="button-row">
        <button className="secondary" type="button" onClick={() => navigate('/report?studentId=' + currentUser.id)}>
          Tải PDF
        </button>
        <button
          className="primary"
          type="button"
          onClick={() =>
            navigate('/universities', {
              state: { defaultMajors: result.topMajorGroupCodes },
            })
          }
        >
          Xem gợi ý trường
        </button>
      </div>
    </section>
  );
};

export default TestResultPage;
