// Ratings and Likes System for Orange Directory
document.addEventListener('DOMContentLoaded', function() {
    // Initialize server-side data simulation (in a real app, this would be fetched from a server)
    initializeServerData();
    
    // Initialize ratings and likes from localStorage if available
    initializeRatings();
    initializeLikes();
    
    // Add event listeners to all rating stars
    document.querySelectorAll('.rating-stars span').forEach(star => {
        star.addEventListener('click', handleRatingClick);
        star.addEventListener('mouseover', handleRatingHover);
        star.addEventListener('mouseout', handleRatingReset);
    });
    
    // Add event listeners to all like buttons
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', handleLikeClick);
    });
});

// Initialize server-side data simulation
function initializeServerData() {
    // In a real application, this data would come from a server
    // For this demo, we'll simulate server data with localStorage
    if (!localStorage.getItem('serverData')) {
        const serverData = {};
        
        // Find all app IDs on the page
        document.querySelectorAll('[data-app-id]').forEach(element => {
            const appId = element.getAttribute('data-app-id');
            if (appId && !serverData[appId]) {
                // Initialize with random data for demonstration
                serverData[appId] = {
                    totalLikes: Math.floor(Math.random() * 100),
                    totalRatings: Math.floor(Math.random() * 50),
                    averageRating: (Math.random() * 4 + 1).toFixed(1) // Random rating between 1.0 and 5.0
                };
            }
        });
        
        localStorage.setItem('serverData', JSON.stringify(serverData));
    }
}

// Initialize ratings from localStorage and update with server data
function initializeRatings() {
    const serverData = JSON.parse(localStorage.getItem('serverData') || '{}');
    
    document.querySelectorAll('.rating-container').forEach(container => {
        const appId = container.getAttribute('data-app-id');
        const savedRating = localStorage.getItem(`rating_${appId}`);
        const appData = serverData[appId] || { totalRatings: 0, averageRating: '0.0' };
        
        // Update total ratings count if it exists
        const totalRatingsElement = container.querySelector('.total-ratings');
        if (totalRatingsElement) {
            totalRatingsElement.textContent = `(${appData.totalRatings} ratings)`;
        } else {
            // Create total ratings element if it doesn't exist
            const totalRatingsSpan = document.createElement('span');
            totalRatingsSpan.className = 'total-ratings';
            totalRatingsSpan.textContent = `(${appData.totalRatings} ratings)`;
            container.querySelector('.rating-title').appendChild(totalRatingsSpan);
        }
        
        const starsContainer = container.querySelector('.rating-stars');
        const ratingDisplay = container.querySelector('.rating-value');
        
        if (savedRating) {
            // User has rated this app
            const ratingValue = parseInt(savedRating);
            
            // Update stars
            updateStars(starsContainer, ratingValue);
            
            // Update rating display with user's rating
            if (ratingDisplay) {
                ratingDisplay.textContent = ratingValue.toFixed(1);
            }
        } else {
            // User hasn't rated, show average rating
            if (ratingDisplay) {
                ratingDisplay.textContent = appData.averageRating;
            }
        }
    });
}

// Initialize likes from localStorage and update with server data
function initializeLikes() {
    const serverData = JSON.parse(localStorage.getItem('serverData') || '{}');
    
    document.querySelectorAll('.like-button').forEach(button => {
        const appId = button.getAttribute('data-app-id');
        const isLiked = localStorage.getItem(`like_${appId}`) === 'true';
        const appData = serverData[appId] || { totalLikes: 0 };
        
        // Update like button state
        if (isLiked) {
            button.classList.add('liked');
            button.querySelector('i').classList.remove('far');
            button.querySelector('i').classList.add('fas');
        }
        
        // Update like count with total likes
        const countElement = button.querySelector('.like-count');
        if (countElement) {
            countElement.textContent = appData.totalLikes;
        }
    });
}

// Handle rating star click
function handleRatingClick(event) {
    const star = event.target.closest('span');
    if (!star) return;
    
    const ratingValue = parseInt(star.getAttribute('data-value'));
    const starsContainer = star.parentElement;
    const ratingContainer = starsContainer.closest('.rating-container');
    const appId = ratingContainer.getAttribute('data-app-id');
    const ratingDisplay = ratingContainer.querySelector('.rating-value');
    
    // Update stars
    updateStars(starsContainer, ratingValue);
    
    // Save rating to localStorage
    localStorage.setItem(`rating_${appId}`, ratingValue);
    
    // Update rating display
    if (ratingDisplay) {
        ratingDisplay.textContent = ratingValue.toFixed(1);
    }
    
    // Update server data (in a real app, this would be an API call)
    updateServerRating(appId, ratingValue);
    
    // Show confirmation message
    showRatingConfirmation(appId, ratingValue);
}

// Update server data with new rating
function updateServerRating(appId, ratingValue) {
    const serverData = JSON.parse(localStorage.getItem('serverData') || '{}');
    
    if (!serverData[appId]) {
        serverData[appId] = {
            totalLikes: 0,
            totalRatings: 0,
            averageRating: '0.0'
        };
    }
    
    // Check if this is a new rating or an update
    const isNewRating = !localStorage.getItem(`rated_${appId}`);
    
    if (isNewRating) {
        // Increment total ratings for new ratings
        serverData[appId].totalRatings++;
        localStorage.setItem(`rated_${appId}`, 'true');
    }
    
    // Recalculate average rating (simplified for demo)
    // In a real app, this would be done server-side
    const currentAvg = parseFloat(serverData[appId].averageRating);
    const totalRatings = serverData[appId].totalRatings;
    
    if (totalRatings === 1 && isNewRating) {
        // First rating
        serverData[appId].averageRating = ratingValue.toFixed(1);
    } else {
        // Update average (this is a simplified calculation for demo purposes)
        const newAvg = ((currentAvg * (totalRatings - (isNewRating ? 1 : 0))) + ratingValue) / totalRatings;
        serverData[appId].averageRating = newAvg.toFixed(1);
    }
    
    // Update total ratings display
    const ratingContainer = document.querySelector(`.rating-container[data-app-id="${appId}"]`);
    if (ratingContainer) {
        const totalRatingsElement = ratingContainer.querySelector('.total-ratings');
        if (totalRatingsElement) {
            totalRatingsElement.textContent = `(${serverData[appId].totalRatings} ratings)`;
        }
    }
    
    // Save updated server data
    localStorage.setItem('serverData', JSON.stringify(serverData));
}

