const portalUrl = window.origin;
const currenciesInfo = "/o/configuration/currencies";
const currenciesPayInfo = "/o/configuration/currencies/pay";
const secondCurrenciesOrderPath = "/o/configuration/currencies/ordered";
const languageCurrencyMapperPath = "/o/configuration/language/currency";
const promotedCurrenciesPath = "/o/configuration/currencies/promoted";
const volumenPath = '/o/api/market/volumen';
const averageRatePath = '/o/api/market/averagerate';
const zondaApiPrefix = 'https://api.zondacrypto.exchange';
const tickerPath = zondaApiPrefix + '/rest/trading/ticker';
const statsPath = zondaApiPrefix + '/rest/trading/stats';
const status = zondaApiPrefix + '/rest/router2/status';
const bbConfig = window.Liferay.BitBay;
const MINUTE_IN_MILIS = 60 * 1000;

const tickerEvent = new CustomEvent("tickerUpdate");
const statsEvent = new CustomEvent("statsUpdate");
const currencyInfoEvent = new CustomEvent("currencyInfoUpdate");
const currencyLanguageMapEvent = new CustomEvent("currencyLanguageMapUpdate");
const secondCurrenciesOrderEvent = new CustomEvent("secondCurrenciesOrderUpdate");
const promotedDataEvent = new CustomEvent("promotedDataUpdate");
const extremumDataEvent = new CustomEvent("extremumDataUpdate");
const volumenDataEvent = new CustomEvent("volumenDataUpdate");
const averageRateEvent = new CustomEvent("averageRateUpdate");
const maintenanceBreakEvent = new CustomEvent("maintenanceBreakEvent");

const TICKER_STORE_NAME = "tickerResult";
const STATS_STORE_NAME = "statsResult";
const PROMOTED_STORE_NAME = "promotedCurrencies";
const SECOND_CURRENCIES_LIST_STORE_NAME = "secondCurrenciesList";
const LANGUAGE_MAP_STORE_NAME = "currencyLanguageMap";
const CURRENCY_INFO_STORE_NAME = "currenciesInfo";
const CURRENCY_PAY_INFO_STORE_NAME = "currenciesPayInfo";
const VOLUME_STORE_NAME = "volumeData";
const AVERAGE_RATE_STORE_NAME = "averageRateData";
const MAINTENANCE_BREAK = "maintenanceBreak";
const MAINTENANCE_BREAK_EST = "maintenanceBreakEstimated";
const LANGUAGE_MAP = {
    "zonda-maintenance-break-information-with-time": {
        pl_PL: "Przerwa techniczna do: ${breakTime}",
        default: "Maintenance break till: ${breakTime}"
    },
    "zonda-maintenance-break-information": {
        pl_PL: "Przerwa techniczna",
        default: "Maintenance break"
    }

}

function updateSessionStoreData(path, storeName, isLocal, timeout, event) {
    Liferay.BitBay.bbInitializerDebugger ? console.debug("storeName", storeName) : "";
    let fullPath = isLocal ? portalUrl + path : path;
    fetch(fullPath)
        .then(response => response.json())
        .then(data => {
            if (data.status == "Fail") {
                window.Liferay.BitBay.bbInitializerDebugger ? console.error('Error during api comunication ', path) : ""
                window.Liferay.BitBay.initializedData[storeName] = false;
                window.Liferay.BitBay.initializedData[MAINTENANCE_BREAK] = false;
                window.Liferay.BitBay.initializedData[MAINTENANCE_BREAK_EST] = data.estimatedTime;
                if (MAINTENANCE_BREAK === storeName) {
                    window.dispatchEvent(event)
                    showMaintenanceBreak();
                }
            } else {
                let maintenanceBreak = JSON.parse(window.sessionStorage.getItem("maintenanceBreak"));
                let previousState = !!maintenanceBreak ? maintenanceBreak.status : "Ok";
                let stringifyData = JSON.stringify(data);
                window.sessionStorage.setItem(storeName, stringifyData);
                window.Liferay.BitBay.initializedData[storeName] = true;
                if (event) {
                    if (MAINTENANCE_BREAK === storeName) {
                        if (previousState !== "Ok" && data.status === "Ok") {
                            window.dispatchEvent(event)
                            hideMaintenanceBreak();
                        }
                    } else {
                        window.dispatchEvent(event)
                    }
                } else {
                    window.Liferay.BitBay.bbInitializerDebugger ? console.debug("event for " + storeName + " is empty") : ""
                }
            }
            if (!Liferay.ThemeDisplay.isSignedIn() && timeout) {
                setTimeout(updateSessionStoreData, timeout, path, storeName, isLocal, timeout, event)
            }
        })
        .catch((error) => {
            console.error('Error during gather ', path, storeName, error)
            if (!Liferay.ThemeDisplay.isSignedIn() && timeout) {
                setTimeout(updateSessionStoreData, timeout, path, storeName, isLocal, timeout, event);
            }
        });
}

