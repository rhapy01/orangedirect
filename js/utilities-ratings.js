// Utilities Ratings Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Fix the app IDs for utilities page
    const utilityCards = document.querySelectorAll('#utilitiesGrid .tool-card');
    
    // Define specific app IDs for all utilities based on their titles
    const utilityTitles = {
        'Gas Optimizer': 'gas-optimizer',
        'Yield Optimizer': 'yield-optimizer',
        'NFT Portfolio': 'nft-portfolio',
        'Blockchain Alerts': 'blockchain-alerts',
        'Tax Reporter': 'tax-reporter',
        'Token Tracker': 'token-tracker',
        'Wallet Manager': 'wallet-manager',
        'Multi-chain Bridge': 'multi-chain-bridge',
        'Staking Dashboard': 'staking-dashboard',
        'Governance Voting': 'governance-voting'
    };
    
    // Assign proper app IDs to each utility card
    utilityCards.forEach((card, index) => {
        const ratingContainer = card.querySelector('.rating-container');
        const likeButton = card.querySelector('.like-button');
        const titleElement = card.querySelector('.tool-title');
        
        if (ratingContainer && likeButton) {
            let appId;
            
            // Try to get an app ID based on the title
            if (titleElement && utilityTitles[titleElement.textContent.trim()]) {
                appId = utilityTitles[titleElement.textContent.trim()];
            } else {
                // Fallback to a numbered ID if title not found
                appId = `utility-app-${index + 1}`;
            }
            
            // Set the proper app IDs
            ratingContainer.setAttribute('data-app-id', appId);
            likeButton.setAttribute('data-app-id', appId);
            
            // Fix any incorrect app IDs in the button
            if (likeButton.getAttribute('data-app-id').includes('${Math.random')) {
                likeButton.setAttribute('data-app-id', appId);
            }
        }
    });
    
    // Also check the featured utility if it exists
    const featuredUtility = document.querySelector('.featured-tool');
    if (featuredUtility) {
        const ratingContainer = featuredUtility.querySelector('.rating-container');
        const likeButton = featuredUtility.querySelector('.like-button');
        
        if (ratingContainer && likeButton) {
            const appId = 'featured-utility';
            ratingContainer.setAttribute('data-app-id', appId);
            likeButton.setAttribute('data-app-id', appId);
        }
    }
});
