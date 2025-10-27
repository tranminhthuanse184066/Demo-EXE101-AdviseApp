import { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const Header = () => {
  const { currentUser, logOut } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = useMemo(() => {
    if (!currentUser) {
      return [
        { to: '/', label: 'Trang chủ' },
        { to: '/auth', label: 'Đăng ký' },
      ];
    }
    if (currentUser.role === 'student') {
      return [
        { to: '/student', label: 'Dashboard' },
        { to: '/take-test', label: 'Trắc nghiệm' },
        { to: '/universities', label: 'Trường' },
        { to: '/roadmap', label: 'Lộ trình' },
      ];
    }
    if (currentUser.role === 'parent') {
      return [
        { to: '/parent', label: 'Giám sát con' },
        { to: '/universities', label: 'Trường' },
        { to: '/chat', label: 'Chat tư vấn' },
      ];
    }
    return [
      { to: '/chat', label: 'Chat' },
      { to: '/universities', label: 'Trường' },
    ];
  }, [currentUser]);

  const handlePrimary = () => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    if (currentUser.role === 'student') {
      navigate('/student');
    } else if (currentUser.role === 'parent') {
      navigate('/parent');
    } else {
      navigate('/chat');
    }
  };

  return (
    <header className="site-header">
      <div className="header-inner">
        <button className="brand" type="button" onClick={() => navigate('/')}>
          <span className="brand-pill">EduPath</span>
          <span className="brand-sub">Career Guidance MVP</span>
        </button>
        <nav className="main-nav">
          {navItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className={location.pathname === item.to ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="header-actions">
          {currentUser ? (
            <>
              <span className="welcome-label">
                Xin chào, {currentUser.fullName.split(' ')[0]}
              </span>
              <button className="ghost" type="button" onClick={logOut}>
                Đăng xuất
              </button>
            </>
          ) : (
            <button className="ghost" type="button" onClick={() => navigate('/auth')}>
              Đăng nhập
            </button>
          )}
          <button className="primary" type="button" onClick={handlePrimary}>
            {currentUser ? 'Đến trang chính' : 'Bắt đầu'}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
