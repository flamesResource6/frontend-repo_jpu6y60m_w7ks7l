import { useEffect, useMemo, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "";

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null); // selected wallpaper

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${BACKEND}/api/wallpapers`);
        const data = await res.json();
        setItems(data.items || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!query) return items;
    return items.filter((it) => it.title.toLowerCase().includes(query.toLowerCase()));
  }, [items, query]);

  return (
    <div className="relative">
      {/* Page watermark badge */}
      <div className="fixed bottom-4 right-4 z-50 select-none">
        <span className="text-xs md:text-sm bg-black/60 text-white px-3 py-1 rounded-full shadow-lg backdrop-blur">
          made by afthab
        </span>
      </div>

      <header className="sticky top-0 z-40 bg-slate-900/70 backdrop-blur border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <img src="/flame-icon.svg" alt="logo" className="w-8 h-8" />
          <h1 className="text-white font-semibold text-lg md:text-2xl">4K HD Wallpapers</h1>
          <div className="ml-auto relative w-full max-w-md">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search wallpapers..."
              className="w-full bg-slate-800/70 border border-white/10 rounded-xl px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[16/10] rounded-xl bg-slate-800/60 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((it) => (
              <button
                key={it.id}
                onClick={() => setActive(it)}
                className="group relative block overflow-hidden rounded-xl border border-white/10 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              >
                <img
                  loading="lazy"
                  src={it.src}
                  alt={it.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-2 left-2 text-white text-sm font-medium drop-shadow">{it.title}</div>
                {/* Thumbnail watermark overlay */}
                <div className="absolute bottom-2 right-2 text-[10px] md:text-xs text-white/90 bg-black/50 px-2 py-0.5 rounded">
                  made by afthab
                </div>
              </button>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center text-slate-300 py-16">No wallpapers found.</div>
        )}
      </main>

      {/* Lightbox modal with watermark overlay */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img src={active.src} alt={active.title} className="w-full h-auto rounded-lg shadow-2xl" />
            <div className="absolute bottom-4 right-4 select-none">
              <span className="text-xs md:text-sm bg-black/60 text-white px-3 py-1 rounded-md shadow-lg">made by afthab</span>
            </div>
            <div className="absolute top-4 left-4 flex gap-2">
              <button
                onClick={() => setActive(null)}
                className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-md border border-white/20"
              >
                Close
              </button>
              <a
                href={active.src}
                target="_blank"
                rel="noreferrer"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md"
              >
                Open original
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
