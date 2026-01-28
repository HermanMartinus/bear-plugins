# Bear Blog plugins

The following scripts are extentions for the Bear Blog platform. These are not official extensions to Bear and may need a bit of tweaking here and there. [Consider contributing!](/CONTRIBUTIONS.md)

They are separated into **Blog** and **Dashboard** tools to distinguish if they are used on the rendering of the blog, or if they are an extension to the Bear editor and dashboard. 

These extensions can be used by copying and pasting the JS into a `<script></script>` tag in the footer directive of your blog. 

**Copying the code is preferred over linking via the GitHub CDN** 

- It gives you more control over the script which can be modified as you see fit
- It loads instantly without additional network requests
- It prevents plugin updates from negatively affecting your blog

## Blog

### Pagination on blog

Add pagination to blog page and post embeds instead of displaying all posts at once. 

[Code](/plugins/pagination.js)

### Reading time on post

Display the estimated reading time for a post.

[Code](/plugins/reading-time.js)

### Search posts

Search post titles on the blog page with a search input. 

[Code](/plugins/search-posts.js)

### Editor shortcut

Easily open the post or homepage editor using `Ctrl + E`

[Code](/plugins/editor-link.js)

### Copy code button

Adds a button to code blocks to easily copy the content.

[Code](/copy-code.js)

### Password protect blog

Add a password to a blog in order to view the content.

*Note: This is circumventable by anyone with a decent understanding of JavaScript and so should only be used to protect non-sensitive information.*

[Code](/plugins/password-protect.js)

### Table of contents

Generate a table of contents at the top of a post based on the titles in the post. 

*Note: The table of contents plugin has been deprecated and instead should be done in-renderer with the following format:*

```
.. toc:: Table of Contents
   :max-level: 3
```

### Redirect www to root

Redirect a custom domain blog with a `www` subdomain to the root domain. 

[Code](/redirect-domain.js)


## Dashboard
These scripts can be added to [the footer of your dashboard](https://bearblog.dev/dashboard/customise/) in a `<script></script>` element.  

### Full height editor

Expands the post and homepage content editor to the bottom of the screen. 

[Code](/plugins/full-height-editor.js)

### Markdown editor

Adds syntax highlighting and shortcuts for markdown features.

[Code](/plugins/overtype.js)

*Note: Overtype has been deprecated and it is instead suggested to use the [Markdown power-editor](https://fischr.org/markdown-power-editor-for-bear-blog/) by René.*

### Post counter

Count and display total posts and pages in the dashboard.

[Code](/plugins/dashboard-post-counter.js)

### Fix New Lines in Posts
Automatically ensures all lines have two spaces at the end, so Markdown will render new lines. Without two spaces at the end, text written on different lines (*without a blank line between them*) will render in your post as being on one line.

[Code](/plugins/newline-fixer.js)
