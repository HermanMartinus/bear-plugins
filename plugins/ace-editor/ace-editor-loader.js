(document.readyState === "loading"
    ? document.addEventListener.bind(this, 'DOMContentLoaded')
    : function (f) { f(); }.bind(this)
).call(this,
    function () {
        // Only run if the page has an element named `$textarea`
        if ($textarea) {
            // Make the default text area invisible. It still exists and holds the current page or post content, but it just isn't shown on screen
            $textarea.style.display = "none";

            // ace-editor needs a div with a given ID to be created.
            // This creates a new div right after the invisible text area
            // to be transformed into the editor
            $aceDiv = document.createElement("div");
            $aceDiv.id = "ace-editor";
            $aceDiv.style.height = "700px";
            $textarea.insertAdjacentElement('afterend', $aceDiv);

            // Now that the div is ready, create the editor
            var editor = ace.edit("ace-editor");

            // Apply theme and set the editing mode to markdown so syntax highlighting works
            editor.setTheme("ace/theme/solarized_dark");
            editor.session.setMode("ace/mode/markdown");

            // Populate ace-editor with the existing page or post content in the hidden text area
            editor.setValue($textarea.value);

            // Reset the cursor back to the top of the editor
            editor.gotoLine(0);

            // Allow scrolling past the last line of the editor. This is a personal preference, but I think it works well in this case!
            editor.setOption("scrollPastEnd", 0.5);

            // Wrap long lines at the editor's width to avoid having to scroll horizontally
            editor.session.setUseWrapMode(true);

            // When you click the "Publish" button, Bear saves the text that is in the original hidden text area, not the text in ace-editor

            // These last lines make sure that any modifications to the text in ace-editor get synced to the hidden text area, so that your edited content gets saved when you click "Publish"
            editor.session.on("change", function (delta) {
                $textarea.value = editor.getValue();
            });
        }
    });
