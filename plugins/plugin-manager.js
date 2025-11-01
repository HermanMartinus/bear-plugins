/**
 * Plugin installer/manager.
 *
 */

function load_locally_installed_plugins(){
    const plugins = get_installed_plugins();
    console.log(plugins);

    const body = document.querySelector('body');
    for (let plugin_path in plugins){
        const script_node = document.createElement('script');
        script_node.setAttribute('type', "text/javascript");
        if (plugin_path.charAt(0)!='/')plugin_path = "/"+plugin_path;
        script_node.setAttribute('src', "https://cdn.jsdelivr.net/gh/hermanmartinus/bear-plugins/"+plugin_path);

        body.appendChild(script_node);
    }
}

function get_installed_plugins(){
    let installed_plugins = localStorage.getItem('installed_plugins');
    if (installed_plugins == null) installed_plugins = {};
    else installed_plugins = JSON.parse(installed_plugins);
    return installed_plugins;
}
function set_installed_plugins(installed_plugins){
    localStorage.setItem('installed_plugins', JSON.stringify(installed_plugins));
}

function install_plugin_locally(plugin_path){
    const installed_plugins = get_installed_plugins();
    installed_plugins[plugin_path] = plugin_path;
    set_installed_plugins(installed_plugins);
    show_plugin_manager(true);
}

function remove_plugin_locally(plugin_path){
    const installed_plugins = get_installed_plugins();
    delete installed_plugins[plugin_path];
    set_installed_plugins(installed_plugins);
    show_plugin_manager(true);
}


function show_plugin_manager(force){

    const main = document.querySelector('body > main');
    if (main.classList.contains('plugin-manager') 
        && force !== true)return;
    main.classList.add('plugin-manager');
    main.innerHTML = '';

    document.querySelector('head title').innerText = 'Plugin Manager | Bear Blog';

    const template = get_plugin_manager_template();

    main.innerHTML = template;
    const plugin_list = main.querySelector('.plugin-list');

    const plugins = get_available_plugins();


    const installed_plugins = get_installed_plugins();

    for (const plugin of plugins.dashboard){
        const plugin_html = get_plugin_template(plugin, installed_plugins);
        const div = document.createElement('div');
        div.classList.add('plugin');
        div.innerHTML = plugin_html;
        plugin_list.appendChild(div);
    }
}

function get_plugin_template(plugin, installed_plugins){
    let requires_manual_install = true;
    let installer_html = "";
    let installed_text = "";
    if (plugin.hasOwnProperty('disable')
        && plugin.disable == true){
        // plugin cannot be installed automatically
        installed_class = " class=\"disabled\" ";
        requires_manual_install = true;
        installer_html = "<p class=\"requires_manual_install\"><strong>Requires manual installation.</strong></p>"
    } else if (installed_plugins.hasOwnProperty(plugin.path)){
        // plugin is installed
        installed_class = " class=\"installed\" ";
        installed_text = "(installed)";
        installer_html = `
            <button class="uninstall" onclick="remove_plugin_locally('${plugin.path}');">Remove Plugin</button>
        `;
    } else {
        // plugin is not installed
        installed_class = " class=\"available\" ";
        installer_html = `
            <button class="install" onclick="install_plugin_locally('${plugin.path}');">Install</button>
        `;
    }


    const template = `
        <h2${installed_class}>${plugin.name} ${installed_text}</h2>
        <p class="plugin_description">${plugin.description}</p>
        ${installer_html}
        <p class="plugin_creator">by <a href="${plugin.creator_url}">${plugin.creator_name}</a></p>
    `;

    return template;
}

/**
 * Get a list of available plugins
 */