function showMaintenanceBreak() {
    if (!document.body.classList.contains("maintenance-break")) {
        document.body.classList.add("maintenance-break");
        let estimateDateTimestamp = window.Liferay.BitBay.initializedData[MAINTENANCE_BREAK_EST];
        let maintenanceMessage;
        let languageId = Liferay.ThemeDisplay.getLanguageId()
        if (estimateDateTimestamp == undefined || new Date().getTime() >= estimateDateTimestamp) {
            let messages = LANGUAGE_MAP["zonda-maintenance-break-information"];
            maintenanceMessage = messages[languageId] ? messages[languageId] : messages["default"];
        } else {
            let estimateDate = new Date(estimateDateTimestamp);
            let timeString = estimateDate.getHours() + ":" + (estimateDate.getMinutes() < 10 ? '0' : '') + estimateDate.getMinutes() + " " + estimateDate.getDate() + "/" + (estimateDate.getMonth() + 1) + "/" + estimateDate.getFullYear();
            let messages = LANGUAGE_MAP["zonda-maintenance-break-information-with-time"];
            maintenanceMessage = messages[languageId] ? messages[languageId] : messages["default"];
            maintenanceMessage = maintenanceMessage.replace("${breakTime}", timeString);
        }
        document.querySelectorAll(".maintenance-break--js").forEach(element => {
            element.textContent = maintenanceMessage;
        })
    }
}

function hideMaintenanceBreak() {
    document.body.classList.remove("maintenance-break")
}

function initSessionStorage() {
    Liferay.BitBay.bbDebugger ? console.debug("start init session storage bbConfig", bbConfig) : "";
    updateSessionStoreData(status, MAINTENANCE_BREAK, false, 10000, maintenanceBreakEvent);

    if (bbConfig.gatherCurrencyInfo) {
        updateSessionStoreData(currenciesInfo, CURRENCY_INFO_STORE_NAME, true, 0);
    }
    if (bbConfig.usePayCoinList) {
        updateSessionStoreData(currenciesPayInfo, CURRENCY_PAY_INFO_STORE_NAME, true, 0);
    }
    if (bbConfig.gatherCurrencyLanguageMap) {
        updateSessionStoreData(languageCurrencyMapperPath, LANGUAGE_MAP_STORE_NAME, true, 0);
    }
    if (bbConfig.gatherSecondCurrenciesOrder) {
        updateSessionStoreData(secondCurrenciesOrderPath, SECOND_CURRENCIES_LIST_STORE_NAME, true, 5 * MINUTE_IN_MILIS, secondCurrenciesOrderEvent);
    }
    if (bbConfig.gatherPromotedData) {
        updateSessionStoreData(promotedCurrenciesPath, PROMOTED_STORE_NAME, true, 5 * MINUTE_IN_MILIS, promotedDataEvent);
    }
    if (bbConfig.gatherTickerData) {
        updateSessionStoreData(tickerPath, TICKER_STORE_NAME, false, 5000, tickerEvent);
    }
    if (bbConfig.gatherStatsData) {
        updateSessionStoreData(statsPath, STATS_STORE_NAME, false, 5000, statsEvent);
    }

    if (bbConfig.gatherStatsData && bbConfig.gatherTickerData && bbConfig.gatherExtremumData) {
        initPerformersList();
    }

    if (bbConfig.gatherVolumeData) {
        updateSessionStoreData(volumenPath, VOLUME_STORE_NAME, true, MINUTE_IN_MILIS, volumenDataEvent);
    }

    if (bbConfig.gatherAverageRate) {
        updateSessionStoreData(averageRatePath, AVERAGE_RATE_STORE_NAME, true, 5 * MINUTE_IN_MILIS, averageRateEvent);
    }

}

