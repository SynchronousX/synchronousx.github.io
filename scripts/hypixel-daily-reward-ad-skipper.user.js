// ==UserScript==
// @name Hypixel Daily Reward Ad Skipper
// @namespace https://synchronousx.github.io/
// @description Skip the video ad appearing when claiming your daily reward.
// @version 1.0.0
// @author Synchronous
// @copyright 2018+, Synchronous
// @license MIT
// @homepageURL https://synchronousx.github.io/scripts
// @updateURL https://synchronousx.github.io/scripts/hypixel-daily-reward-ad-skipper.meta.js
// @downloadURL https://synchronousx.github.io/scripts/hypixel-daily-reward-ad-skipper.user.js
// @supportURL https://github.com/SynchronousX/synchronousx.github.io/issues
// @match *://rewards.hypixel.net/claim-reward/*
// ==/UserScript==

(function() {
    'use strict';

    function removeElements(selector) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
            element.parentNode.removeChild(element);
        }
    }

    function removeBodyDivs() {
        removeElements('body > div');
    }

    function removeScripts(srcPattern) {
        const scripts = document.getElementsByTagName('script');
        for (const script of scripts) {
            if (script.src.match(srcPattern) !== null) {
                script.remove();
            }
        }
    }

    function insertScript(src) {
        const script = document.createElement('script');
        script.src = src;
        document.body.appendChild(script);
    }

    const targetSrcPattern = /app\.js(\?v=)?.*/;
    const newSrc = 'https://cdn.rawgit.com/SynchronousX/7646b731830a8f9289eb87dc815af89c/raw/1912039f12f6608f937d48bbcfb4a94a27750906/app.js';

    removeScripts(targetSrcPattern);
    removeBodyDivs();
    insertScript(newSrc);
})();
