require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Rating = require('./models/Rating');

// Middleware
app.use(express.static(__dirname));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    // Handle rating updates
    socket.on('updateRating', async (data) => {
        try {
            const { projectId, rating } = data;
            
            // Find or create rating document for this project
            let ratingDoc = await Rating.findOne({ projectId });
            if (!ratingDoc) {
                ratingDoc = new Rating({ projectId });
            }

            // Add the new rating
            await ratingDoc.addRating(rating);

            // Broadcast the new average rating
            io.emit('ratingUpdated', {
                projectId,
                averageRating: ratingDoc.averageRating,
                totalRatings: ratingDoc.totalRatings
            });
        } catch (error) {
            console.error('Error updating rating:', error);
            socket.emit('error', { message: 'Failed to update rating' });
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// API endpoint for getting project ratings
app.get('/api/ratings/:projectId', async (req, res) => {
    try {
        const projectId = req.params.projectId;
        const ratingDoc = await Rating.findOne({ projectId });
        
        if (!ratingDoc) {
            return res.json({
                averageRating: 0,
                totalRatings: 0
            });
        }

        res.json({
            averageRating: ratingDoc.averageRating,
            totalRatings: ratingDoc.totalRatings
        });
    } catch (error) {
        console.error('Error fetching rating:', error);
        res.status(500).json({ error: 'Failed to fetch rating' });
    }
});

// Handle all routes by serving index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;
http.listen(port, () => {
    console.log(`Server is running on port ${port}`);
}); 