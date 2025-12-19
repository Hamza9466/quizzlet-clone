// Expert Solutions Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Sidebar Toggle
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const mainContent = document.querySelector('.expert-solutions-container');

    if (menuToggleBtn && sidebar && mainContent) {
        menuToggleBtn.addEventListener('click', function () {
            sidebar.classList.toggle('closed');
            mainContent.classList.toggle('sidebar-closed');
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

        document.addEventListener('click', function (e) {
            if (!profileIcon.contains(e.target) && !profileDropdown.contains(e.target)) {
                profileDropdown.classList.remove('show');
            }
        });

        profileDropdown.addEventListener('click', function (e) {
            e.stopPropagation();
        });
    }

    // Load folders in sidebar
    if (typeof loadFoldersInSidebar === 'function') {
        loadFoldersInSidebar();
    }

    // Subject filter functionality
    const subjectButtons = document.querySelectorAll('.subject-filter-btn');
    const textbooksGrid = document.getElementById('textbooksGrid');
    const currentSubjectSpan = document.getElementById('currentSubject');
    let currentSubject = 'chemistry';

    // Load textbooks for a subject
    function loadTextbooks(subject) {
        const textbooks = getTextbooksBySubject(subject);
        if (!textbooksGrid) return;

        textbooksGrid.innerHTML = textbooks.map(book => `
            <div class="textbook-card">
                <div class="textbook-cover">
                    ${book.coverImage ? 
                        `<img src="../../../assets/admin/images/${book.coverImage}" alt="${book.title}" class="textbook-cover-img">` :
                        `<div class="textbook-cover-placeholder" style="background: ${book.coverColor};">
                            <div class="textbook-cover-title" style="color: ${book.coverTitleColor || '#ffffff'};">${book.coverTitle}</div>
                        </div>`
                    }
                </div>
                <div class="textbook-info">
                    <h3 class="textbook-title">${book.title}</h3>
                    <div class="textbook-meta">
                        <span class="textbook-edition">${book.edition} Edition</span>
                        <span class="textbook-separator"> • </span>
                        <span class="textbook-isbn">ISBN: ${book.isbn}</span>
                        ${book.moreIsbns ? `<span class="textbook-more">(${book.moreIsbns} more)</span>` : ''}
                    </div>
                    <div class="textbook-authors">${book.authors}</div>
                    <button class="textbook-solutions-btn">
                        <i class="bi bi-check-circle-fill"></i>
                        ${book.solutions} solutions
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Get textbooks by subject
    function getTextbooksBySubject(subject) {
        const allTextbooks = {
            chemistry: [
                {
                    title: 'Chemistry: The Central Science',
                    edition: '14th',
                    isbn: '9780134414232',
                    moreIsbns: null,
                    authors: 'Bruce Edward Bursten, Catherine J. Murphy, H. Eugene Lemay, ...',
                    solutions: '7,761',
                    coverImage: '68266c9a4540ed680807226bd916f7f0.jpg'
                },
                {
                    title: 'Chemistry: The Molecular Nature of Matter and Change',
                    edition: '7th',
                    isbn: '9780073511177',
                    moreIsbns: '3',
                    authors: 'Patricia Amateis, Silberberg',
                    solutions: '6,026',
                    coverImage: '01f2cb11cccaa71c2046942b214683b8.jpg'
                },
                {
                    title: 'Modern Chemistry',
                    edition: '1st',
                    isbn: '9780547586632',
                    moreIsbns: '2',
                    authors: 'Jerry L. Sarquis, Mickey Sarquis',
                    solutions: '2,181',
                    coverImage: '7ca53b5c03305e2c62540a91f5f38a3b.jpg'
                },
                {
                    title: 'Atkins\' Physical Chemistry',
                    edition: '11th',
                    isbn: '9780198769866',
                    moreIsbns: null,
                    authors: 'James Keeler, Julio de Paula, Peter Atkins',
                    solutions: '1,689',
                    coverImage: '68266c9a4540ed680807226bd916f7f0.jpg'
                },
                {
                    title: 'Organic Chemistry',
                    edition: '8th',
                    isbn: '9781305580350',
                    moreIsbns: '1',
                    authors: 'Brent L. Iverson, Christopher S. Foote, Eric Anslyn, William H. B...',
                    solutions: '3,328',
                    coverImage: '01f2cb11cccaa71c2046942b214683b8.jpg'
                },
                {
                    title: 'Organic Chemistry',
                    edition: '3rd',
                    isbn: '9781119316152',
                    moreIsbns: '4',
                    authors: 'David Klein',
                    solutions: '3,045',
                    coverImage: '7ca53b5c03305e2c62540a91f5f38a3b.jpg'
                }
            ],
            calculus: [
                {
                    title: 'Calculus: Early Transcendentals',
                    edition: '8th',
                    isbn: '9781285741550',
                    moreIsbns: null,
                    authors: 'James Stewart',
                    solutions: '5,234',
                    coverImage: '68266c9a4540ed680807226bd916f7f0.jpg'
                },
                {
                    title: 'Calculus: A Complete Course',
                    edition: '9th',
                    isbn: '9780134154367',
                    moreIsbns: '2',
                    authors: 'Robert A. Adams, Christopher Essex',
                    solutions: '4,567',
                    coverImage: '01f2cb11cccaa71c2046942b214683b8.jpg'
                }
            ],
            physics: [
                {
                    title: 'University Physics',
                    edition: '14th',
                    isbn: '9780133969290',
                    moreIsbns: null,
                    authors: 'Hugh D. Young, Roger A. Freedman',
                    solutions: '6,789',
                    coverImage: '7ca53b5c03305e2c62540a91f5f38a3b.jpg'
                }
            ]
        };

        return allTextbooks[subject] || allTextbooks.chemistry;
    }

    // Handle subject filter clicks
    subjectButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active state
            subjectButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            // Update current subject
            currentSubject = this.dataset.subject;
            const subjectName = this.textContent;
            if (currentSubjectSpan) {
                currentSubjectSpan.textContent = subjectName;
            }

            // Load textbooks for selected subject
            loadTextbooks(currentSubject);
        });
    });

    // Load initial textbooks
    loadTextbooks('chemistry');
});

// FAQ Accordion Toggle
window.toggleFaq = function(button) {
    const faqItem = button.closest('.faq-item');
    const isActive = faqItem.classList.contains('active');
    const icon = button.querySelector('i');
    
    // Close all other FAQs
    document.querySelectorAll('.faq-item').forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
            const otherIcon = item.querySelector('.faq-question i');
            if (otherIcon) {
                otherIcon.classList.remove('bi-chevron-up');
                otherIcon.classList.add('bi-chevron-down');
            }
        }
    });
    
    // Toggle current FAQ
    if (isActive) {
        faqItem.classList.remove('active');
        icon.classList.remove('bi-chevron-up');
        icon.classList.add('bi-chevron-down');
    } else {
        faqItem.classList.add('active');
        icon.classList.remove('bi-chevron-down');
        icon.classList.add('bi-chevron-up');
    }
};

