function cookieManageInit() {
    let popUpActive = false;
    let activeCookiesCount = 0;

    const cookieContainer = document.getElementById('zonda__cookie-bar');
    const popupBackgroundElement = document.getElementById('cookie-bar__cookie-popup-background');
    const popupContainerElement = document.getElementById('cookie-bar__cookie-popup-content-container');

    const manageCookieButton = document.getElementById('cookie-bar__manage-button');
    const popUpCancelButton = document.getElementById('cookie-bar__cancel-button');
    const popUpConfirmButton = document.getElementById('cookie-bar__confirm-button');
    const popUpAcceptButton = document.getElementById('cookie-bar__accept-button');

    const popUpCheckNecessary = document.getElementById('popup-check-container_necessaryCookies');
    //const popUpCheckFunctional = document.getElementById('popup-check-container_functionalCookies');
    const popUpCheckMarketing = document.getElementById('popup-check-container_marketingCookies');

    let cookiesParams = [
        {
            name: 'zonda_accept_cookies',
            accepted: 'true',
        },
        /*{
            name: 'zonda_functional_cookies',
            accepted: 'false',
        },*/
        {
            name: 'zonda_marketing_cookies',
            accepted: 'false',
        },
    ];

    for (let i = 0; i < cookiesParams.length; i++) {
        const cookieFromBrowser = getCookie(cookiesParams[i].name);

        if (cookieFromBrowser == 'true') {
            activeCookiesCount++;
            cookiesParams[i] = { ...cookiesParams[i], accepted: cookieFromBrowser };
        } else {
            setCookie(cookiesParams[i].name, 'false', 99999);
        }

        if (activeCookiesCount  >= 1) {
            const cookieNecessary = getCookie('zonda_accept_cookies')
            if (cookieNecessary != 'true') {
                cookieContainer.classList.remove('confirmed');
            }
        } else {
            cookieContainer.classList.remove('confirmed');
        }
    }

    if (manageCookieButton) {
        manageCookieButton.onclick = () => {
            if (!popUpActive) {
                popupBackgroundElement.classList.add('popup_active');
                popupContainerElement.classList.add('popup_active');
                document.body.classList.add('cookie-bar__modal-opened');
                popUpActive = true;
            }
        };
    }

    if (popUpCancelButton) {
        popUpCancelButton.onclick = () => {
            if (popUpActive) {
                popupBackgroundElement.classList.remove('popup_active');
                popupContainerElement.classList.remove('popup_active');
                document.body.classList.remove('cookie-bar__modal-opened');
                popUpActive = false;
            }
        };
    }

    if (popUpConfirmButton) {
        popUpConfirmButton.onclick = () => {
            if (popUpActive) {
                popupBackgroundElement.classList.remove('popup_active');
                popupContainerElement.classList.remove('popup_active');
                document.body.classList.remove('cookie-bar__modal-opened');
                popUpActive = false;
            }

            cookiesParams.forEach((cookie) => {
                setCookie(cookie.name, cookie.accepted, 99999);
        });
            cookieContainer.classList.add('confirmed');
            updateTag();
        };
    }

    if (popUpAcceptButton) {
        popUpAcceptButton.onclick = () => {
            if (popUpActive) {
                popupBackgroundElement.classList.remove('popup_active');
                popupContainerElement.classList.remove('popup_active');
                popUpActive = false;
            }

            cookiesParams = cookiesParams.map((cookie) => {
                return { ...cookie, accepted: 'true' };
        });

            cookiesParams.forEach((cookie) => {
                setCookie(cookie.name, cookie.accepted, 99999);
        });
            updateTag();
            cookieContainer.classList.add('confirmed');
        };
    }

    if (popUpCheckNecessary) {
        checkOnActive(popUpCheckNecessary, 0);
        popUpCheckNecessary.onclick = () => acceptCookies(popUpCheckNecessary, 0);
    }

    /*if (popUpCheckFunctional) {
        checkOnActive(popUpCheckFunctional, 1);
        popUpCheckFunctional.onclick = () => acceptCookies(popUpCheckFunctional, 1);
    }*/

    if (popUpCheckMarketing) {
        checkOnActive(popUpCheckMarketing, 1);
        popUpCheckMarketing.onclick = () => acceptCookies(popUpCheckMarketing, 1);
    }

    function checkOnActive(container, cookieIndex) {
        if (cookiesParams[cookieIndex].accepted === 'true') {
            container.classList.add('active');
        }
    }

    function acceptCookies(container, cookieIndex) {
        if (container.classList.contains('active')) {
            container.classList.remove('active');
            cookiesParams[cookieIndex].accepted = 'false';
        } else {
            container.classList.add('active');
            cookiesParams[cookieIndex].accepted = 'true';
        }
    }

    function setCookie(name, value, exdays) {
        const d = new Date();

        d.setTime(d.getTime() + exdays * 24 * 60 * 60  * 5);

        let expires = 'expires=' + d.toUTCString();

        document.cookie = name + '=' + value + ';' + expires + ';path=/';
    }
    
    function updateTag() {
        let marketingCookieAccepted = getCookie("zonda_marketing_cookies");
        if (marketingCookieAccepted === 'true') {
            gtag("consent", "update", {
                ad_storage: "denied",
                analytics_storage: "granted",
                ad_user_data: 'denied',
                ad_personalization: 'denied',
                personalization_storage: 'denied',
                functionality_storage: 'denied',
                security_storage: 'granted'
            });
        }
    }    
}
