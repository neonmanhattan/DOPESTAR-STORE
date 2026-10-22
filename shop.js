/* ============================================================
   DopeStar Store — shop.js
   Runs on shop.html and every category page (shirts, pants,
   sweaters-jackets, accessories). Handles:
     - category / price / size filtering (shop.html only)
     - sorting
     - add-to-cart
     - color swatch variant image swap (shop.html only)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const cards = Array.from(grid.querySelectorAll('.product-card'));
  const resultCount = document.getElementById('result-count');
  const sortSelect = document.getElementById('sort-select');

  /* ---------- Filtering (only present on shop.html) ---------- */
  function applyFilters() {
    const catInput = document.querySelector('input[name="cat"]:checked');
    const priceInput = document.querySelector('input[name="price"]:checked');
    const cat = catInput ? catInput.value : 'all';
    const priceRange = priceInput ? priceInput.value : 'all';
    const query = (document.getElementById('shop-search')?.value || '').trim().toLowerCase();

    let visibleCount = 0;

    cards.forEach(card => {
      const cardCat = card.dataset.cat || '';
      const price = Number(card.dataset.price || 0);
      const haystack = [
        card.querySelector('.card-title')?.textContent,
        card.querySelector('.card-category')?.textContent,
        cardCat
      ].join(' ').toLowerCase();

      const catMatch = cat === 'all' || cardCat === cat;
      const searchMatch = !query || haystack.includes(query);

      let priceMatch = true;
      if (priceRange === 'low') priceMatch = price < 50000;
      else if (priceRange === 'mid') priceMatch = price >= 50000 && price <= 100000;
      else if (priceRange === 'high') priceMatch = price > 100000;

      const show = catMatch && priceMatch && searchMatch;
      card.classList.toggle('hidden', !show);
      if (show) visibleCount++;
    });

    if (resultCount) {
      resultCount.textContent =
        visibleCount === cards.length
          ? 'Showing all items'
          : `Showing ${visibleCount} item${visibleCount === 1 ? '' : 's'}`;
    }
  }

  const applyBtn = document.getElementById('apply-filters');
  if (applyBtn) {
    applyBtn.addEventListener('click', applyFilters);
    // Live-update as radios change too
    document.querySelectorAll('input[name="cat"], input[name="price"]')
      .forEach(input => input.addEventListener('change', applyFilters));
    // Category links on the home page use ?cat=<category>. Reflect that
    // selection in the filter before the first render.
    const requestedCategory = new URLSearchParams(window.location.search)
      .get('cat')
      ?.trim()
      .toLowerCase();
    if (requestedCategory) {
      const requestedInput = Array.from(document.querySelectorAll('input[name="cat"]'))
        .find(input => input.value.toLowerCase() === requestedCategory);
      if (requestedInput) requestedInput.checked = true;
    }

    applyFilters();
  }

  const searchInput = document.getElementById('shop-search');
  if (searchInput) {
    searchInput.addEventListener('input', applyFilters);
    if (!applyBtn) applyFilters();
  }

  // Size buttons are visual-only toggles (no product-level size data yet)
  document.querySelectorAll('.size-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.addEventListener('click', () => btn.classList.toggle('active'));
  });

  /* ---------- Sorting ---------- */
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const mode = sortSelect.value;
      const sorted = [...cards];

      if (mode === 'price-asc') {
        sorted.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
      } else if (mode === 'price-desc') {
        sorted.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
      } else if (mode === 'name') {
        sorted.sort((a, b) => {
          const nameA = a.querySelector('.card-title')?.textContent.trim() || '';
          const nameB = b.querySelector('.card-title')?.textContent.trim() || '';
          return nameA.localeCompare(nameB);
        });
      }
      // 'default' -> original DOM order (cards array preserves it)

      sorted.forEach(card => grid.appendChild(card));
    });
  }

  /* ---------- Color swatch variant swap (shop.html cards) ---------- */
  cards.forEach(card => {
    const mainImg = card.querySelector('.card-img-placeholder > img.shop-img');
    const variants = card.querySelectorAll('.variant-images img');
    if (!mainImg || !variants.length) return;

    const swatchRow = document.createElement('div');
    swatchRow.className = 'color-swatches';
    variants.forEach((variantImg, idx) => {
      const swatch = document.createElement('button');
      swatch.type = 'button';
      swatch.className = 'swatch' + (idx === 0 ? ' active' : '');
      swatch.style.backgroundImage = `url('${variantImg.src}')`;
      swatch.title = variantImg.dataset.color || '';
      swatch.addEventListener('click', () => {
        mainImg.src = variantImg.src;
        mainImg.alt = variantImg.alt;
        swatchRow.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');
      });
      swatchRow.appendChild(swatch);
    });
    card.querySelector('.card-img-placeholder').after(swatchRow);
  });
});
