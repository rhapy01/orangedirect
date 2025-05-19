const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://orange-directory-frontend.onrender.com'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://orange-directory-frontend.onrender.com'],
  credentials: true
}));
app.use(express.json());

// Add a simple health check endpoint
app.get('/', (req, res) => {
  res.send('Orange Directory API is running');
});

// MongoDB connection
console.log('Attempting to connect to MongoDB with URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/orange-directory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('MongoDB connected successfully!');
  console.log('Connection established to database:', mongoose.connection.name);
})
.catch(err => {
  console.error('MongoDB connection error:');
  console.error(err);
});

// Define schemas and models
const ratingSchema = new mongoose.Schema({
  appId: { type: String, required: true },
  userId: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  timestamp: { type: Date, default: Date.now }
});

const likeSchema = new mongoose.Schema({
  appId: { type: String, required: true },
  userId: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const appStatsSchema = new mongoose.Schema({
  appId: { type: String, required: true, unique: true },
  totalRatings: { type: Number, default: 0 },
  averageRating: { type: Number, default: 0 },
  totalLikes: { type: Number, default: 0 },
  lastUpdated: { type: Date, default: Date.now }
});

const Rating = mongoose.model('Rating', ratingSchema);
const Like = mongoose.model('Like', likeSchema);
const AppStats = mongoose.model('AppStats', appStatsSchema);

// API routes
app.get('/api/stats', async (req, res) => {
  try {
    const stats = await AppStats.find();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/stats/:appId', async (req, res) => {
  try {
    const appId = req.params.appId;
    let stats = await AppStats.findOne({ appId });
    
    if (!stats) {
      stats = new AppStats({ appId });
      await stats.save();
    }
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/ratings', async (req, res) => {
  try {
    const { appId, userId, rating } = req.body;
    
    // Check if user has already rated this app
    const existingRating = await Rating.findOne({ appId, userId });
    
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.timestamp = Date.now();
      await existingRating.save();
    } else {
      // Create new rating
      const newRating = new Rating({ appId, userId, rating });
      await newRating.save();
    }
    
    // Update app stats
    await updateAppStats(appId);
    
    // Emit socket event
    io.emit('rating-updated', { appId });
    
    res.status(201).json({ message: 'Rating saved successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/likes', async (req, res) => {
  try {
    const { appId, userId } = req.body;
    
    // Check if user has already liked this app
    const existingLike = await Like.findOne({ appId, userId });
    
    if (existingLike) {
      // Remove like
      await Like.deleteOne({ appId, userId });
    } else {
      // Add like
      const newLike = new Like({ appId, userId });
      await newLike.save();
    }
    
    // Update app stats
    await updateAppStats(appId);
    
    // Emit socket event
    io.emit('like-updated', { appId });
    
    res.status(201).json({ message: 'Like toggled successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Helper function to update app stats
async function updateAppStats(appId) {
  try {
    // Get all ratings for this app
    const ratings = await Rating.find({ appId });
    const totalRatings = ratings.length;
    let averageRating = 0;
    
    if (totalRatings > 0) {
      const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
      averageRating = sumRatings / totalRatings;
    }
    
    // Get all likes for this app
    const likes = await Like.find({ appId });
    const totalLikes = likes.length;
    
    // Update or create app stats
    await AppStats.findOneAndUpdate(
      { appId },
      { 
        totalRatings,
        averageRating,
        totalLikes,
        lastUpdated: Date.now()
      },
      { upsert: true, new: true }
    );
  } catch (error) {
    console.error('Error updating app stats:', error);
  }
}

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');
  
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
