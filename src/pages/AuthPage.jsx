import { Alert, Button, Card, Form, Input, Select, Space, Tabs } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const AuthPage = () => {
  const { signUp, logIn } = useApp();
  const [searchParams] = useSearchParams();
  const [tabKey, setTabKey] = useState('login');
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const [signupForm] = Form.useForm();
  const [loginForm] = Form.useForm();

  useEffect(() => {
    const preferredRole = searchParams.get('role');
    if (preferredRole === 'student' || preferredRole === 'parent') {
      signupForm.setFieldsValue({ role: preferredRole });
      setTabKey('signup');
    }
  }, [searchParams, signupForm]);

  const demoAccounts = useMemo(
    () => [
      { role: 'Học sinh', email: 'student@edupath.vn', password: '123456' },
      { role: 'Phụ huynh', email: 'parent@edupath.vn', password: '123456' },
    ],
    [],
  );

  const handleSignup = (values) => {
    const payload = {
      ...values,
      avgScore: Number(values.avgScore),
      interests: values.interests
        ? values.interests.split(',').map((item) => item.trim()).filter(Boolean)
        : [],
    };
    const res = signUp(payload);
    if (!res.ok) {
      setMessage({ type: 'error', text: res.message });
      return;
    }
    setMessage({
      type: 'success',
      text: res.linkedParentCode
        ? `Mã liên kết phụ huynh của bạn: ${res.linkedParentCode}`
        : res.message,
    });
    navigate(payload.role === 'student' ? '/student' : '/parent');
  };

  const handleLogin = (values) => {
    const res = logIn(values.email, values.password);
    if (!res.ok) {
      setMessage({ type: 'error', text: res.message });
      return;
    }
    setMessage(null);
    const routes = { student: '/student', parent: '/parent', advisor: '/chat' };
    navigate(routes[res.user.role] || '/');
  };

  return (
    <div className="flex w-full justify-center">
      <Card className="w-full max-w-xl shadow-2xl" bordered={false}>
        <Tabs
          activeKey={tabKey}
          onChange={setTabKey}
          centered
          items={[
            { key: 'login', label: 'Đăng nhập', children: null },
            { key: 'signup', label: 'Tạo tài khoản', children: null },
          ]}
        />

        {message && <Alert className="mb-6" type={message.type} message={message.text} showIcon />}

        {tabKey === 'login' ? (
          <Form form={loginForm} layout="vertical" onFinish={handleLogin} requiredMark={false}>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ' }]}>
              <Input size="large" placeholder="ban@example.com" />
            </Form.Item>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Nhập mật khẩu' }]}>
              <Input.Password size="large" placeholder="******" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" shape="round">
                Đăng nhập
              </Button>
            </Form.Item>
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
              <p className="mb-2 font-medium">Tài khoản mẫu</p>
              <Space direction="vertical" size={4}>
                {demoAccounts.map((item) => (
                  <span key={item.email} className="flex items-center justify-between">
                    <strong>{item.role}</strong>
                    <span>
                      {item.email} / {item.password}
                    </span>
                  </span>
                ))}
              </Space>
            </div>
          </Form>
        ) : (
          <Form
            form={signupForm}
            layout="vertical"
            onFinish={handleSignup}
            initialValues={{ role: 'student' }}
            requiredMark={false}
          >
            <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Chọn vai trò' }]}>
              <Select
                size="large"
                options={[
                  { value: 'student', label: 'Học sinh' },
                  { value: 'parent', label: 'Phụ huynh' },
                ]}
              />
            </Form.Item>
            <Form.Item name="fullName" label="Họ và tên" rules={[{ required: true, message: 'Nhập họ tên' }]}>
              <Input size="large" placeholder="Nguyễn Minh Anh" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Nhập email hợp lệ' }]}>
              <Input size="large" placeholder="ban@example.com" />
            </Form.Item>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, min: 6, message: 'Ít nhất 6 ký tự' }]}>
              <Input.Password size="large" placeholder="******" />
            </Form.Item>

            <Form.Item noStyle shouldUpdate={(prev, next) => prev.role !== next.role}>
              {({ getFieldValue }) =>
                getFieldValue('role') === 'student' ? (
                  <Space direction="vertical" size="middle" className="w-full">
                    <Form.Item name="gradeLevel" label="Khối lớp">
                      <Input size="large" placeholder="11" />
                    </Form.Item>
                    <Form.Item name="stream" label="Tổ hợp xét tuyển">
                      <Input size="large" placeholder="A00" />
                    </Form.Item>
                    <Form.Item name="avgScore" label="Điểm trung bình dự kiến">
                      <Input size="large" type="number" step="0.1" placeholder="8.2" />
                    </Form.Item>
                    <Form.Item name="interests" label="Sở thích / hoạt động (cách nhau bằng dấu phẩy)">
                      <Input size="large" placeholder="STEM, MC" />
                    </Form.Item>
                  </Space>
                ) : null
              }
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" shape="round">
                Tạo tài khoản
              </Button>
            </Form.Item>
          </Form>
        )}
      </Card>
    </div>
  );
};

export default AuthPage;
