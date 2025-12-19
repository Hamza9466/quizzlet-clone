// Shared Modal Functions

// New Folder Modal Functions
window.showNewFolderModal = function(e) {
    if (e) e.preventDefault();
    const modal = document.getElementById('newFolderModal');
    const input = document.getElementById('newFolderInput');
    const createBtn = document.getElementById('newFolderCreateBtn');
    
    if (modal) {
        modal.style.display = 'flex';
        if (input) {
            input.value = '';
            setTimeout(() => input.focus(), 100);
        }
        if (createBtn) {
            createBtn.disabled = true;
        }
    }
};

window.hideNewFolderModal = function() {
    const modal = document.getElementById('newFolderModal');
    const input = document.getElementById('newFolderInput');
    if (modal) {
        modal.style.display = 'none';
    }
    if (input) {
        input.value = '';
    }
};

window.createNewFolder = function() {
    const input = document.getElementById('newFolderInput');
    if (!input) return;
    
    const folderName = input.value.trim();
    if (!folderName) return;
    
    // Save folder to localStorage
    const folders = JSON.parse(localStorage.getItem('folders') || '[]');
    const newFolder = {
        id: 'folder-' + Date.now(),
        name: folderName,
        createdAt: new Date().toISOString(),
        pinned: true // New folders are pinned by default
    };
    folders.push(newFolder);
    localStorage.setItem('folders', JSON.stringify(folders));
    
    // Close modal
    hideNewFolderModal();
    
    // Refresh folder list in sidebar
    loadFoldersInSidebar();
    
    // Refresh library folders if on library page
    if (typeof loadLibraryFolders === 'function') {
        loadLibraryFolders();
    }
    
    // Show success message or update UI
    alert(`Folder "${folderName}" created successfully!`);
};

// Load and display folders in sidebar (only pinned folders)
function loadFoldersInSidebar() {
    const foldersList = document.getElementById('foldersList');
    if (!foldersList) return;
    
    const folders = JSON.parse(localStorage.getItem('folders') || '[]');
    const pinnedFolders = folders.filter(folder => folder.pinned !== false);
    
    if (pinnedFolders.length === 0) {
        foldersList.innerHTML = '';
        return;
    }
    
    foldersList.innerHTML = pinnedFolders.map(folder => {
        return `
            <div class="nav-item folder-item-wrapper" data-folder-id="${folder.id}">
                <a href="#" class="nav-item folder-item">
                    <i class="bi bi-folder"></i>
                    <span>${folder.name}</span>
                </a>
                <button class="folder-menu-btn" onclick="toggleFolderMenu('${folder.id}', event)">
                    <i class="bi bi-three-dots-vertical"></i>
                </button>
                <div class="folder-context-menu" id="folderMenu${folder.id}">
                    <button class="folder-menu-item" onclick="unpinFolder('${folder.id}')">
                        <i class="bi bi-pin-angle"></i>
                        <span>Unpin from sidebar</span>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Toggle folder context menu
window.toggleFolderMenu = function(folderId, event) {
    if (event) event.stopPropagation();
    
    // Close all other menus
    document.querySelectorAll('.folder-context-menu').forEach(menu => {
        if (menu.id !== `folderMenu${folderId}`) {
            menu.classList.remove('show');
        }
    });
    
    // Toggle current menu
    const menu = document.getElementById(`folderMenu${folderId}`);
    if (menu) {
        menu.classList.toggle('show');
    }
};

// Unpin folder from sidebar
window.unpinFolder = function(folderId) {
    const folders = JSON.parse(localStorage.getItem('folders') || '[]');
    const folder = folders.find(f => f.id === folderId);
    
    if (folder) {
        folder.pinned = false;
        localStorage.setItem('folders', JSON.stringify(folders));
        loadFoldersInSidebar();
    }
    
    // Close menu
    const menu = document.getElementById(`folderMenu${folderId}`);
    if (menu) {
        menu.classList.remove('show');
    }
};

// Close folder menus when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.folder-item-wrapper')) {
        document.querySelectorAll('.folder-context-menu').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

// Load folders on page load
document.addEventListener('DOMContentLoaded', function() {
    loadFoldersInSidebar();
});

// Initialize modal input handler
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('newFolderInput');
    const createBtn = document.getElementById('newFolderCreateBtn');
    
    if (input && createBtn) {
        input.addEventListener('input', function() {
            const value = this.value.trim();
            createBtn.disabled = !value;
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !createBtn.disabled) {
                createNewFolder();
            }
        });
    }
});

