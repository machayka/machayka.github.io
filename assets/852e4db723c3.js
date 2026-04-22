let zondaSideBar = document.getElementById("zonda-sidebar");
if(zondaSideBar)
    zondaSideBar.addEventListener("click", close);

function close(e) {
    e.stopPropagation();
}

function closeHamburger() {
    let sidebar = document.getElementById("zonda-sidebar");
    sidebar.classList.remove('show');
    sidebar.classList.add('hidden');
}

function show(event, id) {
    var toggledElement = document.getElementById(id);
    document.body.classList.remove("show-search-area");
    toggledElement.classList.toggle('show');
    var iconElement = event.currentTarget.querySelector(".caret-icon");
    if (iconElement) {
        iconElement.classList.toggle("caret-icon__rotate");
    }
    zondaSideBar.classList.remove("initial-hidden");
    zondaSideBar.classList.remove('hidden');
    const firstFocusable = toggledElement.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (firstFocusable) firstFocusable.focus();
    event.stopPropagation();
}

document.addEventListener('click', function (e) {
    let sidebarElement = document.getElementById("zonda-sidebar");
    if (sidebarElement
        && sidebarElement.classList.contains("show")
        && !sidebarElement.contains(e.target) && e.target) {
        sidebarElement.classList.remove('show');
        sidebarElement.classList.add('hidden');
    }
})

document.addEventListener('keydown', function(e) {
    let sidebar = document.getElementById("zonda-sidebar");
    if (sidebar && sidebar.classList.contains('show')) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeHamburger();
            document.getElementById("navbarDropdownHamburger").focus();
        }
    }
});

let lastInputType = 'keyboard';

document.addEventListener('mousedown', () => {
    lastInputType = 'mouse';
});
document.addEventListener('keydown', () => {
    lastInputType = 'keyboard';
});

document.querySelectorAll('.dropdown-hamburger__link').forEach(function(btn) {
    btn.addEventListener('keydown', function(e) {
        if (e.key === ' ' || e.key === 'Enter') {
            e.preventDefault();
            let submenuId = btn.getAttribute('onclick').match(/show\(event, '([^']+)'/)[1];
            let submenu = document.getElementById(submenuId);

            if (submenu.classList.contains('show')) {
                submenu.classList.remove('show');
                btn.setAttribute('aria-expanded', 'false');
                let caret = btn.querySelector('.caret-icon');
                if (caret) caret.classList.remove('caret-icon__rotate');
            } else {
                closeAllSubmenus(submenuId);

                submenu.classList.add('show');
                btn.setAttribute('aria-expanded', 'true');
                let caret = btn.querySelector('.caret-icon');
                if (caret) caret.classList.add('caret-icon__rotate');
            }
        }
    });

    btn.addEventListener('focus', function(e) {
        if (lastInputType !== 'keyboard') return;
        let submenuId = btn.getAttribute('onclick').match(/show\(event, '([^']+)'/)[1];
        closeAllSubmenus(submenuId);
    });
});

function closeAllSubmenus(exceptId) {
    document.querySelectorAll('.dropdown-hamburger__inside').forEach(function(el) {
        if (!exceptId || el.id !== exceptId) {
            el.classList.remove('show');

            let btn = document.querySelector(`[onclick*="show(event, '${el.id}'"]`);
            if (btn) {
                btn.setAttribute('aria-expanded', 'false');
                let caret = btn.querySelector('.caret-icon');
                if (caret) caret.classList.remove('caret-icon__rotate');
            }
        }
    });
}
