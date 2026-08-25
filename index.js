
const path = require('path');
const express = require('express');
const fs = require('fs');

const app = require('../src/app');

// ---- Determine the static directory ----
const staticDir = path.join(process.cwd(), 'client', 'dist');
console.log('📁 Static directory:', staticDir);

// ---- Debug: log every request ----
app.use((req, res, next) => {
  console.log(`➡️  ${req.method} ${req.url}`);
  next();
});

// ---- Debug: list files in static directory ----
app.get('/debug-files', (req, res) => {
  try {
    const files = fs.readdirSync(staticDir, { withFileTypes: true });
    const result = files.map(f => ({
      name: f.name,
      isDirectory: f.isDirectory(),
    }));
    res.json({ staticDir, files: result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---- Serve static files ----
if (fs.existsSync(staticDir)) {
  console.log('✅ Static directory exists, serving...');
  app.use(express.static(staticDir));
} else {
  console.error('❌ Static directory NOT found!');
}

// ---- Catch-all for React Router ----
app.get('*', (req, res) => {
  const indexPath = path.join(staticDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('index.html not found');
  }
});

module.exports = app;