function get_available_plugins(){

    const plugins = {
        dashboard:[
            {
                name: "Full Height Editor",
                path: "/plugins/full-height-editor.js",
                description: "Have the post and homepage content editor expand to fill the page.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/"
            },
            {
                disable: true,
                TODO: "add extra script tag for overtype",
                name: "(WIP) Syntax highlighting and formatting controls in editor",
                path: "/plugins/overtype.js",
                description: "Use <a href=\"https://overtype.dev/\">Overtype</a> as the editor for syntax highlighting and other formatting control shortcuts.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/"
            },
            {
                name: "Generate Table of Contents for Blog Post",
                path: "/plugins/generate-table-of-contents.js",
                description: "Adds a button to your 'New Post' page. When clicked, HTML is generated for a Table of Contents. It is copied into your clipboard, and you must paste it into your post.",
                creator_name: "ReedyBear",
                creator_url: "https://reedybear.bearblog.dev/generate-a-table-of-contents-on-bearblog/"
            },
            {
                name: "Post counter",
                path: "/plugins/dashboard-post-counter.js",
                description: "Count and display total posts and pages.",
                creator_name: "verfasor",
                creator_url: "https://github.com/verfasor"
            },
            

        ],
        blog:[
            {
                name: "Pagination on blog",
                path: "/plugins/pagination.js",
                description: "Have the blog page or post embed paginated instead of displaying all posts at once.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/"
            },
            {
                name: "Reading time on post",
                path: "/plugins/reading-time.js",
                description: "Display the estimated reading time for a post.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/"
            },
            {
                name: "Search posts",
                path: "/plugins/search-posts.js",
                description: "Search post titles on the blog page with a search input.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/"
            },
            {
                disable: true,
                TODO: "data-password must be set on script node in order to set the password",
                name: "Password protect blog (insecure)",
                path: "/plugins/password-protect.js",
                description: "Add a password to a blog in order to view the content. WARNING: This can be easily circumvented by anyone with a decent understanding of Javascript, so should only be used to \"protect\" non-sensitive information.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/",
            },

        ],
    };

    return plugins;
}


/** Get the main content HTML for the Plugin Manager page */
function get_plugin_manager_template(){
   const template =  
    `
        <h1>Dashhboard Plugin Manager</h1>
        <p>Plugins are installed from <a href="https://github.com/HermanMartinus/bear-plugins">Github</a>. They are NOT official extensions of Bear, and some may require tweaking or be unable to install automatically.</p>
        <p>For plugins on the public side of your blog, see <a href="https://bearblog.dev/reedybear/dashboard/directives/">Header & Footer Directives</a>. (<i>requires premium</i>)</p>
        <p><strong>Note:</strong> Dashboard plugins will only be installed on this machine, on this blog's dasbhoard, due to limitations with Bear. To install plugins globally on all your devices and blogs, <a href="https://github.com/HermanMartinus/bear-plugins">manually install plugins</a> on your <a href="https://bearblog.dev/dashboard/customise/">Customise dashboard page</a>.
        <div class="plugin-list">
        </div>

    `;
    return template;
}



document.addEventListener('DOMContentLoaded',
/**
 * Add the 'Plugins' link when you're on a dashboard page, and render the Plugins view if on #manage-plugins
 */
    function(){
        load_locally_installed_plugins();

        // return if we're not on one of the dashboard pages.
        const url = window.location.href;
        if (!(
            url.endsWith('/dashboard/')
            || url.endsWith('/dashboard/nav/')
            || url.endsWith('/dashboard/posts/')
            || url.endsWith('/dashboard/pages/')
            || url.endsWith('/dashboard/styles/')
            || url.endsWith('/dashboard/email-list/')
            || url.endsWith('#manage-plugins')
            //|| url.endsWith('/dashboard/analytics/')  // analytics doesn't include custom dashboard code
            //|| url.endsWith('/dashboard/settings/')   // settings doesn't include custom dashboard code
        ))return;

        const span = document.querySelector('nav > span');
        const plugins_link = document.createElement('a');
        plugins_link.href = "#manage-plugins";
        plugins_link.setAttribute('onclick', "show_plugin_manager()");
        plugins_link.innerText = "Plugins";
        //span.innerHTML = 'test';
        span.appendChild(plugins_link, null);


        if (url.endsWith('#manage-plugins'))show_plugin_manager();
    }
);

