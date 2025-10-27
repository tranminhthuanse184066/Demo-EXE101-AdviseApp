import { Button, Card, Empty, Result, Space, Timeline, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useApp } from '../context/AppContext.jsx';

const statusTone = {
  todo: 'blue',
  doing: 'orange',
  done: 'green',
};

const statusLabel = {
  todo: 'Chưa bắt đầu',
  doing: 'Đang làm',
  done: 'Hoàn thành',
};

const RoadmapPage = () => {
  const { currentUser, findProfile, toggleRoadmapStep, unlockRoadmap } = useApp();
  const profile = currentUser ? findProfile(currentUser.id) : null;
  const [banner, setBanner] = useState({ tone: 'neutral', text: '' });

  const grouped = useMemo(() => {
    if (!profile?.roadmap?.length) return [];
    const map = new Map();
    profile.roadmap.forEach((step) => {
      if (!map.has(step.phase)) map.set(step.phase, []);
      map.get(step.phase).push(step);
    });
    return Array.from(map.entries());
  }, [profile]);

  if (!currentUser || currentUser.role !== 'student') {
    return (
      <Card bordered={false} className="shadow-lg">
        <Result status="403" title="Chỉ dành cho học sinh" subTitle="Đăng nhập bằng tài khoản học sinh để chỉnh lộ trình." />
      </Card>
    );
  }

  const handleUnlock = () => {
    const res = unlockRoadmap();
    if (!res?.ok) {
      setBanner({ tone: 'error', text: res?.message || 'Không mở được lộ trình.' });
      return;
    }
    setBanner({ tone: 'success', text: 'Đã mở khóa lộ trình, kéo xuống để xem.' });
  };

  if (!profile?.roadmapUnlocked) {
    return (
      <Card bordered={false} className="shadow-xl" bodyStyle={{ padding: '3rem' }}>
        <Result
          icon={null}
          title="Mở khóa lộ trình"
          subTitle="Bản đồ 10 bước từ THPT tới đại học"
          extra={
            <Space direction="vertical" size="large" className="items-center">
              <Button type="primary" shape="round" size="large" onClick={handleUnlock}>
                Thanh toán giữ lớp 199.000đ
              </Button>
              <Space size="small">
                <Tag color="blue">Tự động sắp lịch</Tag>
                <Tag color="green">Đồng bộ phụ huynh</Tag>
                <Tag color="purple">Theo dõi trạng thái</Tag>
              </Space>
              {banner.text && (
                <div
                  className={`rounded-full px-4 py-2 text-sm ${banner.tone === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
                >
                  {banner.text}
                </div>
              )}
            </Space>
          }
        />
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" className="w-full">
      {banner.text && (
        <div
          className={`rounded-full px-4 py-2 text-sm ${banner.tone === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}
        >
          {banner.text}
        </div>
      )}
      {grouped.length ? (
        grouped.map(([phase, steps]) => (
          <Card key={phase} title={phase} bordered={false} className="shadow-lg">
            <Timeline
              items={steps.map((step) => ({
                color: statusTone[step.status] || 'blue',
                label: step.dueDate,
                children: (
                  <Button
                    type="text"
                    onClick={() => toggleRoadmapStep(currentUser.id, step.id)}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3"
                  >
                    <span className="text-left text-sm font-medium text-slate-700">{step.title}</span>
                    <Tag color={statusTone[step.status] || 'blue'}>{statusLabel[step.status]}</Tag>
                  </Button>
                ),
              }))}
            />
          </Card>
        ))
      ) : (
        <Empty description="Làm test và mở khóa để nhận lộ trình cá nhân" />
      )}
    </Space>
  );
};

export default RoadmapPage;
