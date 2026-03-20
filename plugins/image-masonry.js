/*
 Plugin name: image-masonry
 Description: A simple hacky masonry grid that pulls photos from a github repository
 Author: Mason
 Author URI: mason.bearblog.dev, github.com/IAMME543
 Browser Support: Requires Firefox 52+ or Chromium 55+ for async/await support 
 */

/* USAGE
It is recomended to manually compress images before storing on github as it makes everything load faster and reduces bandwidth usage.

Change the 4 values (owner, repo, folder, columnCount) or use data attributes in the src declaration as shown here:

> <src data-owner="Github username" data-repo="Github repository name" data-folder="Repository folder name" data-columns="3"></src> 

*/

(function () {
    'use strict';
    const script = document.currentScript;
 
     // Set as github username
     const owner = script.dataset.owner;
     // Set as the repository containing images
     const repo = script.dataset.repo;
     // Set as folder containing images 
     const folder = script.dataset.folder;
     // Set as amount of columns
     const columnCount = Number(script.dataset.columns);

    const main = document.querySelector('main');

    if (!main || !isOnBlog()) { 
        console.log("main does not exist or are not on blog")
        return }

    const style = document.createElement('style');

    style.textContent = `
    .masonry {
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: flex-start;
  }
  .masonry img {
    width: 100%;
    height: auto;
    object-fit: contain;
    display: block;
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
  }

  .masonry img.loaded {
    opacity: 1;
  }

  .column {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width:  ${100 / columnCount}%;
}`;

    document.head.appendChild(style);

    const columns = [];

    const container = document.createElement('div');

    container.classList.add('masonry');

    main.appendChild(container);


    Array.from({ length: columnCount }).forEach(col => {

        const column = document.createElement('div');

        column.classList.add('column');

        columns.push(column);

        container.appendChild(column);

    });


    async function fetchImages() {

        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;

        try {

            const res = await fetch(apiUrl);
            const data = await res.json();


            // filter for image files

            const urls = data
                .filter(file => file.type === 'file' && /\.(jpg|jpeg|png|webp)$/i.test(file.name))
                .map(file => file.download_url);



            urls.forEach(url => {
                const img = document.createElement('img');
                img.addEventListener('load', () => {

                    
                    const heights = columns.map(col => col.getBoundingClientRect().height)
                    let shortest = heights.indexOf(Math.min(...heights))

                    //console.log(columnHeight[0] + ", " + columnHeight[1] + ", " + columnHeight[2])

                    columns[shortest].appendChild(img);

                    //console.log("url: " + url + " shortest: " + shortest + " heights: " + heights)

                    img.classList.add('loaded');

                });
                img.src = url;
                img.alt = url;
            })

        } catch (err) {

            console.error("Error fetching images:", err);
            container.innerHTML = "<p>Failed to load images.</p>";
        }
    }
    function isOnBlog() {
        if (document.body.classList.contains('home') || 
        document.body.classList.contains('blog') || 
        document.body.classList.contains('post') || 
        document.body.classList.contains('page')) {
            return true;
        }
    } 


    addEventListener("DOMContentLoaded", (event) => fetchImages())


})();
