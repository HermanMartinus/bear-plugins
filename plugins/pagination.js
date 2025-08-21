if (document.body.classList.contains('blog')) {
    // Add pagination controls
    const paginationDiv = document.createElement('div');
    paginationDiv.innerHTML =  `<div style="text-align: center; margin: 20px 0;">    <button id="prevPage">Previous</button>    <span id="pageInfo"></span>    <button id="nextPage">Next</button>  </div>;`
    document.querySelector('.blog-posts').after(paginationDiv);

    // Pagination logic
    const posts = document.querySelectorAll('.blog-posts li');
    const postsPerPage = 10;
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