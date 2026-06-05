# Contribution guidelines for Bear Blog plugins

## How to contribute

### 1. Fork the repository

Click the **Fork** button at the top of the repository.

### 2. Create your plugin file

Use a descriptive, lowercase filename with hyphens (e.g., `blog-search-filter.js`) and add your plugin as a new .js file in the `plugins` directory. Ensure that your plugin conforms to the [code standards](#code-standards). If in doubt, start with the [plugin template](/plugins/hello-world.js).

### 3. Add documentation

In the README.md file:

- Describe the plugin briefly
- Link to the js file

### 4. Open a pull request and await review

- Commit your changes with a clear message (e.g., "Add blog search filter plugin")
- Push to your fork
- Open a PR with a description of what your plugin does and how to use it

## Code standards

### 1. Use strict mode with IIFE

Wrap all scripts in an IIFE with 'use strict'; to avoid conflicts with other plugins.

```
(function() {
    'use strict';
    // Your plugin code here
})();
```

### 2. Scope and isolation

- Never pollute the global namespace
- Use `const` and `let` instead of `var`

### 3. DOM ready

Always wait for DOM to be ready before manipulating elements using the `DOMContentLoaded` event listener.

### 4. Conditional execution

Check for specific page contexts before running (e.g., `document.body.classList.contains('blog')`) and verify elements exist before manipulating them.

### 5. Naming conventions

- Use descriptive variable and function names
- Use camelCase for variables and functions
- Add comments for complex logic

### 6. Compatibility

- Stick to features that are in [Baseline Widely available](https://developer.mozilla.org/en-US/docs/Glossary/Baseline/Compatibility) and are fully supported for greater than 90% of users. You can tell a feature is in Baseline Widely available if there is a green box at the top of its MDN page saying it's in Baseline Widely available.
- You may use features that are less widely-supported as long as the fallback logic works or you use a [ponyfill](https://ponyfill.com/)
- Don't override native prototypes
- Test across major browsers

### 7. Add plugin details header

Add a comment block at the top of the pugin file with the following details:

```
/*
 Plugin name: 
 Description: 
 Author: 
 Author URI: 
*/
```
