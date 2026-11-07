import Image from "next/image";
import type { Product } from "@/lib/catalog";
import { formatUGX } from "@/lib/catalog";

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <div className="product-image">
        <Image
          alt={product.name}
          fill
          sizes="(max-width: 640px) 90vw, (max-width: 1024px) 42vw, 28vw"
          src={product.image}
        />
      </div>
      <div className="product-card-copy">
        <p className="product-category">{product.category}</p>
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <strong className="product-price">{formatUGX(product.price)}</strong>
      </div>
    </article>
  );
}
