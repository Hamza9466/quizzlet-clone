// Flashcards Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    let cardCounter = 1;
    const flashcardsList = document.getElementById('flashcardsList');
    const addCardBtn = document.getElementById('addCardBtn');

    // Create flashcard HTML
    function createFlashcardHTML(number) {
        return `
            <div class="position-relative mb-3 p-3 rounded border border-secondary bg-dark" data-card-number="${number}">
                <div class="position-absolute start-0 top-0 translate-middle bg-primary rounded-circle d-flex align-items-center justify-content-center text-white fw-semibold" style="width: 30px; height: 30px; left: -15px; top: 1.5rem;">${number}</div>
                <div class="d-flex gap-2 mb-2 ms-4">
                    <button class="btn btn-outline-secondary btn-sm" style="width: 32px; height: 32px; padding: 0;">
                        <i class="bi bi-type"></i>
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" style="width: 32px; height: 32px; padding: 0;">
                        <i class="bi bi-mic"></i>
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" style="width: 32px; height: 32px; padding: 0;">
                        <i class="bi bi-volume-up"></i>
                    </button>
                    <button class="btn btn-outline-warning btn-sm" style="width: 32px; height: 32px; padding: 0; border-color: #fbbf24;">
                        <i class="bi bi-lock-fill text-warning"></i>
                    </button>
                </div>
                <div class="row g-3 ms-4">
                    <div class="col-md-6">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <small class="text-secondary text-uppercase fw-semibold" data-i18n="term">TERM</small>
                            <a href="#" class="text-decoration-none small" style="color: #7c3aed;" data-i18n="chooseLanguage">CHOOSE LANGUAGE</a>
                        </div>
                        <textarea class="form-control bg-dark border-secondary text-white" rows="5" placeholder="Enter term" data-i18n-placeholder="enterTerm"></textarea>
                    </div>
                    <div class="col-md-6">
                        <div class="d-flex align-items-center gap-2 mb-2">
                            <small class="text-secondary text-uppercase fw-semibold" data-i18n="definition">DEFINITION</small>
                            <a href="#" class="text-decoration-none small" style="color: #7c3aed;" data-i18n="chooseLanguage">CHOOSE LANGUAGE</a>
                        </div>
                        <div class="d-flex gap-2">
                            <textarea class="form-control bg-dark border-secondary text-white flex-grow-1" rows="5" placeholder="Enter definition" data-i18n-placeholder="enterDefinition"></textarea>
                            <button type="button" class="btn btn-outline-secondary d-flex flex-column align-items-center justify-content-center image-upload-btn" style="min-width: 100px; height: auto;" onclick="uploadImage(this)">
                                <i class="bi bi-image fs-5 mb-1"></i>
                                <small data-i18n="image">Image</small>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="position-absolute top-0 end-0 d-flex gap-1 p-2">
                    <button class="btn btn-link text-secondary p-1" onclick="moveCard(this)" style="text-decoration: none;">
                        <i class="bi bi-arrows-move"></i>
                    </button>
                    <button class="btn btn-link text-secondary p-1" onclick="deleteCard(this)" style="text-decoration: none;">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Add new card
    function addCard() {
        const cardHTML = createFlashcardHTML(cardCounter);
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cardHTML;
        const cardElement = tempDiv.firstElementChild;

        flashcardsList.appendChild(cardElement);
        cardCounter++;

        // Apply translations to new card
        if (typeof applyLanguage !== 'undefined') {
            const savedLanguage = localStorage.getItem('language') || 'en-uk';
            applyLanguage(savedLanguage);
        }
    }

    // Delete card
    window.deleteCard = function (btn) {
        const cardItem = btn.closest('.flashcard-item');
        if (cardItem) {
            cardItem.remove();
            // Renumber cards
            renumberCards();
        }
    };

    // Move card (placeholder)
    window.moveCard = function (btn) {
        // Drag and drop functionality can be added here
        console.log('Move card');
    };

    // Renumber cards
    function renumberCards() {
        const cards = flashcardsList.querySelectorAll('.flashcard-item');
        cards.forEach((card, index) => {
            const number = index + 1;
            card.setAttribute('data-card-number', number);
            const numberElement = card.querySelector('.flashcard-number');
            if (numberElement) {
                numberElement.textContent = number;
            }
        });
        cardCounter = cards.length + 1;
    }

    // Add initial cards
    for (let i = 0; i < 3; i++) {
        addCard();
    }

    // Add card button event
    if (addCardBtn) {
        addCardBtn.addEventListener('click', addCard);
    }

    // Suggestions toggle
    const suggestionsToggle = document.querySelector('.suggestions-toggle .toggle-switch');
    if (suggestionsToggle) {
        suggestionsToggle.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    }

    // Load theme
    function loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            document.documentElement.classList.add('light-theme');
            document.querySelector('.dashboard-header')?.classList.add('light-theme');
            document.querySelector('.dashboard-sidebar')?.classList.add('light-theme');
            document.querySelector('.dashboard-main')?.classList.add('light-theme');
        }
    }

    // Load language
    function loadLanguage() {
        if (typeof applyLanguage !== 'undefined') {
            const savedLanguage = localStorage.getItem('language') || 'en-uk';
            applyLanguage(savedLanguage);
        }
    }

    // Initialize theme and language
    loadTheme();
    loadLanguage();

    // Manage Access Modal
    const openAccessModal = document.getElementById('openAccessModal');
    const manageAccessModal = document.getElementById('manageAccessModal');
    const saveAccessBtn = document.getElementById('saveAccessBtn');
    const visibleToDropdown = document.getElementById('visibleToDropdown');
    const editableByDropdown = document.getElementById('editableByDropdown');

    if (openAccessModal && manageAccessModal) {
        openAccessModal.addEventListener('click', function (e) {
            e.preventDefault();
            manageAccessModal.classList.add('show');
        });
    }

    function closeAccessModal() {
        if (manageAccessModal) {
            manageAccessModal.classList.remove('show');
        }
    }

    if (saveAccessBtn) {
        saveAccessBtn.addEventListener('click', function (e) {
            e.preventDefault();
            closeAccessModal();
        });
    }

    // Close modal when clicking outside
    if (manageAccessModal) {
        manageAccessModal.addEventListener('click', function (e) {
            if (e.target === manageAccessModal) {
                closeAccessModal();
            }
        });
    }

    // Update dropdown button text when option is selected
    const accessOptions = document.querySelectorAll('.access-option');
    accessOptions.forEach(option => {
        option.addEventListener('click', function (e) {
            e.preventDefault();
            const value = this.getAttribute('data-value');
            const text = this.textContent.trim();
            const dropdown = this.closest('.dropdown');
            const button = dropdown.querySelector('.access-dropdown-btn');
            const span = button.querySelector('span');

            if (span) {
                span.textContent = text;
            }

            // Update help text for editable by
            if (dropdown.id === 'editableByDropdown') {
                const helpText = dropdown.parentElement.querySelector('.access-help-text');
                if (helpText && value === 'justme') {
                    helpText.textContent = 'Only you can edit this set';
                } else if (helpText) {
                    helpText.textContent = '';
                }
            }
        });
    });

    // Image upload functionality
    window.uploadImage = function (btn) {
        const fileInput = document.getElementById('imageUploadInput');
        if (fileInput) {
            fileInput.onchange = function (e) {
                const file = e.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = function (event) {
                        const imageUrl = event.target.result;

                        // Update button to show image
                        const existingImg = btn.querySelector('.uploaded-image');

                        if (existingImg) {
                            existingImg.src = imageUrl;
                        } else {
                            // Create image element
                            const img = document.createElement('img');
                            img.src = imageUrl;
                            img.className = 'uploaded-image';
                            img.style.cssText = 'width: 100%; height: 100%; object-fit: cover; border-radius: 4px;';

                            // Replace button content with image
                            btn.innerHTML = '';
                            btn.appendChild(img);
                            btn.style.padding = '0';
                            btn.style.minWidth = '100px';
                            btn.style.height = '120px';
                        }

                        // Reset file input
                        fileInput.value = '';
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please select a valid image file.');
                    fileInput.value = '';
                }
            };
            fileInput.click();
        }
    };

    // Save flashcard set function
    window.saveFlashcardSet = function () {
        // Find title input by data attribute or placeholder
        const titleInput = document.querySelector('input[data-i18n-placeholder="enterTitle"]') ||
            document.querySelector('input[placeholder*="title" i]') ||
            document.querySelector('input[placeholder*="Title" i]') ||
            document.getElementById('setTitle');

        // Find description input
        const descriptionInput = document.querySelector('textarea[data-i18n-placeholder="addDescription"]') ||
            document.querySelector('textarea[placeholder*="description" i]') ||
            document.getElementById('setDescription');

        const flashcardsList = document.getElementById('flashcardsList');

        // Check if title exists and has value
        if (!titleInput) {
            console.error('Title input not found');
            alert('Title input field not found. Please check the form.');
            return;
        }

        const titleValue = titleInput.value ? titleInput.value.trim() : '';
        if (!titleValue) {
            alert('Please enter a title for your flashcard set');
            titleInput.focus();
            return;
        }

        const title = titleValue;
        const description = descriptionInput ? (descriptionInput.value ? descriptionInput.value.trim() : '') : '';

        // Collect all flashcard data
        const flashcardItems = flashcardsList.querySelectorAll('[data-card-number]');
        const flashcards = [];

        flashcardItems.forEach((item) => {
            const termField = item.querySelector('textarea[data-i18n-placeholder="enterTerm"]');
            const definitionField = item.querySelector('textarea[data-i18n-placeholder="enterDefinition"]');
            const imageBtn = item.querySelector('.image-upload-btn');
            const imageSrc = imageBtn && imageBtn.querySelector('.uploaded-image')
                ? imageBtn.querySelector('.uploaded-image').src
                : null;

            const term = termField ? termField.value.trim() : '';
            const definition = definitionField ? definitionField.value.trim() : '';

            if (term || definition) {
                flashcards.push({
                    term: term,
                    definition: definition,
                    image: imageSrc
                });
            }
        });

        if (flashcards.length === 0) {
            alert('Please add at least one flashcard');
            return;
        }

        // Create flashcard set object
        const flashcardSet = {
            id: Date.now().toString(),
            title: title,
            description: description,
            flashcards: flashcards,
            createdAt: new Date().toISOString(),
            lastStudied: new Date().toISOString()
        };

        // Get existing flashcard sets from localStorage
        let flashcardSets = JSON.parse(localStorage.getItem('flashcardSets') || '[]');

        // Add new set at the beginning
        flashcardSets.unshift(flashcardSet);

        // Keep only last 20 sets
        if (flashcardSets.length > 20) {
            flashcardSets = flashcardSets.slice(0, 20);
        }

        // Save to localStorage
        localStorage.setItem('flashcardSets', JSON.stringify(flashcardSets));

        // Redirect to dashboard
        window.location.href = 'dashboard.html';
    };

    // Add event listeners to Create buttons
    setTimeout(() => {
        const createBtns = document.querySelectorAll('.btn-create-set');
        createBtns.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                window.saveFlashcardSet();
            });
        });
    }, 100);

    // Hide "Create and practice" button if account type is Teacher
    const accountType = localStorage.getItem('accountType') || 'Student';
    const createAndPracticeBtn = document.getElementById('createAndPracticeBtn');
    
    if (createAndPracticeBtn && accountType === 'Teacher') {
        createAndPracticeBtn.style.display = 'none';
    }
});

