/*
 Plugin name: Editor shortcut
 Description: Easily open the post or homepage editor using Ctrl + E
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';

    window.addEventListener('keydown', function(e) {
        // Trigger on Ctrl + E
        if (e.ctrlKey && e.code === 'KeyE') {
            e.preventDefault();

            // 1. Get the "name" from the tag with the specific content key
            const nameTag = document.querySelector('meta[content="look-for-the-bear-necessities"]');
            const name = nameTag ? nameTag.getAttribute('name') : null;

            // 2. Get the "token" from your new meta tag
            const tokenTag = document.querySelector('meta[name="token"]');
            const token = tokenTag ? tokenTag.getAttribute('content') : null;

            // 3. Build URL and Redirect

            let finalUrl = `https://bearblog.dev/${name}/dashboard/`
            if (name && token) {
                finalUrl = `https://bearblog.dev/${name}/dashboard/posts/${token}/`
                window.open(finalUrl, '_blank');
            } else {
                window.open(finalUrl, '_blank');
            }
        }
    });
})();