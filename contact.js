/* ============================================================
   DopeStar Store — contact.js (contact.html)
   ============================================================ */

const CONTACT_WHATSAPP = '256706210339';

document.addEventListener('DOMContentLoaded', () => {
  const sendBtn = document.getElementById('send-btn');
  if (!sendBtn) return;

  sendBtn.addEventListener('click', () => {
    const name = document.getElementById('name')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const subject = document.getElementById('subject')?.value;
    const message = document.getElementById('message')?.value.trim();

    if (!name || !phone || !message) {
      showToast('Please fill in your name, phone, and message');
      return;
    }

    const lines = [
      `New message from DopeStar Store website:`,
      `Name: ${name}`,
      `Phone: ${phone}`,
      subject ? `Subject: ${subject}` : '',
      `Message: ${message}`
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    window.open(`https://wa.me/${CONTACT_WHATSAPP}?text=${text}`, '_blank');
  });
});
