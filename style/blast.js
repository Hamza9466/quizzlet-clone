// Blast Page JavaScript

const ships = [
    '../../../assets/admin/images/orangeShip@2x.b2bf5d64.png',
    '../../../assets/admin/images/pinkShip@2x.5eb71542.png'
];
let currentShipIndex = 0;

function load() {
    const id = localStorage.getItem('currentFlashcardSetId');
    if (id) {
        const sets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
        const set = sets.find(s => s.id === id);
        if (set) {
            document.getElementById('blastSetTitle').textContent = set.title || 'Untitled';
        }
    }
    updateShipImage();
}

function changeShip(direction) {
    currentShipIndex = (currentShipIndex + direction + ships.length) % ships.length;
    updateShipImage();
}

function updateShipImage() {
    const img = document.getElementById('blastShipImage');
    if (img) {
        img.src = ships[currentShipIndex];
    }
}

function startGame() {
    const main = document.querySelector('.blast-main');
    const content = document.querySelector('.blast-content');
    const game = document.getElementById('blastGame');
    const questionNav = document.getElementById('blastQuestionNav');
    const muteBtn = document.getElementById('blastMuteBtn');
    const gearBtn = document.getElementById('blastGearBtn');
    const trophyBtn = document.getElementById('blastTrophyBtn');
    const finalScreen = document.getElementById('blastFinalScreen');

    // Reset game state
    questionNumber = 1;
    totalScore = 0;

    if (content) content.style.display = 'none';
    if (finalScreen) finalScreen.style.display = 'none';
    if (game) {
        game.style.display = 'block';
        // Initialize spaceship follow after game is visible
        setTimeout(() => {
            setupSpaceshipFollow();
        }, 50);
    }
    if (questionNav) questionNav.style.display = 'flex';
    if (muteBtn) muteBtn.style.display = 'block';
    if (gearBtn) gearBtn.style.display = 'none';
    if (trophyBtn) trophyBtn.style.display = 'block';

    initGame();
}

let questionNumber = 1;
let totalScore = 0;

function initGame() {
    const bubbles = document.getElementById('blastQuestionBubbles');
    const questionText = document.getElementById('blastQuestionText');
    const questionNav = document.getElementById('blastQuestionNav');

    if (!bubbles || !questionText || !questionNav) return;

    // Check if we've completed all questions
    if (questionNumber > 2) {
        showFinalScore();
        return;
    }

    // Ensure nav is visible
    questionNav.style.display = 'flex';

    bubbles.innerHTML = '';

    // Use dummy data - answer 1 -> question 1, answer 2 -> question 2
    const answerText = `answer ${questionNumber}`;
    questionText.textContent = answerText;

    // Dummy question options - correct answer matches question number
    const termOptions = [
        { text: `question ${questionNumber}`, isCorrect: true },
        { text: `question ${questionNumber === 1 ? 2 : 1}`, isCorrect: false }
    ];

    const shuffled = termOptions;

    shuffled.forEach((option, index) => {
        const bubble = document.createElement('div');
        bubble.className = 'blast-question-bubble zigzag-moving';
        bubble.textContent = option.text;
        bubble.dataset.isCorrect = option.isCorrect;

        // Random starting positions (keep within screen bounds)
        const left = 20 + Math.random() * 60;
        const top = 15 + Math.random() * 40;
        bubble.style.left = `${left}%`;
        bubble.style.top = `${top}%`;
        bubble.style.animationDelay = `${index * 0.5}s`;

        bubble.onclick = () => {
            // Stop zigzag animation and blast
            bubble.classList.remove('zigzag-moving');
            bubble.classList.add('blasting');

            if (option.isCorrect) {
                totalScore += 10;
                document.getElementById('blastScore').textContent = String(totalScore).padStart(2, '0');
            }

            // Remove bubble after blast animation and load next question
            setTimeout(() => {
                bubble.remove();
                questionNumber++;
                // Load next question immediately after blast
                setTimeout(() => initGame(), 500);
            }, 500);
        };

        bubbles.appendChild(bubble);
    });

    document.getElementById('blastScore').textContent = String(totalScore).padStart(2, '0');
}

