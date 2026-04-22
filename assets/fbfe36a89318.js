$(document).ready(function () {
    AUI().use('aui-base, aui-node', function (A) {
        var CAROUSEL_ITEM =
            `<a class="splide__slide footer-available-coins-carousel-item" aria-hidden="true" tabindex="-1" href="">`
            + `<img class="footer-available-coins-carousel-item__image" src="https://via.placeholder.com/40" alt="" loading="lazy"/>`
            + `<div class="footer-available-coins-carousel-item__content">`
            + `<span class="footer-available-coins-carousel-item__name">-</span>`
            + `<span class="footer-available-coins-carousel-item__description">-</span>`
            + `</div>`
            + `</a>`;

        function initFooterCarousel() {
            let initializedData = window.Liferay.BitBay.initializedData;
            let summaryEl = A.one('#footer-available-coins-summary');
            let basicInfoInitialized = initializedData["currenciesInfo"] && initializedData["tickerResult"] && initializedData["currencyLanguageMap"];
            if (basicInfoInitialized) {
                let carouselWrapper = A.one("#footer-available-coins-carousel-splide-list");
                let currenciesInfoData = JSON.parse(window.sessionStorage.getItem("currenciesInfo"));
                let tickerResultData = JSON.parse(window.sessionStorage.getItem("tickerResult"));
                if (!!currenciesInfoData && !!tickerResultData) {
                    let currenciesInfoList = currenciesInfoData.currencies;
                    let ticker = tickerResultData.items;
                    let currencyLanguageMap = JSON.parse(window.sessionStorage.getItem("currencyLanguageMap"));

                    if (bbConfig.usePayCoinList) {
                        if (initializedData["currenciesPayInfo"]) {
                            let currenciesPayInfoList = JSON.parse(window.sessionStorage.getItem("currenciesPayInfo"));
                            if (currenciesPayInfoList.length * 192 <= carouselWrapper.get('offsetWidth')) {
                                carouselWrapper.addClass('footer-available-coins-carousel--center');
                            }
                            currenciesPayInfoList.sort().forEach(key => {
                                let currencyInfo = currenciesInfoList[key];
                                addCarouselElement(currencyInfo, "EUR", carouselWrapper);
                            });
                            bbConfig.footerCoinsInitialized = true;
                        } else {
                            setTimeout(initFooterCarousel, 100);
                        }
                    } else {
                        let languageId = Liferay.ThemeDisplay.getLanguageId();
                        let secondCurrencyCode = currencyLanguageMap[languageId];
                        Object.keys(currenciesInfoList).sort().forEach(key => {
                            let currencyInfo = currenciesInfoList[key];
                            let secondCurrency = getSecondCurrency(key, secondCurrencyCode, ticker);
                            if (secondCurrency) {
                                addCarouselElement(currencyInfo, secondCurrency, carouselWrapper);
                            }
                            if (summaryEl) {
                                const names = Object.keys(currenciesInfoList)
                                    .sort()
                                    .map(key => currenciesInfoList[key].fullName + ' (' + key.toUpperCase() + ')');

                                summaryEl.set('text',
                                    'Available\x20coins' + ': ' + names.join(', ')
                                );
                            }
                        });
                        bbConfig.footerCoinsInitialized = true;
                    }

                    Liferay.Loader.require(
                        'carousel-initializer@1.0.3',
                        function (carouselInitializer) {
                            function initializeSplide(carouselInitializer) {
                                if (bbConfig.footerCoinsInitialized) {
                                    carouselInitializer.splide();
                                } else {
                                    setTimeout(initializeSplide, 100, carouselInitializer);
                                }
                            }

                            initializeSplide(carouselInitializer);
                        }
                    );
                } else {
                    setTimeout(initFooterCarousel, 10);
                }
            } else {
                setTimeout(initFooterCarousel, 100);
            }
        };

        function createCurrencyUrl(currencyCode, secondCurrencyCode) {
            let urlPlaceHolder = window.Liferay.BitBay.urlLanguageMapper[Liferay.ThemeDisplay.getLanguageId()];
            let firstCurrencyNormalized = currencyCode.replace(/ /g, "-").replace(/'/g, "").toLowerCase();
            return urlPlaceHolder
                .replace("{firstCurrency}", firstCurrencyNormalized)
                .replace("{secondCurrency}", secondCurrencyCode);
        }

        function getSecondCurrency(fromCurrency, toCurrency, ticker) {
            let defaultToCurrency = "BTC";
            let upperFromCurrency = fromCurrency.toUpperCase();
            let pair = upperFromCurrency + "-" + toCurrency;
            if (ticker[pair]) {
                return toCurrency;
            }
            let defaultPair = upperFromCurrency + "-" + defaultToCurrency;
            if (ticker[defaultPair]) {
                return defaultToCurrency;
            }

            let firstMatchingPair = Object.keys(ticker).find(marketKey => {
                return marketKey.match(upperFromCurrency + "-");
            });
            if (firstMatchingPair) {
                return firstMatchingPair.split("-")[1];
            }

            return "";

        }

        function addCarouselElement(currencyInfo, secondCurrency, carouselWrapper) {
            let carouselElement = A.Node.create(CAROUSEL_ITEM);
            carouselElement.one(".footer-available-coins-carousel-item__description").set("text", currencyInfo.fullName);
            carouselElement.one(".footer-available-coins-carousel-item__name").set("text", currencyInfo.displayName.toUpperCase());
            carouselElement.one(".footer-available-coins-carousel-item__image").set("src", currencyInfo.img);
            carouselElement.one(".footer-available-coins-carousel-item__image").set("alt", currencyInfo.fullName);
            let marketURL = createCurrencyUrl(currencyInfo.fullName, secondCurrency.toLowerCase());
            carouselElement.set("href", marketURL);
            carouselWrapper.append(carouselElement);
        }

        let isInEditMode = document.body.classList.contains("has-edit-mode-menu");
        if (!isInEditMode) {
            initFooterCarousel();
        }
    });
});
