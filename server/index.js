require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());
const { protect } = require('./middleware/auth');

app.use('/api/auth', require('./routes/authRoutes'));

// TEMPORARY: delete after testing
app.get('/api/me', protect, (req, res) => res.json(req.user));
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
});