import { Dots, StarBurst } from "./Decor";

// Official brand logos fetched via the 21st.dev Magic MCP (logo_search).
const TIKTOK = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 352.28 398.67" width="100%" height="100%"><path fill="#25f4ee" d="M137.17 156.98v-15.56c-5.34-.73-10.76-1.18-16.29-1.18C54.23 140.24 0 194.47 0 261.13c0 40.9 20.43 77.09 51.61 98.97-20.12-21.6-32.46-50.53-32.46-82.31 0-65.7 52.69-119.28 118.03-120.81Z"/><path fill="#25f4ee" d="M140.02 333c29.74 0 54-23.66 55.1-53.13l.11-263.2h48.08c-1-5.41-1.55-10.97-1.55-16.67h-65.67l-.11 263.2c-1.1 29.47-25.36 53.13-55.1 53.13-9.24 0-17.95-2.31-25.61-6.34C105.3 323.9 121.6 333 140.02 333ZM333.13 106V91.37c-18.34 0-35.43-5.45-49.76-14.8 12.76 14.65 30.09 25.22 49.76 29.43Z"/><path fill="#fe2c55" d="M283.38 76.57c-13.98-16.05-22.47-37-22.47-59.91h-17.59c4.63 25.02 19.48 46.49 40.06 59.91ZM120.88 205.92c-30.44 0-55.21 24.77-55.21 55.21 0 21.2 12.03 39.62 29.6 48.86-6.55-9.08-10.45-20.18-10.45-32.2 0-30.44 24.77-55.21 55.21-55.21 5.68 0 11.13.94 16.29 2.55v-67.05c-5.34-.73-10.76-1.18-16.29-1.18-.96 0-1.9.05-2.85.07v51.49c-5.16-1.61-10.61-2.55-16.29-2.55Z"/><path fill="#fe2c55" d="M333.13 106v51.04c-34.05 0-65.61-10.89-91.37-29.38v133.47c0 66.66-54.23 120.88-120.88 120.88-25.76 0-49.64-8.12-69.28-21.91 22.08 23.71 53.54 38.57 88.42 38.57 66.66 0 120.88-54.23 120.88-120.88V144.33c25.76 18.49 57.32 29.38 91.37 29.38v-65.68c-6.57 0-12.97-.71-19.14-2.03Z"/><path d="M241.76 261.13V127.66c25.76 18.49 57.32 29.38 91.37 29.38V106c-19.67-4.21-37-14.77-49.76-29.43-20.58-13.42-35.43-34.88-40.06-59.91h-48.08l-.11 263.2c-1.1 29.47-25.36 53.13-55.1 53.13-18.42 0-34.72-9.1-44.75-23.01-17.57-9.25-29.6-27.67-29.6-48.86 0-30.44 24.77-55.21 55.21-55.21 5.68 0 11.13.94 16.29 2.55v-51.49C71.83 158.5 19.14 212.08 19.14 277.78c0 31.78 12.34 60.71 32.46 82.31C71.23 373.87 95.12 382 120.88 382c66.65 0 120.88-54.23 120.88-120.88Z"/></svg>`;

const INSTAGRAM = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="100%" height="100%"><radialGradient id="ig" cx="19.38" cy="42.035" r="44.899" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#fd5"/><stop offset=".328" stop-color="#ff543f"/><stop offset=".348" stop-color="#fc5245"/><stop offset=".504" stop-color="#e64771"/><stop offset=".643" stop-color="#d53e91"/><stop offset=".761" stop-color="#cc39a4"/><stop offset=".841" stop-color="#c837ab"/></radialGradient><path fill="url(#ig)" d="M34.017 41.99l-20 .019c-4.4.004-8.003-3.592-8.008-7.992l-.019-20c-.004-4.4 3.592-8.003 7.992-8.008l20-.019c4.4-.004 8.003 3.592 8.008 7.992l.019 20c.005 4.4-3.592 8.004-7.992 8.008z"/><path fill="#fff" d="M24 31a7 7 0 110-14 7 7 0 010 14zm0-12a5 5 0 100 10 5 5 0 000-10z"/><circle cx="31.5" cy="16.5" r="1.5" fill="#fff"/><path fill="#fff" d="M30 37H18c-3.859 0-7-3.14-7-7V18c0-3.86 3.141-7 7-7h12c3.859 0 7 3.14 7 7v12c0 3.86-3.141 7-7 7zM18 13c-2.757 0-5 2.243-5 5v12c0 2.757 2.243 5 5 5h12c2.757 0 5-2.243 5-5V18c0-2.757-2.243-5-5-5H18z"/></svg>`;

const YOUTUBE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 180" width="100%" height="100%"><path fill="red" d="M250.346 28.075A32.18 32.18 0 0 0 227.69 5.418C207.824 0 127.87 0 127.87 0S47.912.164 28.046 5.582A32.18 32.18 0 0 0 5.39 28.24c-6.009 35.298-8.34 89.084.165 122.97a32.18 32.18 0 0 0 22.656 22.657c19.866 5.418 99.822 5.418 99.822 5.418s79.955 0 99.82-5.418a32.18 32.18 0 0 0 22.657-22.657c6.338-35.348 8.291-89.1-.164-123.134Z"/><path fill="#fff" d="m102.421 128.06 66.328-38.418-66.328-38.418z"/></svg>`;

const PLATFORMS = [
  { name: "TikTok", svg: TIKTOK },
  { name: "Reels", svg: INSTAGRAM },
  { name: "Shorts", svg: YOUTUBE },
];

export default function Platforms() {
  return (
    <section className="relative overflow-hidden border-y border-ink/10 bg-cream-deep">
      <Dots className="pointer-events-none absolute left-8 top-6 hidden h-16 w-28 md:block" />
      <StarBurst className="pointer-events-none absolute right-10 bottom-6 hidden md:block" color="var(--sky)" size={44} />
      <div className="mx-auto max-w-6xl px-5 py-16 text-center">
        <p className="eyebrow">Un clip, partout</p>
        <h2 className="mx-auto mt-3 max-w-2xl font-display text-3xl font-semibold md:text-4xl">
          Prêt à publier sur tes plateformes préférées
        </h2>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
          {PLATFORMS.map((p) => (
            <div
              key={p.name}
              className="group flex items-center gap-3 rounded-2xl border border-ink/10 bg-card px-6 py-4 shadow-soft transition-transform hover:-translate-y-1"
            >
              <span
                className="grid h-10 w-10 place-items-center rounded-xl bg-white p-2 transition-transform group-hover:scale-105"
                dangerouslySetInnerHTML={{ __html: p.svg }}
              />
              <span className="font-display text-lg font-semibold">{p.name}</span>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-ink-soft">
          Format vertical 9:16, sous-titres animés, prêt à poster.
        </p>
      </div>
    </section>
  );
}
