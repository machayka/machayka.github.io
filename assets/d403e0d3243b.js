$(document).ready(function () {
    let languageCurrencyMap, promotedCurrencies, currenciesInfo, currenciesStats;
    let navigationCoinsWrapper = document.querySelector(".nav-coin-container-wrapper");
    if (navigationCoinsWrapper) {
        function initLiveMarketFragment() {

            window.removeEventListener("tickerUpdate", generateLiveMarketContent);
            let initializedData = window.Liferay.BitBay.initializedData;
            if (initializedData["tickerResult"] &&
                initializedData["currencyLanguageMap"] &&
                initializedData["promotedCurrencies"] &&
                initializedData["currenciesInfo"] &&
                initializedData["statsResult"]) {
                let currenciesInfoData = JSON.parse(window.sessionStorage.getItem("currenciesInfo"));
                let currenciesStatsData = JSON.parse(window.sessionStorage.getItem("statsResult"));
                if(!!currenciesInfoData && !!currenciesStatsData) {
                    languageCurrencyMap = JSON.parse(window.sessionStorage.getItem("currencyLanguageMap"));
                    promotedCurrencies = JSON.parse(window.sessionStorage.getItem("promotedCurrencies"));
                    currenciesInfo = currenciesInfoData.currencies;
                    currenciesStats = currenciesStatsData.items;
                    generateLiveMarketContent();
                    window.addEventListener("tickerUpdate", generateLiveMarketContent)
                } else {
                    setTimeout(initLiveMarketFragment, 100);
                }
            } else {
                setTimeout(initLiveMarketFragment, 100);
            }
        }

        initLiveMarketFragment();

    }

    function generateLiveMarketContent() {
        Liferay.BitBay.bbDebugger ? console.debug("fragment tickerUpdate") : "";
        let navigationCoinsWrapper = document.querySelector(".nav-coin-container-wrapper");
        var languageId = Liferay.ThemeDisplay.getLanguageId();
        var ticker = JSON.parse(window.sessionStorage.getItem("tickerResult")).items;
        var defaultCurrencyCode = languageCurrencyMap[languageId];
        for (var i = 0; i < 3; i++) {
            let currencyFrom = promotedCurrencies[i];
            let currencyTo = getToCurrencyTo(currencyFrom, defaultCurrencyCode, ticker);
            let pair = currencyFrom + "-" + currencyTo;
            let tickerPair = ticker[pair];
            let statsPair = currenciesStats[pair];
            if (tickerPair) {
                let calculatedRateChange = calculateRateChange(tickerPair, statsPair);
                let fullChangeText = getRateDiff(currencyFrom, calculatedRateChange, currenciesInfo)
                let marketURL = createCurrencyUrl(currenciesInfo[currencyFrom].fullName, currencyTo.toLowerCase());
                updateCurrency(navigationCoinsWrapper, ".currency-" + i, getRate(currencyTo, tickerPair), calculatedRateChange, fullChangeText, currenciesInfo[currencyFrom], marketURL);
            } else {
                console.debug("pair doesn't exist", pair);
            }
        }
    }

    function getRateDiff(currencyTo, calculatedChange, currenciesInfo) {
        if (calculatedChange != "Infinity") {
            return currenciesInfo[currencyTo].fullName.toUpperCase() + " " + calculatedChange + "%";
        }

        return currenciesInfo[currencyTo].fullName.toUpperCase() + " " + "-";
    }

    function truncate(num, decimals) {
        const factor = Math.pow(10, decimals);
        return Math.trunc(num * factor) / factor;
    }

    function getRate(currencyFrom, tickerPair) {
        let truncatedRate = truncate(tickerPair.rate, 4);
        return getCurrencyWithSymbol(currencyFrom.toUpperCase(), Number(truncatedRate).toLocaleString("en-US", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4
        }))
    }

    function updateCurrency(fragmentElement, currencySelector, currencyRate, calculatedChange, fullChangeText, currenciesInfo, marketURL) {
        fragmentElement.querySelector(currencySelector).classList.remove("d-none");
        var currencyLinkElement = fragmentElement.querySelector(currencySelector + ".currency-item__link");
        var currencyIconImgElement = fragmentElement.querySelector(currencySelector + " .currency-item__img");
        var currencyRateElement = fragmentElement.querySelector(currencySelector + " .currency-rate__text");
        var currencyRateImgElement = fragmentElement.querySelector(currencySelector + " .currency-rate__img");
        var currencyChangeElement = fragmentElement.querySelector(currencySelector + " .currency-rate-change");
        if (calculatedChange != "Infinity") {
            currencyRateImgElement.classList.remove("invisible");
            let currentSrc = currencyRateImgElement.getAttribute("src");
            let newSrc = "";
            if (Number(calculatedChange) > 0) {
                newSrc = "/o/bb-theme/images/icons/TrendGrow.svg";
            } else if (Number(calculatedChange) < 0) {
                newSrc = "/o/bb-theme/images/icons/TrendFall.svg";
            } else {
                newSrc = "/o/bb-theme/images/icons/TrendStable.svg";
            }
            if (newSrc != currentSrc) {
                currencyRateImgElement.setAttribute("src", newSrc);
            }
        } else {
            currencyRateImgElement.classList.add("invisible");
        }

        currencyLinkElement.setAttribute("href", marketURL);
        currencyRateElement.textContent = currencyRate;
        currencyChangeElement.textContent = fullChangeText;
        currencyIconImgElement.setAttribute("src", currenciesInfo.img);
        currencyIconImgElement.setAttribute("alt", currenciesInfo.fullName);
    }

    function calculateRateChange(tickerPair, statsPair) {
        let calculatedRateChange = (((tickerPair.rate - statsPair.r24h) / statsPair.r24h) * 100).toFixed(2);
        if (calculatedRateChange == -0.00) {
            return Math.abs(calculatedRateChange);
        }
        return calculatedRateChange;
    }

    function getToCurrencyTo(fromCurrency, toCurreny, ticker) {
        var defaultToCurrency = "BTC";
        var pair = fromCurrency + "-" + toCurreny;
        if (ticker[pair]) {
            return toCurreny;
        }
        return defaultToCurrency;
    }

    function getCurrencyWithSymbol(currency, value) {
        let val = "NaN" == value ? "-" : value;
        if (window.Liferay.BitBay.supportedCurrencies[currency])
            return window.Liferay.BitBay.supportedCurrencies[currency] + " " + val;
        else
            return val + " " + currency;

    }

    function createCurrencyUrl(currencyCode, secondCurrencyCode) {
        let urlPlaceHolder = window.Liferay.BitBay.urlLanguageMapper[Liferay.ThemeDisplay.getLanguageId()];
        let firstCurrencyNormalized = currencyCode.replace(/ /g, "-").replace(/'/g, "").toLowerCase();
        return "https://zondacrypto.com" + urlPlaceHolder
            .replace("{firstCurrency}", firstCurrencyNormalized)
            .replace("{secondCurrency}", secondCurrencyCode);
    }


});
