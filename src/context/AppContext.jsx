import { createContext, useContext, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  demoRecommendations,
  demoStudentProfiles,
  demoTestResults,
  demoUsers,
  majorGroups,
  universities,
} from '../data/mockData';

const STORAGE_KEY = 'edupath-state';

const clone = (payload) => JSON.parse(JSON.stringify(payload));

const buildInitialState = () => ({
  users: clone(demoUsers),
  studentProfiles: clone(demoStudentProfiles),
  testResults: clone(demoTestResults),
  recommendations: clone(demoRecommendations),
  chatThreads: {},
  currentUserId: null,
});

const loadState = () => {
  if (typeof window === 'undefined') return buildInitialState();
  const cached = window.localStorage.getItem(STORAGE_KEY);
  if (!cached) {
    const initial = buildInitialState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }
  try {
    return JSON.parse(cached);
  } catch (err) {
    console.error('Failed to parse cached state', err);
    const fallback = buildInitialState();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(fallback));
    return fallback;
  }
};

const AppContext = createContext(null);

const idFactory = (prefix) => `${prefix}-${Math.random().toString(36).slice(2, 8)}`;

const makeRoadmapTemplate = () => [
  {
    id: idFactory('step'),
    title: 'Ôn tổ hợp mục tiêu',
    dueDate: dayjs().add(30, 'day').format('YYYY-MM-DD'),
    status: 'todo',
  },
  {
    id: idFactory('step'),
    title: 'Nộp hồ sơ xét tuyển',
    dueDate: dayjs().add(60, 'day').format('YYYY-MM-DD'),
    status: 'todo',
  },
  {
    id: idFactory('step'),
    title: 'Theo dõi học bổng & lịch phỏng vấn',
    dueDate: dayjs().add(90, 'day').format('YYYY-MM-DD'),
    status: 'todo',
  },
];

const traitToMajors = (traitSummary) => {
  const letters = traitSummary.replace(/[^RIASEC]/g, '').split('');
  const picks = new Set();

  const add = (...codes) => codes.forEach((code) => picks.add(code));

  if (letters.includes('I') && letters.includes('R')) {
    add('CS_AI', 'MECH_ELEC');
  }
  if (letters.includes('A') && letters.includes('S')) {
    add('MARKETING', 'PSYCH_SOC', 'MEDIA');
  }
  if (letters.includes('E')) {
    add('BUSINESS', 'FINANCE');
  }
  if (letters.includes('C')) {
    add('LAW', 'FINANCE');
  }
  if (letters.includes('I')) {
    add('DATA_SCI');
  }
  if (letters.includes('R')) {
    add('CYBER');
  }
  if (letters.includes('A')) {
    add('MEDIA');
  }
  return Array.from(picks).slice(0, 3);
};

