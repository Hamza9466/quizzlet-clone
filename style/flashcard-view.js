// Flashcard View Page JavaScript

let i = 0, cards = [{ term: 'question 1', definition: 'answer 1' }, { term: 'question 2', definition: 'answer 2' }], setId = null, hideDefs = false;

function load() {
    setId = localStorage.getItem('currentFlashcardSetId');
    if (setId) {
        const sets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
        const set = sets.find(s => s.id === setId);
        if (set) {
            cards = set.flashcards || [];
            document.getElementById('flashcardSetTitle').textContent = set.title || 'Untitled';
            const titleEl = document.getElementById('setTitleDisplay');
            const headingEl = document.getElementById('termsHeading');
            if (titleEl) titleEl.textContent = set.title || 'Untitled';
            if (headingEl) headingEl.textContent = `Terms In this set (${cards.length})`;
            render();
        }
    } else {
        // If no set ID, render default cards
        render();
    }
}

function render() {
    const list = document.getElementById('termsList');
    if (!list) return;
    list.innerHTML = cards.map(c => `
        <div class="term-card card mb-3" style="background: #2E3856; border: none; border-radius: 8px;">
            <div class="card-body position-relative" style="padding: 1.25rem 1.5rem;">
                <div class="d-flex align-items-center" style="padding-right: 110px; min-height: 50px;">
                    <div class="term-answer text-white" style="flex: 1; font-size: 1rem; text-align: left;">${c.definition || 'No definition'}</div>
                    <div style="width: 1px; height: 40px; background: #586380; flex-shrink: 0; margin: 0 1rem;"></div>
                    <div class="term-question text-white" style="flex: 1; font-size: 1rem; text-align: left;">${c.term || 'No term'}</div>
                </div>
                <div class="d-flex gap-2 position-absolute" style="top: 1.25rem; right: 1.5rem;">
                    <button class="btn btn-link text-white p-0" style="font-size: 1.1rem; line-height: 1; opacity: 0.9;"><i class="bi bi-star"></i></button>
                    <button class="btn btn-link text-white p-0" style="font-size: 1.1rem; line-height: 1; opacity: 0.9;"><i class="bi bi-volume-up"></i></button>
                    <button class="btn btn-link text-white p-0" style="font-size: 1.1rem; line-height: 1; opacity: 0.9;"><i class="bi bi-pencil"></i></button>
                </div>
            </div>
        </div>
    `).join('');
}

function show() {
    if (i < 0 || i >= cards.length) return;
    const c = cards[i];
    document.getElementById('flashcardContent').textContent = c.term || 'No term';
    document.getElementById('flashcardAnswer').textContent = c.definition || 'No definition';
    document.getElementById('flashcardInner').classList.remove('flipped');
    document.getElementById('cardCounter').textContent = `${i + 1} / ${cards.length}`;
    document.getElementById('prevCardBtn').disabled = i === 0;
    document.getElementById('nextCardBtn').disabled = i === cards.length - 1;
}

function flip() {
    document.getElementById('flashcardInner').classList.toggle('flipped');
}

document.addEventListener('DOMContentLoaded', () => {
    load();
    show();
    // Ensure terms list is rendered even if no setId
    if (document.getElementById('termsList') && !document.getElementById('termsList').innerHTML) {
        render();
    }
    document.getElementById('flashcardWrapper')?.addEventListener('click', e => {
        if (!e.target.closest('button') && !e.target.closest('.btn-link')) flip();
    });
    document.getElementById('prevCardBtn')?.addEventListener('click', () => { if (i > 0) { i--; show(); } });
    document.getElementById('nextCardBtn')?.addEventListener('click', () => { if (i < cards.length - 1) { i++; show(); } });
    const edit = e => { e.stopPropagation(); if (setId) { localStorage.setItem('currentFlashcardSetId', setId); window.location.href = 'flashcards.html'; } };
    document.getElementById('editBtn')?.addEventListener('click', edit);
    document.getElementById('editBtnBack')?.addEventListener('click', edit);
    document.getElementById('hideDefinitionsBtn')?.addEventListener('click', () => {
        hideDefs = !hideDefs;
        document.querySelectorAll('.term-question').forEach(el => el.style.display = hideDefs ? 'none' : 'block');
        document.getElementById('hideDefinitionsBtn').textContent = hideDefs ? 'Show definitions' : 'Hide definitions';
    });
    window.startLearn = () => { if (setId) { localStorage.setItem('currentFlashcardSetId', setId); window.location.href = 'learn.html'; } };
});
