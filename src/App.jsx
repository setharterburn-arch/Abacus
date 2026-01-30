import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './services/store';
import Navigation from './components/common/Navigation';

// Lazy load all page components for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DemoLessons = lazy(() => import('./pages/DemoLessons'));
const DiagnosticTest = lazy(() => import('./pages/DiagnosticTest'));
const AdaptivePractice = lazy(() => import('./pages/AdaptivePractice'));
const CurriculumGenerator = lazy(() => import('./pages/CurriculumGenerator'));
const Admin = lazy(() => import('./pages/Admin'));
const AdminCurriculum = lazy(() => import('./pages/AdminCurriculum'));
const TestZone = lazy(() => import('./pages/TestZone'));
const InteractiveTest = lazy(() => import('./pages/InteractiveTest'));
const Worksheets = lazy(() => import('./pages/Worksheets'));
const Feedback = lazy(() => import('./pages/Feedback'));
const LearningPaths = lazy(() => import('./pages/LearningPaths'));
const Assignments = lazy(() => import('./pages/Assignments'));
const SmartScoreAssignment = lazy(() => import('./components/student/SmartScoreAssignment'));
const Shop = lazy(() => import('./pages/Shop'));
const Beta = lazy(() => import('./pages/Beta'));
const FAQ = lazy(() => import('./pages/FAQ'));

// Beta lessons
const ApplesLesson = lazy(() => import('./pages/beta/ApplesLesson'));
const SpaceRaceLesson = lazy(() => import('./pages/beta/SpaceRaceLesson'));
const PizzaPartyLesson = lazy(() => import('./pages/beta/PizzaPartyLesson'));
const ShapeSafariLesson = lazy(() => import('./pages/beta/ShapeSafariLesson'));
const MeasurementLesson = lazy(() => import('./pages/beta/MeasurementLesson'));
const GraphGardenLesson = lazy(() => import('./pages/beta/GraphGardenLesson'));
const CosmicConstellationsLesson = lazy(() => import('./pages/beta/CosmicConstellationsLesson'));
const CrystalVaultLesson = lazy(() => import('./pages/beta/CrystalVaultLesson'));
const VideoTutorials = lazy(() => import('./pages/beta/VideoTutorials'));
const InteractiveAddition = lazy(() => import('./pages/beta/InteractiveAddition'));

// Loading component
const PageLoader = () => (
  <div style={{
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: 'var(--color-bg)',
    color: 'var(--color-text)'
  }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🧮</div>
      <div>Loading...</div>
    </div>
  </div>
);

import { GamificationProvider } from './context/GamificationContext';
import LevelUpModal from './components/gamification/LevelUpModal';

import { ChatProvider } from './context/ChatContext';
import AbacusWidget from './components/chat/AbacusWidget';

import Auth from './pages/Auth';
import MyAccount from './pages/MyAccount';
import ErrorBoundary from './components/common/ErrorBoundary';
import { useStore } from './services/store';

const AppRoutes = () => {
  const { state: { session } } = useStore();

  return (
    <BrowserRouter>
      <Navigation />
      <LevelUpModal />
      <AbacusWidget />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={session ? <Dashboard /> : <LandingPage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<MyAccount />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/demo" element={<DemoLessons />} />
          <Route path="/diagnostic" element={<DiagnosticTest />} />
          <Route path="/practice" element={<AdaptivePractice />} />
          <Route path="/worksheets" element={<Worksheets />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/beta" element={<Beta />} />
          <Route path="/beta/apples" element={<ApplesLesson />} />
          <Route path="/beta/space" element={<SpaceRaceLesson />} />
          <Route path="/beta/pizza" element={<PizzaPartyLesson />} />
          <Route path="/beta/shapes" element={<ShapeSafariLesson />} />
          <Route path="/beta/measure" element={<MeasurementLesson />} />
          <Route path="/beta/graph" element={<GraphGardenLesson />} />
          <Route path="/beta/cosmic" element={<CosmicConstellationsLesson />} />
          <Route path="/beta/crystal-vault" element={<CrystalVaultLesson />} />
          <Route path="/beta/videos" element={<VideoTutorials />} />
          <Route path="/beta/interactive-addition" element={<InteractiveAddition />} />
          <Route path="/learning-paths" element={<LearningPaths />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/assignment/smartscore" element={<SmartScoreAssignment />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/curriculum" element={<AdminCurriculum />} />
          <Route path="/admin/curriculum-generator" element={<CurriculumGenerator />} />
          <Route path="/test" element={<TestZone />} />
          <Route path="/interactive-test" element={<InteractiveTest />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <GamificationProvider>
          <ChatProvider>
            <AppRoutes />
          </ChatProvider>
        </GamificationProvider>
      </StoreProvider>
    </ErrorBoundary>
  );
};

export default App;
