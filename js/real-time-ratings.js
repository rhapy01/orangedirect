// Real-time Ratings and Likes System for Orange Directory
document.addEventListener('DOMContentLoaded', function() {
    // Determine the API server URL based on environment
    const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
        ? 'http://localhost:5000' 
        : 'https://orange-directory-api.onrender.com';
    
    // Connect to the Socket.io server
    const socket = io(API_URL);
    
    // Generate a unique user ID if not already present
    if (!localStorage.getItem('userId')) {
        localStorage.setItem('userId', generateUserId());
    }
    
    // Listen for real-time updates
    socket.on('rating-updated', function(data) {
        updateAppStats(data.appId);
    });
    
    socket.on('like-updated', function(data) {
        updateAppStats(data.appId);
    });
    
    // Initialize all app stats from the server
    initializeAllStats();
    
    // Add event listeners to all rating stars
    document.querySelectorAll('.rating-stars span').forEach(star => {
        star.addEventListener('click', handleRatingClick);
    });
    
    // Add event listeners to all like buttons
    document.querySelectorAll('.like-button').forEach(button => {
        button.addEventListener('click', handleLikeClick);
    });
    
    // Function to initialize all app stats from the server
    async function initializeAllStats() {
        try {
            const response = await fetch(`${API_URL}/api/stats`);
            const stats = await response.json();
            
            // Update UI for each app
            stats.forEach(appStat => {
                updateAppUI(appStat);
            });
            
            // Check for user's existing ratings and likes
            checkUserInteractions();
        } catch (error) {
            console.error('Error fetching app stats:', error);
        }
    }
    
    // Function to update a specific app's stats
    async function updateAppStats(appId) {
        try {
            const response = await fetch(`${API_URL}/api/stats/${appId}`);
            const stats = await response.json();
            
            // Update UI for this app
            updateAppUI(stats);
        } catch (error) {
            console.error(`Error fetching stats for app ${appId}:`, error);
        }
    }
    
    // Function to update the UI for an app
    function updateAppUI(stats) {
        const { appId, totalRatings, averageRating, totalLikes } = stats;
        
        // Update rating display
        const ratingContainer = document.querySelector(`.rating-container[data-app-id="${appId}"]`);
        if (ratingContainer) {
            // Update total ratings count
            const totalRatingsElement = ratingContainer.querySelector('.total-ratings');
            if (totalRatingsElement) {
                totalRatingsElement.textContent = `(${totalRatings} ratings)`;
            } else {
                // Create total ratings element if it doesn't exist
                const totalRatingsSpan = document.createElement('span');
                totalRatingsSpan.className = 'total-ratings';
                totalRatingsSpan.textContent = `(${totalRatings} ratings)`;
                const ratingTitle = ratingContainer.querySelector('.rating-title');
                if (ratingTitle) {
                    ratingTitle.appendChild(totalRatingsSpan);
                }
            }
            
            // Update average rating if user hasn't rated
            const userRating = localStorage.getItem(`rating_${appId}`);
            if (!userRating) {
                const ratingValue = ratingContainer.querySelector('.rating-value');
                if (ratingValue) {
                    ratingValue.textContent = averageRating.toFixed(1);
                }
            }
        }
        
        // Update like count
        const likeButton = document.querySelector(`.like-button[data-app-id="${appId}"]`);
        if (likeButton) {
            const likeCount = likeButton.querySelector('.like-count');
            if (likeCount) {
                likeCount.textContent = totalLikes;
            }
        }
    }
    
    // Function to check user's existing ratings and likes
    async function checkUserInteractions() {
        const userId = localStorage.getItem('userId');
        
        try {
            // This would be an API call to get user's ratings and likes
            // For now, we'll use localStorage as a fallback
            document.querySelectorAll('.rating-container').forEach(container => {
                const appId = container.getAttribute('data-app-id');
                const userRating = localStorage.getItem(`rating_${appId}`);
                
                if (userRating) {
                    const ratingValue = parseInt(userRating);
                    const starsContainer = container.querySelector('.rating-stars');
                    
                    // Update stars UI
                    if (starsContainer) {
                        for (let i = 1; i <= 5; i++) {
                            const star = starsContainer.querySelector(`[data-value="${i}"]`);
                            if (star) {
                                if (i <= ratingValue) {
                                    star.classList.add('active');
                                    star.querySelector('i').classList.remove('far');
                                    star.querySelector('i').classList.add('fas');
                                } else {
                                    star.classList.remove('active');
                                    star.querySelector('i').classList.remove('fas');
                                    star.querySelector('i').classList.add('far');
                                }
                            }
                        }
                    }
                }
            });
            
            document.querySelectorAll('.like-button').forEach(button => {
                const appId = button.getAttribute('data-app-id');
                const isLiked = localStorage.getItem(`like_${appId}`) === 'true';
                
                if (isLiked) {
                    button.classList.add('liked');
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                    }
                }
            });
        } catch (error) {
            console.error('Error checking user interactions:', error);
        }
    }
    
    // Handle rating star click
    async function handleRatingClick(event) {
        const star = event.target.closest('span');
        if (!star) return;
        
        const ratingValue = parseInt(star.getAttribute('data-value'));
        const starsContainer = star.parentElement;
        const ratingContainer = starsContainer.closest('.rating-container');
        const appId = ratingContainer.getAttribute('data-app-id');
        const userId = localStorage.getItem('userId');
        
        // Update UI
        updateStarsUI(starsContainer, ratingValue);
        
        // Save to localStorage as backup
        localStorage.setItem(`rating_${appId}`, ratingValue);
        
        // Send to server
        try {
            const response = await fetch(`${API_URL}/api/ratings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appId,
                    userId,
                    rating: ratingValue
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to save rating');
            }
            
            // Show confirmation message
            showRatingConfirmation(appId, ratingValue);
        } catch (error) {
            console.error('Error saving rating:', error);
        }
    }
    
    // Handle like button click
    async function handleLikeClick(event) {
        const button = event.currentTarget;
        const appId = button.getAttribute('data-app-id');
        const userId = localStorage.getItem('userId');
        const isLiked = button.classList.contains('liked');
        
        // Toggle like state in UI
        if (isLiked) {
            button.classList.remove('liked');
            button.querySelector('i').classList.remove('fas');
            button.querySelector('i').classList.add('far');
        } else {
            button.classList.add('liked');
            button.querySelector('i').classList.remove('far');
            button.querySelector('i').classList.add('fas');
            
            // Show like confirmation
            showLikeConfirmation(appId);
        }
        
        // Save to localStorage as backup
        localStorage.setItem(`like_${appId}`, !isLiked);
        
        // Send to server
        try {
            const response = await fetch(`${API_URL}/api/likes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    appId,
                    userId
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to toggle like');
            }
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }
    
    // Update stars UI
    function updateStarsUI(starsContainer, ratingValue) {
        for (let i = 1; i <= 5; i++) {
            const star = starsContainer.querySelector(`[data-value="${i}"]`);
            if (star) {
                if (i <= ratingValue) {
                    star.classList.add('active');
                    star.querySelector('i').classList.remove('far');
                    star.querySelector('i').classList.add('fas');
                } else {
                    star.classList.remove('active');
                    star.querySelector('i').classList.remove('fas');
                    star.querySelector('i').classList.add('far');
                }
            }
        }
        
        // Update rating value display
        const ratingContainer = starsContainer.closest('.rating-container');
        const ratingDisplay = ratingContainer.querySelector('.rating-value');
        if (ratingDisplay) {
            ratingDisplay.textContent = ratingValue.toFixed(1);
        }
    }
    
    // Show rating confirmation message
    function showRatingConfirmation(appId, ratingValue) {
        const container = document.querySelector(`.rating-container[data-app-id="${appId}"]`);
        if (!container) return;
        
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
        if (!button) return;
        
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
    
    // Generate a unique user ID
    function generateUserId() {
        return 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
});
