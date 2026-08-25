const express = require('express');
const cors = require('cors');
const routeRouter = require('./routes/routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'updated' });
});

app.use('/api/routes', routeRouter);

module.exports = app;