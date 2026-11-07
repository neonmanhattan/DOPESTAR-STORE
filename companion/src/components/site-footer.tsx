import { WHATSAPP_URL } from "@/lib/site";
import { StoreLinks } from "@/components/store-links";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div>
        <p className="footer-brand">DopeStar Store</p>
        <p>Capital Center, Nabugabo Street · Kampala</p>
        <p>Delivery in Kampala · UGX 5,000</p>
      </div>
      <div className="footer-actions">
        <StoreLinks />
        <a
          className="footer-whatsapp"
          href={WHATSAPP_URL}
          rel="noreferrer"
          target="_blank"
        >
          Chat with us on WhatsApp
        </a>
      </div>
    </footer>
  );
}
