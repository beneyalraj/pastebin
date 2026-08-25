require('dotenv').config();
const path = require('path');
const express = require('express');
const app = require('./src/app');

// ---- Path to the React build ----
const staticDir = path.join(__dirname, 'client', 'dist');
console.log('Serving static files from:', staticDir);

// ---- In production, serve the React frontend ----
if (process.env.NODE_ENV === 'production') {
  // Serve static assets (JS, CSS, images)
  app.use(express.static(staticDir));

  // All non-API routes go to index.html (for React Router)
  app.get('*', (req, res) => {
    res.sendFile(path.join(staticDir, 'index.html'));
  });
} else {
  // In development, just a friendly message
  app.get('/', (req, res) => {
    res.send('API is running. Use the Vite dev server for the frontend.');
  });
}

// ---- Export for Vercel ----
module.exports = app;

// ---- Local server ----
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}