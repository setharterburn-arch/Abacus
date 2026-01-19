import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './services/store';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import LandingPage from './pages/LandingPage';
import DemoLessons from './pages/DemoLessons';
import DiagnosticTest from './pages/DiagnosticTest';
import AdaptivePractice from './pages/AdaptivePractice';
import CurriculumGenerator from './pages/CurriculumGenerator';
import Admin from './pages/Admin';
import TestZone from './pages/TestZone';
import Worksheets from './pages/Worksheets';
import Feedback from './pages/Feedback';
import ApplesLesson from './pages/beta/ApplesLesson';
import SpaceRaceLesson from './pages/beta/SpaceRaceLesson';
import PizzaPartyLesson from './pages/beta/PizzaPartyLesson';
import ShapeSafariLesson from './pages/beta/ShapeSafariLesson';
import MeasurementLesson from './pages/beta/MeasurementLesson';
import GraphGardenLesson from './pages/beta/GraphGardenLesson';
import CosmicConstellationsLesson from './pages/beta/CosmicConstellationsLesson';
import CrystalVaultLesson from './pages/beta/CrystalVaultLesson';
import VideoTutorials from './pages/beta/VideoTutorials';
import InteractiveAddition from './pages/beta/InteractiveAddition';
import LearningPaths from './pages/LearningPaths';
import Shop from './pages/Shop';
import Beta from './pages/Beta';
import Navigation from './components/common/Navigation';

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
        <Route path="/shop" element={<Shop />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/curriculum-generator" element={<CurriculumGenerator />} />
        <Route path="/test" element={<TestZone />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
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
