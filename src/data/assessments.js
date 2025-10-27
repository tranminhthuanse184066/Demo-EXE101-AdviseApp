import riasecCover from "../assets/tests/riasec-hero.svg";
import mbtiCover from "../assets/tests/mbti-hero.svg";
import mappCover from "../assets/tests/mapp-hero.svg";
import gardnerCover from "../assets/tests/gardner-hero.svg";
const pickTop = (entries, count = 2) => {
  const sorted = [...entries].sort(([, a], [, b]) => b - a);
  return sorted.slice(0, count);
};

const defaultMajorFallback = ["BUSINESS", "MARKETING", "DATA_SCI"];

const fromRiasecScores = (scores) => {
  const topPairs = pickTop(Object.entries(scores));
  const summary = topPairs.map(([key]) => key).join("-");
  const picks = [];
  const add = (...codes) => {
    codes.forEach((code) => {
      if (!picks.includes(code)) picks.push(code);
    });
  };
  const letters = summary.split("");
  if (letters.includes("R")) add("CS_AI", "MECH_ELEC", "CYBER");
  if (letters.includes("I")) add("DATA_SCI", "CS_AI");
  if (letters.includes("A")) add("MEDIA", "MARKETING");
  if (letters.includes("S")) add("PSYCH_SOC", "MED");
  if (letters.includes("E")) add("BUSINESS", "FINANCE");
  if (letters.includes("C")) add("LAW", "FINANCE");
  return {
    traitSummary: summary,
    topMajorGroupCodes: picks.slice(0, 3).length ? picks.slice(0, 3) : defaultMajorFallback,
  };
};

const mapMbtiToMajors = (code) => {
  const picks = [];
  const add = (...codes) => {
    codes.forEach((item) => {
      if (!picks.includes(item)) picks.push(item);
    });
  };
  if (code.includes("NT")) add("CS_AI", "DATA_SCI", "CYBER");
  if (code.includes("NF")) add("PSYCH_SOC", "MEDIA", "MARKETING");
  if (code.includes("SJ")) add("LAW", "FINANCE", "BUSINESS");
  if (code.includes("SP")) add("MARKETING", "MEDIA");
  if (code[0] === "E") add("BUSINESS");
  if (code[0] === "I") add("DATA_SCI");
  return picks.slice(0, 3).length ? picks.slice(0, 3) : defaultMajorFallback;
};

const mapMappToMajors = (scores) => {
  const entries = pickTop(Object.entries(scores), 2);
  const tags = entries.map(([key]) => key);
  const picks = [];
  const add = (...codes) => {
    codes.forEach((item) => {
      if (!picks.includes(item)) picks.push(item);
    });
  };
  if (tags.includes("Builder")) add("MECH_ELEC", "CS_AI");
  if (tags.includes("Helper")) add("PSYCH_SOC", "MED");
  if (tags.includes("Thinker")) add("DATA_SCI", "CS_AI");
  if (tags.includes("Persuader")) add("MARKETING", "BUSINESS", "FINANCE");
  if (tags.includes("Planner")) add("LAW", "FINANCE");
  if (tags.includes("Creator")) add("MEDIA", "MARKETING");
  return picks.slice(0, 3).length ? picks.slice(0, 3) : defaultMajorFallback;
};

const mapGardnerToMajors = (scores) => {
  const entries = pickTop(Object.entries(scores), 3);
  const picks = [];
  entries.forEach(([key]) => {
    if (key === "Logical") picks.push("DATA_SCI", "CS_AI");
    if (key === "Linguistic") picks.push("LAW", "MARKETING");
    if (key === "Interpersonal") picks.push("BUSINESS", "PSYCH_SOC");
    if (key === "Intrapersonal") picks.push("PSYCH_SOC", "MEDIA");
    if (key === "Spatial") picks.push("MEDIA", "MARKETING");
    if (key === "Musical") picks.push("MEDIA");
    if (key === "Kinesthetic") picks.push("MECH_ELEC", "MED");
    if (key === "Naturalist") picks.push("MECH_ELEC", "MED");
  });
  const unique = picks.filter((code, index) => picks.indexOf(code) === index);
  return unique.slice(0, 3).length ? unique.slice(0, 3) : defaultMajorFallback;
};

