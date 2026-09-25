/*
 Plugin name: Tag Autocomplete
 Description: Adds autocomplete when you're typing tags on your edit post page
 Author: ReedyBear
 Author URI: https://reedybear.bearblog.dev/bearblog/ 
 Author URI 2: https://gitlab.com/taeluf/other/bearblog-stuff
*/
(function() {
    'use strict';

    ////// CONFIGURATIONS //////
    const config = {
        /* if 'false', then longer tags are displayed first in the list */
        short_tags_come_first: true,
        /** maximum number of suggestions to display. */
        max_suggestions: 10,
        /** set 'true' to show autosuggestion even when you the word-under-cursor is empty */
        allow_empty_autosuggest: false,

        /* As long as the word you typed is contained in your tag, it is displayed. Set to 'true' and only tags STARTING with what you typed will be displayed */
        start_match_only: false,
        /** When the autosuggestion box is visible, it is set to display: grid (*or whatever you configure here*) */
        display_visible: "grid",
        /** The styles defined on the autosuggestion box. You can also set this blank and put these styles on your theme. */
        styles:
        `
            .autosuggest_box {
                --background_color: #fff;
                --text_color: #000;
                --divider_color: #000;
                --direction: row; /* 'column' for horizontal layout, 'row' for vertical layout */

                display:none; 
                position: absolute;

                grid-template-rows: auto;
                grid-template-columns: auto;
                grid-auto-flow: var(--direction); 
                grid-gap: 1px;

                border: 1px solid var(--divider_color);
                border-radius: 2px;

                min-width: 10ch;
                padding: 0px;
                margin: 0px;
                background: var(--divider_color);
            }
            .autosuggest_box > button {
                background: var(--background_color);
                border: none;
                color: var(--text_color);
                border-radius: 0px;
                margin: 0px;
                padding: 4px 8px;
                text-wrap: nowrap;
            }

            .autosuggest_box > button:focus, .autosuggest_box > button:hover {
                background-color: var(--text_color);
                color: var(--background_color);
            }
        `,
    };

    const Plugin = {
        /** the text node where you type your tags list */
        text_node: null,
        /** The start of the word (*tag*) your cursor is on */
        start_index: null,
        /** the end of the word (*tag*) your cursor is on */
        end_index: null,
        /** the node used to display autosuggestions */
        autosuggest_box: null,
        /* list of all tags printed in the attributes section */
        tags: null,
    };

    /** Sets Plugin.tags to array of all tags defined in the attributes section */
    Plugin.make_tag_list = function(){
        const all_attributes = document.querySelector('form.post-form > details > p').textContent.split("\n");
        const tags = [];
        for (const entry of all_attributes){
            if (entry.trim().startsWith('tags:')){
                const all_tags = entry
                    .trim()
                    .substring(5)
                    .split(',')
                    .map(function(v){return v.trim()});

                Plugin.tags = all_tags;
                return;
            }
        }

        console.log("Could not load taglist for tag autocomplete.");
        Plugin.tags = [];
    }


    /** replace the currently-typed text with the selected tag's text. */
    Plugin.select_current_tag = function(tag_text){

        Plugin.text_node.textContent = 
            Plugin.text_node.textContent.substring(0, Plugin.start_index)
            + tag_text
            + Plugin.text_node.textContent.substring(Plugin.end_index);

        const position = Plugin.start_index + tag_text.length;

        // setting caret position modified from https://stackoverflow.com/questions/6249095/how-to-set-the-caret-cursor-position-in-a-contenteditable-element-div
        const range = document.createRange();
        const selection = window.getSelection();

        range.setStart(Plugin.text_node, position);
        range.collapse(true);

        selection.removeAllRanges();
        selection.addRange(range);

    }

    /**
     * Generate the ui component and add it to the document, returning the node. Also setup the styles.
     */
    Plugin.make_autosuggest_box = function(){
        const post_header = document.querySelector('div#header_content');

        const box = document.createElement('div');
        Plugin.autosuggest_box = box;
        box.contentEditable = false;
        box.classList.add('autosuggest_box');
        post_header.appendChild(box);

        box.addEventListener('keydown', 
            function(event){
                // prevent printing a new line in the header content box
                if (event.key == 'Enter'
                    ||event.key == ' '
                    ||event.key == 'Backspace'
                ){
                    event.stopPropagation();
                    event.preventDefault();
                } 

            }
        );

        box.addEventListener('keyup', 
            function(event){
                if (event.target.tagName !== 'BUTTON')return;
                if (event.key != 'Enter' 
                    && event.key != ' ')return;
                if (event.key == 'Backspace'){
                    event.stopPropagation();
                    event.preventDefault();
                    return;
                }


                event.stopPropagation();
                event.preventDefault();

                Plugin.select_current_tag(event.target.innerText);
                box.style.display = "none";
            }
        );

        box.addEventListener('click', 
            function(event){
                if (event.target.tagName !== 'BUTTON')return;
                event.stopPropagation();
                event.preventDefault();
                Plugin.select_current_tag(event.target.innerText);
                box.style.display = "none";
            }

        );


        const head = document.querySelector('head');
        const style_node = document.createElement('style');
        style_node.appendChild(document.createTextNode(config.styles));
        head.insertBefore(style_node, head.firstElementChild);

        return box;
    }

    /** Move the autosuggestion box to appear beneath the node containing the taglist node */
    Plugin.position_autosuggest = function(){

        /* textnode positioning solution copied from https://stackoverflow.com/questions/16209153/how-to-get-the-position-and-size-of-a-html-text-node-using-javascript */
        var range = document.createRange();
        range.selectNodeContents(Plugin.text_node);
        var rects = range.getClientRects();

        Plugin.autosuggest_box.style.top = (rects[0].y+rects[0].height)+'px';

    }

    /** Show the list of suggested tags */
    Plugin.fill_autosuggest = function(tags){
        if (tags.length == 0){
            Plugin.autosuggest_box.style.display = "none";
            return;
        }
        if (tags.length > config.max_suggestions){
            tags = tags.slice(0, config.max_suggestions);
        }
        Plugin.autosuggest_box.style.display = config.display_visible;
        Plugin.autosuggest_box.innerHTML = '';
        for (const tag of tags){
            const node = document.createElement('button');
            node.innerText = tag;
            Plugin.autosuggest_box.appendChild(node);
        }

    }

    /* If Escape is pressed, then hide the autocomplete box */
    Plugin.escape_hide_autocomplete = function(event){
        if (event.key == 'Escape') {
            if (Plugin.autosuggest_box.style.display == "none") return;
            Plugin.autosuggest_box.style.display = "none";

            const range = document.createRange();
            const selection = window.getSelection();

            range.setStart(Plugin.text_node, Plugin.end_index);
            range.collapse(true);

            selection.removeAllRanges();
            selection.addRange(range);
            event.preventDefault();
            event.stopPropagation();
            return;
        }
    }

    /** hide autocomplete if a click happens anywhere outside of the spot where you type tags */
    Plugin.click_hide_autocomplete = function(event){
        const header = document.querySelector('div#header_content');
        if (!header.contains(event.target)){
            Plugin.autosuggest_box.style.display = "none";
            return;
        }

        if (!Plugin.is_tags_entry()){
            Plugin.autosuggest_box.style.display = "none";
        }
        
    }

    /** Check if the caret is int he portion of #header_content where the taglist is typed */
    Plugin.is_tags_entry = function(){
        /// NOTE: Plugin.text_node must be set in this function because its node is dynamic. User could erase the node, then make a newline and write "tags: ".
        const sel = document.getSelection();
        const node = sel.anchorNode;
        const text = node.textContent;
        if (text.startsWith('tags:')){
            Plugin.text_node = node;
            return true;
        }

        const prev_node = node.previousSibling;
        if (prev_node == null)return false;
        if (prev_node.innerText.indexOf("tags:") !== -1){
            Plugin.text_node = node;
            return true;
        }


        return false;
    }

    Plugin.show_autocomplete = function(event){
        if (event.key == 'Tab'
            || event.key == 'Escape'
        ){
            return;
        } else if (event.key == 'Backspace'
            && event.target.tagName == 'BUTTON'){
            return;
        }

        if (!Plugin.is_tags_entry()){
            Plugin.autosuggest_box.style.display = "none";
            return;
        }

        //////// GET WORD BEING CURRENTLY TYPED (and selection range) ////////
        const sel = document.getSelection();
        const node = sel.anchorNode;
        const text = node.textContent;

        // Find the beginning of the word currently being typed
        // There should be a space, a comma, or a colon before any tag
        const search_list = [' ', ',', ':'];
        // we get the positions of all the potential start characters, relative to cursor position
        // and use the position closest to where the cursor is
        let start_index = -1;
        for (const searchable of search_list){
            const pos = text.lastIndexOf(searchable, sel.anchorOffset-1);
            if (pos === -1)continue;
            if (start_index < pos) start_index = pos;
        }
        if (start_index == -1){
            // can't find a valid position before to start from
            Plugin.autosuggest_box.style.display = "none";
            return;
        }
        start_index = start_index+1;
        Plugin.start_index = start_index;

        // find the end of the tag being currently-typed.
        let end_index = 999;
        if (text.charAt(sel.anchorOffset) === ''){
            // this means we're at the end of the string
            end_index = sel.anchorOffset;
        } else {
            // the tag being currently-typed ends with a space or comma
            const end_search_list = [' ', ','];
            for (const searchable of end_search_list){
                const pos = text.indexOf(searchable, sel.anchorOffset);
                if (pos === -1)continue;
                if (end_index > pos) end_index = pos;
            }
        }

        const word_being_typed = text.substring(start_index, end_index).trim();

        if (word_being_typed === ''
            && config.allow_empty_autosuggest === false
        ){
            Plugin.autosuggest_box.style.display = "none";
            return;
        }

        Plugin.end_index = end_index;


        const matching = Plugin.tags
            .filter(
                function(v){
                    if (config.start_match_only === true){
                        if (v.indexOf(word_being_typed) === 0)return true;
                    } else if (v.indexOf(word_being_typed)!==-1){
                        return true;
                    }
                }
            ).sort(
                function(a,b){
                    if (config.short_tags_come_first === false){
                        // swap a & b to swap the sort order
                        const c = a;
                        a = b;
                        b = c;
                    }
                    // When the typed-word appears earlier in the tag, the tag appears first in the list of suggestions
                    const diff = a.indexOf(word_being_typed) - b.indexOf(word_being_typed);
                    if (diff == 0){
                        // When two tags would appear in the same spot, the shorter tag appears first
                        return a.length - b.length;
                    }
                    return diff
                }
            );


        Plugin.position_autosuggest();

        Plugin.fill_autosuggest(matching);
    }

    /** setup the plugin */
    Plugin.activate = function(){
        const is_edit_post_page = document.querySelector('body.edit-page');
        if (is_edit_post_page == null)return;

        const body_content = document.querySelector('textarea#body_content');
        if (body_content == null) return;


        const post_header = document.querySelector('div#header_content');
        if (post_header == null) return;

        Plugin.make_tag_list();
        Plugin.make_autosuggest_box();

        post_header.addEventListener('keyup', Plugin.show_autocomplete);
        document.addEventListener('keyup', Plugin.escape_hide_autocomplete);
        document.addEventListener('click', Plugin.click_hide_autocomplete);

    };

    if (document.readyState === "loading"){
        document.addEventListener('DOMContentLoaded', Plugin.activate);
    } else {
        Plugin.activate();
    }
})();
