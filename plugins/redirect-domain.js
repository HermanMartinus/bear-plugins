/*
 Plugin name: Redirect www to root
 Description: Redirects the www subdomain to the root domain
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';
    
    if (window.location.hostname.startsWith('www.')) {
        window.location.replace(
            window.location.href.replace('://www.', '://')
        );
    }
})();