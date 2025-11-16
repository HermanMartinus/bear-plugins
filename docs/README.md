# Plugin Developer Documentation
Plugins are to be added as individual `.js` files to the [`/plugins/`](/plugins/) directory, and the `Plugin Structure` below is recommended (*not required*). 

Dashboard plugins should be added to the Plugin Manager at [`/plugins/plugin-manager.js`](/plugins/plugin-manager.js).

## Docs
- Plugin Structure
- 

## Plugin Structure
This plugin structure is recommended, but not required.

The following plugin structure allows plugins to:
- be configurable via the `<script>` tag using `data-{config}` attributes
- execute when `DOMContentLoaded` event triggers OR immediately if `DOMContentLoaded` has already triggered. 
- function is defined without a name, which can help prevent conflicts (*though it is okay to define additional functions that have names*)

*Note: [MDN](https://developer.mozilla.org/en-US/docs/Web/API/Document/DOMContentLoaded_event#checking_whether_loading_is_already_complete) recommends an if/else for checking readyState. The solution below is more compact and does not require a named function.*

*Note: [currentScript](https://developer.mozilla.org/en-US/docs/Web/API/Document/currentScript) cannot be referenced from inside a function/event handler, so its values must be bound to your function*

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
