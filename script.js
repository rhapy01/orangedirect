// Initialize AOS animations
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: false,
    mirror: true
});

// Sample game data - Including the featured Neon Rebellion game
const gamesData = [
    {
        id: 1,
        title: "Neon Rebellion",
        description: "A 2D side-scrolling shooter set in a cyberpunk dystopia with a rogue cyborg mercenary fighting against OmniCorp's AI rule.",
        thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        developer: "CyberPunk Studios",
        technologies: ["Unity", "C#", "AI-Generated Assets", "Pixel Art"],
        featured: true,
        stats: {
            gameplay: {
                movement: "8 pixels/frame",
                jumpHeight: "200 pixels",
                doubleJump: "150 pixels",
                dash: "150px with 0.5s invulnerability",
                aiming: "360°"
            },
            weapons: [
                { name: "Pistol", damage: 10, fireRate: "0.2s", range: "500px", ammo: "Infinite" },
                { name: "Plasma Rifle", damage: 25, fireRate: "0.15s", range: "600px", ammo: 50 },
                { name: "Shotgun", damage: "60 (6 pellets)", fireRate: "0.5s", range: "300px", ammo: 20 },
                { name: "Rocket Launcher", damage: "100 (50 splash)", fireRate: "1s", range: "800px", ammo: 5 },
                { name: "Laser Sniper", damage: 80, fireRate: "0.8s", piercing: 3, ammo: 10 }
            ],
            enemies: [
                { name: "Security Drones", hp: 50, movement: "Sine wave pattern", attack: "5 damage lasers every 2s", weakness: "2x explosive damage" },
                { name: "Corporate Soldiers", hp: 100, behavior: "Uses cover (75% damage reduction)", attacks: ["15 damage burst", "40 damage grenades"], weakness: "2x headshot damage" },
                { name: "Mech Walkers", hp: 300, speed: "4 pixels/frame", attack: "50 damage homing missiles", weakness: "Exposed core at 50% HP" },
                { name: "Cyber Ninjas", hp: 75, movement: "Teleport 200px every 3s", attack: "20 damage melee", defense: "50% bullet dodge", weakness: "Stagger from shotguns" }
            ],
            controls: {
                keyboard: {
                    movement: "WASD",
                    jump: "Space",
                    dash: "Shift",
                    aiming: "Mouse",
                    shoot: "Left-click",
                    interact: "E"
                },
                gamepad: {
                    movement: "Left stick",
                    jump: "A",
                    dash: "X",
                    aiming: "Right stick",
                    shoot: "Right trigger",
                    interact: "Y"
                }
            }
        }
    },
    {
        id: 2,
        title: "Quantum Heist",
        description: "A stealth-based puzzle game where you manipulate quantum mechanics to pull off the perfect heist.",
        thumbnail: "https://images.unsplash.com/photo-1550439062-609e1531270e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        developer: "Quantum Games",
        technologies: ["Unreal Engine", "C++", "Blueprint"],
        featured: false
    },
    {
        id: 3,
        title: "Neural Drift",
        description: "A racing game that learns from your driving style and adapts the AI opponents accordingly.",
        thumbnail: "https://images.unsplash.com/photo-1511882150382-421056c89033?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        developer: "NeuralWorks",
        technologies: ["Unity", "C#", "TensorFlow.js"],
        featured: false
    },
    {
        id: 4,
        title: "Cipher Realms",
        description: "An open-world RPG where you decode ancient languages to unlock powerful spells and abilities.",
        thumbnail: "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        developer: "Cryptic Studios",
        technologies: ["Godot", "GDScript", "Procedural Generation"],
        featured: false
    },
    {
        id: 5,
        title: "AI Arena",
        description: "A fighting game where you train AI fighters using reinforcement learning that adapt to your strategy.",
        thumbnail: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        developer: "DeepFight Games",
        technologies: ["Unity", "Python", "ML-Agents"],
        featured: false
    },
    {
        id: 6,
        title: "Voxel Frontiers",
        description: "A space exploration sandbox where you build and customize your own spacecraft.",
        thumbnail: "https://images.unsplash.com/photo-1518339233809-d1c79ea2f985?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        developer: "Cubic Innovations",
        technologies: ["Custom Engine", "Rust", "WebGL"],
        featured: false
    }
];

