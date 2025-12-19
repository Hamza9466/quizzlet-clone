// Folder View JavaScript

// Load folder data from URL parameters
document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const folderId = urlParams.get('id');
    const folderName = urlParams.get('name');

    // Load folder from localStorage
    const folders = JSON.parse(localStorage.getItem('folders') || '[]');
    let folder = null;

    if (folderId) {
        folder = folders.find(f => f.id === folderId);
    } else if (folderName) {
        folder = folders.find(f => f.name === decodeURIComponent(folderName));
    }

    if (folder) {
        document.getElementById('folderTitle').textContent = folder.name;

        // Show popular section only for exam folders
        if (folder.isExam && folder.examName) {
            loadPopularStudySets(folder.examName);
        } else {
            document.getElementById('popularSection').style.display = 'none';
        }
    } else if (folderName) {
        // If folder name is provided but not found, use it anyway
        document.getElementById('folderTitle').textContent = decodeURIComponent(folderName);
        document.getElementById('popularSection').style.display = 'none';
    }

    // Load folders in sidebar
    if (typeof loadFoldersInSidebar === 'function') {
        loadFoldersInSidebar();
    }
});

function loadPopularStudySets(examName) {
    // Dummy data for popular study sets
    const popularSets = {
        'IELTS Academic': [
            { title: 'IELTS: Beginner Activities and Hobbies Vocabulary Set 1', cards: 51 },
            { title: 'IELTS: Beginner Anatomy, Health, and Beauty Vocabulary Set 1', cards: 58 },
            { title: 'IELTS: Beginner Business Vocabulary Set 1', cards: 47 },
            { title: 'IELTS: Beginner Cause and Effect Vocabulary Set 1', cards: 66 },
            { title: 'IELTS: Beginner Communication Vocabulary Set 1', cards: 62 }
        ],
        'SAT': [
            { title: 'SAT: Math Vocabulary Set 1', cards: 45 },
            { title: 'SAT: Reading Comprehension Set 1', cards: 52 },
            { title: 'SAT: Writing and Language Set 1', cards: 38 }
        ],
        'JEE Main': [
            { title: 'JEE Main: Physics Formulas Set 1', cards: 75 },
            { title: 'JEE Main: Chemistry Concepts Set 1', cards: 68 },
            { title: 'JEE Main: Mathematics Problems Set 1', cards: 82 }
        ],
        'ENEM': [
            { title: 'ENEM: Português Set 1', cards: 55 },
            { title: 'ENEM: Matemática Set 1', cards: 60 },
            { title: 'ENEM: História Set 1', cards: 48 }
        ]
    };

    const sets = popularSets[examName] || popularSets['IELTS Academic'];
    const popularList = document.getElementById('popularList');

    if (popularList) {
        popularList.innerHTML = sets.map(set => `
            <div class="popular-item">
                <i class="bi bi-card-text popular-item-icon"></i>
                <div class="popular-item-content">
                    <div class="popular-item-title">${set.title}</div>
                    <div class="popular-item-meta">${set.cards} cards • by Quizlet</div>
                </div>
                <button class="popular-item-add">
                    <i class="bi bi-plus-circle"></i>
                </button>
            </div>
        `).join('');
    }
}

// Add Study Materials Modal Functions
function showAddStudyMaterialsModal() {
    const modalElement = document.getElementById('addStudyMaterialsModal');
    if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
        loadStudyMaterialsSets('recents');
    }
}

function hideAddStudyMaterialsModal() {
    const modalElement = document.getElementById('addStudyMaterialsModal');
    if (modalElement) {
        const modal = bootstrap.Modal.getInstance(modalElement);
        if (modal) {
            modal.hide();
        }
    }
}

