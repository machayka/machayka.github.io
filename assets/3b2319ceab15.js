/*1776254606000*/
AUI().ready(function () {
    var navbarBody = document.body;

    var scrollPosition = window.scrollY;
    var resolutionWidth = $(window).width();

    if (scrollPosition > 0) {
        navbarBody.classList.add("navbar-bg")
    }

    window.addEventListener('scroll', function () {
        scrollPosition = window.scrollY;
        if (scrollPosition > 0) {
            navbarBody.classList.add("navbar-bg");
        } else {
            navbarBody.classList.remove("navbar-bg");
        }
    });


    function deactivateSessionExtend() {
        if (Liferay.Session) {
            Liferay.Session.set("autoExtend", false);
            Liferay.Session._expireSession = function () {
            };
        } else {
            setTimeout(deactivateSessionExtend, 100)
        }
    }

    if (!Liferay.ThemeDisplay.isSignedIn()) {
        deactivateSessionExtend()
    }
    let btnSearchShow = document.getElementById("zonda-btn-search-show");
    if (btnSearchShow) {
        btnSearchShow.addEventListener("click", (e) => {
            document.body.classList.add("show-search-area");
            setTimeout(() => {
                let searchInput = document.getElementById("_zonda_search_web_webPortlet_INSTANCE_main_header_search_autoCompleteId");
                if (searchInput) {
                    searchInput.focus();
                }
            }, 300);
        })
    }

    let btnSearchMobileShow = document.getElementById("zonda-btn-search-mobile-show");
    if (btnSearchMobileShow) {
        btnSearchMobileShow.addEventListener("click", () => {
            document.body.classList.add("show-search-area");
        })
    }

    const scrollers = document.querySelectorAll(".scroller");
    let isPreferReduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;
    let isInEditMode = document.body.classList.contains("has-edit-mode-menu");

    if (!isPreferReduceMotion && !isInEditMode) {
        addAnimation();
    }

    function addAnimation() {
        scrollers.forEach((scroller) => {
            let inner = scroller.querySelector(".partnerships-scroller-inner");
            let elementWidth = scroller
                .querySelector("img")
                .getBoundingClientRect().width;
            document.documentElement.style.setProperty(
                "--footer-scroller-img-width",
                `-${elementWidth}px`
            );
            scroller.setAttribute("data-animated", true);

        });
    }

});

(() => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1,
    };

    function observerCallback(entries) {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.remove('active');
                entry.target.classList.add('is-in-viewport');
                observer.unobserve(entry.target);
            }
        });
    }

    var observer = new IntersectionObserver(observerCallback, observerOptions);
    const elementsToLoadIn = document.querySelectorAll('.show-once-when-in-viewport.active');
    elementsToLoadIn.forEach((el) => observer.observe(el));

})();

