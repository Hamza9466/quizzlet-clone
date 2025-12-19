// Teacher Tools Sidebar Script
// This script handles showing/hiding Teacher tools section in sidebar

document.addEventListener('DOMContentLoaded', function() {
    const accountType = localStorage.getItem('accountType') || 'Student';
    
    // Get all elements
    const teacherToolsDivider = document.getElementById('teacherToolsDivider');
    const teacherToolsTitle = document.getElementById('teacherToolsTitle');
    const assignActivityNavItem = document.getElementById('assignActivityNavItem');
    const startHereDivider = document.getElementById('startHereDivider');
    const startHereTitle = document.getElementById('startHereTitle');
    const flashcardsNavItem = document.getElementById('flashcardsNavItem');
    const expertSolutionsNavItem = document.getElementById('expertSolutionsNavItem');

    if (accountType === 'Teacher') {
        // Show Teacher tools
        if (teacherToolsDivider) teacherToolsDivider.style.display = 'block';
        if (teacherToolsTitle) teacherToolsTitle.style.display = 'block';
        if (assignActivityNavItem) assignActivityNavItem.style.display = 'flex';
        
        // Hide "Start here" section
        if (startHereDivider) startHereDivider.style.display = 'none';
        if (startHereTitle) startHereTitle.style.display = 'none';
        if (flashcardsNavItem) flashcardsNavItem.style.display = 'none';
        if (expertSolutionsNavItem) expertSolutionsNavItem.style.display = 'none';
    } else {
        // Hide Teacher tools
        if (teacherToolsDivider) teacherToolsDivider.style.display = 'none';
        if (teacherToolsTitle) teacherToolsTitle.style.display = 'none';
        if (assignActivityNavItem) assignActivityNavItem.style.display = 'none';
        
        // Show "Start here" section
        if (startHereDivider) startHereDivider.style.display = 'block';
        if (startHereTitle) startHereTitle.style.display = 'block';
        if (flashcardsNavItem) flashcardsNavItem.style.display = 'flex';
        if (expertSolutionsNavItem) expertSolutionsNavItem.style.display = 'flex';
    }
});