// Modify populateGames function to include sample game thumbnails from img folder
function populateGames(games) {
    const gamesContainer = document.getElementById('games-container');
    gamesContainer.innerHTML = '';

    if (games.length === 0) {
        gamesContainer.innerHTML = '<div class="no-results">No games found matching your criteria.</div>';
        return;
    }

    // Use our local images for thumbnails
    const localImages = ['img/19.jpg', 'img/90.jpeg', 'img/13.jpg', 'img/14.jpg', 'img/15.jpg'];
    
    // Get non-featured games
    const nonFeaturedGames = games.filter(game => !game.featured);
    
    nonFeaturedGames.forEach((game, index) => {
        // Override the thumbnail with a local image
        const localThumbnail = localImages[index % localImages.length];
        
        const card = document.createElement('div');
        card.className = 'game-card';
        card.setAttribute('data-aos', 'fade-up');

        card.innerHTML = `
            <div class="game-thumbnail">
                <img src="${localThumbnail}" alt="${game.title}">
            </div>
            <div class="game-info">
                <h3 class="game-title">${game.title}</h3>
                <p class="game-description">${game.description}</p>
                <div class="game-developer">
                    <i class="fas fa-user"></i> ${game.developer}
                </div>
                <div class="tech-tags">
                    ${game.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                </div>
                <a href="#" class="view-game-btn" data-id="${game.id}">View Details</a>
            </div>
        `;
        gamesContainer.appendChild(card);
    });

    // Add click event listeners to game cards
    document.querySelectorAll('.view-game-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const gameId = parseInt(this.getAttribute('data-id'));
            const game = gamesData.find(g => g.id === gameId);
            if (game) {
                showGameModal(game);
            }
        });
    });
}

// Initialize particles.js
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 40,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": ["#7000FF", "#00FFAA", "#FF3864"]
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 6
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 2,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#7000FF",
                    "opacity": 0.2,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "bounce",
                    "bounce": false,
                    "attract": {
                        "enable": true,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 0.5
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
    }
}

// Show game modal with detailed information
function showGameModal(game) {
    const modal = document.getElementById('game-modal') || createGameModal();
    const modalContent = modal.querySelector('.modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${game.title}</h2>
            <span class="close-modal">&times;</span>
        </div>
        <div class="modal-body">
            <div class="modal-image">
                <img src="${game.thumbnail}" alt="${game.title}">
            </div>
            <div class="modal-details">
                <p>${game.description}</p>
                <div class="developer-info">
                    <h3>Developer</h3>
                    <p>${game.developer}</p>
                </div>
                <div class="technologies-info">
                    <h3>Technologies</h3>
                    <div class="tech-tags">
                        ${game.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                    </div>
                </div>
                ${game.stats ? `
                <div class="game-detailed-specs">
                    <h3>Game Details</h3>
                    <div class="specs-grid">
                        <div class="spec-item">
                            <h4>Gameplay</h4>
                            <ul>
                                ${Object.entries(game.stats.gameplay).map(([key, value]) => 
                                    `<li><strong>${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> ${value}</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <div class="spec-item">
                            <h4>Weapons</h4>
                            <ul>
                                ${game.stats.weapons.map(weapon => 
                                    `<li><strong>${weapon.name}:</strong> ${weapon.damage} dmg, ${weapon.fireRate} fire rate</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <div class="spec-item">
                            <h4>Enemies</h4>
                            <ul>
                                ${game.stats.enemies.map(enemy => 
                                    `<li><strong>${enemy.name}:</strong> ${enemy.hp} HP, ${enemy.weakness}</li>`
                                ).join('')}
                            </ul>
                        </div>
                    </div>
                </div>
                ` : ''}
            </div>
        </div>
        <div class="modal-footer">
            <button class="btn primary">Play Game</button>
            <button class="btn secondary">View Source</button>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Close modal when clicking on X or outside the modal
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Add animation to modal
    gsap.from(modalContent, {
        duration: 0.4,
        y: -50,
        opacity: 0,
        ease: "power2.out"
    });
}

// Create modal if it doesn't exist
function createGameModal() {
    const modal = document.createElement('div');
    modal.id = 'game-modal';
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-content"></div>';
    document.body.appendChild(modal);
    return modal;
}

// Filter and search functionality
function setupFilters() {
    const searchInput = document.getElementById('search-input');
    const techFilter = document.getElementById('tech-filter');
    const sortOptions = document.getElementById('sort-options');
    
    // Function to apply all filters
    function applyFilters() {
        const searchTerm = searchInput.value.toLowerCase();
        const techSelection = techFilter.value;
        const sortOption = sortOptions.value;
        
        let filteredGames = gamesData.filter(game => {
            // Search term filter
            const matchesSearch = game.title.toLowerCase().includes(searchTerm) || 
                                game.description.toLowerCase().includes(searchTerm) ||
                                game.developer.toLowerCase().includes(searchTerm);
            
            // Technology filter
            const matchesTech = techSelection === '' || 
                              game.technologies.some(tech => tech.includes(techSelection));
            
            return matchesSearch && matchesTech;
        });
        
        // Sort filtered games
        switch(sortOption) {
            case 'newest':
                filteredGames.sort((a, b) => b.id - a.id);
                break;
            case 'oldest':
                filteredGames.sort((a, b) => a.id - b.id);
                break;
            case 'a-z':
                filteredGames.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'z-a':
                filteredGames.sort((a, b) => b.title.localeCompare(a.title));
                break;
        }
        
        populateGames(filteredGames);
    }
    
    // Add event listeners to filters
    searchInput.addEventListener('input', applyFilters);
    techFilter.addEventListener('change', applyFilters);
    sortOptions.addEventListener('change', applyFilters);
}

// Initialize timeline item animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    // Show timeline items when they come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            }
        });
    }, { threshold: 0.2 });
    
    timelineItems.forEach(item => {
        observer.observe(item);
    });
}

