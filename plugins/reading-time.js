document.addEventListener("DOMContentLoaded", function() {
    if (document.body.classList.contains('post')) {
    const main = document.querySelector('main');
    const text = main.textContent.trim();
    const charCount = text.length;
    const readingTime = Math.ceil(charCount / 1200); // 1200 characters per minute
    const p = document.createElement('p');
    p.className = 'reading-time';
    p.textContent = `Reading time: ${readingTime} minute${readingTime === 1 ? '' : 's'}`;
    main.insertBefore(p, main.children[2]);
    }
});