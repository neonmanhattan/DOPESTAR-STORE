import { storePages } from "@/lib/site";

export function StoreLinks({ className = "" }: { className?: string }) {
  if (!storePages) {
    return (
      <p className={`store-link-note ${className}`}>
        Store links become available after setting <code>NEXT_PUBLIC_STORE_URL</code>.
      </p>
    );
  }

  return (
    <div className={`store-links ${className}`}>
      <a href={storePages.home}>Store home</a>
      <a href={storePages.shop}>Shop collection</a>
      <a href={storePages.cart}>Your bag</a>
    </div>
  );
}
