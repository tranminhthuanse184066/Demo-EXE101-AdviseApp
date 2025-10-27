import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const cityLabels = {
  all: 'Tất cả',
  HN: 'Hà Nội',
  HCM: 'TP.HCM',
  ĐN: 'Đà Nẵng',
};

const UniversitiesPage = () => {
  const { currentUser, findProfile, universities, majorGroups, saveUniversityPreference } = useApp();
  const location = useLocation();
  const profile = currentUser?.role === 'student' ? findProfile(currentUser.id) : null;
  const [filterMajor, setFilterMajor] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [onlyReachable, setOnlyReachable] = useState(true);
  const [compareList, setCompareList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.state?.defaultMajors?.length) {
      setFilterMajor(location.state.defaultMajors[0]);
    }
  }, [location.state]);

  const getMajorNames = (uni) =>
    uni.majors
      .map((code) => majorGroups.find((group) => group.code === code)?.name)
      .filter(Boolean)
      .join(', ');

  const filteredUniversities = useMemo(
    () =>
      universities.filter((uni) => {
        const matchMajor = filterMajor ? uni.majors.includes(filterMajor) : true;
        const matchCity = filterCity === 'all' ? true : uni.city === filterCity;
        const matchScore =
          !onlyReachable || !profile?.avgScore ? true : uni.minScore <= Number(profile.avgScore) + 1;
        return matchMajor && matchCity && matchScore;
      }),
    [universities, filterMajor, filterCity, onlyReachable, profile],
  );

  const toggleCompare = (uni) => {
    setCompareList((prev) => {
      if (prev.find((item) => item.id === uni.id)) {
        return prev.filter((item) => item.id !== uni.id);
      }
      if (prev.length === 2) {
        const [, second] = prev;
        return [second, uni];
      }
      return [...prev, uni];
    });
  };

  useEffect(() => {
    if (compareList.length === 2) {
      setShowModal(true);
    }
  }, [compareList]);

  return (
    <section className="universities-page">
      <header>
        <h2>So sánh trường đại học</h2>
        <p>Lọc theo nhóm ngành, thành phố và điểm xét tuyển phù hợp với điểm trung bình.</p>
      </header>

      <div className="filter-bar">
        <label>
          Nhóm ngành
          <select value={filterMajor} onChange={(e) => setFilterMajor(e.target.value)}>
            <option value="">Tất cả</option>
            {majorGroups.map((group) => (
              <option key={group.code} value={group.code}>
                {group.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Thành phố
          <select value={filterCity} onChange={(e) => setFilterCity(e.target.value)}>
            {Object.entries(cityLabels).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="checkbox">
          <input type="checkbox" checked={onlyReachable} onChange={(e) => setOnlyReachable(e.target.checked)} />
          Điểm chuẩn ≤ điểm TB ({profile?.avgScore || '--'})
        </label>
      </div>

      <div className="grid-3">
        {filteredUniversities.map((uni) => {
          const isCompared = compareList.some((item) => item.id === uni.id);
          const isSaved = profile?.savedUniversities?.includes(uni.id);
          return (
            <article key={uni.id} className={`info-card university ${isCompared ? 'selected' : ''}`}>
              <div className="card-head">
                <h4>{uni.name}</h4>
                <span>{cityLabels[uni.city] || uni.city}</span>
              </div>
              <p>Điểm chuẩn: {uni.minScore}</p>
              <p>Học phí: {uni.tuitionPerYear} triệu/năm</p>
              <p>Ngành: {getMajorNames(uni)}</p>
              <div className="card-actions">
                {currentUser?.role === 'student' && (
                  <button className="ghost" type="button" onClick={() => saveUniversityPreference(currentUser.id, uni.id)}>
                    {isSaved ? 'Bỏ lưu' : 'Lưu'}
                  </button>
                )}
                <button className="secondary" type="button" onClick={() => toggleCompare(uni)}>
                  {isCompared ? 'Bỏ so sánh' : 'So sánh'}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {showModal && compareList.length === 2 && (
        <div className="modal">
          <div className="modal-card">
            <header>
              <h3>So sánh 2 trường</h3>
              <button type="button" onClick={() => setShowModal(false)}>
                Đóng
              </button>
            </header>
            <table>
              <thead>
                <tr>
                  <th>Tiêu chí</th>
                  {compareList.map((uni) => (
                    <th key={uni.id}>{uni.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Thành phố</td>
                  {compareList.map((uni) => (
                    <td key={`${uni.id}-city`}>{cityLabels[uni.city] || uni.city}</td>
                  ))}
                </tr>
                <tr>
                  <td>Điểm chuẩn</td>
                  {compareList.map((uni) => (
                    <td key={`${uni.id}-score`}>{uni.minScore}</td>
                  ))}
                </tr>
                <tr>
                  <td>Học phí</td>
                  {compareList.map((uni) => (
                    <td key={`${uni.id}-fee`}>{uni.tuitionPerYear} triệu</td>
                  ))}
                </tr>
                <tr>
                  <td>Nhóm ngành</td>
                  {compareList.map((uni) => (
                    <td key={`${uni.id}-majors`}>{getMajorNames(uni)}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default UniversitiesPage;
