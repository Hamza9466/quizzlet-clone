// Theme Management - Shared across all admin pages

// Load and apply theme on page load
function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
}

// Apply theme to the page
function applyTheme(theme) {
    const body = document.body;
    const html = document.documentElement;
    
    if (theme === 'light') {
        body.classList.add('light-theme');
        html.classList.add('light-theme');
        // Apply to specific elements
        document.querySelector('.dashboard-header')?.classList.add('light-theme');
        document.querySelector('.dashboard-sidebar')?.classList.add('light-theme');
        document.querySelector('.dashboard-main')?.classList.add('light-theme');
    } else {
        // Dark theme (default)
        body.classList.remove('light-theme');
        html.classList.remove('light-theme');
        document.querySelector('.dashboard-header')?.classList.remove('light-theme');
        document.querySelector('.dashboard-sidebar')?.classList.remove('light-theme');
        document.querySelector('.dashboard-main')?.classList.remove('light-theme');
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    return newTheme;
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTheme();
    
    // Add click handler to light mode toggle in profile dropdown
    // Try multiple selectors to find the light mode toggle
    const lightModeSelectors = [
        '.dropdown-item[data-i18n="lightMode"]',
        '.dropdown-item:has(span[data-i18n="lightMode"])',
        '.dropdown-item:has([data-i18n="lightMode"])',
        'a.dropdown-item:has(i.bi-sun)'
    ];
    
    let lightModeToggle = null;
    for (const selector of lightModeSelectors) {
        lightModeToggle = document.querySelector(selector);
        if (lightModeToggle) break;
    }
    
    // Also try finding by text content
    if (!lightModeToggle) {
        const allDropdownItems = document.querySelectorAll('.dropdown-item');
        allDropdownItems.forEach(item => {
            const text = item.textContent.trim().toLowerCase();
            if (text.includes('light mode') || text.includes('lightmode')) {
                lightModeToggle = item;
            }
        });
    }
    
    if (lightModeToggle) {
        lightModeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleTheme();
        });
    }
});

