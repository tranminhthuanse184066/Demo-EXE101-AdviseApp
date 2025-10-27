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

const buildFullRoadmap = (profile) => {
  const start = dayjs();
  const gradeLabel = profile?.gradeLevel || "11";
  const steps = [
    { phase: "Nền tảng lớp 10-11", title: "Ôn vững Toán - Lý - Hóa", dueInDays: 30 },
    { phase: "Nền tảng lớp 10-11", title: "Hoàn thiện kỹ năng tiếng Anh", dueInDays: 60 },
    { phase: "Nền tảng lớp 10-11", title: "Tham gia 1 dự án CLB", dueInDays: 90 },
    { phase: "Lớp 12 HK1", title: "Hoàn thành 50% checklist hướng nghiệp", dueInDays: 150 },
    { phase: "Lớp 12 HK1", title: "Giữ GPA từ 8.0", dueInDays: 170 },
    { phase: "Lớp 12 HK2", title: "Luyện đề thi tốt nghiệp chuẩn Bộ", dueInDays: 220 },
    { phase: "Lớp 12 HK2", title: "Chốt danh sách 5 trường mục tiêu", dueInDays: 240 },
    { phase: "Trước kỳ thi", title: "Hoàn thiện hồ sơ xét tuyển / học bổng", dueInDays: 270 },
    { phase: "Trước kỳ thi", title: "Lập kế hoạch ôn 4 tuần cuối", dueInDays: 285 },
    { phase: "Sau kỳ thi", title: "Đánh giá kết quả và phương án dự phòng", dueInDays: 320 },
  ];
  return steps.map((step) => ({
    id: idFactory("road"),
    phase: `${step.phase} (${gradeLabel})`,
    title: step.title,
    dueDate: start.add(step.dueInDays, "day").format("YYYY-MM-DD"),
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
      return { ok: false, message: "Chỉ học sinh mới mở khóa lộ trình." };
    }
    const profile = findProfile(currentUser.id);
    if (!profile) {
      return { ok: false, message: "Không tìm thấy hồ sơ học sinh." };
    }
    if (profile.roadmapUnlocked) {
      return { ok: true, message: "Lộ trình đã mở sẵn." };
    }
    const roadmap = buildFullRoadmap(profile);
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