// Handle rating star hover
function handleRatingHover(event) {
    const star = event.target;
    const ratingValue = parseInt(star.getAttribute('data-value'));
    const starsContainer = star.parentElement;
    
    // Highlight stars up to the hovered star
    for (let i = 1; i <= 5; i++) {
        const currentStar = starsContainer.querySelector(`[data-value="${i}"]`);
        if (i <= ratingValue) {
            currentStar.classList.add('hover');
        } else {
            currentStar.classList.remove('hover');
        }
    }
}

// Reset star highlighting on mouseout
function handleRatingReset(event) {
    const starsContainer = event.target.parentElement;
    const appId = starsContainer.parentElement.getAttribute('data-app-id');
    const savedRating = localStorage.getItem(`rating_${appId}`);
    
    // Remove hover class from all stars
    starsContainer.querySelectorAll('span').forEach(star => {
        star.classList.remove('hover');
    });
    
    // Restore saved rating if available
    if (savedRating) {
        updateStars(starsContainer, parseInt(savedRating));
    } else {
        // Reset all stars to empty
        starsContainer.querySelectorAll('span').forEach(star => {
            star.classList.remove('active');
            star.querySelector('i').classList.remove('fas');
            star.querySelector('i').classList.add('far');
        });
    }
}

// Update stars based on rating value
function updateStars(starsContainer, ratingValue) {
    for (let i = 1; i <= 5; i++) {
        const currentStar = starsContainer.querySelector(`[data-value="${i}"]`);
        if (i <= ratingValue) {
            currentStar.classList.add('active');
            currentStar.querySelector('i').classList.remove('far');
            currentStar.querySelector('i').classList.add('fas');
        } else {
            currentStar.classList.remove('active');
            currentStar.querySelector('i').classList.remove('fas');
            currentStar.querySelector('i').classList.add('far');
        }
    }
}

// Handle like button click
function handleLikeClick(event) {
    const button = event.currentTarget;
    const appId = button.getAttribute('data-app-id');
    const isLiked = button.classList.contains('liked');
    const likeCountElement = button.querySelector('.like-count');
    
    // Get server data
    const serverData = JSON.parse(localStorage.getItem('serverData') || '{}');
    if (!serverData[appId]) {
        serverData[appId] = {
            totalLikes: 0,
            totalRatings: 0,
            averageRating: '0.0'
        };
    }
    
    let totalLikes = serverData[appId].totalLikes;
    
    if (isLiked) {
        // Unlike
        button.classList.remove('liked');
        button.querySelector('i').classList.remove('fas');
        button.querySelector('i').classList.add('far');
        totalLikes = Math.max(0, totalLikes - 1);
        localStorage.setItem(`like_${appId}`, 'false');
    } else {
        // Like
        button.classList.add('liked');
        button.querySelector('i').classList.remove('far');
        button.querySelector('i').classList.add('fas');
        totalLikes++;
        localStorage.setItem(`like_${appId}`, 'true');
        
        // Show like confirmation
        showLikeConfirmation(appId);
    }
    
    // Update total likes in server data
    serverData[appId].totalLikes = totalLikes;
    localStorage.setItem('serverData', JSON.stringify(serverData));
    
    // Update like count display
    likeCountElement.textContent = totalLikes;
}

// Show rating confirmation message
function showRatingConfirmation(appId, ratingValue) {
    const container = document.querySelector(`.rating-container[data-app-id="${appId}"]`);
    const confirmation = document.createElement('div');
    confirmation.className = 'rating-confirmation';
    confirmation.textContent = `Thanks for rating ${ratingValue} stars!`;
    
    // Remove any existing confirmation
    const existingConfirmation = container.querySelector('.rating-confirmation');
    if (existingConfirmation) {
        existingConfirmation.remove();
    }
    
    // Add new confirmation
    container.appendChild(confirmation);
    
    // Remove confirmation after 3 seconds
    setTimeout(() => {
        confirmation.classList.add('fade-out');
        setTimeout(() => {
            confirmation.remove();
        }, 500);
    }, 2500);
}

// Show like confirmation message
function showLikeConfirmation(appId) {
    const button = document.querySelector(`.like-button[data-app-id="${appId}"]`);
    const confirmation = document.createElement('div');
    confirmation.className = 'like-confirmation';
    confirmation.textContent = 'Thanks for your like!';
    
    // Remove any existing confirmation
    const existingConfirmation = button.parentElement.querySelector('.like-confirmation');
    if (existingConfirmation) {
        existingConfirmation.remove();
    }
    
    // Add new confirmation
    button.parentElement.appendChild(confirmation);
    
    // Remove confirmation after 3 seconds
    setTimeout(() => {
        confirmation.classList.add('fade-out');
        setTimeout(() => {
            confirmation.remove();
        }, 500);
    }, 2500);
}
