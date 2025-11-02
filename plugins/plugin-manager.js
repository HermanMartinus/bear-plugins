/**
 * Plugin installer/manager. To add an installabe plugin, edit the plugins list below.
 *
 */

/**
 * Get a list of available plugins. 
 *
 * Add `disable: true` to any plugins that must be installed manually. They will still display, but will not be installable via the Plugin Manager.
 *
 * Plugins can have an 'editable' field listing inputs. Those editable fields will be translated into `data-name=value` attributes on the `<script>` node. See the 'Generate Table of Contents' plugin for an example.
 *
 * Plugins can have a `prepend_scripts` field. This should be an array of absolute URLs pointing to javascript files. Each one will be added as a `<script>` tag, in the order they're listed, immediately above your plugin's `<script>` tag.
 *
 */
function get_available_plugins(){

    const plugins = {
        dashboard:{
            "/plugins/full-height-editor.js":{
                name: "Full Height Editor",
                path: "/plugins/full-height-editor.js",
                description: "Have the post and homepage content editor expand to fill the page.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/"
            },
            "/plugins/generate-table-of-contents.js":{
                name: "Generate Table of Contents",
                path: "/plugins/generate-table-of-contents.js",
                description: "Adds a button to your 'New Post' page. When clicked, HTML is generated for a Table of Contents. It is copied into your clipboard, and you must paste it into your post.",
                editable: {
                    header: {
                        label: "Header",
                        default: "Contents:",
                        description: "The text that displays at the top of your Table of Contents",
                        type: "text"
                    },
                    button: {
                        label: "Button Text",
                        default: "Generate ToC",
                        description: "The text displayed on the button you click.",
                        type: "text"
                    },
                    class: {
                        label: "CSS Class",
                        description: "Class to apply to the root node of your Table of Contents. Used for styling via CSS",
                        default: "toc",
                        type: "text"
                    }
                },
                creator_name: "ReedyBear",
                creator_url: "https://reedybear.bearblog.dev/generate-a-table-of-contents-on-bearblog/"
            },
            "/plugins/dashboard-post-counter.js":{
                name: "Post counter",
                path: "/plugins/dashboard-post-counter.js",
                description: "Count and display total posts and pages.",
                creator_name: "verfasor",
                creator_url: "https://github.com/verfasor"
            },
            
            "/plugins/overtype.js":{
                //disable: true,
                name: "(WIP) Syntax highlighting and formatting controls in editor",
                path: "/plugins/overtype.js",
                prepend_scripts: [
                    'https://unpkg.com/overtype'
                ],
                description: "Use <a href=\"https://overtype.dev/\">Overtype</a> as the editor for syntax highlighting and other formatting control shortcuts.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/"
            },
            "/plugins/plugin-manager.js": {
                disable: true,
                name: "Plugin Manager",
                path: "/plugins/plugin-manager.js",
                description: "Used to install and configure plugins from <a href=\"https://github.com/HermanMartinus/bear-plugins\">Bear Blog Plugins</a>. (<i>If you're seeing this screen, then this is already installed.</i>)",
                creator_name: "ReedyBear",
                creator_url: "https://reedybear.bearblog.dev/bearblog/"
            },
        },
        blog:{
            "/plugins/pagination.js":{
                name: "Pagination on blog",
                path: "/plugins/pagination.js",
                description: "Have the blog page or post embed paginated instead of displaying all posts at once.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/"
            },
            "/plugins/reading-time.js":{
                name: "Reading time on post",
                path: "/plugins/reading-time.js",
                description: "Display the estimated reading time for a post.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/"
            },
            "/plugins/search-posts.js":{
                name: "Search posts",
                path: "/plugins/search-posts.js",
                description: "Search post titles on the blog page with a search input.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/"
            },
            "/plugins/password-protect.js":{
                disable: true,
                TODO: "data-password must be set on script node in order to set the password",
                name: "Password protect blog (insecure)",
                path: "/plugins/password-protect.js",
                description: "Add a password to a blog in order to view the content. WARNING: This can be easily circumvented by anyone with a decent understanding of Javascript, so should only be used to \"protect\" non-sensitive information.",
                creator_name: "Herman Martinus",
                creator_url: "https://github.com/HermanMartinus/",
            }

        },
    };

    return plugins;
}


/**
 * Add `<script>` tag for each installed Dashboard plugin.
 */
function load_locally_installed_plugins(){
    const plugins = get_installed_plugins();
    const available_plugins = get_available_plugins();
    //console.log(plugins);

    const body = document.querySelector('body');
    for (let plugin_path in plugins){

        const script_node = document.createElement('script');
        script_node.setAttribute('type', "text/javascript");
        if (!plugin_path.startsWith('/'))plugin_path = "/"+plugin_path;
        script_node.setAttribute('src', "https://cdn.jsdelivr.net/gh/hermanmartinus/bear-plugins"+plugin_path);
        const settings = plugins[plugin_path].settings || {};
        for (const setting in settings){
            script_node.setAttribute('data-'+setting, settings[setting]);
        }

        const plugin_details = available_plugins['dashboard'][plugin_path];

        const prepend_scripts = plugin_details.prepend_scripts || [];
        for (const script_url of prepend_scripts){
            const pre_script = document.createElement('script');
            pre_script.setAttribute('type', "text/javascript");
            pre_script.setAttribute('src', script_url);
            body.appendChild(pre_script);
        }

        body.appendChild(script_node);
    }
}

