"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { products, type Occasion } from "@/lib/catalog";

const occasions: Occasion[] = ["Everyday", "Smart casual", "Streetwear", "Evening"];

export function StyleFinder() {
  const [occasion, setOccasion] = useState<Occasion>("Everyday");
  const [budget, setBudget] = useState(120000);
  const [color, setColor] = useState("Any colour");

  const matches = useMemo(
    () =>
      products.filter(
        (product) =>
          product.occasions.includes(occasion) &&
          product.price <= budget &&
          (color === "Any colour" ||
            product.colors.some((productColor) => productColor.toLowerCase() === color.toLowerCase())),
      ),
    [budget, color, occasion],
  );

  return (
    <div className="finder-wrap">
      <div className="finder-controls">
        <fieldset className="occasion-fieldset">
          <legend className="field-label">What are you dressing for?</legend>
          <div className="choice-chips">
            {occasions.map((option) => (
              <button
                aria-pressed={occasion === option}
                className={occasion === option ? "choice-chip active" : "choice-chip"}
                key={option}
                onClick={() => setOccasion(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="field-label" htmlFor="budget">Your max budget</label>
        <select
          className="form-select"
          id="budget"
          onChange={(event) => setBudget(Number(event.target.value))}
          value={budget}
        >
          <option value={50000}>Up to UGX 50,000</option>
          <option value={100000}>Up to UGX 100,000</option>
          <option value={150000}>Up to UGX 150,000</option>
          <option value={200000}>Up to UGX 200,000</option>
        </select>
        <label className="field-label" htmlFor="color">A colour you love</label>
        <select
          className="form-select"
          id="color"
          onChange={(event) => setColor(event.target.value)}
          value={color}
        >
          {["Any colour", "Black", "Blue", "Brown", "Cream", "Gold", "Green", "Grey", "White"].map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>
      <div className="finder-results">
        <div className="results-heading">
          <div>
            <p className="eyebrow eyebrow-dark">CURATED FOR YOU</p>
            <h2>{occasion}, your way.</h2>
          </div>
          <span>{matches.length} {matches.length === 1 ? "piece" : "pieces"}</span>
        </div>
        {matches.length > 0 ? (
          <div className="product-grid">
            {matches.map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        ) : (
          <div className="empty-results">
            <h3>No exact match yet.</h3>
            <p>Try a higher budget or another colour to see more of the collection.</p>
          </div>
        )}
        <p className="catalog-note">
          Prices and availability can change. Please confirm the current options
          with DopeStar Store before placing an order.
        </p>
      </div>
    </div>
  );
}
