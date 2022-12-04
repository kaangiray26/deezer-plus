// spoofer.js

const keys = ['userAgent', 'appVersion', 'platform', 'vendor', 'product', 'oscpu'];

function setUserAgent(userAgent) {
    Object.defineProperty(navigator, "userAgent", {
        get: function () {
            return userAgent;
        },
        configurable: true
    });
}

function setAppVersion(appVersion) {
    Object.defineProperty(navigator, "appVersion", {
        get: function () {
            return appVersion;
        },
        configurable: true
    });
}

function setPlatform(platform) {
    Object.defineProperty(navigator, "platform", {
        get: function () {
            return platform;
        },
        configurable: true
    });
}
function setOscpu(oscpu) {
    Object.defineProperty(navigator, "oscpu", {
        get: function () {
            return oscpu;
        },
        configurable: true
    });
}

setUserAgent('Mozilla/5.0 (X11; Linux x86_64; rv:107.0) Gecko/20100101 Firefox/107.0');
setAppVersion('5.0 (X11)');
setPlatform('Linux x86_64');
setOscpu('Linux x86_64');