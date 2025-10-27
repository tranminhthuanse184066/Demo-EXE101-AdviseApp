import { Button, Card, Col, Empty, Form, Input, Result, Row, Space, Tag } from 'antd';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const ParentDashboard = () => {
  const {
    currentUser,
    linkParentToStudent,
    getLinkedStudentForParent,
    findProfile,
    findTestResult,
    majorGroups,
    universities,
  } = useApp();
  const [form] = Form.useForm();
  const [feedback, setFeedback] = useState(null);
  const navigate = useNavigate();

  if (!currentUser || currentUser.role !== 'parent') {
    return (
      <Card bordered={false} className="shadow-lg">
        <Result status="403" title="Dành riêng cho phụ huynh" subTitle="Sử dụng tài khoản phụ huynh để truy cập trang này." />
      </Card>
    );
  }

  const linkedStudent = getLinkedStudentForParent(currentUser.id);
  const profile = linkedStudent ? findProfile(linkedStudent.id) : null;
  const result = linkedStudent ? findTestResult(linkedStudent.id) : null;

  const topMajors = useMemo(() => {
    if (!result) return [];
    return result.topMajorGroupCodes
      .map((code) => majorGroups.find((group) => group.code === code))
      .filter(Boolean);
  }, [result, majorGroups]);

  const suggestedUniversities = useMemo(() => {
    if (!result) return [];
    return universities
      .filter((uni) => uni.majors.some((code) => result.topMajorGroupCodes.includes(code)))
      .slice(0, 3);
  }, [result, universities]);

  const handleLink = (values) => {
    const res = linkParentToStudent(values.code);
    if (!res?.ok) {
      setFeedback({ type: 'error', text: res.message });
      return;
    }
    setFeedback({ type: 'success', text: `Đã liên kết với ${res.student.fullName}` });
    form.resetFields();
  };

  if (!linkedStudent) {
    return (
      <Card bordered={false} className="shadow-xl" bodyStyle={{ padding: '2.5rem' }}>
        <Space direction="vertical" size="large" className="w-full">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Kết nối gia đình</h2>
            <p className="text-sm text-slate-500">Nhập mã do con gửi để xem dữ liệu học tập.</p>
          </div>
          {feedback && <Result status={feedback.type === 'error' ? 'error' : 'success'} title={feedback.text} />}
          <Form form={form} layout="vertical" onFinish={handleLink} requiredMark={false} className="w-full max-w-md">
            <Form.Item name="code" label="Mã liên kết" rules={[{ required: true, message: 'Nhập mã 6 ký tự' }]}>
              <Input size="large" placeholder="EDUP01" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" shape="round" size="large">
                Liên kết ngay
              </Button>
            </Form.Item>
          </Form>
          <p className="text-sm text-slate-400">Ví dụ: mã của tài khoản mẫu Minh Anh là EDUP01.</p>
        </Space>
      </Card>
    );
  }

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card bordered={false} className="shadow-xl" bodyStyle={{ padding: '2rem' }}>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <Space direction="vertical" size={2}>
            <span className="text-sm text-slate-500">Đang theo dõi</span>
            <h2 className="text-3xl font-semibold text-slate-900">{linkedStudent.fullName}</h2>
            <Space size="small">
              <Tag color="blue">Lớp {profile?.gradeLevel}</Tag>
              <Tag color="green">GPA {profile?.avgScore}</Tag>
              <Tag color="purple">Tổ hợp {profile?.stream}</Tag>
            </Space>
          </Space>
          <Button shape="round" onClick={() => navigate(`/report?studentId=${linkedStudent.id}`)}>
            Tải báo cáo PDF
          </Button>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Bài test gần nhất" bordered={false} className="shadow-lg">
            {result ? (
              <Space direction="vertical" size="middle" className="w-full">
                <Tag color="blue">{result.testLabel}</Tag>
                <h3 className="text-2xl font-semibold text-slate-900">{result.traitSummary}</h3>
                <Space size="small" wrap>
                  {topMajors.map((major) => (
                    <Tag key={major.code} color="success">
                      {major.name}
                    </Tag>
                  ))}
                </Space>
              </Space>
            ) : (
              <Empty description="Học sinh chưa hoàn thành bài test" />
            )}
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Top trường đề cử" bordered={false} className="shadow-lg">
            {suggestedUniversities.length ? (
              <Space direction="vertical" size="small" className="w-full">
                {suggestedUniversities.map((uni) => (
                  <div key={uni.id} className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-lg font-semibold text-slate-900">{uni.name}</p>
                    <p className="text-sm text-slate-500">{uni.city} - Điểm chuẩn {uni.minScore}</p>
                  </div>
                ))}
              </Space>
            ) : (
              <Empty description="Chưa có dữ liệu đề xuất" />
            )}
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default ParentDashboard;

