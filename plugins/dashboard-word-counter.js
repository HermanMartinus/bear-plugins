/*
 Plugin name: Word Counter
 Description: Displays the number of words in the content of your blog post, updates as you type.
 Author: ReedyBear
 Author URI: https://reedybear.bearblog.dev/bearblog/ 
 Author URI 2: https://gitlab.com/taeluf/other/bearblog-stuff
*/
(function() {
    'use strict';



    ////// CONFIGURATIONS //////
    /* This text is appended to the word count. Does _not_ accept HTML */
    let counter_text = " words ";
    /* the word counter display is appended to this element */
    let counter_parent_selector = "form.post-form > p.sticky-controls";
    /* The class used for styling. Use `span.counter-display` in your CSS (for default) */
    let counter_css_class = "counter-display";



    // create the element here so it can be referenced by the functions.
    let counter_display = document.createElement('span');
    counter_display.classList.add(counter_css_class);
    // We normally only update wordcount after space/enter/backspace. But if the last key was a space/enter/backspace, then we'll allow a wordcount update on the next keypress.
    let pending_update = true;

    let update_word_count = function(event_name, event){

        // we only update wordcount for certain keys
        // we always update word count on click and on change
        if (event_name == 'keyup'){
            if (event.code == 'Space'
                || event.code == 'Enter'
                || event.code == 'Backspace'
            ){
                pending_update = true;
                // do nothing, i.e. DONT return, so that we perform word count
            } else if (pending_update === false){
                // console.log(event.code);
                // its not a whitespace, so we DO RETURN and do NOT update word count
                return;
            } else {
                pending_update = false;
            }
        } 
        // KNOWN ISSUE: With cut/paste event, pending_update doesn't work. The setTimeout causes it to lose scope (I think), and so even if I set pending_update=true, it doesn't actually cause an update on the next keypress.

        const body_content = document.querySelector('textarea#body_content');
        if (body_content == null) return;

        const text = body_content.value;
        // Word count code modified from examples at https://stackoverflow.com/a/18679657
        // Check if text is empty
        // Else `/\s+/`matches a series of whitespace characters
        //    we get array with only words
        //    and check its length
        const num_words = text.trim() == '' ? 0 : text.trim().split(/\s+/).length;

        counter_display.innerText = num_words + counter_text;
    }

    const activate_word_counter = function(){
        const is_edit_post_page = document.querySelector('body.edit-page');
        if (is_edit_post_page == null)return;

        const body_content = document.querySelector('textarea#body_content');
        if (body_content == null) return;

        const sticky_controls = document.querySelector(counter_parent_selector);
        if (sticky_controls == null){
            console.log("Cannot add word counter because '"+counter_parent_selector+"' not found");
            return;
        }

        sticky_controls.appendChild(counter_display);

        body_content.addEventListener('keyup', update_word_count.bind(null, 'keyup'));
        body_content.addEventListener('change', update_word_count.bind(null, 'change'));
        body_content.addEventListener('click', update_word_count.bind(null, 'click'));
        // Cut & Paste events trigger BEFORE the cut or paste is actually performed
        // setTimeout with 0 delay causes it to "execute in the next event cycle", per mdn
        body_content.addEventListener('cut', 
            setTimeout.bind(null,update_word_count.bind(this, 'cut'),0)
        );
        body_content.addEventListener('paste', 
            setTimeout.bind(null,update_word_count.bind(this, 'paste'),0)
        );
        update_word_count('manual');
    };

    if (document.readyState === "loading"){
        document.addEventListener('DOMContentLoaded', activate_word_counter);
    } else {
        activate_word_counter();
    }
})();
