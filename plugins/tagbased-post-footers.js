/** Automatically add footers to your posts based upon the tags you've added to the post. Adds a page for managing these footers. Adds a button the new post/edit post page.
*
*  Add `data-first_tag_only="true"` to only add one footer to each post instead of adding footers for every tag.
*
* This plugin developed by: ReedyBear https://reedybear.bearblog.dev/bearblog/
*/

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

function insert_tagbased_footer(show_first_only){
    const header = document.querySelector('#header_content');
    const tag_match = header.innerHTML.match(/tags:([^\<]+)/);
    tag_list = tag_match[1].trim().split(",").map((tag)=>tag.trim());
    const post_footer = [];
    for (const tag of tag_list){
        const footer_content = get_tagbased_footer_content(tag);
        if (footer_content == null) continue;
        post_footer.push(footer_content);
        if (show_first_only)break;
    }

    const post_body = $textarea.value;
     $textarea.value = 
          post_body
          +"\n\n---\n\n"
          +post_footer.join("\n\n");
}

function get_tagbased_footer_content(tag){
    return get_tagbased_footer_list()[tag] ?? null;
}
function get_tagbased_footer_list(){
    const footers_string = localStorage.getItem('tagbased_post_footers');
    if (footers_string == null) return {};
    
    const footers = JSON.parse(footers_string);
    return footers;
}

/* pass content=false to delete the tag */
function store_tagbased_footer_content(tag, content){
    let footers = get_tagbased_footer_list();
    footers[tag] = content;
    if (content === false)delete footers[tag];
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

    const template = get_tagbased_footer_editor_page_template();

    main.innerHTML = template;

    const saved_footers = get_tagbased_footer_list();

    const tag_list = main.querySelector('.tag_footer_list');
    for (const tag in saved_footers){
        const fieldset = add_tagbased_footer_form();
        const tag_name = fieldset.querySelector('input[name="tag"]');
        tag_name.value = tag;
        tag_name.setAttribute('disabled', 'true');
        fieldset.querySelector('textarea').value = saved_footers[tag];
        tag_list.appendChild(fieldset);
    }

    // dynamically interact with your page now that the template is loaded
    // for example: the plugin manager loads the list of plugins and inserts them into the appropriate part of the template
}

function get_tagbased_footer_editor_page_template(){
   const template =  
    `
        <h1>Automatic Footer Manager</h1>
        <p>Edit your automatic footers, which are inserted depending on the tags you add to your post. On the Plugin Manager page, you can configure whether footers are inserted for all tags, or just for the first listed tag.</p>
        <button class="add_footer" onclick="add_tagbased_footer_form();">Add Footer</button>
        <div class="tag_footer_list"></div>
    `;
    return template;
}

function get_tagbased_footer_form_template(){
    const template = 
    `
        <label>Tag<br><input type="text" name="tag" placeholder="tag" /></label>
        <br>
        <label>Footer Content<br><textarea name="footer_content" style="width:50%; height:10em;"></textarea></label>
        <br>
        <button class="save" disabled>unedited</button>
        <button class="delete">Delete</button>
        <br>
    `;
    return template;
}

function add_tagbased_footer_form(){
    const form = document.createElement('fieldset');
    form.innerHTML = get_tagbased_footer_form_template();
    const list = document.querySelector(".tag_footer_list");
    list.insertBefore(form, list.firstChild);
    const save_button = form.querySelector('.save');
    const tag_name = form.querySelector('input[name="tag"]');
    const delete_button = form.querySelector('.delete');
    const fields = [
        tag_name, 
        form.querySelector('textarea')
    ];
    fields.map(function(node){
      node.addEventListener('keyup',
        function(save_button, tag_name_node){
            if (tag_name_node.value == ''){
              save_button.innerText='add tag name';
              save_button.setAttribute('disabled', "true");
              return;
            }
            if (save_button.innerText=='Save')return;
            save_button.innerText='Save';
            save_button.removeAttribute('disabled');
        }.bind(null,save_button, tag_name)
      )
    });

    save_button.addEventListener('click',
        function(self, fieldset){
            const tag_node = fieldset.querySelector('input[name="tag"]')
            const tag = tag_node.value.trim();
            const footer = fieldset.querySelector('textarea').value.trim();
            store_tagbased_footer_content(tag, footer);
            self.setAttribute('disabled', true);
            self.innerText = 'saved';
            tag_node.disabled = "true";
        }.bind(null, save_button, form)
    );


    delete_button.addEventListener('click',
        function(fieldset){
            const tag_node = fieldset.querySelector('input[name="tag"]');
            const tag = tag_node.value.trim();
            if (!confirm('Delete footer for tag "'+tag+'"?'))return;
            store_tagbased_footer_content(tag, false);
            fieldset.parentNode.removeChild(fieldset);
        }.bind(null, form)
    );

    return form;
}






