// Match Page JavaScript

let cards = [];
let selectedCards = [];
let matchedPairs = 0;
let startTime = null;
let timerInterval = null;
let score = 0;

function load() {
    const id = localStorage.getItem('currentFlashcardSetId');
    if (id) {
        const sets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
        const set = sets.find(s => s.id === id);
        if (set) {
            document.getElementById('matchSetTitle').textContent = set.title || 'Untitled';
        }
    }
}

function startGame() {
    const content = document.querySelector('.match-content');
    const game = document.getElementById('matchGame');
    const setTitle = document.getElementById('matchSetTitle');
    const scoreEl = document.getElementById('matchScore');

    if (content) content.style.display = 'none';
    if (game) game.style.display = 'flex';
    if (setTitle) setTitle.style.display = 'none';
    if (scoreEl) scoreEl.style.display = 'block';

    initGame();
}

function initGame() {
    // Use dummy data
    cards = [
        { id: 1, text: 'answer 1', type: 'answer', pairId: 1 },
        { id: 2, text: 'question 2', type: 'question', pairId: 2 },
        { id: 3, text: 'answer 2', type: 'answer', pairId: 2 },
        { id: 4, text: 'question 1', type: 'question', pairId: 1 }
    ];

    // Shuffle cards
    cards = cards.sort(() => Math.random() - 0.5);

    selectedCards = [];
    matchedPairs = 0;
    score = 0;
    startTime = Date.now();

    renderCards();
    startTimer();
}

function renderCards() {
    const container = document.getElementById('matchCardsContainer');
    if (!container) return;

    container.innerHTML = cards.map(card => `
        <div class="match-card ${card.matched ? 'matched' : ''}" 
             data-id="${card.id}" 
             data-pair-id="${card.pairId}"
             onclick="selectCard(${card.id})">
            ${card.text}
        </div>
    `).join('');
}

function selectCard(cardId) {
    const card = cards.find(c => c.id === cardId);
    if (!card || card.matched || selectedCards.length >= 2) return;

    const cardEl = document.querySelector(`.match-card[data-id="${cardId}"]`);
    if (cardEl.classList.contains('selected')) {
        cardEl.classList.remove('selected');
        selectedCards = selectedCards.filter(id => id !== cardId);
        return;
    }

    cardEl.classList.add('selected');
    selectedCards.push(cardId);

    if (selectedCards.length === 2) {
        setTimeout(checkMatch, 500);
    }
}

function checkMatch() {
    const [id1, id2] = selectedCards;
    const card1 = cards.find(c => c.id === id1);
    const card2 = cards.find(c => c.id === id2);

    const card1El = document.querySelector(`.match-card[data-id="${id1}"]`);
    const card2El = document.querySelector(`.match-card[data-id="${id2}"]`);

    if (card1.pairId === card2.pairId && card1.type !== card2.type) {
        // Match found - remove cards
        card1.matched = true;
        card2.matched = true;
        matchedPairs++;

        // Remove cards with animation
        card1El.style.opacity = '0';
        card1El.style.transform = 'scale(0)';
        card2El.style.opacity = '0';
        card2El.style.transform = 'scale(0)';

        setTimeout(() => {
            card1El.remove();
            card2El.remove();
        }, 300);

        if (matchedPairs === cards.length / 2) {
            endGame();
        }
    } else {
        // No match - deselect cards
        card1El.classList.remove('selected');
        card2El.classList.remove('selected');
    }

    selectedCards = [];
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        score = elapsed.toFixed(1);
        document.getElementById('matchScore').textContent = score;
    }, 100);
}

function endGame() {
    if (timerInterval) clearInterval(timerInterval);
    
    // Show results screen
    setTimeout(() => {
        showResults();
    }, 1000);
}

function showResults() {
    const game = document.getElementById('matchGame');
    if (game) game.style.display = 'none';

    const formattedScore = parseFloat(score).toFixed(1);

    let resultsScreen = document.getElementById('matchResultsScreen');
    if (!resultsScreen) {
        resultsScreen = document.createElement('div');
        resultsScreen.id = 'matchResultsScreen';
        resultsScreen.className = 'match-results-screen';
        resultsScreen.innerHTML = `
            <div class="match-results-content">
                <div class="match-congrats-section">
                    <h2 class="match-congrats-title">Congratulations! You're in first place.</h2>
                    <div class="match-party-popper">🎉</div>
                </div>
                <p class="match-best-time">Your best time: <span id="matchBestTime">${formattedScore}</span> seconds</p>
                <div class="match-leaderboard">
                    <h3 class="match-leaderboard-title">The top 10</h3>
                    <div class="match-leaderboard-item first-place">
                        <div class="match-crown">👑</div>
                        <div class="match-profile-pic">
                            <div class="match-profile-avatar">👤</div>
                        </div>
                        <div class="match-username">M_Hamza80</div>
                        <div class="match-time">${formattedScore} seconds</div>
                    </div>
                </div>
                <div class="match-results-buttons">
                    <button class="btn-match-play-again" onclick="restartMatchGame()">
                        <i class="bi bi-play-fill"></i>
                        <span>Play again</span>
                    </button>
                </div>
            </div>
        `;
        document.querySelector('.match-main').appendChild(resultsScreen);
    } else {
        document.getElementById('matchBestTime').textContent = formattedScore;
        document.querySelector('.match-time').textContent = `${formattedScore} seconds`;
    }
    
    resultsScreen.style.display = 'flex';
}

function restartMatchGame() {
    const resultsScreen = document.getElementById('matchResultsScreen');
    if (resultsScreen) resultsScreen.style.display = 'none';
    startGame();
}

window.restartMatchGame = restartMatchGame;

document.addEventListener('DOMContentLoaded', load);
window.startGame = startGame;
window.selectCard = selectCard;

