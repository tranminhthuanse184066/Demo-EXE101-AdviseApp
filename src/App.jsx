import { Layout } from 'antd';
import { Navigate, Outlet, Route, Routes } from 'react-router-dom';
import './App.css';
import Footer from './components/Footer.jsx';
import Header from './components/Header.jsx';
import { useApp } from './context/AppContext.jsx';
import AuthPage from './pages/AuthPage.jsx';
import ChatDemoPage from './pages/ChatDemoPage.jsx';
import LandingPage from './pages/LandingPage.jsx';
import ParentDashboard from './pages/ParentDashboard.jsx';
import ReportPrintPage from './pages/ReportPrintPage.jsx';
import RoadmapPage from './pages/RoadmapPage.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import TakeTestPage from './pages/TakeTestPage.jsx';
import TestResultPage from './pages/TestResultPage.jsx';
import UniversitiesPage from './pages/UniversitiesPage.jsx';

const { Content } = Layout;

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { currentUser } = useApp();
  if (!currentUser) return <Navigate to="/auth" replace />;
  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const MainLayout = () => (
  <Layout className="min-h-screen">
    <Header />
    <Content className="px-3 sm:px-6 pb-12">
      <div className="mx-auto w-full max-w-6xl py-10 space-y-8">
        <Outlet />
      </div>
    </Content>
    <Footer />
  </Layout>
);

const App = () => (
  <Routes>
    <Route element={<MainLayout />}>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/take-test"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <TakeTestPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test-result"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <TestResultPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/universities"
        element={
          <ProtectedRoute allowedRoles={['student', 'parent']}>
            <UniversitiesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/roadmap"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <RoadmapPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/chat"
        element={
          <ProtectedRoute allowedRoles={['student', 'parent', 'advisor']}>
            <ChatDemoPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent"
        element={
          <ProtectedRoute allowedRoles={['parent']}>
            <ParentDashboard />
          </ProtectedRoute>
        }
      />
    </Route>
    <Route path="/report" element={<ReportPrintPage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;
