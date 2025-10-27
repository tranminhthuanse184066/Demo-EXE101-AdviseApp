import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const AuthPage = () => {
  const { signUp, logIn } = useApp();
  const [searchParams] = useSearchParams();
  const [tab, setTab] = useState('login');
  const [signupData, setSignupData] = useState({
    role: 'student',
    fullName: '',
    email: '',
    password: '',
    gradeLevel: '',
    stream: '',
    avgScore: '',
    interests: '',
  });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const preferredRole = searchParams.get('role');
    if (preferredRole === 'student' || preferredRole === 'parent') {
      setSignupData((prev) => ({ ...prev, role: preferredRole }));
      setTab('signup');
    }
  }, [searchParams]);

  const handleSignup = (event) => {
    event.preventDefault();
    const payload = {
      ...signupData,
      avgScore: Number(signupData.avgScore),
      interests: signupData.interests
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    };
    const res = signUp(payload);
    if (!res.ok) {
      setMessage(res.message);
      return;
    }
    const next = signupData.role === 'student' ? '/student' : '/parent';
    setMessage(res.linkedParentCode ? `Mã liên kết phụ huynh của bạn: ${res.linkedParentCode}` : res.message);
    navigate(next);
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const res = logIn(loginData.email, loginData.password);
    if (!res.ok) {
      setMessage(res.message);
      return;
    }
    setMessage('');
    const destinations = {
      parent: '/parent',
      advisor: '/chat',
      student: '/student',
    };
    navigate(destinations[res.user.role] || '/');
  };

  const demoAccounts = useMemo(
    () => [
      { role: 'Học sinh', email: 'minhanh@student.edupath.vn', password: '123456' },
      { role: 'Phụ huynh', email: 'thuha@parent.edupath.vn', password: '123456' },
    ],
    [],
  );

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="tab-row">
          <button className={tab === 'login' ? 'active' : ''} type="button" onClick={() => setTab('login')}>
            Đăng nhập
          </button>
          <button className={tab === 'signup' ? 'active' : ''} type="button" onClick={() => setTab('signup')}>
            Đăng ký
          </button>
        </div>

        {message && <p className="form-message">{message}</p>}

        {tab === 'login' ? (
          <form className="form" onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
            </label>
            <label>
              Mật khẩu
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
            </label>
            <button className="primary" type="submit">
              Đăng nhập
            </button>
            <div className="demo-box">
              <p>Dùng thử nhanh:</p>
              <ul>
                {demoAccounts.map((item) => (
                  <li key={item.email}>
                    <strong>{item.role}</strong>: {item.email} / {item.password}
                  </li>
                ))}
              </ul>
            </div>
          </form>
        ) : (
          <form className="form" onSubmit={handleSignup}>
            <label>
              Vai trò
              <select
                value={signupData.role}
                onChange={(e) => setSignupData({ ...signupData, role: e.target.value })}
              >
                <option value="student">Học sinh</option>
                <option value="parent">Phụ huynh</option>
              </select>
            </label>
            <label>
              Họ tên
              <input
                type="text"
                required
                value={signupData.fullName}
                onChange={(e) => setSignupData({ ...signupData, fullName: e.target.value })}
              />
            </label>
            <label>
              Email
              <input
                type="email"
                required
                value={signupData.email}
                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
              />
            </label>
            <label>
              Mật khẩu
              <input
                type="password"
                required
                minLength={6}
                value={signupData.password}
                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
              />
            </label>
            {signupData.role === 'student' && (
              <>
                <div className="two-cols">
                  <label>
                    Khối lớp
                    <input
                      type="text"
                      value={signupData.gradeLevel}
                      onChange={(e) => setSignupData({ ...signupData, gradeLevel: e.target.value })}
                    />
                  </label>
                  <label>
                    Tổ hợp xét tuyển
                    <input
                      type="text"
                      value={signupData.stream}
                      onChange={(e) => setSignupData({ ...signupData, stream: e.target.value })}
                    />
                  </label>
                </div>
                <label>
                  Điểm TB học kỳ (ước tính)
                  <input
                    type="number"
                    step="0.1"
                    value={signupData.avgScore}
                    onChange={(e) => setSignupData({ ...signupData, avgScore: e.target.value })}
                  />
                </label>
                <label>
                  Sở thích / hoạt động (cách nhau bằng dấu phẩy)
                  <input
                    type="text"
                    value={signupData.interests}
                    onChange={(e) => setSignupData({ ...signupData, interests: e.target.value })}
                  />
                </label>
              </>
            )}
            <button className="primary" type="submit">
              Tạo tài khoản
            </button>
          </form>
        )}
      </div>
    </section>
  );
};

export default AuthPage;
