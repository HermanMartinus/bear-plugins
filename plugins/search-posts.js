document.addEventListener("DOMContentLoaded", function () {
    if (document.body.classList.contains('blog')) {
        // Select the main container and the blog posts list
        const mainContainer = document.querySelector('main');
        const blogPosts = document.querySelector('.blog-posts');

        // Create the search component
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'searchInput';
        searchInput.placeholder = 'Search...';
        searchInput.style.display = 'block';

        mainContainer.insertBefore(searchInput, blogPosts);

        // Add event listener to filter posts based on input
        searchInput.addEventListener('input', function () {
            const searchTerm = this.value.toLowerCase();
            const posts = document.querySelectorAll('.blog-posts li');

            posts.forEach(post => {
                const title = post.textContent.toLowerCase();
                post.style.display = title.includes(searchTerm) ? '' : 'none';
            });
        });

    }
});