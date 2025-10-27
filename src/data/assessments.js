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
        prompt: "Cuoi tuan ranh ban thich lam gi nhat?",
        options: [
          { value: "R", label: "Lap robot mini hoac sua do" },
          { value: "A", label: "Thiet ke poster, ve minh hoa" },
          { value: "S", label: "Di tinh nguyen hoac ho tro nguoi khac" },
        ],
      },
      {
        id: "riasec-2",
        prompt: "Khi gap bai tap kho, ban xu ly the nao?",
        options: [
          { value: "I", label: "Tim tai lieu, phan tich nguyen nhan" },
          { value: "C", label: "Lam theo quy trinh ro rang" },
          { value: "E", label: "Keu goi nhom cung brainstorm" },
        ],
      },
      {
        id: "riasec-3",
        prompt: "Ky nang khien ban tu tin nhat la gi?",
        options: [
          { value: "S", label: "Lang nghe va khich le" },
          { value: "R", label: "Thuc hanh, sua chua chinh xac" },
          { value: "A", label: "Ke chuyen bang hinh anh" },
        ],
      },
      {
        id: "riasec-4",
        prompt: "Muc tieu ngan han trong nam hoc toi?",
        options: [
          { value: "E", label: "Dan dat du an kinh doanh mini" },
          { value: "I", label: "Tham gia cuoc thi khoa hoc ky thuat" },
          { value: "C", label: "Sap xep hoc tap that ky luat" },
        ],
      },
      {
        id: "riasec-5",
        prompt: "Ban muon them hoat dong cau lac bo nao?",
        options: [
          { value: "A", label: "Am nhac, nghe thuat" },
          { value: "R", label: "Mo hinh ky thuat" },
          { value: "S", label: "Tu van - ho tro tan sinh" },
        ],
      },
      {
        id: "riasec-6",
        prompt: "Trong nhom, vai tro phu hop nhat voi ban?",
        options: [
          { value: "C", label: "Len ke hoach, kiem soat tien do" },
          { value: "E", label: "Thuyet phuc, trinh bay ket qua" },
          { value: "I", label: "Phan tich so lieu, nghien cuu" },
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
        summary: `Ban noi bat o nhom ${traitSummary} theo mo hinh Holland.`,
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
          "Chon CLB hoac mon tu chon bam sat hai chu cai cao nhat.",
          "Ghi lai du an, cuoc thi lien quan de dua vao ho so xet tuyen.",
        ],
        topMajorGroupCodes,
        testLabel: "Holland RIASEC",
      };
    },
  },
  {
    id: "mbti",
    shortLabel: "MBTI",
    name: "MBTI dinh huong nghe",
    description: "Do 4 cap tinh cach MBTI de hieu moi truong hoc tap va lam viec hop gu.",
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
        prompt: "Ban nap lai nang luong bang cach nao?",
        options: [
          { value: "I", label: "O nha doc sach, lam viec mot minh" },
          { value: "E", label: "Di choi, gap go ban be" },
        ],
      },
      {
        id: "mbti-2",
        prompt: "Khi hoc kien thuc moi, ban chu y toi dieu gi?",
        options: [
          { value: "S", label: "Chi tiet cu the, vi du thuc te" },
          { value: "N", label: "Y nghia va xu huong tuong lai" },
        ],
      },
      {
        id: "mbti-3",
        prompt: "Trong tranh luan, ban thuong dua vao dau?",
        options: [
          { value: "T", label: "Ly le va du kien" },
          { value: "F", label: "Cam xuc va gia tri" },
        ],
      },
      {
        id: "mbti-4",
        prompt: "Doi voi deadline, ban thuong:",
        options: [
          { value: "J", label: "Lap ke hoach chi tiet va bam sat" },
          { value: "P", label: "Linh hoat ung bien, thich tu do" },
        ],
      },
      {
        id: "mbti-5",
        prompt: "Hoat dong ngoai khoa yeu thich?",
        options: [
          { value: "E", label: "Su kien dong nguoi, day thu thach" },
          { value: "I", label: "Du an nghien cuu nho" },
        ],
      },
      {
        id: "mbti-6",
        prompt: "Khi giai quyet van de, ban khoi dong bang:",
        options: [
          { value: "N", label: "Phac hoa y tuong" },
          { value: "S", label: "Thu thap so lieu ro rang" },
        ],
      },
      {
        id: "mbti-7",
        prompt: "Ban danh gia cao dieu gi trong doi nhom?",
        options: [
          { value: "F", label: "Khong khi hoa dong, ho tro nhau" },
          { value: "T", label: "Hieu qua va ket qua cuoi" },
        ],
      },
      {
        id: "mbti-8",
        prompt: "Cuoi tuan ban chon ke hoach the nao?",
        options: [
          { value: "J", label: "Chuan bi truoc, co lich cu the" },
          { value: "P", label: "De mo, tuy hung luc do" },
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
      return {
        traitSummary: code,
        summary: `Ban mang xu huong ${code}, hay tim moi truong hoc tap ${
          counters.J >= counters.P ? "co cau truc ro rang" : "linh hoat sang tao"
        } va dang tac dong ${counters.N >= counters.S ? "nhin xa" : "thuc te"}.`,
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
          "Uu tien hoat dong giup ban phat huy diem manh tung cap tinh cach.",
          "Ket hop MBTI voi RIASEC de nhin ro nghe phu hop.",
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
      Builder: "Thuc thi ky thuat",
      Helper: "Ho tro con nguoi",
      Thinker: "Phan tich logic",
      Persuader: "Anh huong & kinh doanh",
      Planner: "To chuc he thong",
      Creator: "Sang tao noi dung",
    },
    questions: [
      {
        id: "mapp-1",
        prompt: "Trong du an khoa hoc, ban muon nhan viec gi?",
        options: [
          { value: "Builder", label: "Thu nghiem, lap rap, thao tac" },
          { value: "Thinker", label: "Phan tich ket qua, viet bao cao" },
          { value: "Persuader", label: "Trinh bay, goi tai tro" },
        ],
      },
      {
        id: "mapp-2",
        prompt: "Lop can ho tro, ban san sang lam gi?",
        options: [
          { value: "Planner", label: "Lap bang theo doi, phan cong" },
          { value: "Helper", label: "Dong vien va kem tung ban" },
          { value: "Creator", label: "Thiet ke thong diep truyen cam hung" },
        ],
      },
      {
        id: "mapp-3",
        prompt: "Khi du an gap loi, phan ung dau tien cua ban la?",
        options: [
          { value: "Builder", label: "Lam lai tung buoc de tim nguyen nhan" },
          { value: "Thinker", label: "Doi chieu du lieu de tim mau thuan" },
          { value: "Helper", label: "Noi chuyen de ho tro tung thanh vien" },
        ],
      },
      {
        id: "mapp-4",
        prompt: "Thanh cong nao khien ban tu hao?",
        options: [
          { value: "Persuader", label: "Thuyet phuc duoc tai tro/hop tac" },
          { value: "Creator", label: "Tao san pham truyen thong noi bat" },
          { value: "Planner", label: "Van hanh du an dung tien do" },
        ],
      },
      {
        id: "mapp-5",
        prompt: "Neu dan dat cuoc hop, ban uu tien dieu gi?",
        options: [
          { value: "Helper", label: "Giu tinh than nhom tich cuc" },
          { value: "Persuader", label: "Dinh huong ket qua ro rang" },
          { value: "Thinker", label: "Kiem soat thong tin va so lieu" },
        ],
      },
      {
        id: "mapp-6",
        prompt: "Truoc ky thi quan trong, ban se:",
        options: [
          { value: "Planner", label: "Lap ke hoach on tap chi tiet" },
          { value: "Builder", label: "Lam nhieu de thi mau" },
          { value: "Creator", label: "Tom tat bang so do, infographics" },
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
      return {
        traitSummary: topTags.map(([key]) => key.substring(0, 3).toUpperCase()).join("-"),
        summary: `Dong luc manh nhat cua ban la ${topTags.map(([key]) => key.toLowerCase()).join(" va ")}.`,
        scores,
        scoreLabels: {
          Builder: "Thuc thi ky thuat",
          Helper: "Ho tro con nguoi",
          Thinker: "Phan tich logic",
          Persuader: "Anh huong & kinh doanh",
          Planner: "To chuc he thong",
          Creator: "Sang tao noi dung",
        },
        insights: [
          "Sap xep hoat dong ngoai khoa bam sat nhom dong luc cao nhat.",
          "Giu nang luong bang cach gan muc tieu cu the cho tung du an.",
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
      Linguistic: "Ngon ngu",
      Logical: "Logic - Toan",
      Spatial: "Khong gian",
      Musical: "Am nhac",
      Kinesthetic: "Van dong",
      Interpersonal: "Giao tiep",
      Intrapersonal: "Tu nhan thuc",
      Naturalist: "Thien nhien",
    },
    questions: [
      {
        id: "gardner-1",
        prompt: "Ban thuong dat diem cao nhat o mon nao?",
        options: [
          { value: "Linguistic", label: "Van, Ngoai ngu" },
          { value: "Logical", label: "Toan, Ly" },
          { value: "Spatial", label: "Ve, Thiet ke" },
        ],
      },
      {
        id: "gardner-2",
        prompt: "Hoat dong giai tri ban thich?",
        options: [
          { value: "Musical", label: "Nghe hoac choi nhac" },
          { value: "Kinesthetic", label: "The thao, nhay mua" },
          { value: "Intrapersonal", label: "Viet nhat ky, suy ngam" },
        ],
      },
      {
        id: "gardner-3",
        prompt: "Ban thay de dang nhat khi:",
        options: [
          { value: "Interpersonal", label: "Lam viec cung nhieu nguoi" },
          { value: "Logical", label: "Giai bai toan kho" },
          { value: "Naturalist", label: "Cham soc cay, quan sat thien nhien" },
        ],
      },
      {
        id: "gardner-4",
        prompt: "Trong nhom, ban hay dong gop bang viec gi?",
        options: [
          { value: "Spatial", label: "Ve so do, minh hoa" },
          { value: "Linguistic", label: "Trinh bay noi dung ro rang" },
          { value: "Interpersonal", label: "Ket noi va tao dong luc" },
        ],
      },
      {
        id: "gardner-5",
        prompt: "Ban nho bai tot nhat khi:",
        options: [
          { value: "Kinesthetic", label: "Thuc hanh, lam mau" },
          { value: "Musical", label: "Chuyen thanh giai dieu" },
          { value: "Intrapersonal", label: "Lien he trai nghiem cua minh" },
        ],
      },
      {
        id: "gardner-6",
        prompt: "Thoi khoa bieu ly tuong cua ban nen co:",
        options: [
          { value: "Naturalist", label: "Hoat dong ngoai troi" },
          { value: "Logical", label: "Giai nhieu cau hoi hoc bua" },
          { value: "Linguistic", label: "Thuyet trinh hoac viet" },
        ],
      },
      {
        id: "gardner-7",
        prompt: "Cau nao giong ban nhat?",
        options: [
          { value: "Spatial", label: "Toi luon nhin thay buc tranh lon" },
          { value: "Musical", label: "Toi nghi theo nhip dieu" },
          { value: "Interpersonal", label: "Toi biet cach khich le moi nguoi" },
        ],
      },
      {
        id: "gardner-8",
        prompt: "Ban muon phat trien ky nang nao?",
        options: [
          { value: "Intrapersonal", label: "Quan ly cam xuc ca nhan" },
          { value: "Naturalist", label: "Hieu he sinh thai" },
          { value: "Linguistic", label: "Kha nang thuyet phuc" },
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
      return {
        traitSummary: topEntries.map(([key]) => key.slice(0, 3).toUpperCase()).join("-"),
        summary: `Ban manh ve ${topEntries.map(([key]) => key.toLowerCase()).join(", ")} theo Gardner.`,
        scores,
        scoreLabels: {
          Linguistic: "Ngon ngu",
          Logical: "Logic - Toan",
          Spatial: "Khong gian",
          Musical: "Am nhac",
          Kinesthetic: "Van dong",
          Interpersonal: "Giao tiep",
          Intrapersonal: "Tu nhan thuc",
          Naturalist: "Thien nhien",
        },
        insights: [
          "Chon hoat dong ngoai khoa bo sung nhung tri thong minh con thap.",
          "Dua diem manh vao ho so xet tuyen de tao dau an rieng.",
        ],
        topMajorGroupCodes: majors,
        testLabel: "Multiple Intelligences",
      };
    },
  },
];