function showFinalScore() {
    const game = document.getElementById('blastGame');
    const questionNav = document.getElementById('blastQuestionNav');

    // Hide game elements but keep header visible
    if (game) game.style.display = 'none';
    if (questionNav) questionNav.style.display = 'none';

    // Create or show final score screen
    let finalScreen = document.getElementById('blastFinalScreen');
    if (!finalScreen) {
        finalScreen = document.createElement('div');
        finalScreen.id = 'blastFinalScreen';
        finalScreen.className = 'blast-final-screen';
        finalScreen.innerHTML = `
            <div class="blast-final-content">
                <div class="blast-final-trophy">
                    <img src="../../../assets/admin/images/trophy.webp" alt="Trophy">
                </div>
                <h2 class="blast-final-title">Nice blasting!<br>Here's your final score</h2>
                <div class="blast-final-scores">
                    <div class="blast-score-card">
                        <p class="blast-score-label">Your score</p>
                        <p class="blast-score-value" id="blastFinalScore">0</p>
                    </div>
                    <div class="blast-score-card blast-high-score">
                        <p class="blast-score-label">Your high score</p>
                        <p class="blast-score-value" id="blastHighScore">0</p>
                    </div>
                </div>
                <p class="blast-next-steps-title">Next steps</p>
                <div class="blast-final-buttons">
                    <button class="blast-btn-practice" onclick="window.location.href='learn.html'">
                        <i class="bi bi-arrow-clockwise"></i>
                        <span>Practise with questions</span>
                    </button>
                    <button class="blast-btn-play-again" onclick="restartGame()">
                        <span>Play again</span>
                    </button>
                </div>
                <p class="blast-choose-set" onclick="showChooseSetModal()">Choose a set</p>
            </div>
        `;
        document.querySelector('.blast-main').appendChild(finalScreen);
    }

    // Update scores
    document.getElementById('blastFinalScore').textContent = totalScore;
    const highScore = localStorage.getItem('blastHighScore') || 0;
    const newHighScore = Math.max(totalScore, parseInt(highScore));
    localStorage.setItem('blastHighScore', newHighScore);
    document.getElementById('blastHighScore').textContent = newHighScore;

    finalScreen.style.display = 'flex';
}

function restartGame() {
    questionNumber = 1;
    totalScore = 0;
    const finalScreen = document.getElementById('blastFinalScreen');
    if (finalScreen) finalScreen.style.display = 'none';
    startGame();
}

window.restartGame = restartGame;

