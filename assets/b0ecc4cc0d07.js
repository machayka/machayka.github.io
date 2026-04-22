import { DotLottieWorker, DotLottie } from "/o/zondacrypto-theme/js/lottie/dotlottie-web.js";
const wasmURL = window.location.origin + "/o/zondacrypto-theme/js/lottie/dotlottie-player.wasm";
const logo = document.querySelector(".logo.custom-logo");
const src = window.location.origin + logo.dataset.animationPath;
DotLottieWorker.setWasmUrl(wasmURL)
DotLottie.setWasmUrl(wasmURL);
const canvas = logo.querySelector("canvas");
if(window.Worker){
    const dotLottieWorker = new DotLottieWorker({
        canvas,
        src,
        loop: true,
        autoplay: false,
        backgroundColor: 'rgba(0,0,0,0)'
    });
    dotLottieWorker.addEventListener("load", () => {
        logo.classList.add("hide-img");
        setTimeout(()=> dotLottieWorker.play(), 100);
    })
} else {
    const dotLottie = new DotLottie({
        canvas,
        src,
        loop: true,
        autoplay: false,
        backgroundColor: 'rgba(0,0,0,0)'
    });
    dotLottie.addEventListener("load", () => {
        logo.classList.add("hide-img");
        setTimeout(()=> dotLottie.play(), 100);
    })
}
