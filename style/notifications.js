// Notifications Page JavaScript

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

    // Load notifications
    loadNotifications();
});

function loadNotifications() {
    if (notificationsList.length === 0) {
        notificationsList = getNotifications();
    }
    
    const panel = document.getElementById('notificationsPanel');
    if (!panel) return;

    if (notificationsList.length === 0) {
        panel.innerHTML = '<div style="padding: 3rem; text-align: center; color: #9ca3af;">No notifications</div>';
        return;
    }

    panel.innerHTML = notificationsList.map((notif, index) => {
        let iconContent = '';
        if (notif.iconType === 'ielts') {
            iconContent = `
                <div class="ielts-text">EN</div>
                <div class="ielts-lines"></div>
                <div class="ielts-lines"></div>
                <div class="ielts-lines"></div>
            `;
        } else {
            iconContent = `<i class="bi ${notif.icon} notification-icon ${notif.iconClass || ''}"></i>`;
        }
        
        return `
            <div class="notification-item">
                <div class="notification-dot"></div>
                <div class="notification-icon-wrapper ${notif.iconType}">
                    ${iconContent}
                </div>
                <div class="notification-content">
                    <div class="notification-text">${notif.text}</div>
                    <div class="notification-time">${notif.time}</div>
                </div>
                <div class="notification-actions">
                    <button class="notification-menu-btn" onclick="toggleNotificationMenu(${index}, event)">
                        <i class="bi bi-three-dots-vertical"></i>
                    </button>
                    <div class="notification-menu-dropdown" id="notificationMenu${index}">
                        <button class="notification-menu-item" onclick="removeNotification(${index})">Remove this notification</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

let notificationsList = [];

function getNotifications() {
    return [
        {
            icon: 'bi-fire',
            iconClass: 'flame',
            iconType: '',
            text: 'Your 3-day streak ends tonight. <strong>Study now to keep your progress.</strong>',
            time: '25 mins ago'
        },
        {
            icon: '',
            iconClass: '',
            iconType: 'ielts',
            text: 'Improve your IELTS® score with thousands of essential words selected by experts for your English level. <strong>View sets.</strong>',
            time: '54 mins ago'
        },
        {
            icon: 'bi-fire',
            iconClass: 'flame',
            iconType: '',
            text: 'Way to go! You\'re on a 3-day streak. <strong>Keep up the momentum and study again.</strong>',
            time: '12 hours ago'
        },
        {
            icon: 'bi-lightbulb',
            iconClass: '',
            iconType: '',
            text: 'Need help with homework problems? <strong>Use your free expert solutions!</strong>',
            time: '2 days ago'
        },
        {
            icon: 'bi-trophy',
            iconClass: '',
            iconType: '',
            text: 'Congratulations! You\'ve completed 100 flashcards. <strong>View your achievement.</strong>',
            time: '3 days ago'
        },
        {
            icon: 'bi-star',
            iconClass: '',
            iconType: '',
            text: 'New study set available: "Advanced Mathematics". <strong>Check it out.</strong>',
            time: '4 days ago'
        }
    ];
}

window.toggleNotificationMenu = function(index, event) {
    event.stopPropagation();
    
    // Close all other menus
    document.querySelectorAll('.notification-menu-dropdown').forEach(menu => {
        if (menu.id !== `notificationMenu${index}`) {
            menu.classList.remove('show');
        }
    });
    
    // Toggle current menu
    const menu = document.getElementById(`notificationMenu${index}`);
    if (menu) {
        menu.classList.toggle('show');
    }
};

window.removeNotification = function(index) {
    notificationsList.splice(index, 1);
    loadNotifications();
    
    // Close menu
    const menu = document.getElementById(`notificationMenu${index}`);
    if (menu) {
        menu.classList.remove('show');
    }
};

// Close menus when clicking outside
document.addEventListener('click', function(e) {
    if (!e.target.closest('.notification-actions')) {
        document.querySelectorAll('.notification-menu-dropdown').forEach(menu => {
            menu.classList.remove('show');
        });
    }
});

