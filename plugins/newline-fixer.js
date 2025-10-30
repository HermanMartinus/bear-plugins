/**
* This adds two spaces to the ends of every line in your post. 
*
* In Markdown, new lines only render if there is a full blank line between paragraphs or two spaces at the end of each line. This plugin manages the two-spaces requirement for you.
* Created by ReedyBear, see https://reedybear.bearblog.dev/bearblog/ for other creations.
*/

document.addEventListener('DOMContentLoaded', function() {
  // when 'autofix = false;', a button will be added to your 'New Post' page. When 'autofix = true', the fix will be added automatically on-submission.
  const autofix = true;

  // check if we're on a page with a new post form
  const form = document.querySelector('form.post-form');
  if (form == null) {
      return; // stop execution of we're not on a new post page
  }
  if (autofix){
    form.addEventListener('submit', fix_new_lines);
  } 
  if (true){
    // create a new button element
    const btn = document.createElement('button');
    btn.classList.add('markdown_line_fixer');
    btn.setAttribute('onclick', "event.preventDefault();fix_new_lines(event);");
    btn.innerText = 'Fix new lines';
    // add the button to your 'New Post' page
    document.querySelector('.sticky-controls').appendChild(btn);
  }
});


function fix_new_lines(event){
  console.log('fix new lines');
  //console.log(event);
  //console.log(event.type);
  const body_node = document.querySelector('#body_content');
  const body = body_node.value;
  const regex = /([^\n ])( {0,1})\n/g;
  const fixed_body = body.replaceAll(regex, "$1  \n");
  body_node.value = fixed_body;
  if (event.type == 'submit'
      && body != fixed_body){
      console.log('prevent submission');
      event.preventDefault();
      const form = document.querySelector('form.post-form');
      form.requestSubmit();
  }
}
