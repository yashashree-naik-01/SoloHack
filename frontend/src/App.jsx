import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Navigation from './components/Navigation';
import HomePage from './pages/HomePage';
import CreatePage from './pages/CreatePage';
import PreviewPage from './pages/PreviewPage';
import PublicPage from './pages/PublicPage';
import PortfolioViewPage from './pages/PortfolioViewPage';

function App() {
  return (
    <BrowserRouter>
      <Navigation />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/create" element={<CreatePage />} />
        <Route path="/preview" element={<PreviewPage />} />
        <Route path="/public" element={<PublicPage />} />
        <Route path="/portfolio/:username" element={<PortfolioViewPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

