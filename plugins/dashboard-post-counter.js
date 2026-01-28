/*
 Plugin name: Dashboard post counter
 Description: Count and display total posts and pages in the dashboard.
 Author: Mighil 
 Author URI: https://mgx.bearblog.dev
*/

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function() {
        const postList = document.querySelector('ul.post-list');
        if (postList) {
            const allPosts = postList.querySelectorAll('li');
            const totalCount = allPosts.length;
            
            // Count drafts (posts with "not published" text)
            let draftCount = 0;
            allPosts.forEach(post => {
                const smallElement = post.querySelector('small');
                if (smallElement && smallElement.textContent.includes('not published')) {
                    draftCount++;
                }
            });
            
            const publishedCount = totalCount - draftCount;
            
            const h1Element = document.querySelector('main h1');
            if (h1Element) {
                const countSpan = document.createElement('span');
                countSpan.textContent = ` (${publishedCount} published, ${draftCount} drafts)`;
                countSpan.style.fontSize = '0.8em';
                countSpan.style.fontWeight = 'normal';
                countSpan.style.color = '#777';
                h1Element.appendChild(countSpan);
            }
        }
    });
})();