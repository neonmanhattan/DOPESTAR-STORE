import { StyleFinder } from "./style-finder";

export const metadata = {
  title: "Style finder | DopeStar Store",
};

export default function StyleFinderPage() {
  return (
    <section className="tool-page style-page">
      <div className="tool-intro">
        <p className="eyebrow eyebrow-dark">A LOOK THAT FEELS LIKE YOU</p>
        <h1>Find your <em>kind of style.</em></h1>
        <p>
          Pick the occasion and a budget that feels right. We’ll pull a few
          ideas from the DopeStar collection.
        </p>
      </div>
      <StyleFinder />
    </section>
  );
}
