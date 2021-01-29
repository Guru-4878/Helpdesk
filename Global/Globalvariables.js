"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GlobalUtils = /** @class */ (function () {
    function GlobalUtils() {
        this.tokenKey = "AJPCode";
        this.tokenName = "AJPName";
    }
    GlobalUtils.getSiteCollectionUrl = function () {
        if (window
            && "location" in window
            && "protocol" in window.location
            && "pathname" in window.location
            && "host" in window.location) {
            var baseUrl = window.location.protocol + "//" + window.location.host;
            var pathname = window.location.pathname;
            var siteCollectionDetector = "/sites/";
            if (pathname.indexOf(siteCollectionDetector) >= 0) {
                baseUrl += pathname.substring(0, pathname.indexOf("/", siteCollectionDetector.length));
            }
            return baseUrl;
        }
        return null;
    };
    GlobalUtils.getCurrentAbsoluteSiteUrl = function () {
        if (window
            && "location" in window
            && "protocol" in window.location
            && "pathname" in window.location
            && "host" in window.location) {
            return window.location.protocol + "//" + window.location.host + window.location.pathname;
        }
        return null;
    };
    GlobalUtils.getWebServerRelativeUrl = function () {
        if (window
            && "location" in window
            && "pathname" in window.location) {
            return window.location.pathname.replace(/\/$/, "");
        }
        return null;
    };
    GlobalUtils.getLayoutsPageUrl = function (libraryName) {
        if (window
            && "location" in window
            && "pathname" in window.location
            && libraryName !== "") {
            return window.location.pathname.replace(/\/$/, "") + "/_layouts/15/" + libraryName;
        }
        return null;
    };
    GlobalUtils.getAbsoluteDomainUrl = function () {
        if (window
            && "location" in window
            && "protocol" in window.location
            && "host" in window.location) {
            return window.location.protocol + "//" + window.location.host;
        }
        return null;
    };
    GlobalUtils.prototype.getBaseUrl = function () {
        return document.getElementsByTagName('base')[0].href;
    };
    GlobalUtils.prototype.RedirectLogin = function () {
        return this.getBaseUrl() + "login?returnUrl=" + this.getBaseUrl() + "#/logout";
    };
    GlobalUtils.prototype.CasStore = function (KEY, Name) {
        sessionStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.tokenName);
        sessionStorage.setItem(this.tokenKey, KEY);
        sessionStorage.setItem(this.tokenName, Name);
    };
    GlobalUtils.prototype.CasStoreObject = function (KEY) {
        sessionStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.tokenName);
        console.log(KEY);
        if (KEY.length > 0) {
            for (var i = 0; i < KEY.length; i++) {
                var AJPToken = KEY[i]["EmployeeCode"].toString();
                var AJPTokenName = KEY[i]["EmployeeName"].toString();
                sessionStorage.setItem(this.tokenKey, AJPToken);
                sessionStorage.setItem(this.tokenName, AJPTokenName);
            }
        }
        else {
            sessionStorage.setItem(this.tokenKey, "0");
            sessionStorage.setItem(this.tokenName, "0");
        }
    };
    GlobalUtils.prototype.CasRetrieveAJPCode = function () {
        var storedToken = sessionStorage.getItem(this.tokenKey);
        if (!storedToken)
            throw '0';
        return storedToken;
    };
    GlobalUtils.prototype.CasRetrieveAJPName = function () {
        var storedToken = sessionStorage.getItem(this.tokenName);
        if (!storedToken)
            throw '0';
        return storedToken;
    };
    GlobalUtils.prototype.CasRetrieveClear = function () {
        sessionStorage.removeItem(this.tokenKey);
        sessionStorage.removeItem(this.tokenName);
        sessionStorage.clear();
        sessionStorage.setItem(this.tokenKey, "0");
        sessionStorage.setItem(this.tokenName, "0");
    };
    return GlobalUtils;
}());
exports.GlobalUtils = GlobalUtils;
//# sourceMappingURL=Globalvariables.js.map