"use client";

import { useState } from "react";
import { recommendSize, SIZE_OPTIONS, type FitPreference, type Size } from "@/lib/sizing";
import { WHATSAPP_URL } from "@/lib/site";

const fitLabels: Record<FitPreference, string> = {
  fitted: "Close to the body",
  regular: "Just right",
  relaxed: "A little roomy",
};

export function SizeForm() {
  const [usualSize, setUsualSize] = useState<Size>("M");
  const [fit, setFit] = useState<FitPreference>("regular");
  const [showResult, setShowResult] = useState(false);

  const size = recommendSize(usualSize, fit);
  const sizeIndex = SIZE_OPTIONS.indexOf(size);
  const alternatives = [
    SIZE_OPTIONS[sizeIndex - 1],
    SIZE_OPTIONS[sizeIndex + 1],
  ].filter((option): option is Size => Boolean(option));
  const message = encodeURIComponent(
    `Hi DopeStar Store, I usually wear ${usualSize} and prefer a ${fitLabels[fit].toLowerCase()} fit. Could you help me confirm my size?`,
  );

  return (
    <div className="size-panel">
      <p className="panel-kicker">YOUR SIZE STARTING POINT</p>
      <p className="field-label">What size do you usually wear?</p>
      <div aria-label="Usual clothing size" className="size-options" role="group">
        {SIZE_OPTIONS.map((option) => (
          <button
            aria-pressed={usualSize === option}
            className={usualSize === option ? "size-option selected" : "size-option"}
            key={option}
            onClick={() => {
              setUsualSize(option);
              setShowResult(false);
            }}
            type="button"
          >
            {option}
          </button>
        ))}
      </div>
      <label className="field-label" htmlFor="fit-preference">How do you like the fit?</label>
      <select
        className="form-select"
        id="fit-preference"
        onChange={(event) => {
          const value = event.currentTarget.value;
          if (value === "fitted" || value === "regular" || value === "relaxed") {
            setFit(value);
          }
          setShowResult(false);
        }}
        value={fit}
      >
        {(Object.entries(fitLabels) as [FitPreference, string][]).map(([value, label]) => (
          <option key={value} value={value}>{label}</option>
        ))}
      </select>
      <button className="button button-green full-button" onClick={() => setShowResult(true)} type="button">
        Show my starting size <span aria-hidden="true">↗</span>
      </button>

      {showResult && (
        <div aria-live="polite" className="size-result">
          <span className="result-label">YOUR STARTING POINT</span>
          <strong>{size}</strong>
          <p>
            Based on your usual {usualSize} and a {fitLabels[fit].toLowerCase()} fit.
            {alternatives.length > 0 && ` If you’re between sizes, also ask about ${alternatives.join(" or ")}.`}
          </p>
          <a
            className="text-link"
            href={`https://wa.me/256706210339?text=${message}`}
            rel="noreferrer"
            target="_blank"
          >
            Confirm the fit with us on WhatsApp ↗
          </a>
        </div>
      )}
      <p className="form-disclaimer">
        This is a general suggestion, not a garment measurement chart. Fit can
        vary between pieces; message us before ordering if you’re unsure.
      </p>
    </div>
  );
}
