// Test Page JavaScript
let c = 0, t = 2, q = [], a = [], s = null;

function load() {
    const id = localStorage.getItem('currentFlashcardSetId');
    if (id) {
        const set = JSON.parse(localStorage.getItem('flashcardSets') || '[]').find(x => x.id === id);
        if (set?.flashcards) {
            q = set.flashcards.map(x => ({ q: x.term || 'No question', a: x.definition || 'No answer', d: getD(x.definition, set.flashcards) }));
            t = q.length;
            document.getElementById('testSetTitle').textContent = set.title || 'Untitled';
        }
    }
    if (!q.length) q = [{ q: 'question 1', a: 'answer 1', d: ['distractor 1', 'distractor 2', 'distractor 3'] }, { q: 'question 2', a: 'answer 2', d: ['distractor 1', 'distractor 2', 'distractor 3'] }];
    render();
}

function getD(correct, all) {
    const d = all.filter(x => x.definition !== correct).sort(() => Math.random() - 0.5).slice(0, 3);
    while (d.length < 3) d.push(`distractor ${d.length + 1}`);
    return d;
}

function render() {
    const el = document.getElementById('testQuestionsContainer');
    if (!el) return;
    el.innerHTML = q.map((x, i) => {
        const opts = [x.a, ...x.d].sort(() => Math.random() - 0.5);
        const ci = opts.indexOf(x.a);
        return `<div class="test-card"><div class="test-question-header"><div><h3 class="test-question-label"><span>Definition</span><button class="btn btn-link text-white p-0" style="font-size: 1rem;"><i class="bi bi-volume-up"></i></button></h3></div><div class="test-question-number">${i + 1} of ${q.length}</div></div><div class="test-question-text">${x.q}</div><div class="test-instruction">Choose an answer</div><div class="test-answers-grid">${opts.map((o, idx) => `<button class="test-answer-btn" onclick="select(this, ${i}, ${idx === ci})">${o}</button>`).join('')}</div><div class="test-dont-know"><button class="test-dont-know-btn" onclick="skip(${i})">Don't know?</button></div></div>`;
    }).join('');
    update();
}

function select(btn, idx, ok) {
    const card = btn.closest('.test-card');
    card.querySelectorAll('.test-answer-btn').forEach(b => { b.disabled = true; if (b === btn) b.style.background = ok ? '#10b981' : '#ef4444'; });
    a[idx] = { q: q[idx].q, s: btn.textContent, c: ok };
    c = a.filter(x => x?.c).length;
    update();
    if (a.length === q.length && a.every(x => x)) {
        const el = document.getElementById('testCompletionSection');
        if (el) { el.style.display = 'block'; setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300); }
    }
}

function skip(idx) {
    document.querySelectorAll('.test-card')[idx]?.querySelectorAll('.test-answer-btn').forEach(b => b.disabled = true);
    a[idx] = { q: q[idx].q, s: null, c: false };
    c = a.filter(x => x?.c).length;
    update();
    if (a.length === q.length && a.every(x => x)) {
        const el = document.getElementById('testCompletionSection');
        if (el) { el.style.display = 'block'; setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300); }
    }
}

function update() {
    document.getElementById('testScore').textContent = `${c} / ${t}`;
}

function submit() {
    document.getElementById('testQuestionsContainer').style.display = 'none';
    document.getElementById('testCompletionSection').style.display = 'none';
    const r = document.getElementById('testResultsSection');
    r.style.display = 'block';
    const time = s ? Math.max(1, Math.floor((Date.now() - s) / 60000)) : 1;
    const pct = Math.round((c / t) * 100) || 0;
    const circ = 2 * Math.PI * 85;
    document.getElementById('testTimeDisplay').textContent = `${time} min.`;
    document.getElementById('progressPercentage').textContent = `${pct}%`;
    const pc = document.getElementById('progressCircle');
    pc.style.strokeDasharray = circ;
    pc.style.strokeDashoffset = circ - (pct / 100) * circ;
    document.getElementById('correctCount').textContent = c;
    document.getElementById('incorrectCount').textContent = t - c;
    document.getElementById('testAnswersList').innerHTML = a.map(x => `<div class="test-answer-item"><div class="test-answer-question">${x.q}</div><div class="test-answer-result ${x.c ? 'correct' : 'incorrect'}"><i class="bi ${x.c ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}"></i><span>${x.s || 'Not answered'}</span></div></div>`).join('');
    setTimeout(() => r.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
}

function retest() {
    const missed = a.map((x, i) => !x.c ? q[i] : null).filter(x => x);
    if (missed.length) { localStorage.setItem('missedTerms', JSON.stringify(missed)); window.location.reload(); }
}

document.addEventListener('DOMContentLoaded', () => { s = Date.now(); load(); });
window.selectAnswer = select;
window.dontKnow = skip;
window.submitTest = submit;
window.retestMissedTerms = retest;
