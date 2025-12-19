// Library Page JavaScript

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

    // Load flashcard sets
    loadLibrarySets();

    // Search functionality
    const searchInput = document.getElementById('librarySearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            const query = e.target.value.trim().toLowerCase();
            filterLibrarySets(query);
        });
    }

    // Tab switching
    const tabs = document.querySelectorAll('.library-tab');
    const tabContents = document.querySelectorAll('.library-tab-content');
    
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', function () {
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Show corresponding content based on tab index
            const tabNames = ['flashcards', 'classes', 'folders', 'practiceTests', 'expertSolutions'];
            if (index < tabNames.length) {
                const contentId = tabNames[index] + 'Tab';
                const content = document.getElementById(contentId);
                if (content) {
                    content.classList.add('active');
                    
                    // Load folders when Folders tab is clicked
                    if (tabNames[index] === 'folders') {
                        loadLibraryFolders();
                    }
                }
            }
        });
    });
    
    // Load folders on page load if Folders tab is active
    const foldersTab = document.querySelector('.library-tab[data-tab="folders"]');
    if (foldersTab && foldersTab.classList.contains('active')) {
        loadLibraryFolders();
    }

    // Recent dropdown functionality
    const recentBtn = document.getElementById('recentBtn');
    const recentDropdown = document.getElementById('recentDropdownMenu');
    const recentBtnText = document.getElementById('recentBtnText');
    const recentDropdownItems = document.querySelectorAll('.recent-dropdown-item');

    if (recentBtn && recentDropdown) {
        recentBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            recentDropdown.classList.toggle('show');
        });

        // Handle dropdown item selection
        recentDropdownItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.stopPropagation();
                const sortType = this.dataset.sort;
                
                // Update active state
                recentDropdownItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');
                
                // Update button text
                recentBtnText.textContent = this.textContent;
                
                // Sort and reload sets
                sortLibrarySets(sortType);
                
                // Close dropdown
                recentDropdown.classList.remove('show');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function (e) {
            if (!recentBtn.contains(e.target) && !recentDropdown.contains(e.target)) {
                recentDropdown.classList.remove('show');
            }
        });
    }
});

let currentSortType = 'recent';

function loadLibrarySets() {
    const savedSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
    
    // If no sets, show dummy data
    let setsToDisplay = savedSets;
    if (setsToDisplay.length === 0) {
        setsToDisplay = getDummySets();
    }

    sortLibrarySets(currentSortType, setsToDisplay);
}

function sortLibrarySets(sortType, setsToDisplay = null) {
    currentSortType = sortType;
    
    if (!setsToDisplay) {
        const savedSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
        setsToDisplay = savedSets.length > 0 ? savedSets : getDummySets();
    }

    const grid = document.getElementById('librarySetsGrid');
    const sectionTitle = document.getElementById('sectionTitle');

    if (!grid) return;

    // Sort based on selected type
    if (sortType === 'created') {
        // Sort by creation date (newest first)
        setsToDisplay.sort((a, b) => {
            const dateA = new Date(a.createdAt || a.lastStudied || Date.now());
            const dateB = new Date(b.createdAt || b.lastStudied || Date.now());
            return dateB - dateA;
        });
    } else if (sortType === 'recent') {
        // Sort by last studied (most recent first)
        setsToDisplay.sort((a, b) => {
            const dateA = new Date(a.lastStudied || a.createdAt || Date.now());
            const dateB = new Date(b.lastStudied || b.createdAt || Date.now());
            return dateB - dateA;
        });
    } else if (sortType === 'studied') {
        // Sort by most studied (most cards first, then by last studied)
        setsToDisplay.sort((a, b) => {
            const countA = a.flashcards ? a.flashcards.length : 0;
            const countB = b.flashcards ? b.flashcards.length : 0;
            if (countB !== countA) {
                return countB - countA;
            }
            const dateA = new Date(a.lastStudied || a.createdAt || Date.now());
            const dateB = new Date(b.lastStudied || b.createdAt || Date.now());
            return dateB - dateA;
        });
    }

    // Update section title based on date
    if (setsToDisplay.length > 0) {
        const mostRecent = new Date(setsToDisplay[0].lastStudied || setsToDisplay[0].createdAt || Date.now());
        const today = new Date();
        if (mostRecent.toDateString() === today.toDateString()) {
            sectionTitle.textContent = 'TODAY';
        } else {
            sectionTitle.textContent = 'RECENT';
        }
    }

    displaySets(setsToDisplay);
}

function getDummySets() {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(now);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    return [
        {
            id: 'dummy-1',
            title: 'biology chapter 2',
            flashcards: Array(2).fill(null),
            lastStudied: now.toISOString(),
            createdAt: twoDaysAgo.toISOString(),
            createdBy: 'M_Hamza80'
        },
        {
            id: 'dummy-2',
            title: 'biology chapter 1',
            flashcards: Array(5).fill(null),
            lastStudied: yesterday.toISOString(),
            createdAt: twoDaysAgo.toISOString(),
            createdBy: 'M_Hamza80'
        },
        {
            id: 'dummy-3',
            title: 'Et quia perferendis doloremque dolores',
            flashcards: Array(10).fill(null),
            lastStudied: now.toISOString(),
            createdAt: now.toISOString(),
            createdBy: 'M_Hamza80'
        },
        {
            id: 'dummy-4',
            title: 'biology',
            flashcards: Array(3).fill(null),
            lastStudied: yesterday.toISOString(),
            createdAt: yesterday.toISOString(),
            createdBy: 'M_Hamza80'
        }
    ];
}

