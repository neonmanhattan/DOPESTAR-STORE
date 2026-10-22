/* ============================================================
   DopeStar Store — payment.js (payment.html)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- Method tabs (Mobile Money / Bank Transfer) ---------- */
  const tabs = document.querySelectorAll('.method-tab');
  const panels = document.querySelectorAll('.payment-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      const panel = document.getElementById('panel-' + tab.dataset.method);
      if (panel) panel.classList.add('active');
    });
  });

  /* ---------- Mobile Money provider switch ---------- */
  document.querySelectorAll('input[name="momo-provider"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('#panel-momo .pay-detail-box').forEach(box => box.classList.remove('show'));
      const box = document.getElementById('momo-detail-' + radio.value);
      if (box) box.classList.add('show');
    });
  });

  /* ---------- Bank provider switch ---------- */
  document.querySelectorAll('input[name="bank-provider"]').forEach(radio => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('#panel-bank .pay-detail-box').forEach(box => box.classList.remove('show'));
      const box = document.getElementById('bank-detail-' + radio.value);
      if (box) box.classList.add('show');
    });
  });

  /* ---------- Copy buttons ---------- */
  document.querySelectorAll('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const value = btn.dataset.copy || '';
      try {
        await navigator.clipboard.writeText(value);
      } catch (e) {
        console.error('Clipboard copy failed:', e);
      }
      const original = btn.textContent;
      btn.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = original;
        btn.classList.remove('copied');
      }, 1800);
    });
  });

  /* ---------- Order summary from cart ---------- */
  const itemsEl = document.getElementById('os-items');
  const subtotalEl = document.getElementById('os-subtotal');
  const deliveryEl = document.getElementById('os-delivery');
  const totalEl = document.getElementById('os-total');
  const confirmBtn = document.getElementById('confirm-payment');

  function renderSummary() {
    const items = DopeCart.read();
    const subtotal = DopeCart.subtotal();
    const delivery = DopeCart.deliveryFee();
    const pickup = DopeCart.fulfillment() === 'pickup';
    const deliveryLabel = document.getElementById('os-delivery-label');
    if (deliveryLabel) deliveryLabel.textContent = pickup ? 'Pickup' : 'Delivery';

    if (itemsEl) {
      itemsEl.innerHTML = items.map(item => `
        <div class="os-item">
          <span>${escapeHTML(item.title)} × ${item.qty}</span>
          <span>${formatUGX(item.price * item.qty)}</span>
        </div>
      `).join('');
    }
    if (subtotalEl) subtotalEl.textContent = formatUGX(subtotal);
    if (deliveryEl) deliveryEl.textContent = pickup ? 'Free' : formatUGX(delivery);
    if (totalEl) totalEl.textContent = formatUGX(subtotal + delivery);
    if (confirmBtn) confirmBtn.disabled = items.length === 0;
  }

  /* ---------- Confirm payment -> send order to WhatsApp ---------- */
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      const items = DopeCart.read();
      if (items.length === 0) {
        showToast('Your bag is empty');
        return;
      }

      const name = document.getElementById('pay-name')?.value.trim();
      const phone = document.getElementById('pay-phone')?.value.trim();
      const ref = document.getElementById('pay-ref')?.value.trim();

      if (!name || !phone) {
        showToast('Please add your name and phone number');
        return;
      }

      const subtotal = DopeCart.subtotal();
      const delivery = DopeCart.deliveryFee();
      const pickup = DopeCart.fulfillment() === 'pickup';
      const lines = [
        `Order from DopeStar Store website:`,
        ...items.map(i => `• ${i.title}${i.color ? ' (' + i.color + ')' : ''} × ${i.qty} — ${formatUGX(i.price * i.qty)}`),
        ``,
        `Subtotal: ${formatUGX(subtotal)}`,
        pickup ? 'Fulfillment: Pickup at CAPITAL CENTER' : `Delivery (Kampala): ${formatUGX(delivery)}`,
        `Total: ${formatUGX(subtotal + delivery)}`,
        ``,
        `Name: ${name}`,
        `Phone: ${phone}`,
        ref ? `Reference: ${ref}` : ''
      ].filter(Boolean);

      const message = encodeURIComponent(lines.join('\n'));
      window.open(`https://wa.me/${DopeCart.WHATSAPP}?text=${message}`, '_blank');
    });
  }

  renderSummary();
});
