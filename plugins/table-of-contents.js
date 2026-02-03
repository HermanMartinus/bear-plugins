/*
 Plugin name: Table of contents
 Description: Generate table of contents in a post based on titles
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';
    
    document.addEventListener("DOMContentLoaded", function() {
        // --- Configuration ---
        const TOC_LABEL = "Table of contents";
        const MAX_DEPTH = 3; // Number of levels to include (1, 2, or 3)
        const SCOPE_SELECTOR = "main";
        // ---------------------

        const contentScope = document.querySelector(SCOPE_SELECTOR);
        if (!contentScope) return;

        // 1. Select headers and filter for those with IDs
        const headers = Array.from(contentScope.querySelectorAll("h1, h2, h3, h4, h5, h6"))
                            .filter(h => h.id);
        if (headers.length === 0) return;

        // Determine the baseline (the highest level header found)
        const baseLevel = parseInt(headers[0].tagName.substring(1));

        // 2. Create the <details> element
        const tocDetails = document.createElement("details");
        tocDetails.className = "toc";
        tocDetails.open = true;

        const summary = document.createElement("summary");
        summary.textContent = TOC_LABEL;
        tocDetails.appendChild(summary);

        const rootUl = document.createElement("ul");
        tocDetails.appendChild(rootUl);

        const ulStack = [rootUl];

        // 3. Build hierarchy
        headers.forEach(header => {
            const currentLevel = parseInt(header.tagName.substring(1));
            const relativeDepth = currentLevel - baseLevel;

            // Skip if header is higher than base or exceeds MAX_DEPTH
            if (relativeDepth < 0 || relativeDepth >= MAX_DEPTH) return;

            // Adjust stack depth
            while (ulStack.length > relativeDepth + 1) {
                ulStack.pop();
            }

            if (ulStack.length <= relativeDepth) {
                const lastLi = ulStack[ulStack.length - 1].lastElementChild;
                if (lastLi) {
                    const newUl = document.createElement("ul");
                    lastLi.appendChild(newUl);
                    ulStack.push(newUl);
                } else {
                    ulStack.push(ulStack[ulStack.length - 1]);
                }
            }

            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = `#${header.id}`;
            a.textContent = header.textContent.trim();
            
            li.appendChild(a);
            ulStack[ulStack.length - 1].appendChild(li);
        });

        // 4. Determine Injection Point
        const title = contentScope.querySelector("h1");
        if (title) {
            // Add after the H1
            title.insertAdjacentElement("afterend", tocDetails);
        } else {
            // Add to the very top of the main container
            contentScope.prepend(tocDetails);
        }
    });
})();