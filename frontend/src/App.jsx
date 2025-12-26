import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';
import './templates.css';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import PreviewPage from './pages/PreviewPage';
import PublicPage from './pages/PublicPage';
import PortfolioViewPage from './pages/PortfolioViewPage';
import LoginPage from './pages/LoginPage'; // New
import SignupPage from './pages/SignupPage'; // New

// Protected Route Component
// Navigation Wrapper to hide nav on specific routes
const NavigationWrapper = () => {
  const location = useLocation();
  // Hide nav on portfolio view pages
  // Regex matches /portfolio/<anything>
  const isPublicView = /^\/portfolio\/[^/]+$/.test(location.pathname);

  // Also hide on standalone public page if that's what the user meant by "view portfolio"
  // But usually /public is the gallery. Let's assume /portfolio/:username is the view.
  if (isPublicView) return null;

  return <Navigation />;
};

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <NavigationWrapper />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* Protected Routes */}
        <Route path="/create" element={
          <ProtectedRoute>
            <CreatePage />
          </ProtectedRoute>
        } />

        <Route path="/preview" element={
          <ProtectedRoute>
            <PreviewPage />
          </ProtectedRoute>
        } />

        <Route path="/public" element={
          <ProtectedRoute>
            <PublicPage />
          </ProtectedRoute>
        } />
        <Route path="/portfolio/:username" element={<PortfolioViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

