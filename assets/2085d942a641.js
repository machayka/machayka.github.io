function dropDownMobileFooter(id) {
    let dropdownElement = document.getElementById(id);
    let parentWrapper = dropdownElement.closest('.footer_navigation_mobile_view');
    if (!dropdownElement.classList.contains("active")) {
       document.querySelectorAll(".footer-navigation__heading.active").forEach(element => {
            element.classList.toggle("active");
            element.querySelector("img").classList.toggle("caret-icon__rotate");
            element.element.closest('.footer_navigation_mobile_view').nextElementSibling.classList.toggle("show");
        })
    }

    dropdownElement.classList.toggle("active");
    dropdownElement.querySelector("img").classList.toggle("caret-icon__rotate");
    parentWrapper.nextElementSibling.classList.toggle('show');
}
