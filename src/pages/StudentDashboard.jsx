import { Avatar, Button, Card, Col, Empty, Progress, Row, Space, Statistic, Tag, Tooltip } from 'antd';
import { ExperimentOutlined, FireOutlined, HeartOutlined, SendOutlined, StarFilled, TeamOutlined } from '@ant-design/icons';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const quickTiles = [
  { icon: <ExperimentOutlined />, label: 'Làm test', to: '/take-test' },
  { icon: <FireOutlined />, label: 'Ngành nổi bật', to: '/test-result' },
  { icon: <TeamOutlined />, label: 'Trường phù hợp', to: '/universities' },
  { icon: <SendOutlined />, label: 'Xem lộ trình', to: '/roadmap' },
];

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

  if (!currentUser || currentUser.role !== 'student') {
    return (
      <Card className="shadow-lg" bordered={false}>
        <Empty description="Đăng nhập bằng tài khoản học sinh để xem bảng tin" />
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card bordered={false} className="shadow-xl" bodyStyle={{ padding: '2rem' }}>
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
          <Space size="large">
            <Avatar size={80} src={currentUser.avatar} />
            <Space direction="vertical" size={4}>
              <span className="text-sm text-slate-500">Chào mừng trở lại</span>
              <h2 className="text-2xl font-semibold text-slate-900">{currentUser.fullName}</h2>
              <Space size="small" wrap>
                <Tag color="blue">GPA {profile?.avgScore ?? '--'}</Tag>
                <Tag color="green">Tổ hợp {profile?.stream || 'Cập nhật sau'}</Tag>
                <Tag color="purple">Mã phụ huynh {currentUser.linkedParentCode || 'Đang tạo'}</Tag>
              </Space>
            </Space>
          </Space>
          <Row gutter={16} className="w-full md:w-auto">
            <Col xs={12} md={8}>
              <Statistic title="Bài test" value={testResult ? 1 : 0} suffix="đã làm" valueStyle={{ fontSize: 28 }} />
            </Col>
            <Col xs={12} md={8}>
              <Statistic title="Trường lưu" value={profile?.savedUniversities?.length || 0} suffix="trường" valueStyle={{ fontSize: 28 }} />
            </Col>
            <Col xs={12} md={8}>
              <Statistic title="Lộ trình" value={profile?.roadmapUnlocked ? 'Đã mở' : 'Chưa mở'} valueStyle={{ fontSize: 24 }} />
            </Col>
          </Row>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        {quickTiles.map((tile) => (
          <Col key={tile.label} xs={12} md={6}>
            <Card hoverable className="h-full border-none bg-white/80 shadow-lg" onClick={() => navigate(tile.to)}>
              <Space direction="vertical" size="middle" className="items-start">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-xl text-blue-600">
                  {tile.icon}
                </span>
                <p className="text-lg font-semibold text-slate-800">{tile.label}</p>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Mục tiêu nhanh" bordered={false} className="shadow-lg">
            <Space direction="vertical" size="middle" className="w-full">
              <Space size="large">
                <Tag color="gold" icon={<StarFilled />}>Điểm nóng</Tag>
                <span className="text-sm text-slate-500">Giữ GPA >= 8.0 mỗi học kỳ</span>
              </Space>
              <Space size="small" wrap>
                {(profile?.interests?.length ? profile.interests : ['Cập nhật sở thích']).map((chip) => (
                  <Tag key={chip} bordered={false} color="blue">
                    {chip}
                  </Tag>
                ))}
              </Space>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Bài test mới nhất" bordered={false} className="shadow-lg">
            {testResult ? (
              <Space direction="vertical" size="middle" className="w-full">
                <div className="flex items-center gap-3">
                  <Tag color="blue">{testResult.testLabel}</Tag>
                  <span className="text-lg font-semibold text-slate-900">{testResult.traitSummary}</span>
                </div>
                <Space size="small" wrap>
                  {topMajors.map((major) => (
                    <Tag key={major.code} color="green">
                      {major.name}
                    </Tag>
                  ))}
                </Space>
                <Button type="link" onClick={() => navigate('/test-result')}>
                  Xem báo cáo chi tiết
                </Button>
              </Space>
            ) : (
              <Space direction="vertical" size="middle" className="w-full items-start">
                <p className="text-sm text-slate-500">Bạn chưa làm bài test nào. Thử một quiz cực nhanh nhé!</p>
                <Button type="primary" shape="round" onClick={() => navigate('/take-test')}>
                  Làm test ngay
                </Button>
              </Space>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="Trường đã lưu" bordered={false} className="shadow-lg">
        {profile?.savedUniversities?.length ? (
          <Row gutter={[16, 16]}>
            {universities
              .filter((uni) => profile.savedUniversities.includes(uni.id))
              .map((uni) => (
                <Col xs={24} md={12} key={uni.id}>
                  <Card hoverable className="h-full border border-slate-100 shadow-sm" onClick={() => window.open(uni.url, '_blank')}>
                    <Space direction="vertical" size="small">
                      <p className="text-lg font-semibold text-slate-900">{uni.name}</p>
                      <span className="text-sm text-slate-500">{uni.city} - Điểm chuẩn {uni.minScore}</span>
                      <Tooltip title="Mở website trường">
                        <Button type="text" size="small">
                          Xem website
                        </Button>
                      </Tooltip>
                    </Space>
                  </Card>
                </Col>
              ))}
          </Row>
        ) : (
          <Empty description="Chưa có trường yêu thích" />
        )}
      </Card>

      {profile?.roadmapUnlocked && profile?.roadmap?.length ? (
        <Card title="Nhịp độ lộ trình" bordered={false} className="shadow-lg">
          <Row gutter={[16, 16]}>
            {profile.roadmap.slice(0, 3).map((step) => (
              <Col xs={24} md={8} key={step.id}>
                <Card bordered={false} className="border border-slate-100 bg-blue-50/60 shadow-sm">
                  <Space direction="vertical" size="small">
                    <Tag color="blue">{step.phase.split(' ')[0]}</Tag>
                    <p className="font-semibold text-slate-900">{step.title}</p>
                    <Progress percent={step.status === 'done' ? 100 : step.status === 'doing' ? 60 : 15} size="small" status="active" />
                  </Space>
                </Card>
              </Col>
            ))}
          </Row>
          <Button className="mt-4" shape="round" onClick={() => navigate('/roadmap')}>
            Mở toàn bộ lộ trình
          </Button>
        </Card>
      ) : null}

      <Card bordered={false} className="shadow-lg">
        <Space direction="vertical" size="small" className="w-full">
          <Tag color="pink" icon={<HeartOutlined />}>Chia sẻ với phụ huynh</Tag>
          <p className="text-sm text-slate-500">Gửi mã dưới đây để phụ huynh liên kết tài khoản.</p>
          <div className="flex items-center gap-3 rounded-2xl border border-dashed border-pink-200 bg-pink-50 px-4 py-3 text-lg font-semibold text-pink-600">
            {currentUser.linkedParentCode || 'Đang tạo'}
          </div>
        </Space>
      </Card>
    </Space>
  );
};

export default StudentDashboard;
