/*
 Plugin name: Version history
 Description: Store a version history in browser for easy recovery of older versions of posts
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';

    document.addEventListener('DOMContentLoaded', function() {
        
        // --- 1. ID Extraction & Validation ---
        const urlMatch = window.location.pathname.match(/dashboard\/posts\/([^\/]+)/);
        const postId = urlMatch ? urlMatch[1] : null;

        // Exit if no ID found or if it's a new post
        if (!postId || postId === 'new') {
            return; 
        }

        // --- 2. Configuration ---
        const MAX_VERSIONS = 10; 
        const STORAGE_KEY = `bear_blog_v_${postId}`;
        
        const $form = document.querySelector('form.post-form');
        const $headerContent = document.getElementById('header_content');
        const $bodyContent = document.getElementById('body_content');
        const $controlsArea = document.querySelector('.post-form');

        // --- 3. Logic Functions ---

        function getVersions() {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        }

        function saveVersion(label = null) {
            const versions = getVersions();
            const now = new Date();
            
            const currentHeader = $headerContent.innerHTML;
            const currentBody = $bodyContent.value;

            // Don't save if the content is exactly the same as the latest version
            if (versions.length > 0) {
                const latest = versions[0];
                if (latest.headerHTML === currentHeader && latest.bodyText === currentBody) {
                    return; 
                }
            }

            const newVersion = {
                id: Date.now(),
                timestamp: label || now.toISOString().slice(0, 19).replace('T', ' '),
                headerHTML: currentHeader,
                bodyText: currentBody,
                preview: currentBody.substring(0, 60).replace(/\n/g, ' ') + '...'
            };

            versions.unshift(newVersion);

            if (versions.length > MAX_VERSIONS) {
                versions.length = MAX_VERSIONS;
            }

            localStorage.setItem(STORAGE_KEY, JSON.stringify(versions));
            renderVersions();
        }

        function restoreVersion(version) {
            if (confirm(`Restore version from ${version.timestamp}?\nThis will overwrite current editor state.`)) {
                $headerContent.innerHTML = version.headerHTML;
                $bodyContent.value = version.bodyText;
                
                // Trigger auto-resize logic
                $bodyContent.dispatchEvent(new Event('input'));
            }
        }

        function renderVersions() {
            const versions = getVersions();
            $listContainer.innerHTML = '';

            if (versions.length === 0) {
                $listContainer.innerHTML = '<p style="color: #666; padding: 5px; margin: 0;">No saved versions yet.</p>';
                return;
            }

            versions.forEach((v) => {
                const item = document.createElement('div');
                item.style.cssText = 'padding: 8px; background: white; border: 1px solid #eee; display: flex; justify-content: space-between; align-items: center; font-family: sans-serif;';
                
                const infoDiv = document.createElement('div');
                infoDiv.style.cssText = 'display: flex; flex-direction: column; cursor: pointer; flex-grow: 1; overflow: hidden;';
                infoDiv.innerHTML = `<strong style="color: #333; font-size: 11px;">${v.timestamp}</strong><span style="color: #888; font-size: 11px; white-space: nowrap; text-overflow: ellipsis; overflow: hidden;">${v.preview}</span>`;
                
                const restoreBtn = document.createElement('button');
                restoreBtn.type = 'button';
                restoreBtn.textContent = 'Load';
                restoreBtn.style.cssText = 'margin-left: 10px; padding: 2px 6px; border: 1px solid #ccc; border-radius: 3px; background: #fff; cursor: pointer; font-size: 10px;';
                
                restoreBtn.onclick = (e) => { e.preventDefault(); restoreVersion(v); };
                infoDiv.onclick = (e) => { e.preventDefault(); restoreVersion(v); };

                item.appendChild(infoDiv);
                item.appendChild(restoreBtn);
                $listContainer.appendChild(item);
            });

            const clearBtn = document.createElement('button');
            clearBtn.textContent = 'Clear history';
            clearBtn.type = 'button';
            clearBtn.style.cssText = 'margin-top: 8px; align-self: flex-start; color: #999; background: none; border: none; cursor: pointer; font-size: 10px; text-decoration: underline;';
            clearBtn.onclick = (e) => {
                e.preventDefault();
                if(confirm('Delete all local history for this post?')) {
                    localStorage.removeItem(STORAGE_KEY);
                    renderVersions();
                }
            };
            $listContainer.appendChild(clearBtn);
        }

        // --- 4. UI Setup ---
        const $historyContainer = document.createElement('details');
        $historyContainer.style.cssText = 'font-size: 12px; margin-bottom: 10px; border: 1px solid #ddd; padding: 5px; border-radius: 4px; background: #fefefe;';
        
        const $summary = document.createElement('summary');
        $summary.style.cssText = 'cursor: pointer; font-weight: bold; outline: none;';
        $summary.textContent = `Version history`;
        
        const $listContainer = document.createElement('div');
        $listContainer.style.cssText = 'max-height: 180px; overflow-y: auto; margin-top: 8px; display: flex; flex-direction: column; gap: 4px;';

        $historyContainer.appendChild($summary);
        $historyContainer.appendChild($listContainer);

        if ($controlsArea) {
            $controlsArea.after($historyContainer);
        }

        // --- 5. Initialization & Event Listeners ---

        // Check if empty on load
        const existingVersions = getVersions();
        if (existingVersions.length === 0) {
            saveVersion('Initial version');
        }

        // Save on button click/form submit
        if ($form) {
            $form.addEventListener('submit', () => saveVersion());
        }

        // Catch Ctrl+S / Cmd+S
        document.addEventListener('keydown', function(event) {
            if ((event.ctrlKey || event.metaKey) && event.keyCode === 83) {
                saveVersion();
            }
        });

        // Final Render
        renderVersions();
    });
})();