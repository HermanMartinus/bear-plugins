// Ensure you add the import for the Overtype library above this one
// <script src="https://unpkg.com/overtype"></script>

document.addEventListener('DOMContentLoaded', function() {
    if ($textarea) {
        $textarea.style.display = "none";
        $uploadButton.style.display = "none"; // This is incompatible with the editor

        if ($textarea) {
            $overtypeDiv = document.createElement('div');
            $overtypeDiv.className = 'overtype-editor';
            $overtypeDiv.style.height = '700px';
            $textarea.insertAdjacentElement('afterend', $overtypeDiv);
        }

        const OT = window.OverType.default || window.OverType;
        // Initialize all toolbar editors
        new OT('.overtype-editor', {
            value: $textarea.value,
            toolbar: true,
            theme: 'cave',
            showStats: true,
            placeholder: '...',
            onChange: (value, instance) => {
                $textarea.value = value;
            }
        });

        $overtypeTextarea = document.querySelector('.overtype-input');
        
        $overtypeTextarea.scrollTop = sessionStorage.getItem('overtypeEditorY') || 0
        $overtypeTextarea.addEventListener("scroll", function(e){
            sessionStorage.setItem('overtypeEditorY', $overtypeTextarea.scrollTop)
        })
    }
});



