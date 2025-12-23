import { useState } from 'react';
import './App.css';
import PortfolioForm from './components/PortfolioForm';
import PublicPortfolioViewer from './components/PublicPortfolioViewer';

function App() {
  const [activeTab, setActiveTab] = useState('create');

  return (
    <div className="App">
      {/* Header */}
      <div className="app-header">
        <h1>🎓 Student Portfolio Builder</h1>
        <p>Create and publish your professional portfolio in minutes</p>
      </div>

      {/* Tab Navigation */}
      <div className="tab-container">
        <button
          className={`tab-button ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          ✍️ Create Portfolio
        </button>
        <button
          className={`tab-button ${activeTab === 'view' ? 'active' : ''}`}
          onClick={() => setActiveTab('view')}
        >
          🔍 View Public Portfolio
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'create' ? (
          <PortfolioForm />
        ) : (
          <PublicPortfolioViewer />
        )}
      </div>
    </div>
  );
}

export default App;
