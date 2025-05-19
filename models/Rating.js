const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    projectId: {
        type: String,
        required: true,
        index: true
    },
    ratings: [{
        value: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    totalRatings: {
        type: Number,
        default: 0
    },
    averageRating: {
        type: Number,
        default: 0
    }
});

// Method to add a new rating and update averages
ratingSchema.methods.addRating = function(value) {
    this.ratings.push({ value });
    this.totalRatings = this.ratings.length;
    this.averageRating = this.ratings.reduce((acc, curr) => acc + curr.value, 0) / this.totalRatings;
    return this.save();
};

module.exports = mongoose.model('Rating', ratingSchema); 