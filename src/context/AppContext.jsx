import { createContext, useContext, useMemo, useState } from "react";
import dayjs from "dayjs";
import {
  demoRecommendations,
  demoStudentProfiles,
  demoTestResults,
  demoUsers,
  majorGroups,
  universities,
} from "../data/mockData";

const STORAGE_KEY = "edupath-state";

const clone = (payload) => JSON.parse(JSON.stringify(payload));

const idFactory = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 10)}`;
const majorGroupMap = Object.fromEntries(majorGroups.map((group) => [group.code, group]));

const buildInitialState = () => ({
  users: clone(demoUsers),
  studentProfiles: clone(demoStudentProfiles),
  testResults: clone(demoTestResults),
  recommendations: clone(demoRecommendations),
  chatThreads: {},
  currentUserId: null,
});

const loadState = () => {
  if (typeof window === "undefined") return buildInitialState();
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = buildInitialState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.error("Failed to parse cached state", error);
    const fallback = buildInitialState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
};

const keywordsReply = [
  {
    keyword: "hoc phi",
    reply: "Học phí trung bình các trường dao động 20-60 triệu mỗi năm. Vào mục Trường học để lọc theo mức mong muốn.",
  },
  {
    keyword: "diem chuan",
    reply: "Điểm chuẩn của từng trường đã hiển thị trong danh sách. Hãy đặt mục tiêu cao hơn 1-2 điểm để an toàn.",
  },
  {
    keyword: "khoi xet",
    reply: "Khối xét tuyển phổ biến: A00, A01, D01. So sánh với tổ hợp mạnh và yêu cầu từng trường.",
  },
];

const traitToMajors = (traitSummary) => {
  if (!traitSummary) return [];
  const letters = traitSummary.replace(/[^RIASEC]/g, "").split("");
  const picks = [];
  const add = (...codes) => {
    codes.forEach((code) => {
      if (!picks.includes(code)) picks.push(code);
    });
  };
  if (letters.includes("I") && letters.includes("R")) add("CS_AI", "MECH_ELEC");
  if (letters.includes("A") && letters.includes("S")) add("MARKETING", "PSYCH_SOC", "MEDIA");
  if (letters.includes("E")) add("BUSINESS", "FINANCE");
  if (letters.includes("C")) add("LAW", "FINANCE");
  if (letters.includes("I")) add("DATA_SCI");
  if (letters.includes("R")) add("CYBER");
  if (letters.includes("A")) add("MEDIA");
  return picks.slice(0, 3);
};

const majorRoadmapConfig = {
  CS_AI: {
    label: "Công nghệ AI",
    examCombo: "A00/A01",
    focusSubjects: ["Toán", "Lý", "Tin"],
    coreSkills: ["Python", "Giải thuật", "Tư duy dữ liệu"],
    practice: "30 đề chuẩn A00 và 5 đề đánh giá tư duy",
    activities: "hackathon AI, CLB Robotics, cuộc thi lập trình",
    targetScore: 26,
  },
  DATA_SCI: {
    label: "Khoa học dữ liệu",
    examCombo: "A00/A01",
    focusSubjects: ["Toán", "Tin", "Anh"],
    coreSkills: ["Pandas", "Trực quan hóa dữ liệu", "SQL"],
    practice: "25 đề chuẩn A00/A01 và 3 đề bài phân tích dữ liệu thực tế",
    activities: "cuộc thi Data, thử thách Kaggle, CLB Phân tích dữ liệu",
    targetScore: 25,
  },
  CYBER: {
    label: "An ninh mạng",
    examCombo: "A00/A01",
    focusSubjects: ["Toán", "Lý", "Tin"],
    coreSkills: ["Mạng máy tính", "Kỹ năng CTF", "Phân tích log"],
    practice: "20 đề A00 và 10 bài lab an toàn thông tin",
    activities: "CLB Security, CTF online, dự án bảo mật nội bộ",
    targetScore: 25,
  },
  MECH_ELEC: {
    label: "Cơ khí - Điện",
    examCombo: "A00",
    focusSubjects: ["Toán", "Lý", "Hóa"],
    coreSkills: ["CAD 2D/3D", "Điện tử cơ bản", "Cơ khí ứng dụng"],
    practice: "30 đề A00 và 2 mô hình cơ khí hoặc mạch điện",
    activities: "CLB Kỹ thuật, cuộc thi sáng tạo khoa học, dự án robot",
    targetScore: 24,
  },
  MED: {
    label: "Y khoa",
    examCombo: "B00",
    focusSubjects: ["Sinh", "Hóa", "Toán"],
    coreSkills: ["Sinh học người", "Sơ cứu cơ bản", "Kỹ năng nghiên cứu"],
    practice: "35 đề B00 và 50 câu hỏi tình huống lâm sàng",
    activities: "Tình nguyện y tế, shadowing tại bệnh viện, hội thảo y khoa",
    targetScore: 27,
  },
  PHARMA: {
    label: "Dược học",
    examCombo: "B00",
    focusSubjects: ["Hóa", "Sinh", "Toán"],
    coreSkills: ["Hóa dược", "Thực hành phòng thí nghiệm", "Đọc tài liệu tiếng Anh chuyên ngành"],
    practice: "30 đề B00 và 5 thí nghiệm mô phỏng an toàn",
    activities: "CLB Khoa học, cuộc thi nghiên cứu khoa học kỹ thuật, thực tập nhà thuốc",
    targetScore: 25,
  },
  MARKETING: {
    label: "Truyền thông & Marketing",
    examCombo: "D01",
    focusSubjects: ["Văn", "Anh", "Toán"],
    coreSkills: ["Content Marketing", "Digital Ads", "Nghiên cứu thị trường"],
    practice: "20 đề D01 và 3 bản kế hoạch chiến dịch thực tế",
    activities: "Cuộc thi Marketing, CLB truyền thông, dự án xây dựng thương hiệu cá nhân",
    targetScore: 23,
  },
  MEDIA: {
    label: "Sản xuất nội dung",
    examCombo: "D01/H00",
    focusSubjects: ["Văn", "Anh", "Mỹ thuật cơ bản"],
    coreSkills: ["Kịch bản", "Thiết kế đa phương tiện", "Quay dựng video"],
    practice: "15 đề D01 và 3 sản phẩm multimedia hoàn chỉnh",
    activities: "CLB Media, dự án phim ngắn, cuộc thi sáng tạo nội dung",
    targetScore: 22,
  },
  PSYCH_SOC: {
    label: "Tâm lý & Công tác xã hội",
    examCombo: "C00/D01",
    focusSubjects: ["Văn", "Sử", "Địa"],
    coreSkills: ["Lắng nghe - tham vấn", "Phân tích tình huống", "Thiết kế chương trình hỗ trợ"],
    practice: "20 đề C00/D01 và 10 case study tâm lý - xã hội",
    activities: "Dự án cộng đồng, tình nguyện dài hạn, CLB kỹ năng mềm",
    targetScore: 22,
  },
  BUSINESS: {
    label: "Kinh doanh",
    examCombo: "A00/A01/D01",
    focusSubjects: ["Toán", "Anh", "Lý"],
    coreSkills: ["Excel tài chính", "Thuyết trình", "Tư duy chiến lược"],
    practice: "25 đề tổ hợp và 2 bản business plan hoàn chỉnh",
    activities: "Cuộc thi khởi nghiệp, CLB kinh doanh, chương trình cố vấn doanh nhân",
    targetScore: 24,
  },
  FINANCE: {
    label: "Tài chính - Ngân hàng",
    examCombo: "A00/A01/D01",
    focusSubjects: ["Toán", "Anh", "Kinh tế"],
    coreSkills: ["Phân tích tài chính", "Excel nâng cao", "Tư duy dữ liệu"],
    practice: "25 đề tổ hợp và 50 bài tập nghiệp vụ tài chính",
    activities: "Cuộc thi Tài chính, thực tập ngân hàng, CLB chứng khoán",
    targetScore: 25,
  },
  LAW: {
    label: "Luật & Hành chính",
    examCombo: "C00/D01",
    focusSubjects: ["Văn", "Sử", "Địa"],
    coreSkills: ["Tranh biện", "Nghiên cứu văn bản pháp luật", "Kỹ năng viết lập luận"],
    practice: "20 đề C00/D01 và 10 hồ sơ vụ việc giả định",
    activities: "Phiên tòa giả định, CLB tranh biện, thực tập văn phòng luật",
    targetScore: 23,
  },
  default: {
    label: "Ngành mục tiêu",
    examCombo: "A00/D01",
    focusSubjects: ["Toán", "Anh", "Kỹ năng mềm"],
    coreSkills: ["Tư duy phản biện", "Nghiên cứu học thuật", "Quản lý dự án"],
    practice: "20 đề chuẩn theo tổ hợp lựa chọn",
    activities: "CLB học thuật, dự án cá nhân, hoạt động thiện nguyện",
    targetScore: 24,
  },
};

const createPersonalRoadmap = (profile, { majorCodes, targetScore, targetUniNames }) => {
  const start = dayjs();
  const steps = [];
  let offset = 20;

  const pushStep = (phase, title, extraOffset = 30) => {
    offset += extraOffset;
    steps.push({ phase, title, offset });
  };

  const focusCodes = majorCodes.length ? majorCodes : ["CS_AI"];

  focusCodes.forEach((code) => {
    const config = majorRoadmapConfig[code] || majorRoadmapConfig.default;
    const majorName = majorGroupMap[code]?.name || config.label;
    const subjects = config.focusSubjects.join(" - ");
    const examCombo = config.examCombo;
    const effectiveScore = targetScore ? Math.max(targetScore, config.targetScore) : config.targetScore;

    pushStep(
      `Nền tảng chuyên môn (${majorName})`,
      `Ôn chắc ${subjects} theo tổ hợp ${examCombo}, hoàn thành ${config.practice}.`,
      30,
    );
    pushStep(
      `Kỹ năng & dự án ${majorName}`,
      `Luyện ${config.coreSkills.join(", ")} qua 2 dự án mini liên quan ${majorName}.`,
      35,
    );
    pushStep(
      "Hoạt động nổi bật",
      `Tham gia ${config.activities}, lưu lại minh chứng và viết nhật ký học tập hằng tuần.`,
      35,
    );
    pushStep(
      `Kiểm tra tiến độ ${majorName}`,
      `Đặt mục tiêu điểm ${examCombo} ≥ ${effectiveScore} và rà soát GPA cùng cố vấn mỗi tháng.`,
      35,
    );
  });

  pushStep(
    "Ngoại ngữ & chứng chỉ",
    "Hoàn thành chứng chỉ ngoại ngữ (IELTS 6.5+) hoặc MOS/IC3 để cộng điểm ưu tiên.",
    30,
  );

  const uniSummary = targetUniNames.length ? targetUniNames.join(", ") : "các trường mục tiêu";
  pushStep(
    "Hồ sơ & nộp đơn",
    `Chuẩn bị CV, Personal Statement và đặt lịch nộp hồ sơ cho ${uniSummary}.`,
    35,
  );

  pushStep(
    "Phỏng vấn & tâm lý",
    "Luyện phỏng vấn, quản lý thời gian nghỉ ngơi và sức khỏe trước kỳ thi.",
    25,
  );

  return steps.map((step) => ({
    id: idFactory("road"),
    phase: step.phase,
    title: step.title,
    dueDate: start.add(step.offset, "day").format("YYYY-MM-DD"),
    status: "todo",
  }));
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => loadState());

  const persist = (nextState) => {
    setState(nextState);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    }
  };

  const currentUser = useMemo(
    () => state.users.find((user) => user.id === state.currentUserId) || null,
    [state.users, state.currentUserId],
  );

  const findProfile = (ownerId) => state.studentProfiles.find((profile) => profile.ownerId === ownerId) || null;

  const findTestResult = (ownerId) => state.testResults.find((result) => result.ownerId === ownerId) || null;

  const updateProfile = (ownerId, updater) => {
    const profile = findProfile(ownerId);
    if (!profile) return;
    const updated = state.studentProfiles.map((item) =>
      item.ownerId === ownerId ? { ...item, ...updater(item) } : item,
    );
    persist({ ...state, studentProfiles: updated });
  };

  const updateUser = (userId, updates) => {
    const updatedUsers = state.users.map((user) => (user.id === userId ? { ...user, ...updates } : user));
    persist({ ...state, users: updatedUsers });
  };

  const signUp = (payload) => {
    const { role, fullName, email, password, gradeLevel, stream, avgScore, interests = [] } = payload;
    if (!role || !["student", "parent", "advisor"].includes(role)) {
      return { ok: false, message: "Vui lòng chọn đúng vai trò." };
    }
    if (state.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: "Email đã được dùng, hãy thử email khác." };
    }

    const id = idFactory("user");
    const baseUser = {
      id,
      role,
      fullName,
      email,
      password,
      avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(fullName)}`,
      linkedParentCode: "",
      linkedParentId: null,
      linkedStudentId: null,
    };

    let nextProfiles = state.studentProfiles;
    let newLinkedCode = "";

    if (role === "student") {
      let code = "";
      do {
        code = Math.random().toString(36).substring(2, 8).toUpperCase();
      } while (state.users.some((user) => user.linkedParentCode === code));
      newLinkedCode = code;
      const newProfile = {
        ownerId: id,
        gradeLevel: gradeLevel || "11",
        stream: stream || "A00",
        avgScore: Number(avgScore) || 24,
        interests,
        testResultId: null,
        roadmapUnlocked: false,
        roadmapUnlockedAt: null,
        roadmap: [],
        savedUniversities: [],
      };
      nextProfiles = [...state.studentProfiles, newProfile];
    }

    const newUser = {
      ...baseUser,
      linkedParentCode: newLinkedCode,
    };

    const nextState = {
      ...state,
      users: [...state.users, newUser],
      studentProfiles: nextProfiles,
      currentUserId: id,
    };
    persist(nextState);

    return {
      ok: true,
      message: "Đăng ký thành công.",
      linkedParentCode: newLinkedCode,
    };
  };

  const logIn = (email, password) => {
    const found = state.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
    );
    if (!found) {
      return { ok: false, message: "Sai email hoặc mật khẩu." };
    }
    persist({ ...state, currentUserId: found.id });
    return { ok: true, user: found };
  };

  const logOut = () => persist({ ...state, currentUserId: null });

  const linkParentToStudent = (code) => {
    if (!currentUser || currentUser.role !== "parent") {
      return { ok: false, message: "Chỉ phụ huynh mới sử dụng được tính năng này." };
    }
    const trimmed = code.trim().toUpperCase();
    const student = state.users.find((user) => user.role === "student" && user.linkedParentCode === trimmed);
    if (!student) {
      return { ok: false, message: "Không tìm thấy học sinh với mã này." };
    }
    const updatedUsers = state.users.map((user) => {
      if (user.id === student.id) {
        return { ...user, linkedParentId: currentUser.id };
      }
      if (user.id === currentUser.id) {
        return { ...user, linkedStudentId: student.id };
      }
      return user;
    });
    persist({ ...state, users: updatedUsers });
    return { ok: true, student };
  };

  const submitAssessment = (payload) => {
    if (!currentUser || currentUser.role !== "student") {
      return { ok: false, message: "Vui lòng đăng nhập bằng tài khoản học sinh." };
    }
    if (!payload || !payload.traitSummary) {
      return { ok: false, message: "Dữ liệu bài test không hợp lệ." };
    }
    const majorCodes = payload.topMajorGroupCodes?.length
      ? payload.topMajorGroupCodes
      : traitToMajors(payload.traitSummary);
    const testId = idFactory("test");
    const newResult = {
      id: testId,
      ownerId: currentUser.id,
      traitSummary: payload.traitSummary,
      summary: payload.summary || "",
      insights: payload.insights || [],
      scoresJson: JSON.stringify(payload.scores || {}),
      scoreLabelsJson: JSON.stringify(payload.scoreLabels || {}),
      topMajorGroupCodes: majorCodes.length ? majorCodes : ["BUSINESS", "MARKETING", "DATA_SCI"],
      testType: payload.testType || "custom",
      testLabel: payload.testLabel || "Assessment",
      createdAt: new Date().toISOString(),
    };
    const filtered = state.testResults.filter((result) => result.ownerId !== currentUser.id);
    const updatedResults = [...filtered, newResult];
    const updatedProfiles = state.studentProfiles.map((profile) =>
      profile.ownerId === currentUser.id ? { ...profile, testResultId: testId } : profile,
    );
    persist({ ...state, testResults: updatedResults, studentProfiles: updatedProfiles });
    return { ok: true, result: newResult };
  };

  const toggleRoadmapStep = (ownerId, stepId) => {
    const profile = findProfile(ownerId);
    if (!profile) return;
    const updatedRoadmap = profile.roadmap.map((step) => {
      if (step.id !== stepId) return step;
      const nextStatus = step.status === "todo" ? "doing" : step.status === "doing" ? "done" : "todo";
      return { ...step, status: nextStatus };
    });
    updateProfile(ownerId, () => ({ roadmap: updatedRoadmap }));
  };

    const unlockRoadmap = () => {
    if (!currentUser || currentUser.role !== "student") {
      return { ok: false, message: "Ch? h?c sinh m?i m? kh�a l? tr�nh." };
    }
    const profile = findProfile(currentUser.id);
    if (!profile) {
      return { ok: false, message: "Kh�ng t�m th?y h? so h?c sinh." };
    }
    if (profile.roadmapUnlocked) {
      return { ok: true, message: "L? tr�nh d� m? s?n." };
    }

    const result = findTestResult(currentUser.id);
    const savedUniversities = (profile.savedUniversities || [])
      .map((uniId) => universities.find((item) => item.id === uniId))
      .filter(Boolean);

    const derivedMajorCodes = [];
    if (result?.topMajorGroupCodes?.length) {
      derivedMajorCodes.push(...result.topMajorGroupCodes);
    }
    savedUniversities.forEach((uni) => {
      derivedMajorCodes.push(...uni.majors);
    });

    const focusMajors = [...new Set(derivedMajorCodes.filter((code) => majorRoadmapConfig[code]))].slice(0, 2);
    const targetScore = savedUniversities.length
      ? Math.max(...savedUniversities.map((uni) => uni.minScore))
      : undefined;
    const targetUniNames = savedUniversities.slice(0, 3).map((uni) => uni.name);

    const roadmap = createPersonalRoadmap(profile, {
      majorCodes: focusMajors,
      targetScore,
      targetUniNames,
    });

    updateProfile(currentUser.id, () => ({
      roadmapUnlocked: true,
      roadmapUnlockedAt: new Date().toISOString(),
      roadmap,
    }));
    return { ok: true };
  };

