/** Automatically add footers to your posts based upon the tags you've added to the post
*
* This plugin developed by: ReedyBear https://reedybear.bearblog.dev/bearblog/
*/

// TODO:
// - Add page to create footers
// - DONE use local storage instead of placeholder array
// - DONE (simple append on button click) Re-think how I'm handling the AUTO_POST_FOOTER_START/END stuff. It's just ugly. A simple insert at the end might be better. Or referencing the last occurence of `---` might be better. Making this somewhat configurable might also be best
// - DONE (button always) consider whether it should use a button or actually be automatic (*it could be automatically updated when tags change?*)
// - DONE (setting present) Consider adding a setting for whether we just add a footer for the FIRST tag, or if we add it for ALL tags

(document.readyState === "loading" 
    ? document.addEventListener.bind(this,'DOMContentLoaded')  
    : function(f){f();}.bind(this)
).call(this,
  /**
   * @param config1 string [tell me what value is expected and what it does]
   * @param config2 bool true or false [tell me what it does]
   */
  function(first_tag_only) {

      
      // this goes in your main function
      if (window.location.href.endsWith('#manage-tagbased-footers')){
          show_tagbased_footer_editor_page();
          return;
      }
      
      if (!$textarea)return;
      const controls = document.querySelector('.sticky-controls');
      if (controls == null) return;

      const link_container = document.querySelector('span.helptext.sticky > span:nth-child(2)');
      const link = document.createElement('a');
      link.href = '#manage-tagbased-footers';
      link.target = '_blank';
      link.text = 'Manage Auto-Footers';
      link_container.appendChild(document.createTextNode(' | '));
      link_container.appendChild(link);

      let is_first_only;
      if (first_tag_only=='true')is_first_only = 'true';
      else is_first_only = 'false';
        
      // create a new button element
      const toc_btn = document.createElement('button');
      toc_btn.classList.add('insert_footer');
      toc_btn.setAttribute('onclick', "event.preventDefault();insert_tagbased_footer("+is_first_only+");");
      toc_btn.innerText = "Insert Footer";
      // add the button to your 'New Post' page
      controls.appendChild(toc_btn);
  }.bind(this,
    document.currentScript?.dataset?.first_tag_only, //
    )
);

function insert_auto_footer(){
    const header = document.querySelector('#header_content');
    const tag_match = header.innerHTML.match(/tags:(.+)/);
    tag_list = tag_match[1].trim().split(",").map((tag)=>tag.trim());
    const post_footer = [];
    for (const tag of tag_list){
        const footer_content = get_footer_content(tag);
        if (footer_content == null) continue;
        post_footer.push(footer_content);
    }

    const post_body = $textarea.value;
     $textarea.value = 
          post_body
          +"\n\n---\n\n"
          +post_footer.join("\n\n");
}

function get_footer_content(tag){
    const footers_string = localStorage.getItem('tagbased_post_footers');
    if (footers_string == null) return null;
    
    const footers = JSON.parse(footers_string);
    return footers[tag];
}

function store_footer_content(tag, content){
    const footers_string = localStorage.getItem('tagbased_post_footers');
    let footers;
    if (footers_string == null) footers = {};
    else footers = JSON.parse(footers_string);

    footers[tag] = content;
    localStorage.setItem('tagbased_post_footers', JSON.stringify(footers));
}


/**
 * Show your plugin's page
 *
 * @param force_refresh boolean true\false. Use `false` when displaying initially, and use `true` when forcing a refresh
 */
function show_tagbased_footer_editor_page(force_refresh){
    // edit these settings
    const page_class = "tagbased-footer-editor"; 
    const page_name = "Automatic Footer Manager | Bear Blog";

    // make sure it's an initial load OR force_refresh is true
    const main = document.querySelector('body > main');
    if (main.classList.contains(page_class) 
        && force_refresh !== true)return;

    main.classList.add(page_class);
    main.innerHTML = '';

    document.querySelector('head title').innerText = page_name;

    // TODO: Set the correct function name here, or inline the page HTML
    const template = get_tagbased_footer_editor_page_template();

    main.innerHTML = template;

    // dynamically interact with your page now that the template is loaded
    // for example: the plugin manager loads the list of plugins and inserts them into the appropriate part of the template
}

function get_tagbased_footer_editor_page_template(){
   const template =  
    `
        <h1>Automatic Footer Manager</h1>
        <p>Edit your automatic footers, which are inserted depending on the tags you add to your post. On the Plugin Manager page, you can configure whether footers are inserted for all tags, or just for the first listed tag.</p>
        <div class="tag_list"></div>
    `;
    return template;
}






