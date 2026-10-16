import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import NavBar from './components/NavBar';
import SuspenseFallback from './components/SuspenseFallback';
import DashboardPage from './pages/DashboardPage';

// Code Splitting via React.lazy() - Dynamic Imports
const TasksPage = lazy(() => import('./pages/TasksPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));

export default function App() {
  return (
    <div className="lazy-loading-app">
      <NavBar />

      <main>
        {/* Suspense boundary wrapping code-split routes */}
        <Suspense fallback={<SuspenseFallback routeName="Requested View" />}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="*" element={<DashboardPage />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="footer">
        <p>
          Designed & Engineered by <strong>Abdulkadir Nursumar</strong> | DEPSTAR, CHARUSAT
        </p>
        <p style={{ marginTop: '0.25rem' }}>
          AWDF (ITUE301) Practical 8 — React Lazy Loading & Dynamic Code Splitting
        </p>
      </footer>
    </div>
  );
}
