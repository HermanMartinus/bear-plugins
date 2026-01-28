/*
 Plugin name: Copy code blocks
 Description: Adds a copy button to code blocks for easy clipboard copying
 Author: Herman Martinus
 Author URI: https://herman.bearblog.dev
*/

(function() {
    'use strict';
    
    document.addEventListener("DOMContentLoaded", function() {
        // Find all code blocks
        const codeBlocks = document.querySelectorAll('.highlight');
        
        codeBlocks.forEach(function(highlight) {
            // Create wrapper for positioning
            highlight.style.position = 'relative';
            
            // Create copy button
            const copyButton = document.createElement('button');
            copyButton.className = 'copy-code-button';
            copyButton.setAttribute('aria-label', 'Copy code to clipboard');
            copyButton.style.position = 'absolute';
            copyButton.style.top = '8px';
            copyButton.style.right = '6px';
            copyButton.style.background = 'rgba(0, 0, 0, 0)';
            copyButton.style.border = 'none';
            copyButton.style.cursor = 'pointer';
            copyButton.style.display = 'flex';
            copyButton.style.width = '28px';
            copyButton.style.height = '28px';
            
            // Copy icon SVG
            copyButton.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                    <path d="M3 10V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" stroke-width="1.5" fill="none"/>
                </svg>
            `;
            
            // Copy functionality
            copyButton.addEventListener('click', function() {
                const pre = highlight.querySelector('pre');
                const code = pre.textContent;
                navigator.clipboard.writeText(code).then(function() {
                    // Change to checkmark icon
                    copyButton.innerHTML = `
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    `;
                    
                    // Reset after 1 seconds
                    setTimeout(function() {
                        copyButton.innerHTML = `
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="5" y="5" width="9" height="9" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
                                <path d="M3 10V3C3 2.44772 3.44772 2 4 2H10" stroke="currentColor" stroke-width="1.5" fill="none"/>
                            </svg>
                        `;
                    }, 1000);
                }).catch(function(err) {
                    console.error('Failed to copy code: ', err);
                });
            });
            
            // Add button to highlight div
            highlight.appendChild(copyButton);
        });
    });
})();