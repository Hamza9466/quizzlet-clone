// Dashboard Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Sidebar Toggle
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const mainContent = document.querySelector('.dashboard-main');
    const footer = document.querySelector('.dashboard-footer');

    if (menuToggleBtn && sidebar && mainContent) {
        menuToggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('closed');
            mainContent.classList.toggle('sidebar-closed');
            if (footer) {
                footer.classList.toggle('sidebar-closed');
            }
        });
    }

    // Staff Picks Scroll
    const staffPicksNextBtn = document.querySelector('.staff-picks-next-btn');
    const staffPicksScroll = document.querySelector('.staff-picks-scroll');

    if (staffPicksNextBtn && staffPicksScroll) {
        staffPicksNextBtn.addEventListener('click', function () {
            staffPicksScroll.scrollBy({
                left: 300,
                behavior: 'smooth'
            });
        });
    }

    // Profile Dropdown Toggle
    const profileIcon = document.getElementById('profileIcon');
    const profileDropdown = document.getElementById('profileDropdown');

    if (profileIcon && profileDropdown) {
        profileIcon.addEventListener('click', function (e) {
            e.stopPropagation();
            profileDropdown.classList.toggle('show');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });

        // Prevent dropdown from closing when clicking inside it
        profileDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Load flashcard sets and update dashboard
    loadFlashcardSets();
});

// Load flashcard sets from localStorage
function loadFlashcardSets() {
    const flashcardSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');

    if (flashcardSets.length > 0) {
        // Update Jump back in section with slider
        updateJumpBackIn(flashcardSets);

        // Update Recents section
        updateRecents(flashcardSets);
    } else {
        // Show default message if no sets
        const jumpBackCards = document.getElementById('jumpBackCards');
        if (jumpBackCards) {
            jumpBackCards.innerHTML = '<p class="text-secondary">No flashcard sets yet. Create your first set!</p>';
        }
    }
}

// Update Jump back in section with slider
function updateJumpBackIn(sets) {
    const jumpBackCards = document.getElementById('jumpBackCards');
    const jumpBackPagination = document.getElementById('jumpBackPagination');

    if (!jumpBackCards) return;

    if (sets.length === 0) {
        jumpBackCards.innerHTML = '<p class="text-secondary">No flashcard sets yet. Create your first set!</p>';
        if (jumpBackPagination) jumpBackPagination.innerHTML = '';
        return;
    }

    // Show up to 4 sets in slider
    const displaySets = sets.slice(0, 4);
    jumpBackCards.innerHTML = '';

    displaySets.forEach((set, index) => {
        const card = createJumpBackCard(set, index);
        jumpBackCards.appendChild(card);
    });

    // Create pagination dots
    if (jumpBackPagination && displaySets.length > 1) {
        jumpBackPagination.innerHTML = '';
        displaySets.forEach((set, index) => {
            const dot = document.createElement('button');
            dot.className = 'pagination-dot';
            dot.classList.add(index === 0 ? 'active' : '');
            dot.setAttribute('data-slide-index', index);
            dot.onclick = function () {
                goToSlide(index);
            };
            jumpBackPagination.appendChild(dot);
        });
    } else if (jumpBackPagination) {
        jumpBackPagination.innerHTML = '';
    }

    // Initialize slider
    initJumpBackInSlider();
}

function createJumpBackCard(set, index) {
    const cardWrapper = document.createElement('div');
    cardWrapper.className = 'jump-back-card-item';
    cardWrapper.setAttribute('data-slide-index', index);
    cardWrapper.setAttribute('data-set-id', set.id);

    const cardCount = set.flashcards ? set.flashcards.length : 0;
    const progressPercentage = 50; // Default 50% for demo

    cardWrapper.innerHTML = `
        <div class="jump-back-card">
            <div class="card-menu-wrapper">
                <button class="card-menu-btn" onclick="toggleCardMenu(this)">
                    <i class="bi bi-three-dots-vertical"></i>
                </button>
                <div class="card-menu-dropdown">
                    <button class="card-menu-item" onclick="removeFlashcardSet('${set.id}')">
                        <i class="bi bi-eye-slash"></i>
                        <span data-i18n="remove">Remove</span>
                    </button>
                </div>
            </div>
            <div class="card-content">
                <h3 class="card-title">${set.title}</h3>
                <div class="card-progress">
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${progressPercentage}%;"></div>
                    </div>
                    <span class="progress-text">${progressPercentage}% of questions completed</span>
                </div>
                <button class="btn-continue" onclick="startFlashcardQuiz('${set.id}')" data-i18n="continue">Continue</button>
            </div>
            <div class="card-image">
                <img src="../../../assets/admin/images/progress-hero-FC-swipe-dark.png" alt="Flashcards" class="card-bg-image">
            </div>
        </div>
    `;

    return cardWrapper;
}

let currentSlideIndex = 0;

function initJumpBackInSlider() {
    const container = document.getElementById('jumpBackCards');
    if (!container) return;

    const cards = container.querySelectorAll('.jump-back-card-item');
    if (cards.length === 0) return;

    // Set initial positions
    updateCardPositions();

    // Make slider scrollable
    container.addEventListener('scroll', function () {
        updateActiveSlide();
    });
}