/**
 * Get an object listing all installed plugins.
 *
 * @return object with key = path && value = path
 */
function get_installed_plugins(){
    let installed_plugins = localStorage.getItem('installed_plugins');
    if (installed_plugins == null) installed_plugins = {};
    else installed_plugins = JSON.parse(installed_plugins);
    return installed_plugins;
}

/**
 * Save installed plugins object to local storage
 */
function set_installed_plugins(installed_plugins){
    localStorage.setItem('installed_plugins', JSON.stringify(installed_plugins));
}

/**
 * Add a plugin to local storage and refresh the plugin manager
 */
function install_plugin_locally(plugin_path){
    const installed_plugins = get_installed_plugins();
    installed_plugins[plugin_path] = {};

    const available_plugins = get_available_plugins();
    for (const key in available_plugins.dashboard){
        const p = available_plugins.dashboard[key];
        if (p.path != plugin_path){
            continue;
        }
        for (const conf_name in p.editable || {}){
            const conf = p.editable[conf_name];
            if (conf.hasOwnProperty('default')){
                if (!installed_plugins[plugin_path].hasOwnProperty('settings')){
                    installed_plugins[plugin_path].settings = {};
                }
                installed_plugins[plugin_path].settings[conf_name] = conf.default;
            }
        }
        break;
    }

    set_installed_plugins(installed_plugins);
    show_plugin_manager(true);
}

/**
 * Remove a plugin from local storage and refresh the plugin manager
 */
function remove_plugin_locally(plugin_path){
    const installed_plugins = get_installed_plugins();
    delete installed_plugins[plugin_path];
    set_installed_plugins(installed_plugins);
    show_plugin_manager(true);
}


/**
 * Show the Plugin Manager view
 * TODO: Support header/footer directives too
 *
 * @param force_refresh boolean true\false. Use `false` when displaying initially, and use `true` when forcing a refresh
 */
function show_plugin_manager(force_refresh){

    const main = document.querySelector('body > main');
    if (main.classList.contains('plugin-manager') 
        && force_refresh !== true)return;
    main.classList.add('plugin-manager');
    main.innerHTML = '';

    document.querySelector('head title').innerText = 'Plugin Manager | Bear Blog';

    const template = get_plugin_manager_template();

    main.innerHTML = template;
    const plugin_list = main.querySelector('.plugin-list');

    const plugins = get_available_plugins();


    const installed_plugins = get_installed_plugins();

    //console.log(plugins);
    //console.log(plugins.dashboard);

    for (const key in plugins.dashboard){
        const plugin = plugins.dashboard[key];
        const plugin_html = get_plugin_template(plugin, installed_plugins);
        const div = document.createElement('div');
        div.classList.add('plugin');
        div.innerHTML = plugin_html;
        plugin_list.appendChild(div);
    }
}

function save_configurations(save_button, plugin_path){
    const fieldset = save_button.parentNode;
    const inputs = fieldset.querySelectorAll('input');
    const installed_plugins = get_installed_plugins();
    const settings = {};
    for (const input of inputs){
        settings[input.getAttribute('name')] = input.value;
    }

    installed_plugins[plugin_path] = {
        settings: settings
    };
    set_installed_plugins(installed_plugins);
    save_button.innerText = "Saved";
    save_button.setAttribute("disabled", "disabled");
}

function make_fieldset_saveable(input){
    const fieldset = input.parentNode.parentNode;
    const save_button = fieldset.querySelector('button');
    save_button.innerText = "Save";
    save_button.removeAttribute('disabled');
}

/**
 * Get the HTML for a single plugin. To be displayed in a list of plugins for installation/removal.
 *
 * @param plugin A single plugin as retrieved from `get_available_plugins()`
 * @param installed_plugins, as returned from get_installed_plugins()
 * @return a string of HTML
 */
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
        const settings = installed_plugins[plugin.path].settings || {};
        // plugin is installed
        installed_class = " class=\"installed\" ";
        installed_text = "(installed)";
        if (plugin.hasOwnProperty('editable')
            &&Object.keys(plugin.editable).length > 0){
            let configuration_options = '';
            // plugin is configurable
            for (const editable_key in plugin.editable) {
                const ed = plugin.editable[editable_key];
                const conf_value = settings[editable_key] || ed.default;
                configuration_options += `
                    <label>${ed.label}<br>
                        <input onkeyup="make_fieldset_saveable(this)" type="${ed.type}" value="${conf_value}" name="${editable_key}" />
                    </label>
                    <br>
                `;
            }
            installer_html = `
                <button class="uninstall" onclick="remove_plugin_locally('${plugin.path}');">Remove Plugin</button>
                <fieldset class="configurations"><legend>Configure ${plugin.name}</legend>
                    ${configuration_options}
                    <button disabled="disabled" class="save_config" onclick="save_configurations(this, '${plugin.path}');">Saved</button>
                </fieldset>
            `;
        } else {
            installer_html = `
                <button class="uninstall" onclick="remove_plugin_locally('${plugin.path}');">Remove Plugin</button>
            `;
        }


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

