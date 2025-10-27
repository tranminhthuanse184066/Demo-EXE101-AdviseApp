import { Button, Card, Col, Empty, Progress, Row, Space, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const TestResultPage = () => {
  const { currentUser, findProfile, findTestResult, majorGroups, universities, getRecommendation, unlockRoadmap } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const profile = currentUser ? findProfile(currentUser.id) : null;
  const result = currentUser ? findTestResult(currentUser.id) : null;
  const recommendation = currentUser ? getRecommendation(currentUser.id) : null;

  const scores = useMemo(() => {
    if (!result?.scoresJson) return [];
    try {
      return Object.entries(JSON.parse(result.scoresJson));
    } catch {
      return [];
    }
  }, [result]);

  const scoreLabels = useMemo(() => {
    if (!result?.scoreLabelsJson) return {};
    try {
      return JSON.parse(result.scoreLabelsJson);
    } catch {
      return {};
    }
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
      <Card bordered={false} className="shadow-lg">
        <Empty description="Làm một bài test để xem gợi ý" />
        <Button type="primary" shape="round" className="mt-4" onClick={() => navigate('/take-test')}>
          Làm test ngay
        </Button>
      </Card>
    );
  }

  const handleUnlock = () => {
    setError('');
    const res = unlockRoadmap();
    if (!res?.ok) {
      setError(res?.message || 'Không mở lộ trình được lúc này.');
      return;
    }
    navigate('/roadmap');
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card bordered={false} className="shadow-xl" bodyStyle={{ padding: '2rem' }}>
        <Space direction="vertical" size="middle" className="w-full">
          <Space size="middle" wrap>
            <Tag color="blue">{result.testLabel}</Tag>
            <Tag color="purple">GPA {profile?.avgScore || '--'}</Tag>
            <Tag color="green">Tổ hợp {profile?.stream || '--'}</Tag>
          </Space>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Bộ chữ cái</p>
              <h1 className="text-4xl font-semibold text-slate-900">{result.traitSummary}</h1>
            </div>
            <Space size="small" wrap>
              {topMajors.map((major) => (
                <Tag key={major.code} color="success">
                  {major.name}
                </Tag>
              ))}
            </Space>
          </div>
        </Space>
      </Card>

      {recommendation && (
        <Card bordered={false} className="shadow-lg bg-blue-50" bodyStyle={{ padding: '1.5rem' }}>
          <p className="text-sm text-blue-700">{recommendation.explanation}</p>
        </Card>
      )}

      <Card title="Phân bổ điểm" bordered={false} className="shadow-lg">
        <Space direction="vertical" size="large" className="w-full">
          {scores.map(([trait, value]) => (
            <div key={trait} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <span className="text-sm font-medium text-slate-600">{scoreLabels[trait] || trait}</span>
              <Progress percent={Math.round(((Number(value) || 0) / 12) * 100)} showInfo={false} className="w-full md:w-1/2" />
              <span className="text-lg font-semibold text-slate-900">{value}</span>
            </div>
          ))}
        </Space>
      </Card>

      <Card title="Ngành nên khám phá" bordered={false} className="shadow-lg">
        <Row gutter={[16, 16]}>
          {topMajors.map((major) => (
            <Col xs={24} md={8} key={major.code}>
              <Card bordered={false} className="h-full bg-slate-900 text-white">
                <p className="text-lg font-semibold">{major.name}</p>
                <p className="mt-2 text-sm text-white/70">{major.shortDesc}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card title="Trường phù hợp" bordered={false} className="shadow-lg">
        {suggestedUniversities.length ? (
          <Row gutter={[16, 16]}>
            {suggestedUniversities.map((uni) => (
              <Col xs={24} md={8} key={uni.id}>
                <Card bordered={false} className="h-full border border-slate-100 shadow-sm">
                  <p className="text-lg font-semibold text-slate-900">{uni.name}</p>
                  <p className="text-sm text-slate-500">{uni.city} - Điểm chuẩn {uni.minScore}</p>
                  <p className="text-xs text-slate-400">Học phí ước tính {uni.tuitionPerYear} triệu/năm</p>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Empty description="Hãy điều chỉnh bộ lọc để thấy thêm lựa chọn" />
        )}
      </Card>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <Space size="middle" wrap>
        <Button shape="round" onClick={() => navigate(`/report?studentId=${currentUser.id}`)}>
          Tải PDF
        </Button>
        <Button type="default" shape="round" onClick={() => navigate('/universities', { state: { defaultMajors: result.topMajorGroupCodes } })}>
          Xem bản đồ trường
        </Button>
        <Button type="primary" shape="round" onClick={handleUnlock}>
          {profile?.roadmapUnlocked ? 'Mở lộ trình' : 'Mở khóa lộ trình'}
        </Button>
      </Space>
    </Space>
  );
};

export default TestResultPage;
