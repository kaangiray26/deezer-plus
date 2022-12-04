// spoofer.js

const keys = ['userAgent', 'appVersion', 'platform', 'vendor', 'product', 'oscpu'];

for (let key of keys) {
    Object.defineProperty(navigator, key, {
        get: function () { return '.'; }
    });
}