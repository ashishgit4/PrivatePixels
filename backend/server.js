require('dotenv').config();
const dns = require('dns');

// Force IPv4 for imagekit.io to bypass DNS64/NAT64 connection timeouts on this network
const originalLookup = dns.lookup;
dns.lookup = function (hostname, options, callback) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }

  if (hostname.includes('imagekit.io')) {
    if (typeof options === 'object') {
      options.family = 4;
    } else {
      options = { family: 4 };
    }
  }

  return originalLookup(hostname, options, callback);
};

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/posts', postRoutes);

// Health Check
app.get('/', (req, res) => {
  res.json({
    message: 'Private Pixel API running 🚀',
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});