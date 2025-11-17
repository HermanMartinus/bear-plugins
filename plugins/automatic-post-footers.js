/** Automatically add footers to your posts based upon the tags you've added to the post
*
* ADDITIONAL INSTRUCTIONS / DOCUMENTATION
* This plugin developed by: ReedyBear https://reedybear.bearblog.dev/bearblog/
*/

// TODO:
// - Add page to create footers
// - use local storage instead of placeholder array
// - Re-think how I'm handling the AUTO_POST_FOOTER_START/END stuff. It's just ugly. A simple insert at the end might be better. Or referencing the last occurence of `---` might be better. Making this somewhat configurable might also be best
// - consider whether it should use a button or actually be automatic (*it could be automatically updated when tags change?*)
// - Consider adding a setting for whether we just add a footer for the FIRST tag, or if we add it for ALL tags

(document.readyState === "loading" 
    ? document.addEventListener.bind(this,'DOMContentLoaded')  
    : function(f){f();}.bind(this)
).call(this,
  /**
   * @param config1 string [tell me what value is expected and what it does]
   * @param config2 bool true or false [tell me what it does]
   */
  function(config1, config2) {
      if (!$textarea)return;
      const controls = document.querySelector('.sticky-controls');
      if (controls == null) return;

      $textarea.value = "i am a post body\n\nand another para";

        
      // create a new button element
      const toc_btn = document.createElement('button');
      toc_btn.classList.add('insert_footer');
      toc_btn.setAttribute('onclick', "event.preventDefault();insert_auto_footer();");
      toc_btn.innerText = "Insert Footer";
      // add the button to your 'New Post' page
      controls.appendChild(toc_btn);
  }.bind(this,
    document.currentScript?.dataset?.config1, // corresponds to `data-config1="some setting"`
    document.currentScript?.dataset?.config2,
    )
);

function insert_auto_footer(){
    const header = document.querySelector('#header_content');
    const tag_match = header.innerHTML.match(/tags:([ ,a-zA-Z0-9\-\_]+)/);
    tag_list = tag_match[1].trim().split(",").map((tag)=>tag.trim());
    const post_footer = [];
    for (const tag of tag_list){
        const footer_content = get_footer_content(tag);
        post_footer.push(footer_content);
    }

    const post_body = $textarea.value;
    const auto_header = '<!-- AUTO_POST_FOOTER_START -->';
    const auto_footer = '<!-- AUTO_POST_FOOTER_END -->'
    const auto_start = post_body.indexOf(auto_header);
    if (auto_start == -1){
        console.log("no auto start");
        $textarea.value = 
          post_body+"\n\n"
          +auto_header+"\n\n---\n\n"
          +post_footer.join("\n\n")
          +"\n\n"+auto_footer;
    } else {
      console.log("footer exists");

        const auto_end = post_body.indexOf(auto_footer);
        console.log(auto_start);
        console.log(auto_end);
        console.log(post_body.substr(auto_start, (auto_end - auto_start) + auto_footer.length));
        $textarea.value =
            post_body.replace(
              post_body.substr(auto_start, (auto_end - auto_start) + auto_footer.length),
              auto_header+"\n\n---\n\n"
              +post_footer.join("\n\n")
              +"\n\n"+auto_footer
            );
            
    }
}

function get_footer_content(tag){
    // TODO use local storage
    const footers = {
        abc: "abc footer content",
        def: "def footer content",
        "qr-zx_59": "qr whatever blah blah"
    };
    return footers[tag];
}







