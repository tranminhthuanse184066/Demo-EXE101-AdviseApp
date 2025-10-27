import { Button, Card, Carousel, Col, Row, Space, Tag } from 'antd';
import {
  AimOutlined,
  BulbOutlined,
  CompassOutlined,
  ExperimentOutlined,
  FireOutlined,
  RocketOutlined,
  SmileOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { assessmentCatalog } from '../data/assessments.js';

const featureTiles = [
  { icon: <ExperimentOutlined />, title: 'Test cực nhanh', chip: 'RIASEC - MBTI - MAPP - MI' },
  { icon: <AimOutlined />, title: 'Gợi ý thông minh', chip: 'Top 3 nhóm ngành' },
  { icon: <CompassOutlined />, title: 'Bản đồ trường', chip: 'Lọc theo điểm & thành phố' },
  { icon: <TeamOutlined />, title: 'Đồng bộ gia đình', chip: 'Phụ huynh xem ngay' },
];

const heroDefinitions = [
  {
    id: 'riasec',
    title: 'Quiz 7 phút',
    sub: 'Khoanh nhanh, hiểu mình liền',
    icon: <FireOutlined className="text-3xl text-orange-500" />,
  },
  {
    id: 'mbti',
    title: 'Lộ trình 10 bước',
    sub: 'Từ THPT tới cổng trường đại học',
    icon: <RocketOutlined className="text-3xl text-sky-500" />,
  },
  {
    id: 'mapp',
    title: 'Chat mini coach',
    sub: 'Trả lời học phí, điểm chuẩn tức thì',
    icon: <SmileOutlined className="text-3xl text-green-500" />,
  },
];

const heroSlides = heroDefinitions.map((slide) => ({
  ...slide,
  coverImage: assessmentCatalog.find((item) => item.id === slide.id)?.coverImage ?? assessmentCatalog[0].coverImage,
}));

const testIcons = {
  riasec: <CompassOutlined />,
  mbti: <BulbOutlined />,
  mapp: <AimOutlined />,
  gardner: <ExperimentOutlined />,
};

const testCards = assessmentCatalog.map((test) => ({
  id: test.id,
  label: test.name,
  vibe: test.tagline,
  icon: testIcons[test.id] ?? <CompassOutlined />,
  coverImage: test.coverImage,
  badge: test.shortLabel,
}));

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-14">
      <section className="grid gap-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <Card className="glass-card grid-fade relative overflow-hidden border-none shadow-xl" bodyStyle={{ padding: '2.5rem' }}>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-transparent to-indigo-100/60" />
          <Space direction="vertical" size="large" className="relative z-10">
            <Tag color="blue" className="self-start rounded-full px-4 py-1 text-sm">
              Hướng nghiệp cho thế hệ Alpha & Gen Z
            </Tag>
            <h1 className="text-4xl font-semibold text-slate-900 md:text-5xl">Chọn đường sớm, học không mệt</h1>
            <p className="max-w-lg text-base text-slate-600">
              EduPath giúp học sinh Việt khám phá bản thân, nhận lộ trình cá nhân hóa và kết nối phụ huynh trong một trải nghiệm sống động.
            </p>
            <Space size="middle" wrap>
              <Button type="primary" size="large" shape="round" onClick={() => navigate('/auth?role=student')}>
                Bắt đầu với tư cách học sinh
              </Button>
              <Button size="large" shape="round" onClick={() => navigate('/auth?role=parent')}>
                Xem chế độ phụ huynh
              </Button>
            </Space>
            <Space size="large" wrap>
              {featureTiles.map((item) => (
                <div key={item.title} className="flex items-center gap-3 rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                    {item.icon}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-800">{item.title}</p>
                    <p className="text-xs text-slate-500">{item.chip}</p>
                  </div>
                </div>
              ))}
            </Space>
          </Space>
        </Card>
        <Card className="glass-card overflow-hidden border-none shadow-xl" bodyStyle={{ padding: 0 }}>
          <Carousel autoplay className="h-full">
            {heroSlides.map((slide) => (
              <div key={slide.title} className="flex h-full flex-col items-center justify-between gap-4 bg-slate-900/90 p-10 text-white">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10">
                  {slide.icon}
                </div>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h3 className="text-2xl font-semibold">{slide.title}</h3>
                  <p className="text-sm text-white/70">{slide.sub}</p>
                </div>
                <div className="mt-4 h-32 w-full overflow-hidden rounded-3xl bg-white/10">
                  <img src={slide.coverImage} alt={slide.title} className="h-full w-full object-cover" />
                </div>
              </div>
            ))}
          </Carousel>
        </Card>
      </section>

      <section>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-slate-900">Chọn bộ test</h2>
          <Button type="text" onClick={() => navigate('/take-test')}>
            Làm ngay
          </Button>
        </div>
        <Row gutter={[16, 16]} className="mt-4">
          {testCards.map((card) => (
            <Col xs={24} sm={12} md={6} key={card.id}>
              <Card
                className="flex h-full flex-col justify-between border-none shadow-md"
                hoverable
                onClick={() => navigate('/take-test', { state: { preset: card.id } })}
              >
                <Space direction="vertical" size="middle" className="w-full">
                  <Space size="small" className="items-center" wrap>
                    <Tag color="green">Miễn phí</Tag>
                    <Tag color="blue">{card.badge}</Tag>
                  </Space>
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600 text-xl">
                    {card.icon}
                  </span>
                  <div>
                    <p className="text-lg font-semibold text-slate-800">{card.label}</p>
                    <p className="text-sm text-slate-500">{card.vibe}</p>
                  </div>
                </Space>
                <div className="mt-4 h-28 overflow-hidden rounded-2xl bg-slate-100">
                  <img src={card.coverImage} alt={card.label} className="h-full w-full object-cover" />
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      <section>
        <Card className="border-none shadow-lg" bodyStyle={{ padding: '2rem' }}>
          <Row gutter={[24, 24]} align="middle">
            <Col xs={24} md={12}>
              <Space direction="vertical" size="large">
                <Tag color="purple" className="w-fit rounded-full px-4 py-1 text-sm">
                  Hồ sơ mẫu
                </Tag>
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-100 text-purple-600 text-2xl">
                    <SmileOutlined />
                  </span>
                  <div>
                    <p className="text-xl font-semibold text-slate-900">Minh Anh - Lớp 11A1</p>
                    <p className="text-sm text-slate-500">GPA 8.4 - Tổ hợp A00</p>
                  </div>
                </div>
                <Space size="middle" wrap>
                  <Tag bordered={false} color="blue">
                    Yêu thích: Khoa học dữ liệu
                  </Tag>
                  <Tag bordered={false} color="green">
                    Đã lưu 3 trường
                  </Tag>
                  <Tag bordered={false} color="orange">
                    CLB STEM & MC
                  </Tag>
                </Space>
                <Button shape="round" onClick={() => navigate('/student')}>
                  Xem dashboard mẫu
                </Button>
              </Space>
            </Col>
            <Col xs={24} md={12}>
              <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-blue-700 p-8 text-white shadow-xl">
                <p className="text-sm uppercase tracking-[0.3em] text-white/60">Lộ trình</p>
                <h3 className="mt-3 text-2xl font-semibold">10 điểm chạm quan trọng</h3>
                <ul className="mt-6 space-y-3 text-sm text-white/80">
                  <li>Ôn chắc Toán Lý Hóa</li>
                  <li>Làm dự án STEM ghi portfolio</li>
                  <li>Khóa danh sách 5 trường mơ ước</li>
                </ul>
              </div>
            </Col>
          </Row>
        </Card>
      </section>
    </div>
  );
};

export default LandingPage;
