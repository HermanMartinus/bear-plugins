# Bear Blog plugins

The following scripts are extentions for the Bear Blog platform. These are not official extensions to Bear and may need a bit of tweaking here and there. **Consider contributing!**

They are separated into **Blog** and **Dashboard** tools to distinguish if they are used on the rendering of the blog, or if they are an extension to the Bear editor and dashboard. 

These extensions can be used either by including the provided script links, or by copying and pasting the JS itself into a `<script></script>` tag into the head or footer directive of your blog. The latter option gives you more control over the script and can be modified as you see fit. 

## Blog

### Pagination on blog

Have the blog page or post embed paginated instead of displaying all posts at once. 

[Code](/plugins/pagination.js)

Embed:
```
<script src="https://cdn.jsdelivr.net/gh/hermanmartinus/bear-plugins/plugins/pagination.js"></script>
```

### Reading time on post

Display the estimated reading time for a post.

[Code](/plugins/reading-time.js)

Embed:
```
<script src="https://cdn.jsdelivr.net/gh/hermanmartinus/bear-plugins/plugins/reading-time.js"></script>
```

### Search posts

Search post titles on the blog page with a search input. 

[Code](/plugins/search-posts.js)

Embed:
```
<script src="https://cdn.jsdelivr.net/gh/hermanmartinus/bear-plugins/plugins/search-posts.js"></script>
```

### Password protect blog

Add a password to a blog in order to view the content.

*Note: This is easily circumvented by anyone with a decent understanding of JavaScript and so should only be used to protect non-sensitive information. 

[Code](/plugins/password-protect.js)

Embed:
```
<script src="https://cdn.jsdelivr.net/gh/hermanmartinus/bear-plugins/plugins/password-protect.js" data-password="MyPassword123"></script>
```

Set the `data-password` attribute on the script element to the desired password. 


## Dashboard
These scripts can be added to [https://bearblog.dev/dashboard/customise/](https://bearblog.dev/dashboard/customise/) under 'Dashboard footer content'.  

## Full height editor

Have the post and homepage content editor expand to fill the page. 

[Code](/plugins/full-height-editor.js)

Embed:
```
<script src="https://cdn.jsdelivr.net/gh/hermanmartinus/bear-plugins/plugins/full-height-editor.js"></script>
```

## Syntax highlighting and formatting controls in editor (WIP)

Use [Overtype](https://overtype.dev) as the editor for syntax highlighting and other formatting control shortcuts.

[Code](/plugins/overtype.js)

Embed:
```
<script src="https://unpkg.com/overtype"></script>
<script src="https://cdn.jsdelivr.net/gh/hermanmartinus/bear-plugins/plugins/overtype.js"></script>
```

## Generate Table of Contents for Blog Post
Adds a button to your 'New Post' page. When clicked, HTML is generated for a Table of Contents. It is copied into your clipboard, and you must paste it into your post.

[Code](/plugins/generate-table-of-contents.js)

Embed:
```
<script src="https://cdn.jsdelivr.net/gh/hermanmartinus/bear-plugins/plugins/generate-table-of-contents.js"
    data-header="Content:"
    data-button="Generate ToC"
    data-class="toc"
></script>
```

**Configuration:** Modify the `data-` attributes. `data-header` is the text at the top of your table of contents. `data-button` is the text that displays on the button you click. `data-class` is used for styling the table of contents with CSS. Example: Change `data-header="Content:"` to `data-header="On This Page"`

## Post counter

Count and display total posts and pages.

[Code](/plugins/dashboard-post-counter.js)

Embed:
```
<script src="https://cdn.jsdelivr.net/gh/hermanmartinus/bear-plugins/plugins/dashboard-post-counter.js"></script>
```

