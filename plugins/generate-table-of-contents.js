/**
* This adds a button to your 'new post' page, which, when clicked, generates HTML for a Table of Contents. This HTMl is copied into your clipboard and then you can paste it into your post.
*
* Originally published at https://reedybear.bearblog.dev/generate-a-table-of-contents-on-bearblog/   This version contains editable variables at the start for easier modification. It also wraps the main code in a function for scoping purposes.
*/

// wrap it in a function to prevent variables from conaminating other scripts.
(function(){
  // the text that appears at the top of your table of contents
  const toc_header = "Contents:";
  // the css class added to the <div> that wraps your table of contents
  const toc_class = "toc";
  // the text that appears on the button you click
  const button_text = "Generate ToC";

    
  // create a new button element
  const toc_btn = document.createElement('button');
  toc_btn.classList.add('rdb_post_restorer');
  toc_btn.setAttribute('onclick', "event.preventDefault();generate_toc('"+toc_header+"','"+toc_class+"');");
  toc_btn.innerText = button_text;
  // add the button to your 'New Post' page
  document.querySelector('.sticky-controls').appendChild(toc_btn);
})();

/** scan your post text and generate a ToC, copying it to your clipboard */
function generate_toc(toc_header, toc_class){
  // HTML for the start of the ToC list
  var toc = "\n\n"+'<div class="'+toc_class+'">'
      +"\n"+'<h2>'+toc_header+'</h2>'
      +"\n"+'<ol>';

  // get your post's content
  const body = document.querySelector('#body_content').value;
  // find all header occurences
  const headers_flat = body.matchAll(/^#{1,6}/gm);
  // the first header in the ToC should use '##'
  let header_size = 2;
  // 'started' is to make sure we don't add an </li> before any list items
  let started = false;
  // loop over the header occurences and generate html
  for (const match of headers_flat){
    // how many hashtags this header has
    const length = match[0].length;
    // you should not use '#' for section headers. Use `##`
    if (length < 2)continue; 
    // generate indentations for the HTML so it looks nice
    const indent = "    ";
    const adjusted_indent = indent.repeat(length-2); 
    const li_indent = adjusted_indent + indent;
    if (length == header_size && started == true){
      // close a list item if it does not have a nested list
      toc += "</li>";
    } else if (length > header_size) {
        // add a new sub-list for sub-headers
        toc += "\n"+adjusted_indent+"<ul>";
    } else if (length < header_size){
        // end a sub-list, escape into the parent list
        // .repeat allows us to close multiple open sub-lists at once if needed
        toc += "</li>\n"+adjusted_indent+"</ul></li>".repeat(header_size - length);
    } 
    header_size = length;
    started = true;

    // get the full text of the header
    const start_index = match.index + length;
    const end_index = body.indexOf("\n", match.index);
    const header_text = body.substring(start_index, end_index)
      .trim();
    const header_id = slugify_toc_title(header_text);
    // the html for a link to one section below
    toc += "\n"+li_indent+'<li><a href="#'+header_id+'">'+header_text+'</a>';
  }

  const list_closers = "</ul></li>".repeat(header_size-2);
  // close the ToC list HTML
  toc += "</li>\n    "+list_closers+"\n</ol></div>\n\n";

  navigator.clipboard.writeText(toc);
    // debugging code used during development
    //console.log(toc);
    //document.getElementById("sample_table").innerHTML = toc;
}
  /**
   * Convert a header title into a lower-case version with special characters and spaces removed/replaced.
   * 
   * @dirty_title any string
   * @return a slugified string with only lowercase letters
   */
  function slugify_toc_title(dirty_title){
      let clean = dirty_title.toLowerCase();
      clean = clean.replaceAll(/[^a-z0-9\_\- ]/g, '');
      clean = clean.replaceAll(' ', '-');
      clean = clean.replaceAll(/\-+/g, "-");
      return clean;
  }
