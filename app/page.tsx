import Link from "next/link";

/**
 * Landing: one central headline — "one narrative countless memes" —
 * over the ambient fragment field. Explore + Launch are the only actions.
 */
export default function Home() {
  return (
    <section className="hero" aria-labelledby="home-headline">
      <h1 id="home-headline" className="headline">
        <span className="headline-sheen">one narrative countless memes</span>
        <span className="headline-caret" aria-hidden="true" />
      </h1>
      <p className="hero-sub">
        same narrative - same memes
      </p>
      <div className="hero-actions">
        <Link href="/discover/trending" className="btn btn-primary">
          Explore
        </Link>
        <Link href="/launch/create" className="btn btn-ghost">
          Launch
        </Link>
      </div>
    </section>
  );
}
