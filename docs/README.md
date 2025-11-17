# Plugin Developer Documentation
Plugins are to be added as individual `.js` files to the [`/plugins/`](/plugins/) directory, and the `Plugin Template` below is suggested (*not required*). Plugins should then be added to the [`README`](/README.md)

Dashboard plugins should be added to the Plugin Manager at [`/plugins/plugin-manager.js`](/plugins/plugin-manager.js).

## Docs
- Plugin Template
- `jsdelivr.net` url
- Check for New Post / Edit Post pages
- Auto-refresh script during development
- Create a new dashboard page

## Plugin Template
This plugin structure is recommended, but not required.

The following plugin template allows plugins to:
- be configurable via the `<script>` tag using `data-{config}` attributes
- execute when `DOMContentLoaded` event triggers OR immediately if `DOMContentLoaded` has already triggered. 
- main function is defined without a name, which can help prevent conflicts (*though it is okay to define additional functions that have names*)
- be loaded by the Plugin Manager

```javascript
/** Describe what this plugin does
*
* ADDITIONAL INSTRUCTIONS / DOCUMENTATION
* This plugin developed by: Your Name https://example.org/YourLink
*/

(document.readyState === "loading" 
    ? document.addEventListener.bind(this,'DOMContentLoaded')  
    : function(f){f();}.bind(this)
).call(this,
  /**
   * @param config1 string [tell me what value is expected and what it does]
   * @param config2 bool true or false [tell me what it does]
   */
  function(config1, config2) {
      // your code goes here
  }.bind(this,
    document.currentScript?.dataset?.config1, // corresponds to `data-config1="some setting"`
    document.currentScript?.dataset?.config2,
    )
);
```

*Note: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event#checking_whether_loading_is_already_complete) recommends an if/else for checking readyState. The solution below is more compact and does not require a named function.*

*Note: [currentScript](https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript) cannot be referenced from inside a function/event handler, so its values must be bound to your function*

## `jsdelivr.net` url
On the readme, you will add a tag like the following for your plugin:

```html
<script src="https://cdn.jsdelivr.net/gh/hermanmartinus/bear-plugins/plugins/PLUGIN_NAME.js"></script>
```

[`jsdelivr`](https://www.jsdelivr.com/) will load `/plugins/PLUGIN_NAME.js` from the bear plugins repository on GitHub. No action is required from you, except to set the correct URL here pointing to your plugin's `.js` file in the `/plugins/` dir. 

*Note: The jsdelivr.net url will not work until the Pull Request for your plugin is merged.*

*Caching: jsdelivr [caches files](https://www.jsdelivr.com/documentation#id-caching) for 7 days, so it may take up to 7 days for changes to your plugin to hit end users after your PR is merged.*

## Check for New Post / Edit Post pages
Post pages (*new post, edit post, home page editor*) define a `$textarea` variable, so in our main function, we just check if `$textarea` is set and return if not. 

```javascript
function(config1, config2) {
      if (!$textarea) return;
      // your code goes here
  }
```

## Auto-refresh script during development
*If you have a better suggestion, please contribute it here*

1. On your local machine, create a `.js` file for whatever plugin you're developing
2. Start a localhost webserver that delivers this `.js` file
3. Add `<script type="text/javascript" src="http://localhost:3000/my-script.js"></script>` to your customise dashboard or head directive section.

This way, when your dashboard or blog loads, it will load that script from your localhost server. This way, all you have to do is save your script and then refresh the page. If you don't know how to do this, then don't worry about it, you can just update the code on the bearblog dashboard directly.

## Create a new dashboard page
Via Javascript, you'll add a link to the page, linking to `#your-page-url`, then when the URL ends with `#your-page-url`, you replace the page content with your page's content.

See an example page in the [plugin manager](/plugins/plugin-manager.js) in the `show_plugin_manager()`. Example of URL management and link adding is available at the end of that script in the main function.

**You Must:** Edit all the `ALL_CAPS` items in the sample code below
```javascript
// this goes in your main function
if (window.location.href.endsWith('#your-page-url'))SHOW_YOUR_PAGE();

/**
 * Show your plugin's page
 *
 * @param force_refresh boolean true\false. Use `false` when displaying initially, and use `true` when forcing a refresh
 */
function SHOW_YOUR_PAGE(force_refresh){
    // edit these settings
    const page_class = "--YOUR_PAGES_CLASS--"; 
    const page_name = "YOUR PAGE'S NAME | Bear Blog";

    // make sure it's an initial load OR force_refresh is true
    const main = document.querySelector('body > main');
    if (main.classList.contains(page_class) 
        && force_refresh !== true)return;

    main.classList.add(page_class);
    main.innerHTML = '';

    document.querySelector('head title').innerText = page_name;

    // TODO: Set the correct function name here, or inline the page HTML
    const template = GET_YOUR_PAGES_TEMPLATE();

    main.innerHTML = template;

    // dynamically interact with your page now that the template is loaded
    // for example: the plugin manager loads the list of plugins and inserts them into the appropriate part of the template
}

function GET_YOUR_PAGES_TEMPLATE(){
   const template =  
    `
        <h1>PAGE HEADER</h1>
        <p>ABOUT THIS PAGE</p>
        ... OTHER HTML HERE ...
    `;
    return template;
}
```


