document.addEventListener('DOMContentLoaded', function() {
    if ($textarea) {
        $textarea.addEventListener('input', autoResize, false);

        function autoResize() {
            this.style.height = 'auto';
            this.style.height = this.scrollHeight + 'px';
        }
        autoResize.call($textarea);

        window.scrollTo(0, sessionStorage.getItem('scrollY'))
        window.addEventListener("scroll", function(event) {
            sessionStorage.setItem('scrollY', window.scrollY);
        });
    }
});
