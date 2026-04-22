const registerHref = "a[href^='https://onboarding.zondacrypto.exchange']"
const registerEventName = "begin_register";

const loginHref = "a[href^='https://auth.zondacrypto.exchange']"
const loginEventName = "click_button_LOGIN";

const gtmUidAction = (eventName, selector) => {
    const allElements = document.querySelectorAll(selector);
    const uid = getUID();
    allElements.forEach(element => {
        appendUID(element, uid);
        element.addEventListener("click", (event) => {
            window.dataLayer = window.dataLayer || [];
            dataLayer.push({
                event: `${eventName}`,
                user_id: `${uid}`
            });
        })
    })
}


const gtmAction = (eventName, selector) => {
    const allElements = document.querySelectorAll(selector);
    allElements.forEach(element => {
        element.addEventListener("click", (event) => {
            let btnText = element.textContent;
            window.dataLayer = window.dataLayer || [];
            dataLayer.push({
                "event": `${eventName}`,
                "click_text": `${btnText}`
            });
        })
    })
}

const getUID = ()=> {
    let uid = sessionStorage.getItem("uId");
    if(!uid) {
        uid = crypto.randomUUID();
        sessionStorage.setItem("uId", uid);
    }
    return uid;
}

const appendUID = (linkElement, uid) => {
    let newUrl = new URL(linkElement.href);
    newUrl.searchParams.set("uId", uid);
    linkElement.href = newUrl.toString();
}

gtmUidAction(registerEventName, registerHref);
gtmAction(loginEventName, loginHref);