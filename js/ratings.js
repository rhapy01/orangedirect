// Ratings and Likes System for Orange Directory
let socket;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Socket.io connection
    socket = io();
    
    // Listen for rating updates
    socket.on('ratingUpdated', function(data) {
        updateRatingDisplay(data.projectId, data.averageRating, data.totalRatings);
    });

    socket.on('error', function(error) {
        console.error('Socket error:', error);
        alert('Error updating rating. Please try again.');
    });
    
    // Add event listeners to all rating stars
    document.querySelectorAll('.rating-stars span').forEach(star => {
        star.addEventListener('click', handleRatingClick);
        star.addEventListener('mouseover', handleRatingHover);
        star.addEventListener('mouseout', handleRatingReset);
    });
    
    // Initialize ratings for all projects
    document.querySelectorAll('.rating-container').forEach(container => {
        const projectId = container.getAttribute('data-app-id');
        fetchProjectRating(projectId);
    });
});

// Fetch rating for a project
function fetchProjectRating(projectId) {
    fetch(`/api/ratings/${projectId}`)
        .then(response => response.json())
        .then(data => {
            updateRatingDisplay(projectId, data.averageRating, data.totalRatings);
        })
        .catch(error => {
            console.error('Error fetching rating:', error);
        });
}

// Update rating display for a project
function updateRatingDisplay(projectId, averageRating, totalRatings) {
    const container = document.querySelector(`.rating-container[data-app-id="${projectId}"]`);
    if (!container) return;

    const ratingDisplay = container.querySelector('.rating-value');
    const totalRatingsElement = container.querySelector('.total-ratings');
    const starsContainer = container.querySelector('.rating-stars');

    if (ratingDisplay) {
        ratingDisplay.textContent = averageRating.toFixed(1);
    }

    if (totalRatingsElement) {
        totalRatingsElement.textContent = `(${totalRatings} ratings)`;
    }

    updateStars(starsContainer, averageRating);
}

// Handle rating star click
function handleRatingClick(event) {
    const star = event.target.closest('span');
    if (!star) return;
    
    const ratingValue = parseInt(star.getAttribute('data-value'));
    const ratingContainer = star.closest('.rating-container');
    const projectId = ratingContainer.getAttribute('data-app-id');
    
    // Send rating to server via Socket.io
    socket.emit('updateRating', {
        projectId: projectId,
        rating: ratingValue
    });
    
    // Show confirmation message
    showRatingConfirmation(projectId, ratingValue);
}

// Handle rating star hover
function handleRatingHover(event) {
    const star = event.target;
    const ratingValue = parseInt(star.getAttribute('data-value'));
    const starsContainer = star.parentElement;
    
    updateStars(starsContainer, ratingValue);
}

// Handle rating star mouse out
function handleRatingReset(event) {
    const starsContainer = event.target.parentElement;
    const container = starsContainer.closest('.rating-container');
    const ratingDisplay = container.querySelector('.rating-value');
    const currentRating = parseFloat(ratingDisplay.textContent);
    
    updateStars(starsContainer, currentRating);
}

// Update star display
function updateStars(starsContainer, rating) {
    if (!starsContainer) return;
    
    const stars = starsContainer.querySelectorAll('span');
    stars.forEach(star => {
        const value = parseInt(star.getAttribute('data-value'));
        const starIcon = star.querySelector('i');
        
        if (value <= rating) {
            starIcon.className = 'fas fa-star';
        } else if (value <= rating + 0.5) {
            starIcon.className = 'fas fa-star-half-alt';
        } else {
            starIcon.className = 'far fa-star';
        }
    });
}

// Show rating confirmation message
function showRatingConfirmation(projectId, rating) {
    const container = document.querySelector(`.rating-container[data-app-id="${projectId}"]`);
    const confirmationDiv = document.createElement('div');
    confirmationDiv.className = 'rating-confirmation';
    confirmationDiv.textContent = `Thanks for rating! You gave ${rating} stars.`;
    
    // Remove any existing confirmation
    const existingConfirmation = container.querySelector('.rating-confirmation');
    if (existingConfirmation) {
        existingConfirmation.remove();
    }
    
    container.appendChild(confirmationDiv);
    
    // Remove confirmation after 3 seconds
    setTimeout(() => {
        confirmationDiv.remove();
    }, 3000);
}
