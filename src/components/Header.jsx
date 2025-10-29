import { Layout, Button, Space, Tooltip } from 'antd';
import {
  CompassOutlined,
  ExperimentOutlined,
  HomeOutlined,
  RobotOutlined,
  RocketOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const badgePalette = {
  student: { label: 'Học sinh', icon: <RocketOutlined /> },
  parent: { label: 'Phụ huynh', icon: <TeamOutlined /> },
  advisor: { label: 'Cố vấn', icon: <ExperimentOutlined /> },
};

const Header = () => {
  const { currentUser, logOut } = useApp();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const navLinks = currentUser
    ? currentUser.role === 'student'
      ? [
          { to: '/student', icon: <HomeOutlined />, label: 'Bảng tin' },
          { to: '/take-test', icon: <ExperimentOutlined />, label: 'Bài test' },
          { to: '/universities', icon: <CompassOutlined />, label: 'Trường học' },
          { to: '/roadmap', icon: <RocketOutlined />, label: 'Lộ trình' },
          { to: '/ai-coach', icon: <RobotOutlined />, label: 'AI Coach' },
        ]
      : currentUser.role === 'parent'
        ? [
            { to: '/parent', icon: <HomeOutlined />, label: 'Bảng phụ huynh' },
            { to: '/universities', icon: <CompassOutlined />, label: 'Trường học' },
            { to: '/ai-coach', icon: <RobotOutlined />, label: 'AI Coach' },
            { to: '/chat', icon: <TeamOutlined />, label: 'Tin nhắn' },
          ]
        : [
            { to: '/chat', icon: <TeamOutlined />, label: 'Chat' },
            { to: '/ai-coach', icon: <RobotOutlined />, label: 'AI Coach' },
            { to: '/universities', icon: <CompassOutlined />, label: 'Trường học' },
          ]
    : [
        { to: '/', icon: <HomeOutlined />, label: 'Trang chủ' },
        { to: '/take-test', icon: <ExperimentOutlined />, label: 'Làm thử' },
        { to: '/ai-coach', icon: <RobotOutlined />, label: 'AI Coach' },
        { to: '/auth', icon: <UserOutlined />, label: 'Đăng nhập' },
      ];

  const primaryCta = currentUser
    ? currentUser.role === 'student'
      ? { label: 'Vào trang học sinh', action: () => navigate('/student') }
      : currentUser.role === 'parent'
        ? { label: 'Vào trang phụ huynh', action: () => navigate('/parent') }
        : { label: 'Phòng cố vấn', action: () => navigate('/chat') }
    : { label: 'Bắt đầu ngay', action: () => navigate('/auth?role=student') };

  const badge = currentUser ? badgePalette[currentUser.role] : null;

  return (
    <Layout.Header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="flex items-center gap-2 rounded-full border border-slate-200/70 bg-white/80 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <RocketOutlined />
          </span>
          <span>EduPath</span>
          <span className="hidden text-xs font-medium text-slate-500 sm:inline">Định hướng thế hệ mới</span>
        </button>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = pathname === link.to;
            return (
              <Link key={link.to} to={link.to}>
                <Button type={active ? 'primary' : 'text'} icon={link.icon} className="px-3" shape="round">
                  {link.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        <Space size="small" className="items-center">
          {badge && (
            <span className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 sm:flex">
              {badge.icon}
              {badge.label}
            </span>
          )}
          {currentUser ? (
            <Space>
              <Tooltip title="Trang cá nhân">
                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      currentUser.role === 'student'
                        ? '/student'
                        : currentUser.role === 'parent'
                          ? '/parent'
                          : '/chat',
                    )
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white shadow-sm"
                >
                  <UserOutlined />
                </button>
              </Tooltip>
              <Button type="text" onClick={logOut}>
                Thoát
              </Button>
            </Space>
          ) : (
            <Button type="text" onClick={() => navigate('/auth')}>
              Đăng nhập
            </Button>
          )}
          <Button type="primary" shape="round" onClick={primaryCta.action}>
            {primaryCta.label}
          </Button>
        </Space>
      </div>
    </Layout.Header>
  );
};

export default Header;
