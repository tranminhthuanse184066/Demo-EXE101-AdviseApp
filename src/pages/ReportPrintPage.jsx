import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const ReportPrintPage = () => {
  const { state, findProfile, findTestResult, majorGroups, universities } = useApp();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const studentId = searchParams.get('studentId');
  const student = state.users.find((user) => user.id === studentId);
  const profile = student ? findProfile(student.id) : null;
  const result = student ? findTestResult(student.id) : null;

  const topMajors = useMemo(() => {
    if (!result) return [];
    return result.topMajorGroupCodes
      .map((code) => majorGroups.find((group) => group.code === code))
      .filter(Boolean);
  }, [result, majorGroups]);

  const suggestedUniversities = useMemo(() => {
    if (!result) return [];
    return universities.filter((uni) => uni.majors.some((code) => result.topMajorGroupCodes.includes(code))).slice(0, 3);
  }, [result, universities]);

  if (!student) {
    return (
      <section className="report-print">
        <p>Không tìm thấy học sinh.</p>
        <button type="button" onClick={() => navigate('/')}>
          Quay lại
        </button>
      </section>
    );
  }

  return (
    <section className="report-print">
      <div className="print-toolbar">
        <button type="button" onClick={() => navigate(-1)}>
          ← Quay lại
        </button>
        <button className="primary" type="button" onClick={() => window.print()}>
          In/PDF
        </button>
      </div>
      <div className="report-sheet">
        <header>
          <h1>EduPath Report</h1>
          <p>Học sinh: {student.fullName}</p>
          <p>Lớp: {profile?.gradeLevel} · Tổ hợp: {profile?.stream}</p>
        </header>

        <section>
          <h2>Tổng quan kết quả</h2>
          <p>Trait summary: {result?.traitSummary || 'Chưa có'}</p>
          <ul>
            {topMajors.map((major) => (
              <li key={major.code}>
                <strong>{major.name}</strong>: {major.shortDesc}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Đề xuất trường</h2>
          <ol>
            {suggestedUniversities.map((uni) => (
              <li key={uni.id}>
                {uni.name} ({uni.city}) – Điểm chuẩn {uni.minScore} · Học phí {uni.tuitionPerYear} triệu/năm
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2>Lộ trình hành động</h2>
          {profile?.roadmap?.length ? (
            <ol>
              {profile.roadmap.map((step) => (
                <li key={step.id}>
                  <strong>{step.title}</strong> · Hạn {step.dueDate} · Trạng thái: {step.status}
                </li>
              ))}
            </ol>
          ) : (
            <p>Chưa có dữ liệu.</p>
          )}
        </section>
      </div>
    </section>
  );
};

export default ReportPrintPage;
