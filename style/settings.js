// Settings Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Sidebar Toggle
    const menuToggleBtn = document.querySelector('.menu-toggle-btn');
    const sidebar = document.querySelector('.dashboard-sidebar');
    const mainContent = document.querySelector('.dashboard-main');

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

    // Avatar selection
    const avatarItems = document.querySelectorAll('.avatar-item:not(.add-avatar)');
    const currentAvatarImg = document.querySelector('.current-avatar-img');
    const addAvatarBtn = document.getElementById('addAvatarBtn');
    const avatarUpload = document.getElementById('avatarUpload');
    const avatarGrid = document.querySelector('.avatar-grid');

    // Function to update avatar selection
    function updateAvatarSelection(selectedItem) {
        const allItems = document.querySelectorAll('.avatar-item:not(.add-avatar)');
        allItems.forEach(av => av.classList.remove('selected'));
        if (selectedItem) {
            selectedItem.classList.add('selected');
        }
    }

    avatarItems.forEach(item => {
        item.addEventListener('click', function () {
            updateAvatarSelection(this);

            // Update current avatar
            const clickedImg = this.querySelector('.avatar-img');
            if (clickedImg && currentAvatarImg) {
                currentAvatarImg.src = clickedImg.src;
            }
        });
    });

    // Avatar upload functionality
    if (addAvatarBtn && avatarUpload) {
        addAvatarBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            avatarUpload.click();
        });

        avatarUpload.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(event) {
                    const imageUrl = event.target.result;
                    
                    // Create new avatar item
                    const newAvatarItem = document.createElement('div');
                    newAvatarItem.className = 'avatar-item uploaded';
                    newAvatarItem.innerHTML = `
                        <img src="${imageUrl}" alt="Avatar" class="avatar-img">
                        <button class="avatar-delete-btn" type="button">
                            <i class="bi bi-x"></i>
                        </button>
                    `;
                    
                    // Insert before the add-avatar button
                    if (addAvatarBtn && addAvatarBtn.parentNode) {
                        addAvatarBtn.parentNode.insertBefore(newAvatarItem, addAvatarBtn);
                    }
                    
                    // Add click handler to new avatar (for selection)
                    newAvatarItem.addEventListener('click', function(e) {
                        // Don't trigger selection if clicking delete button
                        if (e.target.closest('.avatar-delete-btn')) {
                            return;
                        }
                        updateAvatarSelection(this);
                        
                        // Update current avatar
                        const clickedImg = this.querySelector('.avatar-img');
                        if (clickedImg && currentAvatarImg) {
                            currentAvatarImg.src = clickedImg.src;
                        }
                    });
                    
                    // Add delete handler
                    const deleteBtn = newAvatarItem.querySelector('.avatar-delete-btn');
                    if (deleteBtn) {
                        deleteBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            
                            // Check if this avatar is currently selected
                            const isSelected = newAvatarItem.classList.contains('selected');
                            const avatarImg = newAvatarItem.querySelector('.avatar-img');
                            
                            // If this avatar is selected, reset to first default avatar
                            if (isSelected && currentAvatarImg) {
                                const firstDefaultAvatar = document.querySelector('.avatar-item:not(.uploaded):not(.add-avatar) .avatar-img');
                                if (firstDefaultAvatar) {
                                    currentAvatarImg.src = firstDefaultAvatar.src;
                                    updateAvatarSelection(firstDefaultAvatar.closest('.avatar-item'));
                                }
                            }
                            
                            // Remove the avatar item
                            newAvatarItem.remove();
                        });
                    }
                    
                    // Select and update current avatar to the new one
                    updateAvatarSelection(newAvatarItem);
                    if (currentAvatarImg) {
                        currentAvatarImg.src = imageUrl;
                    }
                    
                    // Reset file input
                    avatarUpload.value = '';
                };
                
                reader.readAsDataURL(file);
            } else {
                alert('Please select a valid image file.');
            }
        });
    }

    // Theme switching
    const themeDropdown = document.getElementById('themeDropdown');
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeButton = themeDropdown ? themeDropdown.querySelector('button') : null;

    // Load saved theme or default to dark
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    updateThemeButton(savedTheme);

    themeOptions.forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            const theme = this.getAttribute('data-theme');
            applyTheme(theme);
            updateThemeButton(theme);
            localStorage.setItem('theme', theme);
        });
    });

    function applyTheme(theme) {
        const body = document.body;
        const html = document.documentElement;

        if (theme === 'light') {
            body.classList.add('light-theme');
            html.classList.add('light-theme');
        } else {
            // Dark theme (default)
            body.classList.remove('light-theme');
            html.classList.remove('light-theme');
        }
    }

    function updateThemeButton(theme) {
        if (themeButton) {
            const themeText = theme.charAt(0).toUpperCase() + theme.slice(1);
            themeButton.innerHTML = themeText + ' <i class="bi bi-chevron-down"></i>';
        }
    }

    // Language switching
    const languageDropdown = document.getElementById('languageDropdown');
    const languageOptions = document.querySelectorAll('.language-option');
    const languageButton = languageDropdown ? languageDropdown.querySelector('button') : null;

    // Load saved language or default to English (UK)
    const savedLanguage = localStorage.getItem('language') || 'en-uk';
    applyLanguage(savedLanguage);
    updateLanguageButton(savedLanguage);

    languageOptions.forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            const lang = this.getAttribute('data-lang');
            // Apply language immediately
            applyLanguage(lang);
            updateLanguageButton(lang);
            localStorage.setItem('language', lang);
        });
    });

    function updateLanguageButton(lang) {
        if (languageButton) {
            // Use languageNames from translations.js if available
            const langName = (typeof languageNames !== 'undefined' && languageNames[lang]) 
                ? languageNames[lang] 
                : (lang === 'en-uk' ? 'English (UK)' : lang);
            languageButton.innerHTML = langName + ' <i class="bi bi-chevron-down"></i>';
        }
    }

    // Notification toggle functionality
    const notificationIcons = document.querySelectorAll('.notification-icon');
    notificationIcons.forEach(icon => {
        icon.addEventListener('click', function(e) {
            e.stopPropagation();
            this.classList.toggle('active');
            this.classList.toggle('inactive');
        });
    });

    // Notification group collapse functionality
    const notificationGroupHeaders = document.querySelectorAll('.notification-group-header');
    notificationGroupHeaders.forEach(header => {
        header.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            const target = document.querySelector(targetId);
            const chevron = this.querySelector('.notification-chevron');
            
            if (target) {
                const isExpanded = !target.classList.contains('show');
                if (isExpanded) {
                    target.classList.add('show');
                    this.setAttribute('aria-expanded', 'true');
                } else {
                    target.classList.remove('show');
                    this.setAttribute('aria-expanded', 'false');
                }
            }
        });
    });

    // Privacy toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch');
    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('click', function() {
            this.classList.toggle('active');
        });
    });

    // Create Password Modal
    const openPasswordModal = document.getElementById('openPasswordModal');
    const closePasswordModal = document.getElementById('closePasswordModal');
    const cancelPasswordModal = document.getElementById('cancelPasswordModal');
    const createPasswordModal = document.getElementById('createPasswordModal');
    const modalForm = document.querySelector('.modal-form');

    if (openPasswordModal && createPasswordModal) {
        openPasswordModal.addEventListener('click', function(e) {
            e.preventDefault();
            createPasswordModal.classList.add('show');
        });
    }

    function closeModal() {
        if (createPasswordModal) {
            createPasswordModal.classList.remove('show');
            // Reset form
            if (modalForm) {
                modalForm.reset();
            }
        }
    }

    if (closePasswordModal) {
        closePasswordModal.addEventListener('click', closeModal);
    }

    if (cancelPasswordModal) {
        cancelPasswordModal.addEventListener('click', closeModal);
    }

    // Close modal when clicking outside
    if (createPasswordModal) {
        createPasswordModal.addEventListener('click', function(e) {
            if (e.target === createPasswordModal) {
                closeModal();
            }
        });
    }

    // Handle form submission
    if (modalForm) {
        modalForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const newPassword = document.getElementById('newPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Basic validation
            if (newPassword && confirmPassword && newPassword === confirmPassword) {
                // Here you would typically send the password to your backend
                console.log('Password created successfully');
                closeModal();
            } else if (newPassword !== confirmPassword) {
                alert('Passwords do not match');
            }
        });
    }
});

