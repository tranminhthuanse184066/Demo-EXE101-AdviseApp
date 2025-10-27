import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';

const questionBank = [
  {
    id: 'q1',
    text: 'Hoạt động sau khiến bạn hứng thú nhất?',
    options: [
      { label: 'A. Lắp ráp robot mini', trait: 'R' },
      { label: 'B. Phân tích số liệu từ thí nghiệm', trait: 'I' },
      { label: 'C. Lên kế hoạch bán hàng', trait: 'E' },
    ],
  },
  {
    id: 'q2',
    text: 'Bạn thích kiểu bài tập nào?',
    options: [
      { label: 'A. Vẽ poster sự kiện', trait: 'A' },
      { label: 'B. Tư vấn định hướng cho bạn', trait: 'S' },
      { label: 'C. Giải các bài toán logic', trait: 'I' },
    ],
  },
  {
    id: 'q3',
    text: 'Thời gian rảnh bạn thường:',
    options: [
      { label: 'A. Chơi thể thao ngoài trời', trait: 'R' },
      { label: 'B. Viết blog, chia sẻ cảm xúc', trait: 'A' },
      { label: 'C. Tìm hiểu luật, tin tức kinh tế', trait: 'C' },
    ],
  },
  {
    id: 'q4',
    text: 'Nhóm bạn cần người phụ trách, bạn sẽ chọn:',
    options: [
      { label: 'A. Điều phối, thúc đẩy mọi người', trait: 'E' },
      { label: 'B. Ghi chép, quản lý chi tiết', trait: 'C' },
      { label: 'C. Tạo nội dung truyền thông', trait: 'A' },
    ],
  },
  {
    id: 'q5',
    text: 'Môi trường học tập yêu thích:',
    options: [
      { label: 'A. Phòng lab với thiết bị công nghệ', trait: 'I' },
      { label: 'B. Studio sáng tạo', trait: 'A' },
      { label: 'C. Không gian mở để gặp gỡ nhiều người', trait: 'S' },
    ],
  },
  {
    id: 'q6',
    text: 'Bạn cảm thấy tự tin khi:',
    options: [
      { label: 'A. Hỗ trợ người khác giải quyết khó khăn', trait: 'S' },
      { label: 'B. Quản lý ngân sách, con số', trait: 'C' },
      { label: 'C. Tự tay sửa chữa đồ dùng', trait: 'R' },
    ],
  },
  {
    id: 'q7',
    text: 'Khi làm dự án dài hơi, bạn thường:',
    options: [
      { label: 'A. Đặt KPI và theo sát tiến độ', trait: 'E' },
      { label: 'B. Tập trung nghiên cứu chiều sâu', trait: 'I' },
      { label: 'C. Viết, kể câu chuyện truyền cảm hứng', trait: 'A' },
    ],
  },
  {
    id: 'q8',
    text: 'Nếu tham gia CLB mới, bạn chọn:',
    options: [
      { label: 'A. CLB tranh biện / MC', trait: 'E' },
      { label: 'B. CLB khoa học – STEM', trait: 'I' },
      { label: 'C. Đội công tác xã hội', trait: 'S' },
    ],
  },
  {
    id: 'q9',
    text: 'Khi đọc tin tức, bạn quan tâm nhất tới:',
    options: [
      { label: 'A. Thành tựu công nghệ mới', trait: 'R' },
      { label: 'B. Xu hướng marketing sáng tạo', trait: 'A' },
      { label: 'C. Chính sách tài chính, kinh tế', trait: 'E' },
    ],
  },
  {
    id: 'q10',
    text: 'Trong nhóm học tập, bạn thường đảm nhận:',
    options: [
      { label: 'A. Người kết nối, hỗ trợ tinh thần', trait: 'S' },
      { label: 'B. Người thiết kế slide bắt mắt', trait: 'A' },
      { label: 'C. Người tổng hợp tài liệu khoa học', trait: 'I' },
    ],
  },
  {
    id: 'q11',
    text: 'Bạn mong muốn công việc tương lai:',
    options: [
      { label: 'A. Tạo ra sản phẩm hữu hình', trait: 'R' },
      { label: 'B. Làm việc với dữ liệu, phân tích', trait: 'C' },
      { label: 'C. Giao tiếp với nhiều khách hàng', trait: 'E' },
    ],
  },
  {
    id: 'q12',
    text: 'Điều khiến bạn tự hào nhất:',
    options: [
      { label: 'A. Kiên trì luyện tập kỹ năng mới', trait: 'R' },
      { label: 'B. Lên ý tưởng sáng tạo độc đáo', trait: 'A' },
      { label: 'C. Giúp người khác cảm thấy tốt hơn', trait: 'S' },
    ],
  },
];

const TakeTestPage = () => {
  const { submitAssessment } = useApp();
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (questionId, trait) => {
    setAnswers((prev) => ({ ...prev, [questionId]: trait }));
    setError('');
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questionBank.length) {
      setError('Vui lòng hoàn thành tất cả câu hỏi.');
      return;
    }
    const res = submitAssessment(answers);
    if (!res?.ok) {
      setError(res.message);
      return;
    }
    navigate('/test-result', { state: { highlight: true } });
  };

  return (
    <section className="test-page">
      <header>
        <h2>Bài trắc nghiệm RIASEC rút gọn</h2>
        <p>Chọn phương án giống bạn nhất. Kết quả dùng cho gợi ý ngành và lọc trường.</p>
      </header>

      <div className="question-list">
        {questionBank.map((question) => (
          <article key={question.id} className="question">
            <p>
              <strong>{question.id.toUpperCase()}</strong> {question.text}
            </p>
            <div className="options">
              {question.options.map((option) => (
                <label key={option.trait} className={answers[question.id] === option.trait ? 'selected' : ''}>
                  <input
                    type="radio"
                    name={question.id}
                    value={option.trait}
                    checked={answers[question.id] === option.trait}
                    onChange={() => handleChange(question.id, option.trait)}
                  />
                  {option.label}
                </label>
              ))}
            </div>
          </article>
        ))}
      </div>

      {error && <p className="form-message">{error}</p>}
      <button className="primary" type="button" onClick={handleSubmit}>
        Nộp bài
      </button>
    </section>
  );
};

export default TakeTestPage;
