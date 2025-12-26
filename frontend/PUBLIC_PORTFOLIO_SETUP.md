# Public Portfolio View - Setup Guide

## Overview
The Public Portfolio View allows users to share their portfolio via a URL like:
```
http://yoursite.com/portfolio/johndoe
```

## Files Created
- `PublicPortfolioPage.jsx` - Main component
- `public.jsx` - Standalone entry point with routing
- Updated `App.css` - Public page styling

## Setup Options

### Option 1: Standalone Build (Recommended for Simplicity)
Use the `public.jsx` entry point for a separate public-facing build.

**Update vite.config.js:**
```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        public: './public.html'  // Create separate HTML
      }
    }
  }
})
```

**Create public.html:**
```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Student Portfolio</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/public.jsx"></script>
  </body>
</html>
```

### Option 2: Install React Router
For a more robust routing solution:

```bash
npm install react-router-dom
```

**Update App.jsx:**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PublicPortfolioPage from './components/PublicPortfolioPage';
import YourMainComponent from './components/YourMainComponent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<YourMainComponent />} />
        <Route path="/portfolio/:username" element={
          <PublicPortfolioPageWrapper />
        } />
      </Routes>
    </BrowserRouter>
  );
}

function PublicPortfolioPageWrapper() {
  const { username } = useParams();
  return <PublicPortfolioPage username={username} />;
}
```

### Option 3: Direct Integration (Simple)
Use PublicPortfolioPage in your existing app:

```jsx
import PublicPortfolioPage from './components/PublicPortfolioPage';

function App() {
  const [showPublic, setShowPublic] = useState(false);
  const [username, setUsername] = useState('');

  if (showPublic) {
    return <PublicPortfolioPage username={username} />;
  }
  
  // ... rest of your app
}
```

## Features

✅ **URL Parameter Extraction** - Reads username from URL
✅ **Backend Integration** - Fetches from `/api/portfolio/:username`
✅ **Published Check** - Only shows published portfolios
✅ **Error Handling** - Friendly messages for all states
✅ **Template Support** - Uses saved template preference
✅ **Shareable URLs** - Users can share their portfolio link

## States Handled

1. **Loading** - Shows spinner while fetching
2. **Not Published** - Friendly message with locked icon
3. **Not Found** - Username doesn't exist
4. **Network Error** - Connection issues with retry button
5. **Success** - Shows beautiful portfolio

## Testing

Test different scenarios:
```
/portfolio/johndoe         (exists & published)
/portfolio/testuser        (not published)
/portfolio/nonexistent     (doesn't exist)
```
