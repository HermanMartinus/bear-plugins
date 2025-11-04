/**
* Ensures each line in your post has two spaces at the end, so that markdown renders new lines.
*
* change `const autofix = true;` to `const autofix = false;` to add a 'Fix new lines' button instead of fixing automatically on submission.
* Created by ReedyBear, see https://reedybear.bearblog.dev/bearblog/ for other creations.
*/

(document.readyState === "loading" 
    ? document.addEventListener.bind(this,'DOMContentLoaded')  
    : function(f){f();}.bind(this)
).call(this,
  function(autofix_config) {
    // when 'autofix = false;', a button will be added to your 'New Post' page. When 'autofix = true', the fix will be added automatically on-submission.
    let autofix = true;
    if (autofix_config == "false")autofix = false;
  
    // check if we're on a page with a new post form
    const form = document.querySelector('form.post-form');
    if (form == null) {
        return; // stop execution of we're not on a new post page
    }
    if (autofix){
      // update the submit buttons so the fix is applied automatically when they are clicked
      const submit_buttons = document.querySelectorAll('.sticky-controls > button[type="submit"]');
      for (const button of submit_buttons){
          button.setAttribute('onclick', 
              button.getAttribute('onclick')
              +";fix_new_lines(event);"
              );
      }
    } else {
      // create a new button, which you can click to apply the new lines fix
      const btn = document.createElement('button');
      btn.classList.add('markdown_line_fixer');
      btn.setAttribute('onclick', "event.preventDefault();fix_new_lines(event);");
      btn.innerText = 'Fix new lines';
      // add the button to your 'New Post' page
      document.querySelector('.sticky-controls').appendChild(btn);
    }
  }.bind(this, 
    document.currentScript?.dataset?.autofix,
    )
);

/** ensures every line in the post content has two spaces at the end */
function fix_new_lines(event){
  const body_node = document.querySelector('#body_content');
  const body = body_node.value;
  // regex finds lines that have text on them and do not end with 2 spaces.
  const regex = /([^\n ])( {0,1})\n/g;
  // The $1 makes sure that the last character of each line does not get deleted.
  const fixed_body = body.replaceAll(regex, "$1  \n");
  body_node.value = fixed_body;
}