function updateCardPositions() {
    const container = document.getElementById('jumpBackCards');
    if (!container) return;

    const cards = container.querySelectorAll('.jump-back-card-item');
    cards.forEach((card, index) => {
        if (index === currentSlideIndex) {
            card.classList.add('active');
            card.classList.remove('next');
        } else if (index === currentSlideIndex + 1) {
            card.classList.add('next');
            card.classList.remove('active');
        } else {
            card.classList.remove('active', 'next');
        }
    });

    // Scroll to current slide
    if (cards[currentSlideIndex]) {
        cards[currentSlideIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }

    updatePagination();
}

function updateActiveSlide() {
    const container = document.getElementById('jumpBackCards');
    if (!container) return;

    const cards = container.querySelectorAll('.jump-back-card-item');
    const containerRect = container.getBoundingClientRect();
    const containerCenter = containerRect.left + containerRect.width / 2;

    let closestIndex = 0;
    let closestDistance = Infinity;

    cards.forEach((card, index) => {
        const cardRect = card.getBoundingClientRect();
        const cardCenter = cardRect.left + cardRect.width / 2;
        const distance = Math.abs(cardCenter - containerCenter);

        if (distance < closestDistance) {
            closestDistance = distance;
            closestIndex = index;
        }
    });

    if (closestIndex !== currentSlideIndex) {
        currentSlideIndex = closestIndex;
        updateCardPositions();
    }
}

function updatePagination() {
    const pagination = document.getElementById('jumpBackPagination');
    if (!pagination) return;

    const dots = pagination.querySelectorAll('.pagination-dot');
    dots.forEach((dot, index) => {
        if (index === currentSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

window.goToSlide = function (index) {
    const container = document.getElementById('jumpBackCards');
    if (!container) return;

    const cards = container.querySelectorAll('.jump-back-card-item');
    if (index >= 0 && index < cards.length) {
        currentSlideIndex = index;
        updateCardPositions();
    }
};

window.slideJumpBack = function (direction) {
    const container = document.getElementById('jumpBackCards');
    if (!container) return;

    const cards = container.querySelectorAll('.jump-back-card-item');
    if (cards.length <= 1) return;

    if (direction === 'next') {
        currentSlideIndex = (currentSlideIndex + 1) % cards.length;
    } else {
        currentSlideIndex = (currentSlideIndex - 1 + cards.length) % cards.length;
    }

    updateCardPositions();
};

// Update Recents section
function updateRecents(sets) {
    const recentsList = document.querySelector('.recents-list');
    if (!recentsList || sets.length === 0) return;

    // Show first 3 sets
    const displaySets = sets.slice(0, 3);
    recentsList.innerHTML = '';

    displaySets.forEach((set) => {
        const cardCount = set.flashcards ? set.flashcards.length : 0;
        const lastStudied = new Date(set.lastStudied).toLocaleDateString();

        const item = document.createElement('a');
        item.href = '#';
        item.className = 'recent-item';
        item.onclick = function (e) {
            e.preventDefault();
            startFlashcardQuiz(set.id);
        };
        item.innerHTML = `
            <i class="bi bi-card-text recent-icon"></i>
            <div class="recent-content">
                <div class="recent-title">${set.title}</div>
                <div class="recent-meta">${cardCount} cards • ${lastStudied}</div>
            </div>
        `;
        recentsList.appendChild(item);
    });
}

// Toggle card menu dropdown
window.toggleCardMenu = function (btn) {
    // Close all other menus first
    const allMenus = document.querySelectorAll('.card-menu-dropdown');
    allMenus.forEach(menu => {
        if (menu !== btn.nextElementSibling) {
            menu.classList.remove('show');
        }
    });

    // Toggle current menu
    const menu = btn.nextElementSibling;
    if (menu) {
        menu.classList.toggle('show');
    }
};

// Remove flashcard set
window.removeFlashcardSet = function (setId) {
    if (!confirm('Are you sure you want to remove this flashcard set from "Jump back in"?')) {
        return;
    }

    try {
        // Get all flashcard sets
        const flashcardSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');

        // Remove the set
        const updatedSets = flashcardSets.filter(set => set.id !== setId);

        // Save back to localStorage
        localStorage.setItem('flashcardSets', JSON.stringify(updatedSets));

        // Remove the card from DOM
        const cardWrapper = document.querySelector(`[data-set-id="${setId}"]`);
        if (cardWrapper) {
            cardWrapper.remove();
        }

        // Reload the sections
        loadFlashcardSets();

        // Close the menu
        const allMenus = document.querySelectorAll('.card-menu-dropdown');
        allMenus.forEach(menu => menu.classList.remove('show'));
    } catch (error) {
        console.error('Error removing flashcard set:', error);
        alert('Error removing flashcard set');
    }
};

// Close menu when clicking outside
document.addEventListener('click', function (e) {
    if (!e.target.closest('.card-menu-wrapper')) {
        const allMenus = document.querySelectorAll('.card-menu-dropdown');
        allMenus.forEach(menu => menu.classList.remove('show'));
    }
});

// Start flashcard quiz
window.startFlashcardQuiz = function (setId) {
    if (!setId) {
        // Get the most recent set if no ID provided
        const flashcardSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
        if (flashcardSets.length > 0) {
            setId = flashcardSets[0].id;
        } else {
            alert('No flashcard sets available');
            return;
        }
    }

    // Store the selected set ID and redirect to learn page
    localStorage.setItem('currentFlashcardSetId', setId);
    window.location.href = 'learn.html';
};

