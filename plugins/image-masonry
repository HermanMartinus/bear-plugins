/* 
    Image masonry plugin for bearblog: to display a collection of images hosted in a github repository in a fake masonry grid

    Put all images in a single folder in your repository and ensure that it is public. 

    Made by Mason. mason.bearblog.dev

*/


(function () {

    const style = document.createElement('style');
    style.textContent = `.masonry {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 20px;
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
}`;
    document.head.appendChild(style);

    const script = document.currentScript;

    const owner = script.dataset.owner;
    const repo = script.dataset.repo;
    const folder = script.dataset.folder;

    const columncount = Number(script.dataset.columns);
    const columns = [];

    const main = document.querySelector('main');

    const container = document.createElement('div');
    container.classList.add('masonry');
    main.appendChild(container);

    if (isNaN(columncount)) {
        throw new Error("Column count parsing failure. Ensure it is a real number");
    }

    // create collumn divs
    Array.from({ length: columncount }).forEach(col => {
        const column = document.createElement('div');
        column.classList.add('column');
        columns.push(column);
        container.appendChild(column);
    });

    async function fetchImages() {
        const apiUrl = `https://api.github.com/repos/${owner}/${repo}/contents/${folder}`;

        try {
            const res = await fetch(apiUrl);
            if (!res.ok) {
                throw new Error(`Response status: ${response.status}`);
            }

            const data = await res.json();


            // filter for image files
            const urls = data
                .filter(file => file.type === 'file' && /\.(jpg|jpeg|png|webp)$/i.test(file.name))
                .map(file => file.download_url);


            // split url array into columns
            const columnlength = Math.ceil(urls.length / columncount);
            for (let i = 0; i < columncount; i++) {
                const start = i * columnlength;
                const end = start + columnlength;

                // inject images
                urls.slice(start, end).forEach(url => {
                    const img = document.createElement('img');
                    img.src = url;
                    img.loading = 'lazy';
                    img.alt = url;
                    // fade-in effect when image loads
                    img.addEventListener('load', () => img.classList.add('loaded'));
                    columns[i].appendChild(img);

                });
            }
        } catch (err) {
            container.innerHTML = "<p>Failed to load images.</p>";
            throw new Error(`Error fetching images: ${err}`);
        }
    }

    fetchImages();
})();
