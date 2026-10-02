/*
 Plugin name: Hide current post from embeds
 Description: Removes the current post from embedded post lists when viewing a post
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';

    // Strip leading and trailing slashes so "/my-post/" and "/my-post" match
    function normalizePath(path) {
        return path.replace(/^\/+|\/+$/g, '');
    }

    document.addEventListener("DOMContentLoaded", function() {
        if (!document.body.classList.contains('post')) {
            return;
        }

        const currentPath = normalizePath(window.location.pathname);
        if (!currentPath) {
            return;
        }

        const listItems = document.querySelectorAll('ul.blog-posts li, .embedded li');

        listItems.forEach(function(listItem) {
            const link = listItem.querySelector('a[href]');
            if (!link) {
                return;
            }

            // Resolve relative and absolute hrefs, and only match links on this blog
            const linkUrl = new URL(link.getAttribute('href'), window.location.href);
            if (linkUrl.host !== window.location.host) {
                return;
            }

            if (normalizePath(linkUrl.pathname) === currentPath) {
                listItem.remove();
            }
        });
    });
})();
