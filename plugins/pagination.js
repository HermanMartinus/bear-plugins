/*
 Plugin name: Blog pagination
 Description: Add pagination to blog page and post embeds instead of displaying all posts at once. 
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';

    document.addEventListener("DOMContentLoaded", function() {
        if (document.body.classList.contains('blog')) {
            // Add pagination controls
            const paginationDiv = document.createElement('div');
            paginationDiv.innerHTML = '<div class="pagination"><a id="prevPage">Previous</a><span id="pageInfo"></span><a id="nextPage">Next</button></a></div>';

            document.querySelector('.blog-posts').after(paginationDiv);

            // Pagination logic
            const postsPerPage = 20;
            const posts = document.querySelectorAll('.blog-posts li');
            const totalPages = Math.ceil(posts.length / postsPerPage);
            let currentPage = 1;

            function showPage(page) {
                const start = (page - 1) * postsPerPage;
                const end = start + postsPerPage;

                posts.forEach((post, index) => {
                    post.style.display = (index >= start && index < end) ? '' : 'none';
                });

                document.getElementById('pageInfo').textContent = `Page ${page} of ${totalPages}`;
                document.getElementById('prevPage').disabled = page === 1;
                document.getElementById('nextPage').disabled = page === totalPages;
            }

            document.getElementById('prevPage').onclick = () => {
                if(currentPage > 1) showPage(--currentPage);
            };

            document.getElementById('nextPage').onclick = () => {
                if(currentPage < totalPages) showPage(++currentPage);
            };

            showPage(1);
        }
    });
})();