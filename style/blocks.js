// Blocks Page JavaScript
let q = [], qi = 0, score = 0, grid = Array(80).fill(null), currentBlocks = [], placedCount = 0, selectedBlock = null, selectedCells = [];

function load() {
    const id = localStorage.getItem('currentFlashcardSetId');
    if (id) {
        const sets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
        const set = sets.find(s => s.id === id);
        if (set) {
            document.getElementById('blocksSetTitle').textContent = set.title || 'Untitled';
            if (set.flashcards) q = set.flashcards;
        }
    }
    if (!q.length) q = [{ term: 'question 1', definition: 'answer 1' }, { term: 'question 2', definition: 'answer 2' }];
}

function startGame() {
    document.querySelector('.blocks-content').style.display = 'none';
    document.getElementById('blocksGame').style.display = 'block';
    initGame();
    showBlocks();
}

function initGame() {
    const g = document.getElementById('blocksGrid');
    g.innerHTML = '';
    for (let i = 0; i < 80; i++) {
        const cell = document.createElement('div');
        cell.className = 'blocks-grid-cell';
        cell.dataset.index = i;
        cell.onclick = () => placeBlockOnGrid(i);
        g.appendChild(cell);
    }
    const hs = localStorage.getItem('blocksHighScore') || 0;
    document.getElementById('highScore').textContent = hs;
    document.getElementById('blocksAnswerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
}

function showBlocks() {
    placedCount = 0;
    currentBlocks = generateBlocks();
    const preview = document.getElementById('blocksPreview');
    preview.innerHTML = '';
    currentBlocks.forEach((block, idx) => {
        const blockEl = createBlockElement(block, idx);
        blockEl.onclick = () => selectBlock(idx);
        preview.appendChild(blockEl);
    });
    document.getElementById('blocksPreviewPanel').style.display = 'block';
    document.getElementById('blocksQuestionPanel').style.display = 'none';
    document.getElementById('blocksPlacedCount').textContent = `${placedCount} / 3 blocks placed`;
}

function generateBlocks() {
    const shapes = [
        { type: 'L', cells: [[0, 0], [1, 0], [1, 1]], color: '#ff6b6b' },
        { type: 'line3v', cells: [[0, 0], [0, 1], [0, 2]], color: '#c44569' },
        { type: 'square', cells: [[0, 0], [0, 1], [1, 0], [1, 1]], color: '#10b981' },
        { type: 'line3h', cells: [[0, 0], [1, 0], [2, 0]], color: '#00d2d3' },
        { type: 'line2h', cells: [[0, 0], [1, 0]], color: '#f59e0b' }
    ];
    return Array(3).fill(null).map(() => {
        const s = shapes[Math.floor(Math.random() * shapes.length)];
        return { ...s, id: Math.random(), placed: false };
    });
}

function createBlockElement(block, idx) {
    const div = document.createElement('div');
    div.className = `blocks-preview-block ${selectedBlock === idx ? 'selected' : ''}`;
    const maxX = Math.max(...block.cells.map(c => c[0]));
    const maxY = Math.max(...block.cells.map(c => c[1]));
    div.style.gridTemplateColumns = `repeat(${maxX + 1}, 30px)`;
    div.style.gridTemplateRows = `repeat(${maxY + 1}, 30px)`;
    div.dataset.blockId = idx;
    const grid = Array((maxX + 1) * (maxY + 1)).fill(null);
    block.cells.forEach(([x, y]) => {
        grid[y * (maxX + 1) + x] = block.color;
    });
    div.innerHTML = grid.map((color, i) =>
        color ? `<div class="block-piece" style="background: ${color}"></div>` : '<div></div>'
    ).join('');
    return div;
}

function selectBlock(idx) {
    selectedBlock = idx;
    document.querySelectorAll('.blocks-preview-block').forEach((el, i) => {
        el.classList.toggle('selected', i === idx);
    });
}

function placeBlockOnGrid(gridIdx) {
    if (selectedBlock === null || currentBlocks[selectedBlock].placed) return;
    const block = currentBlocks[selectedBlock];
    const row = Math.floor(gridIdx / 8);
    const col = gridIdx % 8;
    const cells = block.cells.map(([x, y]) => (row + y) * 8 + (col + x));
    if (cells.every(i => i >= 0 && i < 80 && grid[i] === null)) {
        cells.forEach(i => {
            grid[i] = block.color;
            const cell = document.querySelector(`[data-index="${i}"]`);
            cell.style.background = block.color;
            cell.classList.add('filled');
        });
        block.placed = true;
        placedCount++;
        document.getElementById('blocksPlacedCount').textContent = `${placedCount} / 3 blocks placed`;
        selectedBlock = null;
        document.querySelectorAll('.blocks-preview-block').forEach(el => el.classList.remove('selected'));
        if (placedCount === 3) {
            checkRowsColumns();
            setTimeout(() => {
                document.getElementById('blocksPreviewPanel').style.display = 'none';
                document.getElementById('blocksQuestionPanel').style.display = 'block';
                showQuestion();
            }, 500);
        }
    }
}

function checkRowsColumns() {
    let cleared = false;
    for (let r = 0; r < 10; r++) {
        const row = Array(8).fill(null).map((_, c) => grid[r * 8 + c]);
        if (row.every(c => c !== null)) {
            for (let c = 0; c < 8; c++) {
                grid[r * 8 + c] = null;
                const cell = document.querySelector(`[data-index="${r * 8 + c}"]`);
                cell.style.background = '';
                cell.classList.remove('filled');
            }
            score += 100;
            cleared = true;
        }
    }
    for (let c = 0; c < 8; c++) {
        const col = Array(10).fill(null).map((_, r) => grid[r * 8 + c]);
        if (col.every(cell => cell !== null)) {
            for (let r = 0; r < 10; r++) {
                grid[r * 8 + c] = null;
                const cell = document.querySelector(`[data-index="${r * 8 + c}"]`);
                cell.style.background = '';
                cell.classList.remove('filled');
            }
            score += 100;
            cleared = true;
        }
    }
    if (cleared) {
        document.getElementById('currentScore').textContent = score;
        const hs = Math.max(score, parseInt(localStorage.getItem('blocksHighScore') || 0));
        localStorage.setItem('blocksHighScore', hs);
        document.getElementById('highScore').textContent = hs;
    }
}

function showQuestion() {
    if (qi >= q.length) qi = 0;
    document.getElementById('blocksQuestion').textContent = q[qi].term || 'question 1';
    document.getElementById('blocksAnswerInput').value = '';
    document.getElementById('blocksAnswerInput').focus();
}

function checkAnswer() {
    const input = document.getElementById('blocksAnswerInput');
    const answer = input.value.trim().toLowerCase();
    const correct = (q[qi].definition || '').toLowerCase();
    if (answer === correct) {
        score += 10;
        document.getElementById('currentScore').textContent = score;
        qi++;
        if (qi >= q.length) qi = 0;
        setTimeout(() => {
            document.getElementById('blocksQuestionPanel').style.display = 'none';
            showBlocks();
        }, 500);
    } else {
        input.style.borderColor = '#ef4444';
        setTimeout(() => input.style.borderColor = '#586380', 500);
    }
}

function showOptions() {
    document.getElementById('blocksOptionsModal').style.display = 'flex';
}

function closeOptions() {
    document.getElementById('blocksOptionsModal').style.display = 'none';
}

function closeOptionsModal(e) {
    if (e.target.id === 'blocksOptionsModal') closeOptions();
}

function toggleQuestionFormat() {
    const content = document.getElementById('questionFormatContent');
    const text = document.getElementById('questionFormatToggleText');
    const icon = document.getElementById('questionFormatToggleIcon');
    const isCollapsed = content.classList.contains('collapsed');

    if (isCollapsed) {
        content.classList.remove('collapsed');
        content.style.maxHeight = content.scrollHeight + 'px';
        text.textContent = 'Hide';
        icon.className = 'bi bi-chevron-up';
    } else {
        content.classList.add('collapsed');
        content.style.maxHeight = '0';
        text.textContent = 'Show';
        icon.className = 'bi bi-chevron-down';
    }
}

function showHowToPlay() {
    document.getElementById('blocksModal').style.display = 'flex';
}

function closeHowToPlay() {
    document.getElementById('blocksModal').style.display = 'none';
}

function closeModal(e) {
    if (e.target.id === 'blocksModal') closeHowToPlay();
}

document.addEventListener('DOMContentLoaded', () => {
    load();
    const content = document.getElementById('questionFormatContent');
    if (content) {
        content.style.maxHeight = content.scrollHeight + 'px';
    }
});

window.startGame = startGame;
window.checkAnswer = checkAnswer;
window.showOptions = showOptions;
window.closeOptions = closeOptions;
window.closeOptionsModal = closeOptionsModal;
window.toggleQuestionFormat = toggleQuestionFormat;
window.showHowToPlay = showHowToPlay;
window.closeHowToPlay = closeHowToPlay;
window.closeModal = closeModal;
