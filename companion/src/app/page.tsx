import Image from "next/image";
import Link from "next/link";
import { StoreLinks } from "@/components/store-links";
import { products } from "@/lib/catalog";
import { WHATSAPP_URL } from "@/lib/site";

const features = [
  {
    number: "01",
    title: "Find your fit",
    description:
      "Start with the size you already wear and choose how you like your clothes to fit.",
    href: "/size-guide",
    link: "Get a size suggestion",
  },
  {
    number: "02",
    title: "Build a look",
    description:
      "Browse pieces by occasion and budget, then take your shortlist to the store.",
    href: "/style-finder",
    link: "Find your style",
  },
  {
    number: "03",
    title: "Follow your order",
    description:
      "Use the private tracking code shared by our team to see the latest order update.",
    href: "/track-order",
    link: "Track an order",
  },
];

export default function HomePage() {
  const edit = products.find((product) => product.id === "cuban-set");

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow"><span /> CAPITAL CENTER · KAMPALA</p>
          <h1>Wear the feeling.<br /><em>Own the moment.</em></h1>
          <p className="hero-description">
            A little more confidence in every choice. Find your fit, put a look
            together, or keep up with your order.
          </p>
          <div className="hero-actions">
            <Link className="button button-gold" href="/style-finder">
              Find your next look <span aria-hidden="true">↗</span>
            </Link>
            <Link className="button button-quiet" href="/size-guide">
              Find your size
            </Link>
          </div>
          <p className="hero-location">CAPITAL CENTER, Nabugabo Street · Kampala</p>
        </div>
        {edit && (
          <div className="hero-image-wrap">
            <Image
              alt="Cuban shirt and beltless pants set"
              className="hero-image"
              fill
              sizes="(max-width: 800px) 90vw, 44vw"
              src={edit.image}
            />
            <div className="hero-image-caption">
              <span>THE KAMPALA EDIT</span>
              <span>01 / 03</span>
            </div>
            <div className="hero-price">
              <span>THE CUBAN SET</span>
              <strong>UGX 85,000</strong>
            </div>
          </div>
        )}
        <div aria-hidden="true" className="hero-orbit" />
      </section>

      <section className="service-strip" aria-label="Store highlights">
        <div><span className="strip-index">01</span><strong>Made for your everyday</strong></div>
        <div><span className="strip-index">02</span><strong>Delivery in Kampala · UGX 5,000</strong></div>
        <div><span className="strip-index">03</span><strong>Visit us at Capital Center</strong></div>
      </section>

      <section className="section-block feature-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow eyebrow-dark">THE DOPESTAR COMPANION</p>
            <h2>Make it <em>your own.</em></h2>
          </div>
          <p className="section-intro">
            Helpful little tools, made around how you actually shop.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="feature-number">{feature.number}</span>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <Link href={feature.href}>{feature.link} <span aria-hidden="true">↗</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="store-cta">
        <div>
          <p className="eyebrow">YOUR NEXT FAVOURITE IS WAITING</p>
          <h2>Good style starts<br />with a good <em>feeling.</em></h2>
        </div>
        <div className="store-cta-actions">
          <StoreLinks />
          <a className="button button-gold" href={WHATSAPP_URL} target="_blank" rel="noreferrer">
            Ask us on WhatsApp <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>
    </>
  );
}
