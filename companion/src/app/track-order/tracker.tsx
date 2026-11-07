"use client";

import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { WHATSAPP_URL } from "@/lib/site";

type StatusUpdate = {
  status: string;
  note: string;
  createdAt: string;
};

type TrackedOrder = {
  reference: string;
  status: string;
  statusNote: string;
  estimatedDelivery: string | null;
  updatedAt: string;
  updates: StatusUpdate[];
};

const statusNames: Record<string, string> = {
  pending: "Order received",
  confirmed: "Confirmed",
  preparing: "Being prepared",
  ready_for_dispatch: "Ready for dispatch",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-UG", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Africa/Kampala",
  }).format(new Date(value));
}

export function Tracker() {
  const [code, setCode] = useState("");
  const [searchedCode, setSearchedCode] = useState("");
  const [requestRevision, setRequestRevision] = useState(0);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchedCode) return;

    let active = true;
    const loadOrder = async () => {
      try {
        const response = await fetch(`/api/track/${encodeURIComponent(searchedCode)}`, {
          cache: "no-store",
        });
        const result = await response.json();
        if (!response.ok) {
          throw new Error(result.error || "We couldn't check that order right now.");
        }
        if (active) {
          setOrder(result.order as TrackedOrder);
          setError("");
          setLoading(false);
        }
      } catch (requestError) {
        if (active) {
          setOrder(null);
          setError(
            requestError instanceof Error
              ? requestError.message
              : "We couldn't check that order right now.",
          );
          setLoading(false);
        }
      }
    };

    void loadOrder();
    const intervalId = window.setInterval(() => void loadOrder(), 30_000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [requestRevision, searchedCode]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalizedCode = code.trim();
    if (!normalizedCode) {
      setError("Enter the tracking code our team shared with you.");
      return;
    }
    setLoading(true);
    setOrder(null);
    setError("");
    setSearchedCode(normalizedCode);
    setRequestRevision((revision) => revision + 1);
  }

  const currentStatus = order ? statusNames[order.status] || order.status : "";

  return (
    <div className="tracking-panel">
      <form className="tracking-form" onSubmit={handleSubmit}>
        <label className="field-label" htmlFor="tracking-code">Your private tracking code</label>
        <input
          autoComplete="off"
          className="form-input"
          id="tracking-code"
          onChange={(event) => setCode(event.target.value)}
          placeholder="e.g. the code shared on WhatsApp"
          value={code}
        />
        <button className="button button-green full-button" disabled={loading} type="submit">
          {loading ? "Checking…" : "Check my order"} <span aria-hidden="true">↗</span>
        </button>
      </form>

      {error && <p aria-live="polite" className="form-error" role="alert">{error}</p>}

      {order && (
        <section aria-live="polite" className="order-result">
          <div className="order-result-heading">
            <div>
              <span className="result-label">ORDER REFERENCE</span>
              <h2>{order.reference}</h2>
            </div>
            <span className="status-pill">{currentStatus}</span>
          </div>
          {order.statusNote && <p className="status-note">{order.statusNote}</p>}
          {order.estimatedDelivery && (
            <p className="delivery-estimate">
              Estimated delivery <strong>{order.estimatedDelivery}</strong>
            </p>
          )}
          <p className="updated-at">Last updated {formatDate(order.updatedAt)} · refreshes every 30 seconds</p>
          <ol className="status-timeline">
            {order.updates.map((update, index) => (
              <li className="timeline-entry" key={`${update.createdAt}-${index}`}>
                <span aria-hidden="true" className="timeline-dot" />
                <div>
                  <strong>{statusNames[update.status] || update.status}</strong>
                  {update.note && <p>{update.note}</p>}
                  <time dateTime={update.createdAt}>{formatDate(update.createdAt)}</time>
                </div>
              </li>
            ))}
          </ol>
        </section>
      )}

      <p className="form-disclaimer">
        Your code is private. If you haven’t received one, or need a hand,{" "}
        <a href={WHATSAPP_URL} rel="noreferrer" target="_blank">message us on WhatsApp</a>.
      </p>
    </div>
  );
}
