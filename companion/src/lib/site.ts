export const WHATSAPP_URL =
  "https://wa.me/256706210339?text=Hello%20DopeStar%20Store";

const defaultStoreUrl = "https://neonmanhattan.github.io/DOPESTAR-STORE";
const configuredStoreUrl = process.env.NEXT_PUBLIC_STORE_URL?.trim();

export const storeUrl = configuredStoreUrl
  ? configuredStoreUrl.replace(/\/+$/, "")
  : defaultStoreUrl;

export const storePages = storeUrl
  ? {
      home: `${storeUrl}/index.html`,
      shop: `${storeUrl}/shop.html`,
      cart: `${storeUrl}/cart.html`,
    }
  : null;
