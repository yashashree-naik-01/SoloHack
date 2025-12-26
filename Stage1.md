# Step 1: Frontend Implementation

This document showcases the frontend of the **Student Portfolio Builder**, built using **React + Vite** and styled with **Advanced Vanilla CSS (Glassmorphism & Gradients)**.

## 🛠️ Tech Stack
- **Library**: React (Functional Components)
- **Build Tool**: Vite
- **Styling**: Vanilla CSS (Custom Variables, Gradients, Backdrop Filters)

## 📁 Key Components

### 1. App.jsx (Main Entry & Tab Navigation)
The main container handles switching between the "Create" and "View" modes using a sleek tabbed interface.
```javascript
import './App.css';
import PortfolioForm from './components/PortfolioForm';
import PublicPortfolioViewer from './components/PublicPortfolioViewer';

function App() {
  const [activeTab, setActiveTab] = useState('create');
  // ... tab switching logic ...
}
```

### 2. PortfolioForm.jsx (Creation & Validation)
A comprehensive form that tracks mandatory sections (About, Skills, Projects, Education) and visualizes progress with an animated bar.
- **Progress Tracking**: Real-time completion percentage.
- **Validation**: Blocks publishing until 100% complete.
- **Dynamic Fields**: Allows adding multiple projects and education entries.

### 3. PublicPortfolioViewer.jsx (Global Search)
A dedicated interface for searching and viewing published portfolios by username.
- **Integration**: Link generation for the public API endpoint.

### 4. App.css (Premium Styling)
Includes:
- **Glassmorphism**: `.card { backdrop-filter: blur(12px); ... }`
- **Gradients**: Deep blue theme and status-specific gradients.
- **Animations**: Smooth transitions for tabs and the progress bar.

## 🚀 How to Run
1. `cd frontend`
2. `npm install`
3. `npm run dev`
