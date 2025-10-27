import { Badge, Button, Card, Col, Modal, Row, Select, Space, Switch, Tag } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const cityOptions = [
  { value: 'all', label: 'Tất cả' },
  { value: 'HN', label: 'Hà Nội' },
  { value: 'HCM', label: 'TP.HCM' },
  { value: 'DN', label: 'Đà Nẵng' },
];

const UniversitiesPage = () => {
  const { currentUser, findProfile, universities, majorGroups, saveUniversityPreference } = useApp();
  const location = useLocation();
  const profile = currentUser?.role === 'student' ? findProfile(currentUser.id) : null;
  const [filterMajor, setFilterMajor] = useState('');
  const [filterCity, setFilterCity] = useState('all');
  const [onlyReachable, setOnlyReachable] = useState(true);
  const [compareList, setCompareList] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (location.state?.defaultMajors?.length) {
      setFilterMajor(location.state.defaultMajors[0]);
    }
  }, [location.state]);

  const getMajorNames = (uni) =>
    uni.majors
      .map((code) => majorGroups.find((group) => group.code === code)?.name)
      .filter(Boolean)
      .slice(0, 2)
      .join(', ');

  const filteredUniversities = useMemo(() => {
    return universities.filter((uni) => {
      const matchMajor = filterMajor ? uni.majors.includes(filterMajor) : true;
      const matchCity = filterCity === 'all' ? true : uni.city === filterCity;
      const matchScore =
        !onlyReachable || !profile?.avgScore ? true : uni.minScore <= Number(profile.avgScore) + 1;
      return matchMajor && matchCity && matchScore;
    });
  }, [universities, filterMajor, filterCity, onlyReachable, profile]);

  const toggleCompare = (uni) => {
    setCompareList((prev) => {
      if (prev.find((item) => item.id === uni.id)) {
        return prev.filter((item) => item.id !== uni.id);
      }
      if (prev.length === 2) {
        return [prev[1], uni];
      }
      return [...prev, uni];
    });
  };

  useEffect(() => {
    if (compareList.length === 2) {
      setShowModal(true);
    }
  }, [compareList]);

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card bordered={false} className="shadow-lg" bodyStyle={{ padding: '2rem' }}>
        <Space direction="vertical" size="large" className="w-full">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-semibold text-slate-900">Bản đồ trường</h2>
            <Space size="middle" wrap>
              <Select
                value={filterMajor}
                placeholder="Chọn nhóm ngành"
                allowClear
                onChange={(value) => setFilterMajor(value || '')}
                options={majorGroups.map((group) => ({ value: group.code, label: group.name }))}
                className="min-w-[200px]"
              />
              <Select
                value={filterCity}
                onChange={setFilterCity}
                options={cityOptions}
                className="min-w-[140px]"
              />
              <Space>
                <Switch checked={onlyReachable} onChange={setOnlyReachable} />
                <span className="text-sm text-slate-500">Điểm chuẩn phù hợp</span>
              </Space>
            </Space>
          </div>
          <Row gutter={[16, 16]}>
            {filteredUniversities.map((uni) => {
              const isSaved = profile?.savedUniversities?.includes(uni.id);
              const isCompared = compareList.some((item) => item.id === uni.id);
              return (
                <Col xs={24} md={12} lg={8} key={uni.id}>
                  <Badge.Ribbon
                    text={cityOptions.find((item) => item.value === uni.city)?.label || uni.city}
                    color="blue"
                  >
                    <Card
                      hoverable
                      className="h-full border border-slate-100 shadow-md"
                      actions={[
                        currentUser?.role === 'student' ? (
                          <Button
                            key="save"
                            type="text"
                            onClick={() => saveUniversityPreference(currentUser.id, uni.id)}
                          >
                            {isSaved ? 'Đã lưu' : 'Lưu lại'}
                          </Button>
                        ) : null,
                        <Button key="compare" type="text" onClick={() => toggleCompare(uni)}>
                          {isCompared ? 'Bỏ so sánh' : 'So sánh'}
                        </Button>,
                      ].filter(Boolean)}
                    >
                      <Space direction="vertical" size="small" className="w-full">
                        <p className="text-lg font-semibold text-slate-900">{uni.name}</p>
                        <Space size="small">
                          <Tag color="blue">Điểm {uni.minScore}</Tag>
                          <Tag color="green">Học phí {uni.tuitionPerYear} triệu</Tag>
                        </Space>
                        <p className="text-sm text-slate-500">{getMajorNames(uni)}</p>
                      </Space>
                    </Card>
                  </Badge.Ribbon>
                </Col>
              );
            })}
          </Row>
        </Space>
      </Card>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        title="So sánh"
        centered
      >
        {compareList.length === 2 ? (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Tiêu chí</th>
                {compareList.map((uni) => (
                  <th key={uni.id} className="py-2">
                    {uni.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 text-slate-500">Thành phố</td>
                {compareList.map((uni) => (
                  <td key={`${uni.id}-city`} className="py-2">
                    {cityOptions.find((item) => item.value === uni.city)?.label || uni.city}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 text-slate-500">Điểm chuẩn</td>
                {compareList.map((uni) => (
                  <td key={`${uni.id}-score`} className="py-2">
                    {uni.minScore}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 text-slate-500">Học phí ước tính</td>
                {compareList.map((uni) => (
                  <td key={`${uni.id}-fee`} className="py-2">
                    {uni.tuitionPerYear} triệu
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-2 text-slate-500">Nhóm ngành</td>
                {compareList.map((uni) => (
                  <td key={`${uni.id}-majors`} className="py-2">
                    {uni.majors
                      .map((code) => majorGroups.find((group) => group.code === code)?.name)
                      .filter(Boolean)
                      .join(', ')}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        ) : null}
      </Modal>
    </Space>
  );
};

export default UniversitiesPage;
