/*
 Plugin name: Multi-language post
 Description: Write a post in several languages and let readers switch between them. Start each language with a line like {lang: en}. End the last one with {/lang} if shared content follows.
 Author: cuuthegioi
 Author URI: https://blog.sonngo.dev
*/

(function() {
    'use strict';

    // --- Configuration ---
    const LABELS = { en: 'English', vi: 'Tiếng Việt', ja: '日本語', 'en-x-tldr': 'TL;DR' }; // Unknown codes show as upper case
    const DEFAULT_LANG = ''; // Empty: use the first language in the post
    const STORAGE_KEY = 'multi-language-post';
    // ---------------------

    // Matches {lang: xx} or {/lang} at the start of a paragraph, alone on its line
    const MARKER = /^\s*\{\s*(?:lang\s*:\s*([a-zA-Z]{2,3}(?:-[a-zA-Z0-9]+)*)|\/\s*lang)\s*\}[ \t]*(?:\r?\n|$)/;

    // Markdown joins a marker and the next line into one paragraph, so strip the marker and keep the rest.
    function readMarker(node) {
        if (node.nodeType !== Node.ELEMENT_NODE || node.tagName !== 'P') return null;
        const first = node.firstChild;
        if (!first || first.nodeType !== Node.TEXT_NODE) return null;
        const match = first.data.match(MARKER);
        if (!match) return null;

        first.data = first.data.slice(match[0].length);
        if (first.data === '') first.remove();
        if (node.firstChild && node.firstChild.nodeName === 'BR') node.firstChild.remove();

        const isEmpty = node.textContent.trim() === '' && !node.querySelector('img, iframe, video, audio');
        return { lang: match[1] ? match[1].toLowerCase() : null, rest: isEmpty ? null : node };
    }

    // Bear adds tags, the upvote form and scripts after the post body; a block must not swallow them.
    function isBearChrome(node) {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        return node.matches('p.tags, #upvote-form, script');
    }

    function readStoredLang() {
        try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
    }

    function storeLang(lang) {
        try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage blocked */ }
    }

    function pickInitialLang(langs) {
        const fromUrl = new URLSearchParams(window.location.search).get('lang');
        const fromBrowser = (navigator.languages || [navigator.language]).map(function(l) {
            return String(l).toLowerCase();
        });
        const candidates = [fromUrl, readStoredLang()]
            .concat(fromBrowser)
            .concat(fromBrowser.map(function(l) { return l.split('-')[0]; }))
            .concat([DEFAULT_LANG]);

        for (let i = 0; i < candidates.length; i++) {
            const c = candidates[i] && candidates[i].toLowerCase();
            if (c && langs.indexOf(c) !== -1) return c;
        }
        return langs[0];
    }

    document.addEventListener('DOMContentLoaded', function() {
        const body = document.body.classList;
        if (!body.contains('post') && !body.contains('page')) return;

        const main = document.querySelector('main');
        if (!main) return;

        // 1. Group the nodes between markers into one wrapper per language
        const blocks = {};
        const langs = [];
        let current = null;
        let firstBlock = null;

        Array.from(main.childNodes).forEach(function(node) {
            if (isBearChrome(node)) { current = null; return; }

            const marker = readMarker(node);
            if (marker && marker.lang) {
                const lang = marker.lang;
                current = document.createElement('div');
                current.className = 'lang-block';
                current.lang = lang;
                main.insertBefore(current, node);
                if (!blocks[lang]) { blocks[lang] = []; langs.push(lang); }
                blocks[lang].push(current);
                if (!firstBlock) firstBlock = current;
                if (marker.rest) current.appendChild(node); else node.remove();
                return;
            }
            if (marker) {
                current = null;
                if (!marker.rest) node.remove();
                return;
            }

            if (current) current.appendChild(node);
        });

        if (langs.length === 0) return;

        // 2. Build the switcher
        const switcher = document.createElement('nav');
        switcher.className = 'lang-switcher';
        switcher.setAttribute('aria-label', 'Language');

        const buttons = {};
        langs.forEach(function(lang) {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.lang = lang;
            btn.textContent = LABELS[lang] || lang.toUpperCase();
            btn.addEventListener('click', function() { show(lang, true); });
            buttons[lang] = btn;
            switcher.appendChild(btn);
        });

        const style = document.createElement('style');
        style.textContent =
            '.lang-switcher{display:flex;flex-wrap:wrap;gap:.5em;margin:1em 0}' +
            '.lang-switcher button{font:inherit;color:inherit;background:none;border:1px solid currentColor;border-radius:3px;padding:.1em .6em;opacity:.6}' +
            '.lang-switcher button[aria-pressed="true"]{opacity:1;font-weight:bold}';
        document.head.appendChild(style);

        firstBlock.parentNode.insertBefore(switcher, firstBlock);

        // 3. Show one language
        function show(lang, fromClick) {
            langs.forEach(function(l) {
                blocks[l].forEach(function(block) { block.hidden = l !== lang; });
                buttons[l].setAttribute('aria-pressed', String(l === lang));
            });
            document.documentElement.lang = lang;
            if (fromClick) {
                storeLang(lang);
                const url = new URL(window.location.href);
                url.searchParams.set('lang', lang);
                history.replaceState(null, '', url);
            }
        }

        show(pickInitialLang(langs), false);
    });
})();