function initPerformersList() {
    let initializedData = window.Liferay.BitBay.initializedData;
    window.Liferay.BitBay.bbInitializerDebugger ? console.info('initPerformersList data') : ""

    if (initializedData[STATS_STORE_NAME] && initializedData[TICKER_STORE_NAME] && initializedData[CURRENCY_INFO_STORE_NAME] &&
        initializedData[MAINTENANCE_BREAK]) {
        updatePerformersList();
    } else {
        setTimeout(initPerformersList, 100);
    }
}

function updatePerformersList() {
    let weakestFirst = new Array(), topFirst = new Array(), weakestPerformers = new Array(),
        topPerformers = new Array();
    let jsonResult = {"topPerformers": new Array(), "weakestPerformers": new Array()}
    let stats = JSON.parse(window.sessionStorage.getItem(STATS_STORE_NAME)).items;
    let ticker = JSON.parse(window.sessionStorage.getItem(TICKER_STORE_NAME)).items;
    let currenciesInfoList = JSON.parse(window.sessionStorage.getItem(CURRENCY_INFO_STORE_NAME)).currencies;

    let sortedMarkets = Object.keys(stats)
        .sort(function (keyA, keyB) {
            return calculateChange(keyB, ticker, stats) - calculateChange(keyA, ticker, stats);
        });
    sortedMarkets.every(key => {
        var firstCurrency = key.split("-")[0];
        if (!topFirst.includes(firstCurrency)) {
            var performerceObject = createPerformerObject(key, stats, ticker, currenciesInfoList);
            if (performerceObject && performerceObject.rateChange != "Infinity") {
                topFirst.push(firstCurrency)
                topPerformers.push(key);
                jsonResult.topPerformers.push(performerceObject);
            }
        }
        return true;
    });

    sortedMarkets.reverse().every(key => {
        var firstCurrency = key.split("-")[0];
        if (!weakestFirst.includes(firstCurrency)) {
            var performerceObject = createPerformerObject(key, stats, ticker, currenciesInfoList);
            if (performerceObject && performerceObject.rateChange != "Infinity") {
                weakestFirst.push(firstCurrency);
                weakestPerformers.push(key);
                jsonResult.weakestPerformers.push(performerceObject);
            }
        }
        return true;
    });

    window.sessionStorage.setItem("topPerformers", JSON.stringify(topPerformers));
    window.sessionStorage.setItem("weakestPerformers", JSON.stringify(weakestPerformers));
    window.sessionStorage.setItem("performersData", JSON.stringify(jsonResult));
    window.Liferay.BitBay.initializedData["extremumCurrencies"] = true;
    window.dispatchEvent(extremumDataEvent);
    setTimeout(updatePerformersList, 5000);
}

function calculateChange(key, ticker, stats) {
    let tickerData = ticker[key];
    if (tickerData) {
        let currentRate = tickerData.rate;
        let last24hRate = stats[key].r24h;
        return Number((currentRate - last24hRate) / last24hRate);
    }

    return 0;
}

function createPerformerObject(key, stats, ticker, infoList) {
    let tickerKeyElement = ticker[key];
    if (tickerKeyElement) {
        let price = tickerKeyElement.rate;
        let currencyArray = key.split("-");
        let first = currencyArray[0].toUpperCase();
        let firstInfo = infoList[first];
        if(typeof firstInfo !== 'undefined') {
            let fullName = firstInfo.fullName.concat(" (", firstInfo.displayName.toUpperCase(), ")");
            let rateChange = (calculateChange(key, ticker, stats) * 100);
            return {
                "key": key,
                "img": firstInfo.img,
                "fullName": fullName,
                "rateChange": rateChange,
                "price": price
            }
        }
    }
    return "";
}

initSessionStorage();
