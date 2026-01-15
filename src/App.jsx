import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { StoreProvider } from './services/store';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import TestZone from './pages/TestZone';
import Worksheets from './pages/Worksheets';
import Feedback from './pages/Feedback';
import InteractiveLessonNew from './pages/InteractiveLessonNew'; // Cleaning this up later
import ApplesLesson from './pages/beta/ApplesLesson';
import Beta from './pages/Beta';
import ChatInterface from './components/chat/ChatInterface';
import Navigation from './components/common/Navigation';

import Auth from './pages/Auth';
import ErrorBoundary from './components/common/ErrorBoundary';

const App = () => {
  return (
    <ErrorBoundary>
      <StoreProvider>
        <BrowserRouter>
          <Navigation />
          <Routes>
            <Route path="/" element={<Auth />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/worksheets" element={<Worksheets />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/beta" element={<Beta />} />
            <Route path="/beta/apples" element={<ApplesLesson />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/test" element={<TestZone />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
          <ChatInterface />
        </BrowserRouter>
      </StoreProvider>
    </ErrorBoundary>
  );
};

export default App;