const keywordsReply = [
  {
    keyword: 'học phí',
    reply:
      'Học phí trung bình dao động 15–60 triệu/năm tùy trường. Bạn có thể lọc theo mức học phí trong phần So sánh trường.',
  },
  {
    keyword: 'điểm chuẩn',
    reply: 'Điểm chuẩn tối thiểu đã được hiển thị trong danh sách trường. Chuẩn bị mức điểm an toàn cao hơn 1-2 điểm.',
  },
  {
    keyword: 'khối xét tuyển',
    reply:
      'Khối xét tuyển phổ biến: A00, A1, D01. Bạn nên đối chiếu với tổ hợp mạnh nhất và yêu cầu từng trường.',
  },
];

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => loadState());

  const persist = (nextState) => {
    setState(nextState);
    if (typeof window !== 'undefined') {
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
    const updatedProfiles = state.studentProfiles.map((profile) =>
      profile.ownerId === ownerId ? { ...profile, ...updater(profile) } : profile,
    );
    persist({ ...state, studentProfiles: updatedProfiles });
  };

  const updateUser = (userId, updates) => {
    const updatedUsers = state.users.map((user) => (user.id === userId ? { ...user, ...updates } : user));
    persist({ ...state, users: updatedUsers });
  };

  const signUp = (payload) => {
    const { role, fullName, email, password, gradeLevel, stream, avgScore, interests = [] } = payload;
    if (!role || !['student', 'parent', 'advisor'].includes(role)) {
      return { ok: false, message: 'Vui lòng chọn vai trò.' };
    }
    if (state.users.some((user) => user.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, message: 'Email đã tồn tại.' };
    }

    const id = idFactory('user');
    const baseUser = {
      id,
      role,
      fullName,
      email,
      password,
      avatar: `https://api.dicebear.com/9.x/thumbs/svg?seed=${encodeURIComponent(fullName)}`,
      linkedParentCode: '',
      linkedParentId: null,
      linkedStudentId: null,
    };

    let nextProfiles = state.studentProfiles;
    let newLinkedCode = '';

    if (role === 'student') {
      const code = (() => {
        let temp = '';
        do {
          temp = Math.random().toString(36).substring(2, 8).toUpperCase();
        } while (state.users.some((user) => user.linkedParentCode === temp));
        return temp;
      })();
      newLinkedCode = code;
      const newProfile = {
        ownerId: id,
        gradeLevel: gradeLevel || 'Chưa cập nhật',
        stream: stream || '',
        avgScore: Number(avgScore) || 20,
        interests,
        testResultId: null,
        savedUniversities: [],
        roadmap: makeRoadmapTemplate(),
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

    return { ok: true, message: 'Đăng ký thành công', linkedParentCode: newLinkedCode };
  };

  const logIn = (email, password) => {
    const found = state.users.find(
      (user) => user.email.toLowerCase() === email.toLowerCase() && user.password === password,
    );
    if (!found) {
      return { ok: false, message: 'Sai email hoặc mật khẩu.' };
    }
    persist({ ...state, currentUserId: found.id });
    return { ok: true, user: found };
  };

  const logOut = () => persist({ ...state, currentUserId: null });

  const linkParentToStudent = (code) => {
    if (!currentUser || currentUser.role !== 'parent') {
      return { ok: false, message: 'Chỉ phụ huynh mới có thể liên kết.' };
    }
    const student = state.users.find((user) => user.role === 'student' && user.linkedParentCode === code.trim());
    if (!student) {
      return { ok: false, message: 'Không tìm thấy học sinh với mã này.' };
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

  const deriveTraitSummary = (scores) => {
    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a);
    const topTwo = sorted.slice(0, 2).map(([trait]) => trait);
    return topTwo.join('-');
  };

  const submitAssessment = (answers) => {
    if (!currentUser || currentUser.role !== 'student') {
      return { ok: false, message: 'Bạn cần đăng nhập bằng tài khoản học sinh.' };
    }
    const tally = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    Object.values(answers).forEach((trait) => {
      if (trait && tally[trait] !== undefined) {
        tally[trait] += 1;
      }
    });
    const traitSummary = deriveTraitSummary(tally);
    const majorCodes = traitToMajors(traitSummary);
    const testId = idFactory('test');
    const newResult = {
      id: testId,
      ownerId: currentUser.id,
      traitSummary,
      scoresJson: JSON.stringify(tally),
      topMajorGroupCodes: majorCodes.length ? majorCodes : ['BUSINESS', 'FINANCE', 'MARKETING'].slice(0, 3),
    };
    const existing = state.testResults.filter((result) => result.ownerId !== currentUser.id);
    const updatedResults = [...existing, newResult];
    const updatedProfiles = state.studentProfiles.map((profile) =>
      profile.ownerId === currentUser.id ? { ...profile, testResultId: testId } : profile,
    );
    const nextState = { ...state, testResults: updatedResults, studentProfiles: updatedProfiles };
    persist(nextState);
    return { ok: true, result: newResult };
  };

  const toggleRoadmapStep = (ownerId, stepId) => {
    const profile = findProfile(ownerId);
    if (!profile) return;
    const updatedRoadmap = profile.roadmap.map((step) => {
      if (step.id !== stepId) return step;
      const nextStatus = step.status === 'todo' ? 'doing' : step.status === 'doing' ? 'done' : 'todo';
      return { ...step, status: nextStatus };
    });
    updateProfile(ownerId, () => ({ roadmap: updatedRoadmap }));
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
      id: idFactory('msg'),
      sender: 'user',
      body: trimmed,
      timestamp: new Date().toISOString(),
    };
    const keywordMatch =
      keywordsReply.find((item) => trimmed.toLowerCase().includes(item.keyword)) ||
      {
        reply: 'Cảm ơn bạn! Cố vấn EduPath sẽ phản hồi chi tiết trong vòng 24h.',
      };
    const botMsg = {
      id: idFactory('msg'),
      sender: 'bot',
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
  if (!context) throw new Error('useApp must be used inside AppProvider');
  return context;
};
