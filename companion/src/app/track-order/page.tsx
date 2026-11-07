import { Tracker } from "./tracker";

export const metadata = {
  title: "Track an order | DopeStar Store",
};

export default function TrackOrderPage() {
  return (
    <section className="tool-page tracking-page">
      <div className="tool-intro">
        <p className="eyebrow eyebrow-dark">YOUR ORDER, AT A GLANCE</p>
        <h1>Good things are <em>on the way.</em></h1>
        <p>
          Enter the private tracking code sent to you by our team to see your
          latest order update.
        </p>
      </div>
      <Tracker />
    </section>
  );
}
