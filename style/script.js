document.addEventListener('DOMContentLoaded', () => {
    const s = document.getElementById('cardsSlider'), p = document.getElementById('prevBtn'), n = document.getElementById('nextBtn'), c = document.querySelectorAll('.study-card-link');
    if (!s || !p || !n || !c.length) return;
    let i = 0;
    const v = () => window.innerWidth < 768 ? 2 : 4;
    const w = () => c[0].offsetWidth + 24, u = () => {
        const m = Math.max(0, c.length - v());
        i = Math.min(i, m);
        s.style.transform = `translateX(${-i * w()}px)`;
        p.classList.toggle('disabled', !i);
        n.classList.toggle('disabled', i >= m);
    };
    p.onclick = () => i > 0 && u(--i);
    n.onclick = () => i < Math.max(0, c.length - v()) && u(++i);
    window.onresize = () => setTimeout(u, 250);
    setTimeout(u, 100);

    // Flashcard Sets Pagination
    const fp = document.getElementById('flashcardPrevBtn'), fn = document.getElementById('flashcardNextBtn'), ft = document.getElementById('flashcardPageText'), fc = document.querySelectorAll('.flashcard-sets-row > div');
    if (!fp || !fn || !ft || !fc.length) return;
    let cp = 0, pp = 6, tp = Math.ceil(fc.length / pp);
    const showPage = (p) => {
        fc.forEach((el, idx) => {
            const card = el.querySelector('.flashcard-card');
            if (idx >= p * pp && idx < (p + 1) * pp) {
                el.style.display = 'block';
                if (card) {
                    card.classList.remove('fade-out');
                    card.style.animationDelay = `${(idx % pp) * 0.1}s`;
                }
            } else {
                if (card) card.classList.add('fade-out');
                setTimeout(() => el.style.display = 'none', 300);
            }
        });
        ft.textContent = `${p + 1}/${tp}`;
        fp.classList.toggle('disabled', !p);
        fn.classList.toggle('disabled', p >= tp - 1);
    };
    fp.onclick = () => cp > 0 && showPage(--cp);
    fn.onclick = () => cp < tp - 1 && showPage(++cp);
    showPage(0);
});
