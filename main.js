/* ============================================================
   DopeStar Store — main.js
   Shared behaviour loaded on every page:
     - mobile hamburger menu
     - active nav link highlighting
     - cart badge count (reads shared cart storage)
     - toast helper
   ============================================================ */

/* ---------- Shared cart storage (used by shop.js, cart.js, payment.js) ---------- */
const DopeCart = {
  KEY: 'dopestar_cart',

  read() {
    try {
      const raw = localStorage.getItem(this.KEY);
      const items = raw ? JSON.parse(raw) : [];
      if (!Array.isArray(items)) return [];

      return items
        .filter(item => item && typeof item === 'object')
        .map(item => ({
          title: String(item.title || 'Item'),
          category: String(item.category || ''),
          color: String(item.color || ''),
          image: String(item.image || ''),
          price: Math.max(0, Number(item.price) || 0),
          qty: Math.max(1, Math.floor(Number(item.qty) || 1))
        }));
    } catch (e) {
      console.error('Cart read failed:', e);
      return [];
    }
  },

  write(items) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(items));
      DopeCart.updateBadge();
    } catch (e) {
      console.error('Cart write failed:', e);
    }
  },

  count() {
    return this.read().reduce((sum, item) => sum + Number(item.qty || 0), 0);
  },

  add(product) {
    const item = {
      title: String(product.title || 'Item'),
      category: String(product.category || ''),
      color: String(product.color || ''),
      image: String(product.image || ''),
      price: Math.max(0, Number(product.price) || 0)
    };
    const items = this.read();
    const existing = items.find(
      i => i.title === item.title && i.color === item.color
    );
    if (existing) {
      existing.qty += 1;
    } else {
      items.push({ ...item, qty: 1 });
    }
    this.write(items);
  },

  updateQty(index, qty) {
    const items = this.read();
    if (!Number.isInteger(index) || !items[index]) return;
    const nextQty = Math.floor(Number(qty));
    if (!Number.isFinite(nextQty) || nextQty <= 0) {
      items.splice(index, 1);
    } else {
      items[index].qty = nextQty;
    }
    this.write(items);
  },

  remove(index) {
    const items = this.read();
    if (!Number.isInteger(index) || !items[index]) return;
    items.splice(index, 1);
    this.write(items);
  },

  clear() {
    this.write([]);
  },

  subtotal() {
    return this.read().reduce((sum, i) => sum + i.price * i.qty, 0);
  },

  updateBadge() {
    const count = DopeCart.count();
    document.querySelectorAll('.cart-count').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });
  },

  FULFILL_KEY: 'dopestar_fulfillment',
  DELIVERY_FEE: 5000,
  WHATSAPP: '256706210339',

  fulfillment() {
    return localStorage.getItem(this.FULFILL_KEY) === 'pickup' ? 'pickup' : 'delivery';
  },

  setFulfillment(value) {
    localStorage.setItem(this.FULFILL_KEY, value === 'pickup' ? 'pickup' : 'delivery');
  },

  deliveryFee() {
    if (this.subtotal() <= 0) return 0;
    return this.fulfillment() === 'pickup' ? 0 : this.DELIVERY_FEE;
  }
};

const STORE_HOURS = {
  // Africa/Kampala — Sunday=0
  0: { open: 10 * 60, close: 18 * 60, label: '10:00 am – 6:00 pm' },
  1: { open: 9 * 60, close: 20 * 60 + 30, label: '9:00 am – 8:30 pm' },
  2: { open: 9 * 60, close: 20 * 60 + 30, label: '9:00 am – 8:30 pm' },
  3: { open: 9 * 60, close: 20 * 60 + 30, label: '9:00 am – 8:30 pm' },
  4: { open: 9 * 60, close: 20 * 60 + 30, label: '9:00 am – 8:30 pm' },
  5: { open: 9 * 60, close: 20 * 60 + 30, label: '9:00 am – 8:30 pm' },
  6: { open: 9 * 60, close: 20 * 60 + 30, label: '9:00 am – 8:30 pm' }
};

function kampalaNow() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Kampala',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).formatToParts(new Date());
  const get = type => parts.find(p => p.type === type)?.value;
  const weekday = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[get('weekday')];
  return { weekday, minutes: Number(get('hour')) * 60 + Number(get('minute')) };
}

function storeStatus() {
  const { weekday, minutes } = kampalaNow();
  const hours = STORE_HOURS[weekday];
  const open = minutes >= hours.open && minutes < hours.close;
  const closeHour = hours.close === 18 * 60 ? '6:00 pm' : '8:30 pm';
  return {
    open,
    badge: open ? 'Open Now' : 'Closed',
    hours: open ? `Closes ${closeHour}` : `Opens ${hours.label.split(' – ')[0]}`,
    weekday
  };
}

/* ---------- Toast notification ---------- */
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => toast.classList.remove('show'), 2600);
}

/* ---------- Currency helper ---------- */
function formatUGX(amount) {
  return 'UGX ' + Math.round(Math.max(0, Number(amount) || 0)).toLocaleString('en-UG');
}

/* Escape values restored from browser storage before rendering them as HTML. */
function escapeHTML(value) {
  return String(value).replace(/[&<>'"]/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[character]));
}

/* ---------- Init on every page ---------- */
document.addEventListener('DOMContentLoaded', () => {
  // Mobile hamburger
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // Highlight active nav link based on current page
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === current) a.classList.add('active');
  });

  // Category jump-to-page select (used on shop/shirts/pants/etc pages)
  const categoryNav = document.getElementById('category-nav-select');
  if (categoryNav) {
    categoryNav.addEventListener('change', () => {
      if (categoryNav.value) window.location.href = categoryNav.value;
    });
  }

  // Populate cart badge
  DopeCart.updateBadge();

  const status = storeStatus();
  document.querySelectorAll('.badge-open').forEach(el => {
    el.textContent = status.badge;
    el.classList.toggle('is-closed', !status.open);
  });
  document.querySelectorAll('.badge-hours').forEach(el => {
    el.textContent = status.hours;
  });

  const hourRows = document.querySelectorAll('.hours-table tr');
  hourRows.forEach(row => row.classList.remove('today'));
  const hourRowIndex = status.weekday === 0 ? 6 : status.weekday - 1;
  if (hourRows[hourRowIndex]) hourRows[hourRowIndex].classList.add('today');

  if (!document.querySelector('.wa-float')) {
    const wa = document.createElement('a');
    wa.className = 'wa-float';
    wa.href = `https://wa.me/${DopeCart.WHATSAPP}?text=${encodeURIComponent('Hi DopeStar Store — I have a question about your collection.')}`;
    wa.target = '_blank';
    wa.rel = 'noopener noreferrer';
    wa.setAttribute('aria-label', 'Chat on WhatsApp');
    wa.innerHTML = '<span>WhatsApp</span>';
    document.body.appendChild(wa);
  }

  // Add-to-cart (global — works on any page with .product-card + [data-action="cart"])
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('[data-action="cart"]');
    if (!btn) return;

    const card = btn.closest('.product-card');
    if (!card) return;

    const title = card.querySelector('.card-title')?.textContent.trim() || 'Item';
    const category = card.querySelector('.card-category')?.textContent.trim() || '';
    const price = Number(card.dataset.price || 0);
    const activeSwatch = card.querySelector('.swatch.active');
    const img = card.querySelector('.card-img-placeholder img');
    const color = activeSwatch ? activeSwatch.title : '';

    DopeCart.add({ title, category, price, color, image: img ? img.src : '' });
    showToast(`${title} added to your bag`);
  });
});
