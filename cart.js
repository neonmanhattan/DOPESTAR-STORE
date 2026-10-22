/* ============================================================
   DopeStar Store — cart.js (cart.html)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const itemsWrap = document.getElementById('cart-items');
  const emptyState = document.getElementById('cart-empty');
  const subtotalEl = document.getElementById('sum-subtotal');
  const deliveryEl = document.getElementById('sum-delivery');
  const deliveryLabel = document.getElementById('sum-delivery-label');
  const totalEl = document.getElementById('sum-total');
  const clearLink = document.getElementById('clear-cart');
  const whatsappOrder = document.getElementById('whatsapp-order');
  if (!itemsWrap) return;

  document.querySelectorAll('input[name="fulfill"]').forEach(input => {
    input.checked = input.value === DopeCart.fulfillment();
    input.addEventListener('change', () => {
      DopeCart.setFulfillment(input.value);
      render();
    });
  });

  function render() {
    const items = DopeCart.read();

    if (items.length === 0) {
      itemsWrap.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      updateSummary(0);
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    itemsWrap.innerHTML = items.map((item, index) => `
      <div class="cart-row" data-index="${index}">
        <div class="cart-img-wrap">
          <img class="cart-row-img" src="${escapeHTML(item.image)}" alt="${escapeHTML(item.title)}">
        </div>
        <div class="cart-row-info">
          <div class="cart-cat">${escapeHTML(item.category)}</div>
          <div class="cart-name">${escapeHTML(item.title)}</div>
          <div class="cart-unit-price">${formatUGX(item.price)}${item.color ? ' · ' + escapeHTML(item.color) : ''}</div>
        </div>
        <div class="qty-control">
          <button type="button" class="qty-minus" aria-label="Decrease quantity">−</button>
          <span>${item.qty}</span>
          <button type="button" class="qty-plus" aria-label="Increase quantity">+</button>
        </div>
        <div class="cart-row-total">${formatUGX(item.price * item.qty)}</div>
        <button type="button" class="remove-btn" aria-label="Remove item">×</button>
      </div>
    `).join('');

    updateSummary(DopeCart.subtotal());
  }

  function updateSummary(subtotal) {
    const pickup = DopeCart.fulfillment() === 'pickup';
    const delivery = DopeCart.deliveryFee();
    if (subtotalEl) subtotalEl.textContent = formatUGX(subtotal);
    if (deliveryLabel) deliveryLabel.textContent = pickup ? 'Pickup (CAPITAL CENTER)' : 'Delivery (Kampala)';
    if (deliveryEl) deliveryEl.textContent = pickup ? 'Free' : formatUGX(delivery);
    if (totalEl) totalEl.textContent = formatUGX(subtotal + delivery);
  }

  itemsWrap.addEventListener('click', e => {
    const row = e.target.closest('.cart-row');
    if (!row) return;
    const index = Number(row.dataset.index);
    const items = DopeCart.read();
    const item = items[index];
    if (!item) return;

    if (e.target.classList.contains('qty-plus')) {
      DopeCart.updateQty(index, item.qty + 1);
      render();
    } else if (e.target.classList.contains('qty-minus')) {
      DopeCart.updateQty(index, item.qty - 1);
      render();
    } else if (e.target.classList.contains('remove-btn')) {
      DopeCart.remove(index);
      render();
      showToast('Item removed from your bag');
    }
  });

  if (clearLink) {
    clearLink.addEventListener('click', () => {
      if (DopeCart.read().length === 0) return;
      DopeCart.clear();
      render();
      showToast('Your bag has been cleared');
    });
  }

  if (whatsappOrder) {
    whatsappOrder.addEventListener('click', e => {
      const items = DopeCart.read();
      if (items.length === 0) {
        e.preventDefault();
        showToast('Add items to your bag first');
        return;
      }
      const pickup = DopeCart.fulfillment() === 'pickup';
      const lines = [
        'Hi DopeStar Store — I would like to order:',
        ...items.map(i => `• ${i.title}${i.color ? ' (' + i.color + ')' : ''} × ${i.qty} — ${formatUGX(i.price * i.qty)}`),
        '',
        `Subtotal: ${formatUGX(DopeCart.subtotal())}`,
        pickup ? 'Fulfillment: Pickup at CAPITAL CENTER' : `Delivery (Kampala): ${formatUGX(DopeCart.deliveryFee())}`,
        `Total: ${formatUGX(DopeCart.subtotal() + DopeCart.deliveryFee())}`
      ];
      whatsappOrder.href = `https://wa.me/${DopeCart.WHATSAPP}?text=${encodeURIComponent(lines.join('\n'))}`;
    });
  }

  render();
});