const saveUniversityPreference = (ownerId, universityId) => {
    const profile = findProfile(ownerId);
    if (!profile) return;
    const exists = profile.savedUniversities.includes(universityId);
    const updated = exists
      ? profile.savedUniversities.filter((id) => id !== universityId)
      : [...profile.savedUniversities, universityId];
    updateProfile(ownerId, () => ({ savedUniversities: updated }));
  };

  const getRecommendation = (studentId) =>
    state.recommendations.find((rec) => rec.ownerId === studentId) || null;

  const getLinkedStudentForParent = (parentId) => {
    const parent = state.users.find((user) => user.id === parentId);
    if (!parent || !parent.linkedStudentId) return null;
    return state.users.find((user) => user.id === parent.linkedStudentId) || null;
  };

  const sendChatMessage = (message) => {
    if (!currentUser) return;
    const trimmed = message.trim();
    if (!trimmed) return;
    const thread = state.chatThreads[currentUser.id] || [];
    const userMsg = {
      id: idFactory("msg"),
      sender: "user",
      body: trimmed,
      timestamp: new Date().toISOString(),
    };
    const keywordMatch =
      keywordsReply.find((item) => trimmed.toLowerCase().includes(item.keyword)) || {
        reply: "Cảm ơn bạn! Cố vấn EduPath sẽ phản hồi chi tiết trong 24 giờ.",
      };
    const botMsg = {
      id: idFactory("msg"),
      sender: "bot",
      body: keywordMatch.reply,
      timestamp: new Date().toISOString(),
    };
    const updatedThreads = {
      ...state.chatThreads,
      [currentUser.id]: [...thread, userMsg, botMsg],
    };
    persist({ ...state, chatThreads: updatedThreads });
  };

  const clearChat = () => {
    if (!currentUser) return;
    const updatedThreads = { ...state.chatThreads, [currentUser.id]: [] };
    persist({ ...state, chatThreads: updatedThreads });
  };

  const value = {
    state,
    currentUser,
    majorGroups,
    universities,
    findProfile,
    findTestResult,
    signUp,
    logIn,
    logOut,
    linkParentToStudent,
    submitAssessment,
    toggleRoadmapStep,
    unlockRoadmap,
    saveUniversityPreference,
    getRecommendation,
    getLinkedStudentForParent,
    sendChatMessage,
    clearChat,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside AppProvider");
  return context;
};




