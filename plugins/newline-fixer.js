/**
*
* WIP - I can't figure out how to get the autofix onsubmit to work. I think I have to block submission THEN call form.submit() which I was hoping to avoid. I could try click events on the buttons, but that is somewhat prone to problems, like if someone submits by pressing enter.
*
* This adds two spaces to the ends of every line in your post. 
*
* In Markdown, new lines only render if there is a full blank line between paragraphs or two spaces at the end of each line. This plugin manages the two-spaces requirement for you.
* Created by ReedyBear, see https://reedybear.bearblog.dev/bearblog/ for other creations.
*/

(function(){
  // when 'autofix = false;', a button will be added to your 'New Post' page. When 'autofix = true', the fix will be added automatically on-submission.
  const autofix = true;

  // check if we're on a page with a new post form
  const form = document.querySelector('form.post-form');
  if (form == null) {
      return; // stop execution of we're not on a new post page
  }
  if (autofix){
    //form.addEventListener('submit', fix_new_lines);
    const body_node = document.querySelector('#body_content');
    body_node.addEventListener('change', fix_new_lines);
  } else {
    // create a new button element
    const btn = document.createElement('button');
    btn.classList.add('markdown_line_fixer');
    btn.setAttribute('onclick', "event.preventDefault();fix_new_lines();");
    btn.innerText = 'Fix new lines';
    // add the button to your 'New Post' page
    document.querySelector('.sticky-controls').appendChild(btn);
  }
})();


function fix_new_lines(){
  const body_node = document.querySelector('#body_content');
  const body = body_node.value;
  const regex = /([^\n ])( {0,1})\n/g;
  const fixed_body = body.replaceAll(regex, "$1  \n");
  body_node.value = fixed_body;
}
