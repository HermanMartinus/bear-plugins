/*
 Plugin name: Blog archive
 Description: Groups blog posts by month with year filtering, search, and pagination.
 Author: Robert Birming
 Author URI: https://robertbirming.com
*/
(function () {

  "use strict";

  const PARAM_YEAR = "y";
  const PARAM_SEARCH = "s";
  const PARAM_PAGE = "p";

  const POSTS_PER_PAGE = 25;
  const SEARCH_DEBOUNCE_MS = 140;

  const ID_WRAPPER = "blog-archive";
  const ID_YEAR = "blog-archive-year";
  const ID_SEARCH = "blog-archive-search";
  const ID_PAGINATION = "blog-archive-pagination";
  const ID_PREV = "blog-archive-prev";
  const ID_NEXT = "blog-archive-next";
  const ID_INFO = "blog-archive-info";
  const ID_EMPTY = "blog-archive-empty";

  const showEl = (el) => { el.hidden = false; el.style.display = ""; };
  const hideEl = (el) => { el.hidden = true; el.style.display = "none"; };

  const normalizeText = (s) => (s || "").normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  function init() {
    if (!document.body.classList.contains("blog")) return;

    const main = document.querySelector("main");
    if (!main) return;

    if (main.querySelector("#" + ID_WRAPPER)) return;

    const sourceList =
      main.querySelector("ul.embedded.blog-posts") ||
      main.querySelector("ul.blog-posts");
    if (!sourceList) return;

    const rawItems = Array.from(sourceList.querySelectorAll("li"));
    if (!rawItems.length) return;

    const legacySearch = main.querySelector("#searchInput");
    if (legacySearch) legacySearch.remove();

    const tagsBlock = main.querySelector(".tags")?.closest("small");

    const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

    const parseDatetime = (dt) => {
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dt);
      return m ? new Date(Date.UTC(+m[1], +m[2] - 1, +m[3])) : new Date(dt);
    };

    const readParams = () => new URLSearchParams(location.search);

    // Uses replaceState (not pushState) so filtering/searching doesn't clutter browser history
    const writeParams = (p) => {
      const url = new URL(location.href);
      url.pathname = url.pathname.endsWith("/") ? url.pathname : url.pathname + "/";
      url.search = p.toString();
      history.replaceState(null, "", url.toString());
    };

    const setDisabled = (btn, disabled) => {
      btn.disabled = !!disabled;
    };

    const groups = Object.create(null);
    const years = Object.create(null);
    const allItems = [];

    for (let i = 0; i < rawItems.length; i++) {
      const li = rawItems[i];

      li.style.display = "";

      const time = li.querySelector("time[datetime]");
      if (!time) continue;

      const dt = time.getAttribute("datetime");
      if (!dt) continue;

      const date = parseDatetime(dt);
      if (Number.isNaN(date.getTime())) continue;

      const year = String(date.getUTCFullYear());
      const month = String(date.getUTCMonth() + 1).padStart(2, "0");
      const monthKey = year + "-" + month;

      const label = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      });

      const anchor = li.querySelector("a");
      li.dataset.blogArchiveYear = year;
      li.dataset.blogArchiveText = normalizeText((anchor?.textContent || "").trim());

      years[year] = (years[year] || 0) + 1;

      if (!groups[monthKey]) groups[monthKey] = { label, date, items: [] };
      groups[monthKey].items.push(li);

      allItems.push(li);
    }

    if (!allItems.length) return;

    const sortedMonths = Object.keys(groups).sort((a, b) => groups[b].date - groups[a].date);

    sourceList.remove();

    const wrapper = document.createElement("div");
    wrapper.id = ID_WRAPPER;
    main.appendChild(wrapper);

    const controls = document.createElement("p");

    const yearSelect = document.createElement("select");
    yearSelect.id = ID_YEAR;
    yearSelect.setAttribute("aria-label", "Filter posts by year");
    yearSelect.setAttribute("aria-controls", wrapper.id);

    const optAll = document.createElement("option");
    optAll.value = "";
    optAll.textContent = "All posts";
    yearSelect.appendChild(optAll);

    Object.keys(years)
      .sort((a, b) => Number(b) - Number(a))
      .forEach((y) => {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y + " (" + years[y] + ")";
        yearSelect.appendChild(opt);
      });

    controls.appendChild(yearSelect);

    const searchInput = document.createElement("input");
    searchInput.type = "search";
    searchInput.id = ID_SEARCH;
    searchInput.placeholder = "Search\u2026";
    searchInput.autocomplete = "off";
    searchInput.spellcheck = false;
    searchInput.setAttribute("aria-label", "Search posts");
    searchInput.setAttribute("aria-controls", wrapper.id);

    controls.appendChild(searchInput);

    wrapper.appendChild(controls);

    if (tagsBlock) wrapper.appendChild(tagsBlock);

    const emptyMsg = document.createElement("p");
    emptyMsg.id = ID_EMPTY;
    hideEl(emptyMsg);
    wrapper.appendChild(emptyMsg);

    const months = [];

    for (let mi = 0; mi < sortedMonths.length; mi++) {
      const key = sortedMonths[mi];
      const g = groups[key];

      const h3 = document.createElement("h3");
      h3.textContent = g.label;

      const ul = document.createElement("ul");
      ul.className = "blog-posts";

      for (let j = 0; j < g.items.length; j++) {
        showEl(g.items[j]);
        ul.appendChild(g.items[j]);
      }

      wrapper.appendChild(h3);
      wrapper.appendChild(ul);

      months.push({ h3, ul });
    }

    const pagination = document.createElement("p");
    pagination.id = ID_PAGINATION;

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.id = ID_PREV;
    prevBtn.textContent = "Previous";
    prevBtn.setAttribute("aria-controls", wrapper.id);

    const info = document.createElement("span");
    info.id = ID_INFO;
    info.setAttribute("aria-live", "polite");

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.id = ID_NEXT;
    nextBtn.textContent = "Next";
    nextBtn.setAttribute("aria-controls", wrapper.id);

    pagination.appendChild(prevBtn);
    pagination.appendChild(info);
    pagination.appendChild(nextBtn);
    wrapper.appendChild(pagination);

    let currentPage = 1;
    let debounceId = null;

    const clearPendingSearch = () => {
      if (debounceId) {
        window.clearTimeout(debounceId);
        debounceId = null;
      }
    };

    const getFiltered = () => {
      const yr = yearSelect.value;
      const term = normalizeText(searchInput.value.trim());

      if (!yr && !term) return allItems;

      return allItems.filter((item) => {
        if (yr && item.dataset.blogArchiveYear !== yr) return false;
        if (term && !(item.dataset.blogArchiveText || "").includes(term)) return false;
        return true;
      });
    };

    const updateEmptyMessage = () => {
      const yr = yearSelect.value;
      const term = searchInput.value.trim();
      const parts = [];
      if (yr) parts.push(yr);
      if (term) parts.push("\u201C" + term + "\u201D");
      emptyMsg.textContent = "No posts found" + (parts.length ? " for " + parts.join(", ") : "") + ".";
    };

    const renderPageItems = (pageItems, hasAnyResults) => {
      allItems.forEach(hideEl);
      pageItems.forEach(showEl);

      months.forEach(({ h3, ul }) => {
        const anyVisible = Array.from(ul.children).some((c) => !c.hidden);
        if (anyVisible) {
          showEl(ul);
          showEl(h3);
        } else {
          hideEl(ul);
          hideEl(h3);
        }
      });

      hasAnyResults ? hideEl(emptyMsg) : showEl(emptyMsg);
    };

    const syncUrl = () => {
      const yr = yearSelect.value;
      const term = searchInput.value.trim();
      const p = readParams();
      yr ? p.set(PARAM_YEAR, yr) : p.delete(PARAM_YEAR);
      term ? p.set(PARAM_SEARCH, term) : p.delete(PARAM_SEARCH);
      currentPage > 1 ? p.set(PARAM_PAGE, String(currentPage)) : p.delete(PARAM_PAGE);
      writeParams(p);
    };

    const update = () => {
      const filtered = getFiltered();
      const hasAnyResults = filtered.length > 0;
      const totalPages = Math.max(1, Math.ceil(filtered.length / POSTS_PER_PAGE));
      currentPage = clamp(currentPage, 1, totalPages);

      const start = (currentPage - 1) * POSTS_PER_PAGE;
      renderPageItems(filtered.slice(start, start + POSTS_PER_PAGE), hasAnyResults);

      if (hasAnyResults) {
        info.textContent = "Page " + currentPage + " of " + totalPages;
        setDisabled(prevBtn, currentPage === 1);
        setDisabled(nextBtn, currentPage === totalPages);
        filtered.length <= POSTS_PER_PAGE ? hideEl(pagination) : showEl(pagination);
      } else {
        info.textContent = "";
        hideEl(pagination);
      }

      updateEmptyMessage();
      syncUrl();
    };

    const p0 = readParams();
    yearSelect.value = p0.get(PARAM_YEAR) || "";
    searchInput.value = p0.get(PARAM_SEARCH) || "";

    const page0 = parseInt(p0.get(PARAM_PAGE) || "1", 10);
    currentPage = Number.isFinite(page0) && page0 > 0 ? page0 : 1;

    const scrollToTop = () => {
      wrapper.scrollIntoView({ behavior: "smooth" });
    };

    yearSelect.addEventListener("change", () => {
      clearPendingSearch();
      currentPage = 1;
      update();
    });

    let lastHandledValue = null;

    const runSearchUpdate = () => {
      const value = searchInput.value;
      if (value === lastHandledValue) return;
      lastHandledValue = value;
      currentPage = 1;
      clearPendingSearch();
      update();
    };

    searchInput.addEventListener("input", () => {
      if (!searchInput.value.trim()) {
        runSearchUpdate();
        return;
      }
      currentPage = 1;
      clearPendingSearch();
      // Debounce while typing to avoid re-filtering on every keystroke
      debounceId = window.setTimeout(() => {
        debounceId = null;
        lastHandledValue = searchInput.value;
        update();
      }, SEARCH_DEBOUNCE_MS);
    });

    searchInput.addEventListener("search", runSearchUpdate);

    prevBtn.addEventListener("click", () => {
      if (prevBtn.disabled) return;
      currentPage -= 1;
      update();
      scrollToTop();
    });

    nextBtn.addEventListener("click", () => {
      if (nextBtn.disabled) return;
      currentPage += 1;
      update();
      scrollToTop();
    });

    update();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

})();
