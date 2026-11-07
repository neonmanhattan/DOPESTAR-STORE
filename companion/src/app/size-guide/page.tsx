import Link from "next/link";
import { SizeForm } from "./size-form";

export const metadata = {
  title: "Size guide | DopeStar Store",
};

export default function SizeGuidePage() {
  return (
    <section className="tool-page">
      <div className="tool-intro">
        <p className="eyebrow eyebrow-dark">A BETTER PLACE TO START</p>
        <h1>Find your <em>fit.</em></h1>
        <p>
          Start with the size you usually wear, then tell us how you like your
          clothes to sit. We’ll suggest a starting point for your next pick.
        </p>
        <Link className="text-link" href="/style-finder">Know what you want? Find a look ↗</Link>
      </div>
      <SizeForm />
    </section>
  );
}