// Animate prize cards
function animatePrizeCards() {
    const prizeCards = document.querySelectorAll('.prize-card');
    
    gsap.fromTo(prizeCards, {
        y: 50,
        opacity: 0
    }, {
        y: 0,
        opacity: 1,
        stagger: 0.2,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
            trigger: '.prizes-grid',
            start: "top 80%"
        },
        onComplete: () => {
            // Add animated class for hover effects
            prizeCards.forEach(card => {
                card.classList.add('animated');
            });
        }
    });
}

// Featured game animations
function animateFeaturedGame() {
    const featuredGame = document.querySelector('.featured-game');
    
    if (featuredGame) {
        gsap.from(featuredGame, {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
                trigger: featuredGame,
                start: "top 80%"
            }
        });
        
        const badge = featuredGame.querySelector('.featured-badge');
        if (badge) {
            gsap.from(badge, {
                scale: 0,
                opacity: 0,
                duration: 0.6,
                delay: 0.8,
                ease: "back.out(1.7)"
            });
        }
    }
}

// Countdown Timer
function initCountdown() {
    // Set the submission deadline to March 30th, 2025, 00:00:00 EDT
    const deadline = new Date('2025-03-30T00:00:00-04:00').getTime();
    
    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = deadline - now;

        // Calculate time units
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        // Get the elements
        const daysElement = document.getElementById('countdown-days');
        const hoursElement = document.getElementById('countdown-hours');
        const minutesElement = document.getElementById('countdown-minutes');
        const secondsElement = document.getElementById('countdown-seconds');

        if (!daysElement || !hoursElement || !minutesElement || !secondsElement) {
            console.error('Countdown elements not found');
            return;
        }

        if (timeLeft <= 0) {
            // If deadline has passed
            daysElement.textContent = '00';
            hoursElement.textContent = '00';
            minutesElement.textContent = '00';
            secondsElement.textContent = '00';
            return;
        }

        // Add leading zeros and update the display
        daysElement.textContent = days.toString().padStart(2, '0');
        hoursElement.textContent = hours.toString().padStart(2, '0');
        minutesElement.textContent = minutes.toString().padStart(2, '0');
        secondsElement.textContent = seconds.toString().padStart(2, '0');
    }

    // Update immediately and then every second
    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    // Store the interval ID on the window object so it can be cleared if needed
    window.countdownInterval = intervalId;
}

// Document ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing countdown');
    initCountdown();
    
    // Initialize particles for blockchain effect
    initParticles();
    
    // Populate games grid with all games in the data array
    populateGames(gamesData);
    
    // Setup filters and search
    setupFilters();
    
    // Initialize timeline animations
    initTimelineAnimations();
    
    // Animate prize cards
    animatePrizeCards();
    
    // Animate featured game section
    animateFeaturedGame();
    
    // Add blockchain class to sections with blockchain grid
    document.querySelectorAll('.blockchain-grid').forEach(grid => {
        const section = grid.closest('section');
        if (section) {
            section.classList.add('has-blockchain-grid');
        }
    });
    
    // Featured game video play effect
    const playButton = document.querySelector('.featured-image .play-video');
    if (playButton) {
        playButton.addEventListener('click', function() {
            alert('Game trailer would play here!');
        });
    }
    
    // Initialize GSAP ScrollTrigger if available
    if (typeof ScrollTrigger !== 'undefined') {
        // Register the plugin
        gsap.registerPlugin(ScrollTrigger);
        
        // Animate sections on scroll
        gsap.utils.toArray('section').forEach(section => {
            gsap.from(section.querySelectorAll('h2, .section-intro'), {
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%"
                }
            });
        });
    }
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
        const item = question.parentElement;
        const isActive = item.classList.contains('active');
        
        // Close all FAQ items
        document.querySelectorAll('.faq-item').forEach(faqItem => {
            faqItem.classList.remove('active');
            const icon = faqItem.querySelector('.toggle-icon');
            if (icon) icon.textContent = '+';
        });
        
        // If the clicked item wasn't active, open it
        if (!isActive) {
            item.classList.add('active');
            const icon = question.querySelector('.toggle-icon');
            if (icon) icon.textContent = '−';
        }
    });
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (window.scrollY > 100) {
        nav.classList.add('scrolled');
    } else {
        nav.classList.remove('scrolled');
    }
});

// Timeline animation
const timelineItems = document.querySelectorAll('.timeline-item');
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
}, observerOptions);

timelineItems.forEach(item => {
    observer.observe(item);
});

// Mobile Menu Functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navLinks = document.querySelector('.nav-links');
const body = document.body;

mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    navLinks.classList.toggle('active');
    body.classList.toggle('menu-open');
});

// Close menu when clicking a link
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !mobileMenuBtn.contains(e.target) && navLinks.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        navLinks.classList.remove('active');
        body.classList.remove('menu-open');
    }
});