# Template Selection - Quick Integration Guide

## Overview
Add template selection to your Student Portfolio Builder with three distinct themes:
- **Minimal**: Clean and simple
- **Developer**: Dark theme with monospace fonts
- **Creative**: Colorful with gradients

## How to Use

### 1. Basic Setup
```jsx
import { useState } from 'react';
import TemplateSelector from './components/TemplateSelector';
import LivePortfolioPreview from './components/LivePortfolioPreview';

function MyPage() {
    const [selectedTemplate, setSelectedTemplate] = useState('minimal');
    const [portfolioData, setPortfolioData] = useState(null);
    
    return (
        <>
            <TemplateSelector 
                selectedTemplate={selectedTemplate}
                onTemplateChange={setSelectedTemplate}
            />
            
            <LivePortfolioPreview 
                portfolioData={portfolioData}
                template={selectedTemplate}
            />
        </>
    );
}
```

### 2. With Form Integration
```jsx
// In your PortfolioForm component
const [selectedTemplate, setSelectedTemplate] = useState('minimal');

// Include template in save request
const portfolioData = {
    username,
    about,
    skills,
    projects,
    education,
    selectedTemplate  // Send to backend
};
```

### 3. Fetch from Backend
```jsx
<LivePortfolioPreview 
    username="student123"
    template={selectedTemplate}
/>
```

## Files Created
- `TemplateSelector.jsx` - Template selection UI
- `TemplateDemo.jsx` - Complete working example
- Updated `LivePortfolioPreview.jsx` - Now accepts template prop
- Updated `App.css` - Added template-specific styling

## Template Styles
Each template has unique styling:
- **Minimal**: Gray tones, simple borders
- **Developer**: Dark background (#0f172a), cyan accents (#22d3ee), monospace fonts
- **Creative**: Gradient background, rainbow colors, bold styling