function displaySets(sets) {
    const grid = document.getElementById('librarySetsGrid');
    if (!grid) return;

    if (sets.length === 0) {
        grid.innerHTML = '<p style="color: #9ca3af; grid-column: 1 / -1; text-align: center; padding: 2rem;">No flashcard sets found.</p>';
        return;
    }

    grid.innerHTML = sets.map(set => {
        const cardCount = set.flashcards ? set.flashcards.length : 0;
        const username = set.createdBy || 'M_Hamza80';
        const initials = username.substring(0, 2).toUpperCase();

        return `
            <div class="library-set-card" onclick="openFlashcardSet('${set.id}')">
                <div class="library-set-meta">
                    <span>${cardCount} terms</span>
                    <span class="library-set-meta-separator"></span>
                    <div class="library-set-user">
                        <div class="library-set-avatar">${initials}</div>
                        <span>${username}</span>
                    </div>
                </div>
                <h3 class="library-set-title">${set.title}</h3>
            </div>
        `;
    }).join('');
}

function filterLibrarySets(query) {
    const savedSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');
    let setsToDisplay = savedSets.length > 0 ? savedSets : getDummySets();

    if (query) {
        const queryLower = query.toLowerCase();
        setsToDisplay = setsToDisplay.filter(set =>
            set.title.toLowerCase().includes(queryLower)
        );
    }

    // Apply current sort after filtering
    sortLibrarySets(currentSortType, setsToDisplay);
}

// Load and display folders in library
function loadLibraryFolders() {
    const folders = JSON.parse(localStorage.getItem('folders') || '[]');
    const emptyState = document.getElementById('foldersEmptyState');
    const foldersGrid = document.getElementById('libraryFoldersGrid');
    
    if (!emptyState || !foldersGrid) return;
    
    if (folders.length === 0) {
        emptyState.style.display = 'flex';
        foldersGrid.style.display = 'none';
        return;
    }
    
    emptyState.style.display = 'none';
    foldersGrid.style.display = 'grid';
    
    foldersGrid.innerHTML = folders.map(folder => {
        const createdDate = new Date(folder.createdAt);
        const formattedDate = createdDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const folderName = encodeURIComponent(folder.name);
        
        return `
            <div class="library-folder-card-wrapper" style="position: relative;">
                <a href="folder-view.html?id=${folder.id}&name=${folderName}" class="library-set-card" style="text-decoration: none; display: block;">
                    <div class="library-set-meta">
                        <span>Created ${formattedDate}</span>
                    </div>
                    <h3 class="library-set-title">
                        <i class="bi bi-folder" style="margin-right: 0.5rem;"></i>
                        ${folder.name}
                    </h3>
                </a>
                <button class="library-folder-menu-btn" onclick="toggleLibraryFolderMenu(event, '${folder.id}')">
                    <i class="bi bi-three-dots-vertical"></i>
                </button>
                <div class="library-folder-context-menu" id="folderMenu_${folder.id}">
                    <button class="library-folder-menu-item delete" onclick="deleteLibraryFolder(event, '${folder.id}')">
                        <i class="bi bi-trash"></i>
                        <span>Delete</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Folder menu functions
function toggleLibraryFolderMenu(event, folderId) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    // Close all other menus
    document.querySelectorAll('.library-folder-context-menu').forEach(menu => {
        if (menu.id !== `folderMenu_${folderId}`) {
            menu.classList.remove('show');
        }
    });
    
    const menu = document.getElementById(`folderMenu_${folderId}`);
    if (menu) {
        menu.classList.toggle('show');
    }
}

function deleteLibraryFolder(event, folderId) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    
    if (confirm('Are you sure you want to delete this folder? This action cannot be undone.')) {
        const folders = JSON.parse(localStorage.getItem('folders') || '[]');
        const updatedFolders = folders.filter(f => f.id !== folderId);
        localStorage.setItem('folders', JSON.stringify(updatedFolders));
        
        // Reload folders in library
        loadLibraryFolders();
        
        // Reload folders in sidebar if function exists
        if (typeof loadFoldersInSidebar === 'function') {
            loadFoldersInSidebar();
        }
    }
    
    // Close menu
    const menu = document.getElementById(`folderMenu_${folderId}`);
    if (menu) {
        menu.classList.remove('show');
    }
}

// Close menu when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.library-folder-menu-btn') && !e.target.closest('.library-folder-context-menu')) {
        document.querySelectorAll('.library-folder-context-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// Make functions globally available
window.loadLibraryFolders = loadLibraryFolders;
window.toggleLibraryFolderMenu = toggleLibraryFolderMenu;
window.deleteLibraryFolder = deleteLibraryFolder;

window.openFlashcardSet = function (setId) {
    localStorage.setItem('currentFlashcardSetId', setId);
    window.location.href = 'flashcard-view.html';
};

