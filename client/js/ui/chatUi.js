'use strict'

export function setupIconActiveStateSwitch() {
    const sideMenuLinks = document.querySelectorAll('.side-menu-link')
    sideMenuLinks.forEach(linkEl => {
        linkEl.addEventListener('click', (e) => {
            e.preventDefault();
            sideMenuLinks.forEach(linkEl => {
                linkEl.classList.remove("active");
            })
            e.currentTarget.classList.add("active");
            const targetElement = e.currentTarget.dataset.target;
            loadContent(targetElement);
        })
    })
}

export function loadContent(targetElement) {
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.add('hide');
    });

    const activeSection = document.getElementById(targetElement);
    if (activeSection) {
        activeSection.classList.remove('hide');
    }
}