function loadStudyMaterialsSets(tab) {
    // Dummy data for flashcard sets
    const setsData = {
        recents: [
            { title: 'AECL 366 Exam 3', terms: 52, creator: 'JairoYeMu' },
            { title: 'biology chapter 2', terms: 2, creator: 'you' },
            { title: 'biology chapter 1', terms: 2, creator: 'you' },
            { title: 'Et quia perferendis doloremque dolores', terms: 25, creator: 'you' }
        ],
        library: [
            { title: 'My Study Set 1', terms: 30, creator: 'you' },
            { title: 'My Study Set 2', terms: 45, creator: 'you' },
            { title: 'My Study Set 3', terms: 20, creator: 'you' }
        ],
        others: [
            { title: 'Popular Set 1', terms: 50, creator: 'User1' },
            { title: 'Popular Set 2', terms: 35, creator: 'User2' },
            { title: 'Popular Set 3', terms: 60, creator: 'User3' }
        ]
    };

    const sets = setsData[tab] || setsData.recents;
    const setsList = document.getElementById('addStudySetsList');

    if (setsList) {
        setsList.innerHTML = sets.map(set => `
            <div class="d-flex align-items-center gap-3 p-3 rounded" style="background: #0A092D; border: 1px solid #586380; cursor: pointer; transition: all 0.2s ease;" onmouseover="this.style.background='#1a1a2e'; this.style.borderColor='#3b82f6';" onmouseout="this.style.background='#0A092D'; this.style.borderColor='#586380';">
                <i class="bi bi-card-text" style="font-size: 1.5rem; color: #60A5FA; flex-shrink: 0;"></i>
                <div class="flex-grow-1">
                    <div class="text-white fw-semibold mb-1" style="font-size: 0.875rem;">${set.title}</div>
                    <div class="text-secondary" style="font-size: 0.75rem;">Flashcard set • ${set.terms} terms • by ${set.creator}</div>
                </div>
                <button class="btn p-0 d-flex align-items-center justify-content-center rounded-circle" style="width: 32px; height: 32px; background: none; border: none; color: #ffffff; font-size: 1.25rem; flex-shrink: 0;" onmouseover="this.style.background='#586380'; this.style.color='#3b82f6';" onmouseout="this.style.background='none'; this.style.color='#ffffff';">
                    <i class="bi bi-plus-circle"></i>
                </button>
            </div>
        `).join('');
    }
}

// Tab switching for Add Study Materials Modal
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.add-study-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // Update active tab styling
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.background = '#0A092D';
                t.style.color = '#ffffff';
                t.style.borderColor = '#586380';
            });
            this.classList.add('active');
            this.style.background = '#3b82f6';
            this.style.color = '#ffffff';
            this.style.borderColor = '#3b82f6';

            // Load sets for selected tab
            const tabName = this.dataset.tab;
            loadStudyMaterialsSets(tabName);
        });
    });
});

// Folder Menu Functions
function toggleFolderMenu(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    const menu = document.getElementById('folderContextMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

function deleteFolder() {
    if (confirm('Are you sure you want to delete this folder? This action cannot be undone.')) {
        const urlParams = new URLSearchParams(window.location.search);
        const folderId = urlParams.get('id');
        const folderName = urlParams.get('name');
        
        if (folderId || folderName) {
            const folders = JSON.parse(localStorage.getItem('folders') || '[]');
            let updatedFolders;
            
            if (folderId) {
                updatedFolders = folders.filter(f => f.id !== folderId);
            } else if (folderName) {
                const decodedName = decodeURIComponent(folderName);
                updatedFolders = folders.filter(f => f.name !== decodedName);
            }
            
            localStorage.setItem('folders', JSON.stringify(updatedFolders));
            
            // Reload folders in sidebar if function exists
            if (typeof loadFoldersInSidebar === 'function') {
                loadFoldersInSidebar();
            }
            
            // Redirect to library page
            window.location.href = 'library.html';
        }
    }
    closeFolderMenu();
}

function closeFolderMenu() {
    const menu = document.getElementById('folderContextMenu');
    if (menu) {
        menu.classList.remove('show');
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    const menu = document.getElementById('folderContextMenu');
    const menuBtn = document.querySelector('.folder-menu-btn');
    if (menu && menuBtn && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menu.classList.remove('show');
    }
});

// Make functions globally accessible
window.showAddStudyMaterialsModal = showAddStudyMaterialsModal;
window.hideAddStudyMaterialsModal = hideAddStudyMaterialsModal;
window.toggleFolderMenu = toggleFolderMenu;
window.deleteFolder = deleteFolder;