export const assessmentCatalog = [
  {
    id: "riasec",
    shortLabel: "RIASEC",
    name: "Holland RIASEC",
    tagline: "Khám nhanh nhóm sở thích nổi bật và định hướng ngành học.",
    description: "Khám phá nhóm sở thích R - I - A - S - E - C để ghép ngành phù hợp.",
    coverImage: riasecCover,
    scoreLabels: {
      R: "Realistic",
      I: "Investigative",
      A: "Artistic",
      S: "Social",
      E: "Enterprising",
      C: "Conventional",
    },
    questions: [
      {
        id: "riasec-1",
        prompt: "Cuối tuần rảnh bạn thích làm gì nhất?",
        options: [
          { value: "R", label: "Lắp robot mini hoặc sửa đồ" },
          { value: "A", label: "Thiết kế poster, vẽ minh họa" },
          { value: "S", label: "Đi tình nguyện hoặc hỗ trợ người khác" },
        ],
      },
      {
        id: "riasec-2",
        prompt: "Khi gặp bài tập khó, bạn xử lý thế nào?",
        options: [
          { value: "I", label: "Tìm tài liệu, phân tích nguyên nhân" },
          { value: "C", label: "Làm theo quy trình rõ ràng" },
          { value: "E", label: "Kêu gọi nhóm cùng brainstorm" },
        ],
      },
      {
        id: "riasec-3",
        prompt: "Kỹ năng khiến bạn tự tin nhất là gì?",
        options: [
          { value: "S", label: "Lắng nghe và khích lệ" },
          { value: "R", label: "Thực hành, sửa chữa chính xác" },
          { value: "A", label: "Kể chuyện bằng hình ảnh" },
        ],
      },
      {
        id: "riasec-4",
        prompt: "Mục tiêu ngắn hạn trong năm học tới?",
        options: [
          { value: "E", label: "Dẫn dắt dự án kinh doanh mini" },
          { value: "I", label: "Tham gia cuộc thi khoa học kỹ thuật" },
          { value: "C", label: "Sắp xếp học tập thật kỷ luật" },
        ],
      },
      {
        id: "riasec-5",
        prompt: "Bạn muốn thêm hoạt động câu lạc bộ nào?",
        options: [
          { value: "A", label: "Âm nhạc, nghệ thuật" },
          { value: "R", label: "Mô hình kỹ thuật" },
          { value: "S", label: "Tư vấn - hỗ trợ tân sinh" },
        ],
      },
      {
        id: "riasec-6",
        prompt: "Trong nhóm, vai trò phù hợp nhất với bạn?",
        options: [
          { value: "C", label: "Lên kế hoạch, kiểm soát tiến độ" },
          { value: "E", label: "Thuyết phục, trình bày kết quả" },
          { value: "I", label: "Phân tích số liệu, nghiên cứu" },
        ],
      },
    ],
    evaluate: (answers) => {
      const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
      Object.values(answers).forEach((value) => {
        if (scores[value] !== undefined) {
          scores[value] += 1;
        }
      });
      const { traitSummary, topMajorGroupCodes } = fromRiasecScores(scores);
      return {
        traitSummary,
        summary: `Bạn nổi bật ở nhóm ${traitSummary} theo mô hình Holland.`,
        scores,
        scoreLabels: {
          R: "Realistic",
          I: "Investigative",
          A: "Artistic",
          S: "Social",
          E: "Enterprising",
          C: "Conventional",
        },
        insights: [
          "Chọn CLB hoặc môn tự chọn bám sát hai chữ cái cao nhất.",
          "Ghi lại dự án, cuộc thi liên quan để đưa vào hồ sơ xét tuyển.",
        ],
        topMajorGroupCodes,
        testLabel: "Holland RIASEC",
      };
    },
  },
  {
    id: "mbti",
    shortLabel: "MBTI",
    name: "MBTI định hướng nghề nghiệp",
    tagline: "Khám phá nhóm tính cách MBTI và phong cách học tập phù hợp.",
    description: "Đo 4 cặp tính cách MBTI để hiểu môi trường học tập và làm việc hợp gu.",
    coverImage: mbtiCover,
    scoreLabels: {
      I: "Introversion",
      E: "Extraversion",
      N: "Intuition",
      S: "Sensing",
      T: "Thinking",
      F: "Feeling",
      J: "Judging",
      P: "Perceiving",
    },
    questions: [
      {
        id: "mbti-1",
        prompt: "Bạn nạp lại năng lượng bằng cách nào?",
        options: [
          { value: "I", label: "Ở nhà đọc sách, làm việc một mình" },
          { value: "E", label: "Đi chơi, gặp gỡ bạn bè" },
        ],
      },
      {
        id: "mbti-2",
        prompt: "Khi học kiến thức mới, bạn chú ý tới điều gì?",
        options: [
          { value: "S", label: "Chi tiết cụ thể, ví dụ thực tế" },
          { value: "N", label: "Ý nghĩa và xu hướng tương lai" },
        ],
      },
      {
        id: "mbti-3",
        prompt: "Trong tranh luận, bạn thường dựa vào đâu?",
        options: [
          { value: "T", label: "Lý lẽ và dự kiến" },
          { value: "F", label: "Cảm xúc và giá trị" },
        ],
      },
      {
        id: "mbti-4",
        prompt: "Đối với deadline, bạn thường:",
        options: [
          { value: "J", label: "Lập kế hoạch chi tiết và bám sát" },
          { value: "P", label: "Linh hoạt ứng biến, thích tự do" },
        ],
      },
      {
        id: "mbti-5",
        prompt: "Hoạt động ngoại khóa yêu thích?",
        options: [
          { value: "E", label: "Sự kiện đông người, đầy thử thách" },
          { value: "I", label: "Dự án nghiên cứu nhỏ" },
        ],
      },
      {
        id: "mbti-6",
        prompt: "Khi giải quyết vấn đề, bạn khởi động bằng:",
        options: [
          { value: "N", label: "Phác họa ý tưởng" },
          { value: "S", label: "Thu thập số liệu rõ ràng" },
        ],
      },
      {
        id: "mbti-7",
        prompt: "Bạn đánh giá cao điều gì trong đội nhóm?",
        options: [
          { value: "F", label: "Không khí hòa đồng, hỗ trợ nhau" },
          { value: "T", label: "Hiệu quả và kết quả cuối" },
        ],
      },
      {
        id: "mbti-8",
        prompt: "Cuối tuần bạn chọn kế hoạch thế nào?",
        options: [
          { value: "J", label: "Chuẩn bị trước, có lịch cụ thể" },
          { value: "P", label: "Dễ mở, tùy hứng lúc đó" },
        ],
      },
    ],
    evaluate: (answers) => {
      const counters = { I: 0, E: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
      Object.values(answers).forEach((value) => {
        if (counters[value] !== undefined) counters[value] += 1;
      });
      const code = `${counters.I >= counters.E ? "I" : "E"}${counters.N >= counters.S ? "N" : "S"}${
        counters.T >= counters.F ? "T" : "F"
      }${counters.J >= counters.P ? "J" : "P"}`;
      const majors = mapMbtiToMajors(code);
      const structureNote = counters.J >= counters.P ? "có cấu trúc rõ ràng" : "linh hoạt sáng tạo";
      const focusNote = counters.N >= counters.S ? "hướng tương lai" : "thực tế";
      return {
        traitSummary: code,
        summary: `Bạn mang xu hướng ${code}, hợp môi trường học tập ${structureNote} và phong cách làm việc ${focusNote}.`,
        scores: counters,
        scoreLabels: {
          I: "Introversion",
          E: "Extraversion",
          N: "Intuition",
          S: "Sensing",
          T: "Thinking",
          F: "Feeling",
          J: "Judging",
          P: "Perceiving",
        },
        insights: [
          "Ưu tiên hoạt động giúp bạn phát huy điểm mạnh từng cặp tính cách.",
          "Kết hợp MBTI với RIASEC để nhìn rõ nghề phù hợp.",
        ],
        topMajorGroupCodes: majors,
        testLabel: "MBTI Career",
      };
    },
  },
  {
    id: "mapp",
    shortLabel: "MAPP",
    name: "Động lực MAPP",
    tagline: "Tìm động lực nội tại và hoạch định lộ trình dài hạn.",
    description: "Đo động lực nội tại và sở thích công việc để chọn đường dài hạn.",
    coverImage: mappCover,
    scoreLabels: {
      Builder: "Thực thi kỹ thuật",
      Helper: "Hỗ trợ con người",
      Thinker: "Phân tích logic",
      Persuader: "Ảnh hưởng & kinh doanh",
      Planner: "Tổ chức hệ thống",
      Creator: "Sáng tạo nội dung",
    },
    questions: [
      {
        id: "mapp-1",
        prompt: "Trong dự án khoa học, bạn muốn nhận việc gì?",
        options: [
          { value: "Builder", label: "Thử nghiệm, lắp ráp, thao tác" },
          { value: "Thinker", label: "Phân tích kết quả, viết báo cáo" },
          { value: "Persuader", label: "Trình bày, gọi tài trợ" },
        ],
      },
      {
        id: "mapp-2",
        prompt: "Lớp cần hỗ trợ, bạn sẵn sàng làm gì?",
        options: [
          { value: "Planner", label: "Lập bảng theo dõi, phân công" },
          { value: "Helper", label: "Động viên và kèm từng bạn" },
          { value: "Creator", label: "Thiết kế thông điệp truyền cảm hứng" },
        ],
      },
      {
        id: "mapp-3",
        prompt: "Khi dự án gặp lỗi, phản ứng đầu tiên của bạn là?",
        options: [
          { value: "Builder", label: "Làm lại từng bước để tìm nguyên nhân" },
          { value: "Thinker", label: "Đối chiếu dữ liệu để tìm mâu thuẫn" },
          { value: "Helper", label: "Nói chuyện để hỗ trợ từng thành viên" },
        ],
      },
      {
        id: "mapp-4",
        prompt: "Thành công nào khiến bạn tự hào?",
        options: [
          { value: "Persuader", label: "Thuyết phục được tài trợ/hợp tác" },
          { value: "Creator", label: "Tạo sản phẩm truyền thông nổi bật" },
          { value: "Planner", label: "Vận hành dự án đúng tiến độ" },
        ],
      },
      {
        id: "mapp-5",
        prompt: "Nếu dẫn dắt cuộc họp, bạn ưu tiên điều gì?",
        options: [
          { value: "Helper", label: "Giữ tinh thần nhóm tích cực" },
          { value: "Persuader", label: "Định hướng kết quả rõ ràng" },
          { value: "Thinker", label: "Kiểm soát thông tin và số liệu" },
        ],
      },
      {
        id: "mapp-6",
        prompt: "Trước kỳ thi quan trọng, bạn sẽ:",
        options: [
          { value: "Planner", label: "Lập kế hoạch ôn tập chi tiết" },
          { value: "Builder", label: "Làm nhiều đề thi mẫu" },
          { value: "Creator", label: "Tóm tắt bằng sơ đồ, infographics" },
        ],
      },
    ],
    evaluate: (answers) => {
      const scores = {
        Builder: 0,
        Helper: 0,
        Thinker: 0,
        Persuader: 0,
        Planner: 0,
        Creator: 0,
      };
      Object.values(answers).forEach((value) => {
        if (scores[value] !== undefined) scores[value] += 1;
      });
      const topTags = pickTop(Object.entries(scores));
      const majors = mapMappToMajors(scores);
      const labelMap = {
        Builder: "Thực thi kỹ thuật",
        Helper: "Hỗ trợ con người",
        Thinker: "Phân tích logic",
        Persuader: "Ảnh hưởng & kinh doanh",
        Planner: "Tổ chức hệ thống",
        Creator: "Sáng tạo nội dung",
      };
      return {
        traitSummary: topTags.map(([key]) => key.substring(0, 3).toUpperCase()).join("-"),
        summary: `Động lực mạnh nhất của bạn nằm ở ${topTags
          .map(([key]) => labelMap[key].toLowerCase())
          .join(" và ")}.`,
        scores,
        scoreLabels: labelMap,
        insights: [
          "Sắp xếp hoạt động ngoại khóa bám sát nhóm động lực cao nhất.",
          "Giữ năng lượng bằng cách gắn mục tiêu cụ thể cho từng dự án.",
        ],
        topMajorGroupCodes: majors,
        testLabel: "MAPP Motivation",
      };
    },
  },
  {
    id: "gardner",
    shortLabel: "MI",
    name: "Đa trí thông minh Gardner",
    tagline: "Đánh giá 8 loại trí thông minh để cân bằng học tập và hoạt động.",
    description: "Đo 8 loại trí thông minh để chọn môn học và hoạt động cân bằng.",
    coverImage: gardnerCover,
    scoreLabels: {
      Linguistic: "Ngôn ngữ",
      Logical: "Logic - Toán",
      Spatial: "Không gian",
      Musical: "Âm nhạc",
      Kinesthetic: "Vận động",
      Interpersonal: "Giao tiếp",
      Intrapersonal: "Tự nhận thức",
      Naturalist: "Thiên nhiên",
    },
    questions: [
      {
        id: "gardner-1",
        prompt: "Bạn thường đạt điểm cao nhất ở môn nào?",
        options: [
          { value: "Linguistic", label: "Văn, Ngoại ngữ" },
          { value: "Logical", label: "Toán, Lý" },
          { value: "Spatial", label: "Vẽ, Thiết kế" },
        ],
      },
      {
        id: "gardner-2",
        prompt: "Hoạt động giải trí bạn thích?",
        options: [
          { value: "Musical", label: "Nghe hoặc chơi nhạc" },
          { value: "Kinesthetic", label: "Thể thao, nhảy múa" },
          { value: "Intrapersonal", label: "Viết nhật ký, suy ngẫm" },
        ],
      },
      {
        id: "gardner-3",
        prompt: "Bạn thấy dễ dàng nhất khi:",
        options: [
          { value: "Interpersonal", label: "Làm việc cùng nhiều người" },
          { value: "Logical", label: "Giải bài toán khó" },
          { value: "Naturalist", label: "Chăm sóc cây, quan sát thiên nhiên" },
        ],
      },
      {
        id: "gardner-4",
        prompt: "Trong nhóm, bạn hay đóng góp bằng việc gì?",
        options: [
          { value: "Spatial", label: "Vẽ sơ đồ, minh họa" },
          { value: "Linguistic", label: "Trình bày nội dung rõ ràng" },
          { value: "Interpersonal", label: "Kết nối và tạo động lực" },
        ],
      },
      {
        id: "gardner-5",
        prompt: "Bạn nhớ bài tốt nhất khi:",
        options: [
          { value: "Kinesthetic", label: "Thực hành, làm mẫu" },
          { value: "Musical", label: "Chuyển thành giai điệu" },
          { value: "Intrapersonal", label: "Liên hệ trải nghiệm của mình" },
        ],
      },
      {
        id: "gardner-6",
        prompt: "Thời khóa biểu lý tưởng của bạn nên có:",
        options: [
          { value: "Naturalist", label: "Hoạt động ngoài trời" },
          { value: "Logical", label: "Giải nhiều câu hỏi hóc búa" },
          { value: "Linguistic", label: "Thuyết trình hoặc viết" },
        ],
      },
      {
        id: "gardner-7",
        prompt: "Câu nào giống bạn nhất?",
        options: [
          { value: "Spatial", label: "Tôi luôn nhìn thấy bức tranh lớn" },
          { value: "Musical", label: "Tôi nghĩ theo nhịp điệu" },
          { value: "Interpersonal", label: "Tôi biết cách khích lệ mọi người" },
        ],
      },
      {
        id: "gardner-8",
        prompt: "Bạn muốn phát triển kỹ năng nào?",
        options: [
          { value: "Intrapersonal", label: "Quản lý cảm xúc cá nhân" },
          { value: "Naturalist", label: "Hiểu hệ sinh thái" },
          { value: "Linguistic", label: "Khả năng thuyết phục" },
        ],
      },
    ],
    evaluate: (answers) => {
      const scores = {
        Linguistic: 0,
        Logical: 0,
        Spatial: 0,
        Musical: 0,
        Kinesthetic: 0,
        Interpersonal: 0,
        Intrapersonal: 0,
        Naturalist: 0,
      };
      Object.values(answers).forEach((value) => {
        if (scores[value] !== undefined) scores[value] += 1;
      });
      const topEntries = pickTop(Object.entries(scores), 3);
      const majors = mapGardnerToMajors(scores);
      const labelMap = {
        Linguistic: "Ngôn ngữ",
        Logical: "Logic - Toán",
        Spatial: "Không gian",
        Musical: "Âm nhạc",
        Kinesthetic: "Vận động",
        Interpersonal: "Giao tiếp",
        Intrapersonal: "Tự nhận thức",
        Naturalist: "Thiên nhiên",
      };
      return {
        traitSummary: topEntries.map(([key]) => key.slice(0, 3).toUpperCase()).join("-"),
        summary: `Bạn mạnh về ${topEntries.map(([key]) => labelMap[key].toLowerCase()).join(", ")} theo Gardner.`,
        scores,
        scoreLabels: labelMap,
        insights: [
          "Chọn hoạt động ngoại khóa bổ sung những trí thông minh còn thấp.",
          "Đưa điểm mạnh vào hồ sơ xét tuyển để tạo dấu ấn riêng.",
        ],
        topMajorGroupCodes: majors,
        testLabel: "Multiple Intelligences",
      };
    },
  },
];










