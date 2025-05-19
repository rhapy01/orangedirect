// Script to ensure all apps have rating and like functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check all pages for missing rating and like functionality
    
    // 1. Check all featured items
    const featuredItems = document.querySelectorAll('.featured-tool');
    featuredItems.forEach((item, index) => {
        const toolLinks = item.querySelector('.tool-links');
        if (toolLinks && !toolLinks.nextElementSibling?.classList.contains('tool-interactions')) {
            // Featured item is missing rating and like functionality
            addRatingAndLikeToItem(item, `featured-item-${index}`, true);
        }
    });
    
    // 2. Check all regular app cards
    const appCards = document.querySelectorAll('.tool-card');
    appCards.forEach((card, index) => {
        const toolInfo = card.querySelector('.tool-info');
        const toolLinks = card.querySelector('.tool-links');
        const titleElement = card.querySelector('.tool-title');
        
        if (toolLinks && !toolLinks.nextElementSibling?.classList.contains('tool-interactions')) {
            // App card is missing rating and like functionality
            let appId = 'app-' + index;
            
            // Try to get a more meaningful ID from the title
            if (titleElement) {
                appId = titleElement.textContent.trim()
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/(^-|-$)/g, '');
            }
            
            addRatingAndLikeToItem(card, appId, false);
        }
    });
    
    // Function to add rating and like functionality to an item
    function addRatingAndLikeToItem(item, appId, isFeatured) {
        const toolInfo = item.querySelector('.featured-info') || item.querySelector('.tool-info');
        const toolLinks = item.querySelector('.tool-links');
        
        if (!toolInfo || !toolLinks) return;
        
        // Create tool interactions container
        const toolInteractions = document.createElement('div');
        toolInteractions.className = 'tool-interactions';
        
        // Create rating container
        const ratingContainer = document.createElement('div');
        ratingContainer.className = 'rating-container';
        ratingContainer.setAttribute('data-app-id', appId);
        
        // Create rating title
        const ratingTitle = document.createElement('div');
        ratingTitle.className = 'rating-title';
        ratingTitle.textContent = isFeatured ? 'Rate this app:' : 'Rate:';
        
        // Create rating stars
        const ratingStars = document.createElement('div');
        ratingStars.className = 'rating-stars';
        
        // Add 5 stars
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('span');
            star.setAttribute('data-value', i);
            
            const icon = document.createElement('i');
            icon.className = 'far fa-star';
            
            star.appendChild(icon);
            ratingStars.appendChild(star);
        }
        
        // Add rating value
        const ratingValue = document.createElement('span');
        ratingValue.className = 'rating-value';
        ratingValue.textContent = '0.0';
        ratingStars.appendChild(ratingValue);
        
        // Assemble rating container
        ratingContainer.appendChild(ratingTitle);
        ratingContainer.appendChild(ratingStars);
        
        // Create like container
        const likeContainer = document.createElement('div');
        likeContainer.className = 'like-container';
        
        // Create like button
        const likeButton = document.createElement('button');
        likeButton.className = 'like-button';
        likeButton.setAttribute('data-app-id', appId);
        
        // Add thumb icon
        const thumbIcon = document.createElement('i');
        thumbIcon.className = 'far fa-thumbs-up';
        likeButton.appendChild(thumbIcon);
        
        // Add text and count
        likeButton.appendChild(document.createTextNode(' Like '));
        
        const likeCount = document.createElement('span');
        likeCount.className = 'like-count';
        likeCount.textContent = '0';
        likeButton.appendChild(likeCount);
        
        // Assemble like container
        likeContainer.appendChild(likeButton);
        
        // Assemble tool interactions
        toolInteractions.appendChild(ratingContainer);
        toolInteractions.appendChild(likeContainer);
        
        // Add to the DOM after tool links
        toolLinks.parentNode.insertBefore(toolInteractions, toolLinks.nextSibling);
        
        // Add event listeners
        star.addEventListener('click', handleRatingClick);
        star.addEventListener('mouseover', handleRatingHover);
        star.addEventListener('mouseout', handleRatingReset);
        likeButton.addEventListener('click', handleLikeClick);
    }
    
    // Event handlers (simplified versions that call the main handlers from ratings.js)
    function handleRatingClick(event) {
        if (typeof window.handleRatingClick === 'function') {
            window.handleRatingClick(event);
        }
    }
    
    function handleRatingHover(event) {
        if (typeof window.handleRatingHover === 'function') {
            window.handleRatingHover(event);
        }
    }
    
    function handleRatingReset(event) {
        if (typeof window.handleRatingReset === 'function') {
            window.handleRatingReset(event);
        }
    }
    
    function handleLikeClick(event) {
        if (typeof window.handleLikeClick === 'function') {
            window.handleLikeClick(event);
        }
    }
});
