// ==UserScript==
// @name Hypixel Daily Reward Ad Skipper
// @namespace https://synchronousx.github.io/
// @description Skip the video ad appearing when claiming your daily reward.
// @version 2.0.1
// @author Synchronous
// @copyright 2018+, Synchronous
// @license MIT
// @homepageURL https://synchronousx.github.io/scripts
// @updateURL https://synchronousx.github.io/scripts/hypixel-daily-reward-ad-skipper.meta.js
// @downloadURL https://synchronousx.github.io/scripts/hypixel-daily-reward-ad-skipper.user.js
// @supportURL https://github.com/SynchronousX/synchronousx.github.io/issues
// @run-at document-start
// @match *://rewards.hypixel.net/claim-reward/*
// ==/UserScript==

(function() {
    'use strict';

    const skipButtonClass = 'index__skipButton___3ihHt';

    defer(function() {
        const appData = JSON.parse(window.appData);
        if (!appData.skippable) {
            appData.skippable = true;
            window.appData = JSON.stringify(appData);
        }
    }, function() {
        return window.appData;
    }, 0);

    defer(function() {
        document.getElementsByClassName(skipButtonClass)[0].click();
    }, function() {
        if (document.getElementsByClassName(skipButtonClass).length) {
            const iframes = document.getElementsByTagName('iframe');
            return iframes.length && YT.get(iframes[0].id).pauseVideo;
        }

        return false;
    }, 0);

    function defer(func, conditionFunc, interval) {
        if (conditionFunc()) {
            func();
        } else {
            setTimeout(function() {
                defer(func, conditionFunc, interval);
            }, interval);
        }
    }
})();
