import { Button, Card, Radio, Space, Tag } from 'antd';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { assessmentCatalog } from '../data/assessments.js';

const buildInitialAnswers = (questions) => {
  const map = {};
  questions.forEach((question) => {
    map[question.id] = '';
  });
  return map;
};

const randomInitial = assessmentCatalog[Math.floor(Math.random() * assessmentCatalog.length)];

const TestCard = ({ test, active, onSelect }) => (
  <Card
    hoverable
    onClick={() => onSelect(test)}
    className={`h-full overflow-hidden transition-all duration-200 ${active ? 'ring-2 ring-blue-500 shadow-lg' : 'border border-slate-200 hover:shadow-lg'}`}
    bodyStyle={{ padding: '1.25rem' }}
  >
    <div className="flex h-full flex-col gap-4">
      <div className="relative rounded-2xl bg-slate-900 p-5 text-white">
        <div className="flex items-center justify-between">
          <Tag color="green">Miễn phí</Tag>
          <Tag color="blue">{test.shortLabel}</Tag>
        </div>
        <h3 className="mt-4 text-lg font-semibold">{test.name}</h3>
        <p className="mt-1 text-sm text-white/70">{test.tagline}</p>
        <Button
          type={active ? 'primary' : 'default'}
          shape="round"
          block
          className="mt-4"
          onClick={(event) => {
            event.stopPropagation();
            onSelect(test);
          }}
        >
          {active ? 'Đang chọn' : 'Bắt đầu'}
        </Button>
      </div>
      <div className="h-28 overflow-hidden rounded-2xl bg-slate-100">
        <img src={test.coverImage} alt={`Minh họa ${test.name}`} className="h-full w-full object-cover" />
      </div>
    </div>
  </Card>
);

const TakeTestPage = () => {
  const { submitAssessment } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedId, setSelectedId] = useState(randomInitial.id);
  const [answers, setAnswers] = useState(() => buildInitialAnswers(randomInitial.questions));
  const [error, setError] = useState('');
  const questionSectionRef = useRef(null);

  const scrollToQuestions = () => {
    if (questionSectionRef.current) {
      questionSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const selectTest = (test) => {
    setSelectedId(test.id);
    setAnswers(buildInitialAnswers(test.questions));
    setError('');
    requestAnimationFrame(scrollToQuestions);
  };

  useEffect(() => {
    if (location.state?.preset) {
      const match = assessmentCatalog.find((test) => test.id === location.state.preset);
      if (match) {
        selectTest(match);
      }
    }
  }, [location.state]);

  const selectedTest = useMemo(
    () => assessmentCatalog.find((item) => item.id === selectedId) || randomInitial,
    [selectedId],
  );

  useEffect(() => {
    // keep answers in sync when selected test changes via URL or default
    setAnswers(buildInitialAnswers(selectedTest.questions));
  }, [selectedTest]);

  const progress = useMemo(() => {
    const filled = Object.values(answers).filter(Boolean).length;
    return Math.round((filled / selectedTest.questions.length) * 100);
  }, [answers, selectedTest.questions.length]);

  const handleSubmit = () => {
    const incomplete = selectedTest.questions.some((question) => !answers[question.id]);
    if (incomplete) {
      setError('Bạn cần chọn đáp án cho tất cả câu hỏi.');
      return;
    }
    const outcome = selectedTest.evaluate(answers);
    const res = submitAssessment({ ...outcome, testType: selectedTest.id, testLabel: selectedTest.name });
    if (!res?.ok) {
      setError(res?.message || 'Không lưu được bài test lúc này.');
      return;
    }
    navigate('/test-result', { state: { highlight: true } });
  };

  const handleShuffle = () => {
    const next = assessmentCatalog[Math.floor(Math.random() * assessmentCatalog.length)];
    selectTest(next);
  };

  return (
    <Space direction="vertical" size="large" className="w-full">
      <Card bordered={false} className="shadow-lg" bodyStyle={{ padding: '2rem' }}>
        <Space direction="vertical" size="large" className="w-full">
          <div className="flex flex-col gap-2">
            <Tag color="blue" className="w-fit rounded-full px-4 py-1 text-sm">Bộ test miễn phí</Tag>
            <h1 className="text-3xl font-semibold text-slate-900">Chọn bài test phù hợp</h1>
            <p className="max-w-2xl text-sm text-slate-500">
              Bắt đầu với bài test bạn quan tâm, tất cả đều miễn phí và có thể hoàn thành ngay trong vài phút.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {assessmentCatalog.map((test) => (
              <TestCard key={test.id} test={test} active={selectedId === test.id} onSelect={selectTest} />
            ))}
          </div>
        </Space>
      </Card>

      <div ref={questionSectionRef} className="w-full">
        <Card bordered={false} className="shadow-lg" bodyStyle={{ padding: '2rem' }}>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2">
              <Space size="small" wrap>
                <Tag color="green">Miễn phí</Tag>
                <Tag color="blue">{selectedTest.shortLabel}</Tag>
              </Space>
              <h2 className="text-2xl font-semibold text-slate-900">{selectedTest.name}</h2>
              <p className="text-sm text-slate-500">{selectedTest.description}</p>
            </div>
            <div className="flex flex-col items-start gap-2 md:items-end">
              <span className="text-sm text-slate-500">Hoàn thành</span>
              <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">{progress}%</div>
            </div>
          </div>
        </Card>
      </div>

      <Space direction="vertical" size="large" className="w-full">
        {selectedTest.questions.map((question, index) => (
          <Card
            key={question.id}
            className="border-none shadow-md"
            title={`Câu ${index + 1}`}
            extra={<Tag color={answers[question.id] ? 'green' : 'default'}>{answers[question.id] ? 'Đã chọn' : 'Chưa chọn'}</Tag>}
          >
            <Space direction="vertical" size="middle" className="w-full">
              <p className="text-base font-medium text-slate-800">{question.prompt}</p>
              <Radio.Group
                onChange={(event) => {
                  setAnswers((prev) => ({ ...prev, [question.id]: event.target.value }));
                  setError('');
                }}
                value={answers[question.id]}
                className="grid gap-3"
              >
                {question.options.map((option) => (
                  <Radio.Button key={option.value} value={option.value} className="text-left">
                    {option.label}
                  </Radio.Button>
                ))}
              </Radio.Group>
            </Space>
          </Card>
        ))}
      </Space>

      {error && <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}

      <Space size="middle" wrap>
        <Button shape="round" onClick={handleShuffle}>
          Đổi bộ câu hỏi
        </Button>
        <Button type="primary" shape="round" onClick={handleSubmit}>
          Gửi kết quả
        </Button>
      </Space>
    </Space>
  );
};

export default TakeTestPage;