function showChooseSetModal() {
    let modal = document.getElementById('blastChooseSetModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'blastChooseSetModal';
        modal.className = 'blast-choose-set-modal';
        modal.innerHTML = `
            <div class="blast-modal-overlay" onclick="closeChooseSetModal()"></div>
            <div class="blast-modal-content" onclick="event.stopPropagation()">
                <div class="blast-modal-header">
                    <div class="blast-dropdown-wrapper">
                        <button class="blast-modal-dropdown" onclick="toggleSetsDropdown(event)">
                            <span>Your sets</span>
                            <i class="bi bi-chevron-down"></i>
                        </button>
                        <div class="blast-dropdown-menu" id="blastSetsDropdown" style="display: none;">
                            <div class="blast-dropdown-item active" onclick="selectSetsFilter('your-sets', event)">
                                <span>Your sets</span>
                                <i class="bi bi-check"></i>
                            </div>
                            <div class="blast-dropdown-item" onclick="selectSetsFilter('recent-sets', event)">
                                <span>Recent sets</span>
                            </div>
                            <div class="blast-dropdown-item" onclick="selectSetsFilter('class-sets', event)">
                                <span>Class sets</span>
                            </div>
                        </div>
                    </div>
                    <button class="blast-modal-close" onclick="closeChooseSetModal()">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                <div class="blast-modal-body" id="blastSetsList">
                    <!-- Sets will be loaded here -->
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            const dropdown = document.getElementById('blastSetsDropdown');
            const wrapper = document.querySelector('.blast-dropdown-wrapper');
            if (dropdown && wrapper && !wrapper.contains(e.target)) {
                dropdown.style.display = 'none';
            }
        });
    }

    currentFilter = 'your-sets';
    loadSetsIntoModal();
    modal.style.display = 'block';
}

function closeChooseSetModal() {
    const modal = document.getElementById('blastChooseSetModal');
    if (modal) modal.style.display = 'none';
}

let currentFilter = 'your-sets';

function loadSetsIntoModal() {
    const setsList = document.getElementById('blastSetsList');
    if (!setsList) return;

    let sets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
    const currentSetId = localStorage.getItem('currentFlashcardSetId');

    // Filter sets based on current filter
    if (currentFilter === 'recent-sets') {
        sets = sets.sort((a, b) => {
            const aTime = new Date(a.lastStudied || a.createdAt || 0);
            const bTime = new Date(b.lastStudied || b.createdAt || 0);
            return bTime - aTime;
        }).slice(0, 10);
    } else if (currentFilter === 'class-sets') {
        sets = []; // Class sets would come from a different source
    }

    if (sets.length === 0) {
        setsList.innerHTML = '<p class="blast-modal-empty">No sets available</p>';
        return;
    }

    setsList.innerHTML = sets.map(set => `
        <div class="blast-set-item ${set.id === currentSetId ? 'selected' : ''}" onclick="selectSet('${set.id}')">
            <span class="blast-set-item-text">${set.title || 'Untitled'}</span>
            <div class="blast-radio-button ${set.id === currentSetId ? 'checked' : ''}">
                ${set.id === currentSetId ? '<div class="blast-radio-inner"></div>' : ''}
            </div>
        </div>
    `).join('');
}

function toggleSetsDropdown(event) {
    event.stopPropagation();
    const dropdown = document.getElementById('blastSetsDropdown');
    if (dropdown) {
        dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
    }
}

function selectSetsFilter(filter, event) {
    event.stopPropagation();
    currentFilter = filter;

    // Update dropdown button text
    const dropdownBtn = document.querySelector('.blast-modal-dropdown span');
    const dropdownItems = document.querySelectorAll('.blast-dropdown-item');
    const dropdown = document.getElementById('blastSetsDropdown');

    dropdownItems.forEach(item => item.classList.remove('active'));
    event.currentTarget.classList.add('active');

    if (dropdownBtn) {
        dropdownBtn.textContent = event.currentTarget.querySelector('span').textContent;
    }

    if (dropdown) dropdown.style.display = 'none';

    loadSetsIntoModal();
}

window.toggleSetsDropdown = toggleSetsDropdown;
window.selectSetsFilter = selectSetsFilter;

function selectSet(setId) {
    localStorage.setItem('currentFlashcardSetId', setId);
    closeChooseSetModal();
    // Reload the page or update the UI
    window.location.reload();
}

window.showChooseSetModal = showChooseSetModal;
window.closeChooseSetModal = closeChooseSetModal;
window.selectSet = selectSet;

function setupSpaceshipFollow() {
    const game = document.getElementById('blastGame');
    const ship = document.querySelector('.blast-spaceship-container');
    const shipImage = document.querySelector('.blast-spaceship-image');
    if (!game || !ship || !shipImage) {
        setTimeout(setupSpaceshipFollow, 100);
        return;
    }

    // Remove any existing listeners
    const handleMouseMove = (e) => {
        const gameRect = game.getBoundingClientRect();
        const shipRect = ship.getBoundingClientRect();

        // Get center of ship
        const shipCenterX = shipRect.left + shipRect.width / 2;
        const shipCenterY = shipRect.top + shipRect.height / 2;

        // Get mouse position
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Calculate angle between ship center and mouse (in radians)
        const dx = mouseX - shipCenterX;
        const dy = mouseY - shipCenterY;
        const angleRad = Math.atan2(dy, dx);
        const angleDeg = angleRad * (180 / Math.PI);

        // Rotate ship to point towards mouse (adjust offset if needed based on ship image orientation)
        shipImage.style.transform = `rotate(${angleDeg + 90}deg)`;
    };

    // Remove old listener if exists
    game.removeEventListener('mousemove', handleMouseMove);
    game.addEventListener('mousemove', handleMouseMove);
}

function showHowToPlay() {
    // How to play modal will be implemented here
    alert('How to play Blast instructions coming soon!');
}

document.addEventListener('DOMContentLoaded', load);
window.startGame = startGame;
window.showHowToPlay = showHowToPlay;
window.changeShip = changeShip;

