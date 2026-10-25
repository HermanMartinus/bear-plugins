/*
 Plugin name: Lightbox
 Description: Opens post and page images in a full-screen viewer. Photos in the same paragraph form a set with previous/next, keyboard and swipe support. Styles included, using Bear's default color tokens.
 Author: Robert Birming
 Author URI: https://robertbirming.com
*/
(function () {

  "use strict";

  // Added first in <head>, so any theme rule with the same selector wins
  const css = `
main img[role="button"] {
  cursor: zoom-in;
}

.lightbox[open] {
  display: grid;
  place-items: center;
}

.lightbox {
  box-sizing: border-box;
  width: 100%;
  max-width: none;
  height: 100%;
  max-height: none;
  margin: 0;
  padding: 1rem;
  border: 0;
  color: var(--text-color, CanvasText);
  background-color: color-mix(in srgb, var(--background-color, Canvas) 95%, transparent);
}

.lightbox:focus {
  outline: none;
}

.lightbox::backdrop {
  background: none;
}

html:has(.lightbox[open]) {
  overflow: hidden;
}

.lightbox-image {
  max-width: 100%;
  max-height: calc(100dvh - 6rem);
  object-fit: contain;
}

.lightbox :is(.lightbox-close, .lightbox-prev, .lightbox-next) {
  position: fixed;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 0;
  border-radius: 999px;
  font: inherit;
  font-size: 1.25em;
  line-height: 1;
  cursor: pointer;
  color: color-mix(in srgb, var(--text-color, CanvasText) 80%, transparent);
  background-color: color-mix(in srgb, var(--background-color, Canvas) 70%, transparent);
}

.lightbox-close {
  inset-block-start: 1rem;
  inset-inline-end: 1rem;
}

.lightbox-prev,
.lightbox-next {
  inset-block-start: 50%;
  translate: 0 -50%;
}

.lightbox-prev {
  inset-inline-start: 1rem;
}

.lightbox-next {
  inset-inline-end: 1rem;
}

.lightbox-count {
  position: fixed;
  inset-block-end: 1rem;
  inset-inline: 0;
  margin: 0;
  text-align: center;
  font-size: 0.875em;
  font-variant-numeric: tabular-nums;
  color: color-mix(in srgb, var(--text-color, CanvasText) 80%, transparent);
}

/* Phones on their side: use the full height and keep the photo clear of the arrows */
@media (orientation: landscape) and (max-height: 32rem) {
  .lightbox-image {
    max-width: calc(100% - 6rem);
    max-height: calc(100dvh - 2rem);
  }

  .lightbox-count {
    inset-inline: auto;
    inset-inline-start: 50%;
    translate: -50% 0;
    padding: 0.125rem 0.625rem;
    border-radius: 999px;
    background-color: color-mix(in srgb, var(--background-color, Canvas) 70%, transparent);
  }
}

@media (hover: hover) {
  .lightbox :is(.lightbox-close, .lightbox-prev, .lightbox-next):hover {
    color: var(--link-color, LinkText);
  }
}

@media (prefers-reduced-motion: no-preference) {
  .lightbox[open] {
    animation: lightbox-in 150ms ease-out;
  }
}

@keyframes lightbox-in {
  from { opacity: 0; }
}
`;

  function addStyles() {
    if (document.getElementById("lightbox-styles")) return;
    const style = document.createElement("style");
    style.id = "lightbox-styles";
    style.textContent = css;
    document.head.prepend(style);
  }

  function init() {
    const images = Array.from(document.querySelectorAll("main img:not(a img)"));
    if (!images.length) return;

    addStyles();

    const dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.tabIndex = -1;
    dialog.setAttribute("aria-label", "Image viewer");
    dialog.innerHTML =
      '<img class="lightbox-image" alt="">' +
      '<button type="button" class="lightbox-close" aria-label="Close">×</button>' +
      '<button type="button" class="lightbox-prev" aria-label="Previous image">←</button>' +
      '<button type="button" class="lightbox-next" aria-label="Next image">→</button>' +
      '<p class="lightbox-count" aria-live="polite"></p>';
    document.body.appendChild(dialog);

    const view = dialog.querySelector(".lightbox-image");
    const prevBtn = dialog.querySelector(".lightbox-prev");
    const nextBtn = dialog.querySelector(".lightbox-next");
    const count = dialog.querySelector(".lightbox-count");

    let group = [];
    let index = 0;
    let opener = null;

    const show = (i) => {
      index = (i + group.length) % group.length;
      const img = group[index];
      view.src = img.currentSrc || img.src;
      view.alt = img.alt;
      count.textContent = (index + 1) + " / " + group.length;

      // Load the neighbours ahead, so previous and next feel instant
      if (group.length > 1) {
        [index + 1, index - 1].forEach((n) => {
          const next = group[(n + group.length) % group.length];
          new Image().src = next.currentSrc || next.src;
        });
      }
    };

    const open = (set, i) => {
      opener = document.activeElement;
      group = set;
      const many = set.length > 1;
      prevBtn.hidden = nextBtn.hidden = count.hidden = !many;
      show(i);
      dialog.showModal();
      // Focus the viewer itself, so no button shows a ring until you Tab to it
      dialog.focus();
    };

    // Photos sharing a parent (in Markdown, the same paragraph) form one set, so arrows stay within a gallery
    const sets = new Map();

    images.forEach((img) => {
      const set = sets.get(img.parentElement) || [];
      sets.set(img.parentElement, set);
      const i = set.push(img) - 1;

      img.tabIndex = 0;
      img.setAttribute("role", "button");
      img.setAttribute("aria-label", (img.alt ? img.alt + ", " : "") + "view larger");
      img.addEventListener("click", () => open(set, i));
      img.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open(set, i);
        }
      });
    });

    dialog.querySelector(".lightbox-close").addEventListener("click", () => dialog.close());
    prevBtn.addEventListener("click", () => show(index - 1));
    nextBtn.addEventListener("click", () => show(index + 1));

    dialog.addEventListener("keydown", (e) => {
      if (group.length < 2) return;
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        show(index + (e.key === "ArrowLeft" ? -1 : 1));
      }
    });

    // Swipe sideways with one finger, so pinch zoom still works
    let start = null;
    dialog.addEventListener("touchstart", (e) => {
      start = e.touches.length === 1 ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null;
    }, { passive: true });
    dialog.addEventListener("touchend", (e) => {
      if (!start || group.length < 2) return;
      const dx = e.changedTouches[0].clientX - start.x;
      const dy = e.changedTouches[0].clientY - start.y;
      start = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) show(index + (dx < 0 ? 1 : -1));
    }, { passive: true });
    dialog.addEventListener("touchcancel", () => {
      start = null;
    }, { passive: true });

    // Clicking the empty space around the image closes the viewer
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });

    // Back to the photo you opened, and clear the image so the next one never flashes the old
    dialog.addEventListener("close", () => {
      view.removeAttribute("src");
      if (opener) opener.focus();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
