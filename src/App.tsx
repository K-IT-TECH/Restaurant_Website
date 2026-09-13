import { useState, useEffect, useRef, useCallback } from "react";

// ─── Icons ────────────────────────────────────────────────────────────────────

const Icon = {
  Search: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
    </svg>
  ),
  MapPin: ({ size = 16 }: { size?: number }) => (
    <svg width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/>
    </svg>
  ),
  Star: ({ filled = true }: { filled?: boolean }) => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#f59e0b" : "none"} stroke="#f59e0b" strokeWidth="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  ),
  Heart: ({ filled = false }: { filled?: boolean }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "#f04e23" : "none"} stroke={filled ? "#f04e23" : "#555"} strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  ),
  Clock: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
    </svg>
  ),
  ChevronDown: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M6 9l6 6 6-6"/>
    </svg>
  ),
  ChevronRight: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  ),
  Filter: () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
    </svg>
  ),
  Home: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  ),
  Compass: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
    </svg>
  ),
  BookOpen: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/><path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
    </svg>
  ),
  User: () => (
    <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
    </svg>
  ),
  X: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  TrendingUp: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/>
    </svg>
  ),
  Zap: () => (
    <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  ),
  Plus: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  ),
  Navigation: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <polygon points="3 11 22 2 13 21 11 13 3 11"/>
    </svg>
  ),
};

// ─── Data ─────────────────────────────────────────────────────────────────────

const LOCATIONS = ["New York, NY", "Los Angeles, CA", "Chicago, IL", "San Francisco, CA", "Austin, TX", "Miami, FL", "Seattle, WA", "Boston, MA"];

const CATEGORIES = [
  { id: "all", emoji: "🍽️", label: "All" },
  { id: "pizza", emoji: "🍕", label: "Pizza" },
  { id: "sushi", emoji: "🍣", label: "Sushi" },
  { id: "burgers", emoji: "🍔", label: "Burgers" },
  { id: "tacos", emoji: "🌮", label: "Tacos" },
  { id: "ramen", emoji: "🍜", label: "Ramen" },
  { id: "salads", emoji: "🥗", label: "Salads" },
  { id: "indian", emoji: "🍛", label: "Indian" },
  { id: "desserts", emoji: "🍰", label: "Desserts" },
  { id: "chinese", emoji: "🥡", label: "Chinese" },
  { id: "thai", emoji: "🍲", label: "Thai" },
  { id: "bbq", emoji: "🥩", label: "BBQ" },
];

type Restaurant = {
  id: number; name: string; cuisine: string; rating: number; reviews: number;
  deliveryTime: string; deliveryFee: string; minOrder: string;
  price: "$" | "$$" | "$$$" | "$$$$";
  img: string; tags: string[]; open: boolean; promo?: string;
  distance: string; category: string;
};

const RESTAURANTS: Restaurant[] = [
  { id: 1, name: "Napoli Verace", cuisine: "Italian · Pizza", rating: 4.8, reviews: 2340, deliveryTime: "20–35 min", deliveryFee: "Free", minOrder: "$15", price: "$$", img: "https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=600&h=420&fit=crop&auto=format", tags: ["Wood-fired", "Vegan options"], open: true, promo: "20% off", distance: "0.4 mi", category: "pizza" },
  { id: 2, name: "Sakura Omakase", cuisine: "Japanese · Sushi", rating: 4.9, reviews: 1876, deliveryTime: "30–45 min", deliveryFee: "$2.99", minOrder: "$30", price: "$$$", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&h=420&fit=crop&auto=format", tags: ["Premium", "Chef's table"], open: true, distance: "0.8 mi", category: "sushi" },
  { id: 3, name: "The Smash Shack", cuisine: "American · Burgers", rating: 4.6, reviews: 4102, deliveryTime: "15–25 min", deliveryFee: "Free", minOrder: "$12", price: "$", img: "https://images.unsplash.com/photo-1557723434-b7376b3cec47?w=600&h=420&fit=crop&auto=format", tags: ["Best Seller", "Crispy fries"], open: true, promo: "Free delivery", distance: "0.2 mi", category: "burgers" },
  { id: 4, name: "Ramen Kodo", cuisine: "Japanese · Ramen", rating: 4.7, reviews: 1653, deliveryTime: "25–40 min", deliveryFee: "$1.99", minOrder: "$18", price: "$$", img: "https://images.unsplash.com/photo-1785306589626-5b68b7deb153?w=600&h=420&fit=crop&auto=format", tags: ["Tonkotsu", "Spicy options"], open: true, distance: "1.1 mi", category: "ramen" },
  { id: 5, name: "Taquería El Sol", cuisine: "Mexican · Tacos", rating: 4.5, reviews: 3210, deliveryTime: "20–30 min", deliveryFee: "Free", minOrder: "$10", price: "$", img: "https://images.unsplash.com/photo-1676912819036-b9024f1e74ff?w=600&h=420&fit=crop&auto=format", tags: ["Street-style", "Authentic"], open: false, distance: "0.6 mi", category: "tacos" },
  { id: 6, name: "Garden & Grove", cuisine: "Salads · Bowls", rating: 4.4, reviews: 987, deliveryTime: "15–20 min", deliveryFee: "Free", minOrder: "$14", price: "$$", img: "https://images.unsplash.com/photo-1512132411229-c30391241dd8?w=600&h=420&fit=crop&auto=format", tags: ["Vegan", "Organic"], open: true, promo: "$3 off", distance: "0.3 mi", category: "salads" },
  { id: 7, name: "Spice Route", cuisine: "Indian · Curry", rating: 4.7, reviews: 2089, deliveryTime: "30–45 min", deliveryFee: "$2.49", minOrder: "$20", price: "$$", img: "https://images.unsplash.com/photo-1600326145359-3a44909d1a39?w=600&h=420&fit=crop&auto=format", tags: ["Tandoor", "Halal"], open: true, distance: "1.4 mi", category: "indian" },
  { id: 8, name: "Wok & Fire", cuisine: "Chinese · Noodles", rating: 4.3, reviews: 1544, deliveryTime: "20–30 min", deliveryFee: "Free", minOrder: "$12", price: "$", img: "https://images.unsplash.com/photo-1677382274373-5c4c9e081543?w=600&h=420&fit=crop&auto=format", tags: ["Dim Sum", "Family platters"], open: true, promo: "10% off", distance: "0.9 mi", category: "chinese" },
  { id: 9, name: "The Coal Yard BBQ", cuisine: "American · BBQ", rating: 4.8, reviews: 3301, deliveryTime: "35–50 min", deliveryFee: "$3.99", minOrder: "$25", price: "$$", img: "https://images.unsplash.com/photo-1574966740637-12c84035a4f2?w=600&h=420&fit=crop&auto=format", tags: ["Slow-cooked", "Smokehouse"], open: true, distance: "2.1 mi", category: "bbq" },
  { id: 10, name: "Café Soleil", cuisine: "French · Bakery", rating: 4.6, reviews: 778, deliveryTime: "10–20 min", deliveryFee: "Free", minOrder: "$8", price: "$$", img: "https://images.unsplash.com/photo-1586253181808-c030e7e1aa5e?w=600&h=420&fit=crop&auto=format", tags: ["Pastries", "Coffee"], open: true, distance: "0.1 mi", category: "desserts" },
  { id: 11, name: "Thai Basil Kitchen", cuisine: "Thai · Curry", rating: 4.5, reviews: 1230, deliveryTime: "25–40 min", deliveryFee: "$1.49", minOrder: "$16", price: "$", img: "https://images.unsplash.com/photo-1570780775848-bc1897788ce0?w=600&h=420&fit=crop&auto=format", tags: ["Pad Thai", "Spicy"], open: false, distance: "1.7 mi", category: "thai" },
  { id: 12, name: "Crème & Coulis", cuisine: "Desserts · French", rating: 4.9, reviews: 562, deliveryTime: "20–30 min", deliveryFee: "$1.99", minOrder: "$10", price: "$$$", img: "https://images.unsplash.com/photo-1772985504206-efa1b98814cc?w=600&h=420&fit=crop&auto=format", tags: ["Artisan", "Award-winning"], open: true, promo: "New!", distance: "0.7 mi", category: "desserts" },
];

const DISHES = [
  { id: 1, name: "Truffle Margherita Pizza", restaurant: "Napoli Verace", price: "$18", img: "https://images.unsplash.com/photo-1616141215340-34b0e7c661c8?w=500&h=600&fit=crop&auto=format", category: "pizza" },
  { id: 2, name: "Dragon Roll", restaurant: "Sakura Omakase", price: "$26", img: "https://images.unsplash.com/photo-1570780775848-bc1897788ce0?w=500&h=600&fit=crop&auto=format", category: "sushi" },
  { id: 3, name: "Double Smash Burger", restaurant: "The Smash Shack", price: "$14", img: "https://images.unsplash.com/photo-1671522635273-f70d28b00493?w=500&h=600&fit=crop&auto=format", category: "burgers" },
  { id: 4, name: "Tonkotsu Black Ramen", restaurant: "Ramen Kodo", price: "$16", img: "https://images.unsplash.com/photo-1575830243383-04c3dc00fa11?w=500&h=600&fit=crop&auto=format", category: "ramen" },
  { id: 5, name: "Al Pastor Tacos (3)", restaurant: "Taquería El Sol", price: "$11", img: "https://images.unsplash.com/photo-1590374783065-b6f3264c4693?w=500&h=600&fit=crop&auto=format", category: "tacos" },
  { id: 6, name: "Salmon Chirashi Bowl", restaurant: "Sakura Omakase", price: "$22", img: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=500&h=600&fit=crop&auto=format", category: "sushi" },
];

const TRENDING_SEARCHES = ["Pizza near me", "Best sushi NYC", "Vegan burgers", "Late night ramen", "Taco Tuesday deals", "BBQ delivery"];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useReveal(ref: React.RefObject<Element | null>) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref]);
  return visible;
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 2500); return () => clearTimeout(t); }, [onDone]);
  return <div className="toast in">{msg}</div>;
}

// ─── Stars ───────────────────────────────────────────────────────────────────

function Stars({ rating }: { rating: number }) {
  return (
    <span className="flex gap-0.5 items-center">
      {[1,2,3,4,5].map((i) => <Icon.Star key={i} filled={i <= Math.round(rating)} />)}
    </span>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function Navbar({
  location, onLocationChange, cartCount, onCartClick
}: {
  location: string; onLocationChange: (l: string) => void;
  cartCount: number; onCartClick: () => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [locOpen, setLocOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [showSugg, setShowSugg] = useState(false);
  const locRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (locRef.current && !locRef.current.contains(e.target as Node)) setLocOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSugg(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const filteredSugg = TRENDING_SEARCHES.filter(s =>
    search ? s.toLowerCase().includes(search.toLowerCase()) : true
  ).slice(0, 6);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center gap-3 md:gap-5">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2 flex-shrink-0" style={{ textDecoration: "none" }}>
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #f04e23, #ff7043)" }}>F</div>
          <span className="font-display font-bold text-lg hidden sm:block" style={{ color: "var(--text)", fontStyle: "italic" }}>FoodExplorer</span>
        </a>

        {/* Location */}
        <div ref={locRef} className="relative flex-shrink-0 hidden md:block">
          <button
            onClick={() => setLocOpen(!locOpen)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors"
            style={{ fontSize: "0.83rem", color: "var(--text-2)", fontWeight: 500 }}
          >
            <span style={{ color: "var(--accent)" }}><Icon.MapPin /></span>
            <span className="max-w-[130px] truncate">{location}</span>
            <Icon.ChevronDown />
          </button>
          {locOpen && (
            <div className="loc-dropdown">
              <div className="p-3 border-b" style={{ borderColor: "var(--border)" }}>
                <p className="text-xs font-semibold mb-2" style={{ color: "var(--text-3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Select City</p>
              </div>
              {LOCATIONS.map((l) => (
                <button
                  key={l}
                  onClick={() => { onLocationChange(l); setLocOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2 transition-colors"
                  style={{
                    fontWeight: location === l ? 700 : 400,
                    color: location === l ? "var(--accent)" : "var(--text)",
                    background: location === l ? "var(--accent-light)" : "transparent",
                  }}
                >
                  <span style={{ color: "var(--accent)", opacity: location === l ? 1 : 0 }}>✓</span>
                  {l}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search */}
        <div ref={searchRef} className="flex-1 relative" style={{ maxWidth: 520 }}>
          <div className="search-wrap flex items-center gap-2 px-4 py-2.5">
            <span style={{ color: "var(--text-3)", flexShrink: 0 }}><Icon.Search /></span>
            <input
              className="search-input"
              placeholder="Search restaurants, dishes, cuisines…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setShowSugg(true)}
            />
            {search && (
              <button onClick={() => setSearch("")} style={{ color: "var(--text-3)", flexShrink: 0 }}><Icon.X /></button>
            )}
          </div>
          {showSugg && (
            <div className="suggestions-box">
              {!search && (
                <div className="px-4 pt-3 pb-1">
                  <p className="text-xs font-semibold mb-1" style={{ color: "var(--text-3)", letterSpacing: "0.05em", textTransform: "uppercase" }}>Trending</p>
                </div>
              )}
              {filteredSugg.map((s) => (
                <div key={s} className="suggestion-item" onClick={() => { setSearch(s); setShowSugg(false); }}>
                  <span style={{ color: "var(--text-3)" }}>{search ? <Icon.Search /> : <Icon.TrendingUp />}</span>
                  <span style={{ color: "var(--text)" }}>{s}</span>
                </div>
              ))}
              {search && filteredSugg.length === 0 && (
                <div className="px-4 py-3 text-sm" style={{ color: "var(--text-3)" }}>No results for "{search}"</div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="desktop-nav flex items-center gap-2 flex-shrink-0">
          <button className="btn btn-ghost hidden lg:flex" style={{ gap: 6, fontSize: "0.83rem" }}>
            <Icon.Filter />Filters
          </button>
          <button
            onClick={onCartClick}
            className="relative btn btn-primary"
            style={{ padding: "0.6rem 1.1rem", fontSize: "0.83rem" }}
          >
            🛒 Cart
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 flex items-center justify-center text-xs font-bold text-white rounded-full" style={{ background: "var(--accent)", fontSize: "0.62rem" }}>{cartCount}</span>
            )}
          </button>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 cursor-pointer" style={{ background: "linear-gradient(135deg, #667eea, #764ba2)", fontSize: "0.8rem" }}>
            JD
          </div>
        </div>
      </div>
    </nav>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function Hero({ location }: { location: string }) {
  const [activeSearch, setActiveSearch] = useState("restaurants");

  return (
    <section className="hero-bg pt-28 pb-20 px-4 md:px-6" id="home">
      <div className="hero-blob-1" />
      <div className="hero-blob-2" />
      <div className="max-w-7xl mx-auto relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 chip chip-accent mb-5 anim-fadeUp">
              <span><Icon.MapPin size={12} /></span>
              <span>Now serving in {location.split(",")[0]}</span>
              <span className="badge-open">Open</span>
            </div>
            <h1
              className="font-display font-black leading-none mb-6 anim-fadeUp delay-100 hero-title"
              style={{ fontSize: "clamp(2.8rem, 6vw, 5rem)", color: "var(--text)", letterSpacing: "-0.02em" }}
            >
              Discover<br />
              <span style={{ color: "var(--accent)", fontStyle: "italic" }}>amazing</span>{" "}
              food<br />near you
            </h1>
            <p className="text-base mb-8 anim-fadeUp delay-200" style={{ color: "var(--text-2)", maxWidth: 420, lineHeight: 1.7 }}>
              Explore thousands of restaurants, browse menus, read reviews, and get your favourite food delivered to your door in minutes.
            </p>

            {/* Search tabs */}
            <div className="anim-fadeUp delay-300">
              <div className="flex gap-2 mb-3">
                {["restaurants", "dishes", "cuisines"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setActiveSearch(t)}
                    className="btn"
                    style={{
                      padding: "0.4rem 1rem", borderRadius: "var(--radius-full)", fontSize: "0.78rem",
                      background: activeSearch === t ? "var(--accent)" : "rgba(255,255,255,0.7)",
                      color: activeSearch === t ? "white" : "var(--text-2)",
                      border: "1.5px solid",
                      borderColor: activeSearch === t ? "var(--accent)" : "var(--border)",
                      backdropFilter: "blur(8px)",
                    }}
                  >
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
              <div className="search-wrap flex items-center gap-2 px-5 py-3.5" style={{ borderRadius: "var(--radius-xl)", maxWidth: 480 }}>
                <span style={{ color: "var(--text-3)" }}><Icon.Search /></span>
                <input
                  className="search-input flex-1"
                  placeholder={`Search ${activeSearch}…`}
                  style={{ fontSize: "0.95rem" }}
                />
                <button className="btn btn-primary" style={{ padding: "0.5rem 1.2rem", fontSize: "0.82rem", borderRadius: "var(--radius-md)" }}>
                  Search
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-8 anim-fadeUp delay-400">
              {[
                { val: "8,500+", label: "Restaurants" },
                { val: "4.8★", label: "Avg Rating" },
                { val: "22 min", label: "Avg Delivery" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-bold text-xl" style={{ color: "var(--text)" }}>{s.val}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-3)", fontWeight: 500 }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — floating food cards */}
          <div className="hidden lg:block relative h-[460px]">
            {/* Main big card */}
            <div
              className="absolute anim-float"
              style={{ width: 260, top: 20, right: 40, borderRadius: "var(--radius-xl)", overflow: "hidden", boxShadow: "var(--shadow-xl)", background: "white" }}
            >
              <div style={{ height: 180, overflow: "hidden" }}>
                <img src="https://images.unsplash.com/photo-1566843972142-a7fcb70de55a?w=520&h=360&fit=crop&auto=format" alt="Pizza" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "0.9rem 1rem" }}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>Napoli Verace</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-2)", marginTop: 2 }}>Italian · Wood-fired Pizza</p>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1">
                    <Stars rating={4.8} />
                    <span style={{ fontSize: "0.72rem", color: "var(--text-3)", fontWeight: 600 }}>4.8</span>
                  </div>
                  <span className="chip chip-green" style={{ fontSize: "0.68rem" }}>Free delivery</span>
                </div>
              </div>
            </div>

            {/* Mini card 1 */}
            <div
              className="absolute anim-float"
              style={{ width: 190, top: 240, right: 310, borderRadius: "var(--radius-lg)", overflow: "hidden", boxShadow: "var(--shadow-lg)", background: "white", animationDelay: "0.8s" }}
            >
              <div style={{ height: 110, overflow: "hidden" }}>
                <img src="https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=380&h=220&fit=crop&auto=format" alt="Sushi" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "0.65rem 0.75rem" }}>
                <p style={{ fontWeight: 700, fontSize: "0.8rem", color: "var(--text)" }}>Sakura Omakase</p>
                <div className="flex items-center gap-1 mt-1">
                  <Stars rating={4.9} />
                  <span style={{ fontSize: "0.7rem", color: "var(--text-3)", fontWeight: 600 }}>4.9</span>
                </div>
              </div>
            </div>

            {/* Promo badge */}
            <div
              className="absolute anim-float"
              style={{ right: 20, bottom: 60, background: "white", borderRadius: "var(--radius-lg)", padding: "0.75rem 1rem", boxShadow: "var(--shadow-lg)", animationDelay: "1.4s", display: "flex", alignItems: "center", gap: 10 }}
            >
              <div style={{ width: 40, height: 40, borderRadius: "var(--radius-md)", background: "var(--accent-light)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem" }}>🔥</div>
              <div>
                <p style={{ fontWeight: 700, fontSize: "0.82rem", color: "var(--text)" }}>Hot deals today</p>
                <p style={{ fontSize: "0.72rem", color: "var(--accent)", fontWeight: 600 }}>Up to 40% off →</p>
              </div>
            </div>

            {/* Delivery chip */}
            <div
              className="absolute anim-float"
              style={{ top: 30, right: 310, background: "white", borderRadius: "var(--radius-full)", padding: "0.5rem 1rem", boxShadow: "var(--shadow-lg)", animationDelay: "0.5s", display: "flex", alignItems: "center", gap: 6, fontSize: "0.78rem", fontWeight: 700 }}
            >
              <span style={{ color: "var(--green)" }}>🛵</span>
              <span style={{ color: "var(--text)" }}>22 min delivery</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Categories ───────────────────────────────────────────────────────────────

function Categories({ active, onChange }: { active: string; onChange: (c: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useReveal(ref);

  return (
    <section ref={ref} className={`py-10 px-4 md:px-6 reveal ${visible ? "visible" : ""}`} style={{ background: "white", borderBottom: "1px solid var(--border)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-5">
          <p className="section-eyebrow">Browse By</p>
          <button className="btn btn-ghost" style={{ fontSize: "0.78rem", padding: "0.4rem 0.9rem" }}>See all</button>
        </div>
        <div className="hscroll">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              className={`cat-pill ${active === c.id ? "active" : ""}`}
              onClick={() => onChange(c.id)}
            >
              <span className="cat-icon">{c.emoji}</span>
              <span className="cat-label">{c.label}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Restaurant Card ──────────────────────────────────────────────────────────

function RestCard({ r, onFav, faved, onAdd }: {
  r: Restaurant; onFav: () => void; faved: boolean; onAdd: () => void;
}) {
  return (
    <div className="rest-card">
      <div className="card-img-wrap" style={{ height: 200 }}>
        <img src={r.img} alt={r.name} className="card-img" />
        <button className={`card-fav ${faved ? "faved" : ""}`} onClick={(e) => { e.stopPropagation(); onFav(); }}>
          <Icon.Heart filled={faved} />
        </button>
        {r.promo && (
          <div className="card-badge">
            <span className="promo-tag"><Icon.Zap />{r.promo}</span>
          </div>
        )}
      </div>
      <div style={{ padding: "1rem 1.1rem 1.1rem" }}>
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)", lineHeight: 1.3 }}>{r.name}</h3>
          <span style={{ fontSize: "0.75rem", color: "var(--text-3)", fontWeight: 600, flexShrink: 0 }}>{r.price}</span>
        </div>
        <p style={{ fontSize: "0.78rem", color: "var(--text-2)", marginBottom: "0.6rem" }}>{r.cuisine}</p>
        <div className="flex items-center gap-1.5 mb-3">
          <Stars rating={r.rating} />
          <span style={{ fontWeight: 700, fontSize: "0.78rem", color: "var(--text)" }}>{r.rating}</span>
          <span style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>({r.reviews.toLocaleString()})</span>
          <span style={{ marginLeft: "auto" }}>
            {r.open ? <span className="badge-open">Open</span> : <span className="badge-closed">Closed</span>}
          </span>
        </div>
        <div className="divider mb-3" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs" style={{ color: "var(--text-2)" }}>
            <span className="flex items-center gap-1"><Icon.Clock />{r.deliveryTime}</span>
            <span className="map-pin"><Icon.Navigation />{r.distance}</span>
          </div>
          <span className={`chip ${r.deliveryFee === "Free" ? "chip-green" : "chip-gray"}`} style={{ fontSize: "0.68rem" }}>
            {r.deliveryFee === "Free" ? "Free delivery" : r.deliveryFee}
          </span>
        </div>
        <button
          className="btn btn-primary w-full mt-3"
          style={{ padding: "0.6rem", fontSize: "0.82rem", borderRadius: "var(--radius-md)", width: "100%" }}
          onClick={onAdd}
        >
          Order Now
        </button>
      </div>
    </div>
  );
}

// ─── Popular Restaurants ──────────────────────────────────────────────────────

function PopularRestaurants({ restaurants, favs, onFav, onAdd }: {
  restaurants: Restaurant[]; favs: Set<number>; onFav: (id: number) => void; onAdd: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const visible = useReveal(ref);
  const rowRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: number) => rowRef.current?.scrollBy({ left: dir * 300, behavior: "smooth" });

  return (
    <section ref={ref} className={`py-14 px-4 md:px-6 reveal ${visible ? "visible" : ""}`} style={{ background: "var(--bg-soft)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="section-eyebrow mb-1">Highly Rated</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: "var(--text)" }}>Popular Restaurants</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="scroll-arrow" onClick={() => scroll(-1)}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button className="scroll-arrow" onClick={() => scroll(1)}>
              <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
            </button>
            <button className="btn btn-outline hidden sm:flex" style={{ fontSize: "0.8rem", padding: "0.5rem 1.1rem" }}>View All</button>
          </div>
        </div>
        <div ref={rowRef} className="hscroll" style={{ gap: 18 }}>
          {restaurants.sort((a, b) => b.rating - a.rating).slice(0, 8).map((r) => (
            <div key={r.id} style={{ minWidth: 280, maxWidth: 280 }}>
              <RestCard r={r} faved={favs.has(r.id)} onFav={() => onFav(r.id)} onAdd={onAdd} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Promo Banner ─────────────────────────────────────────────────────────────

function PromoBanner() {
  const ref = useRef<HTMLElement>(null);
  const visible = useReveal(ref);

  return (
    <section ref={ref} className={`py-8 px-4 md:px-6 reveal ${visible ? "visible" : ""}`} style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto">
        <div className="promo-banner p-8 md:p-10 grid md:grid-cols-2 gap-6 items-center" style={{ color: "white" }}>
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="chip mb-3" style={{ background: "rgba(255,255,255,0.2)", color: "white", display: "inline-flex" }}>
              <Icon.Zap />Limited Time
            </div>
            <h3 className="font-display font-bold mb-2" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 1.2 }}>Get 30% off your first three orders</h3>
            <p style={{ opacity: 0.85, fontSize: "0.9rem", marginBottom: "1.5rem", lineHeight: 1.6 }}>
              New to FoodExplorer? Use code <strong>EXPLORE30</strong> and discover your neighbourhood's best food at unbeatable prices.
            </p>
            <button className="btn" style={{ background: "white", color: "var(--accent)", padding: "0.75rem 1.75rem", borderRadius: "var(--radius-full)", fontWeight: 700, fontSize: "0.9rem", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}>
              Claim Offer →
            </button>
          </div>
          <div className="hidden md:flex justify-end items-center gap-4" style={{ position: "relative", zIndex: 1 }}>
            {["🍕", "🍣", "🍔", "🌮"].map((emoji, i) => (
              <div
                key={i}
                className="anim-float"
                style={{
                  width: 64, height: 64, borderRadius: "var(--radius-lg)",
                  background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "2rem", animationDelay: `${i * 0.3}s`,
                  transform: i % 2 === 0 ? "translateY(-8px)" : "translateY(8px)",
                }}
              >{emoji}</div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Dish Discovery ───────────────────────────────────────────────────────────

function DishDiscovery({ onAdd }: { onAdd: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useReveal(ref);

  return (
    <section ref={ref} className={`py-14 px-4 md:px-6 reveal ${visible ? "visible" : ""}`} style={{ background: "var(--bg-warm)" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="section-eyebrow mb-1">Food Discovery</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: "var(--text)" }}>Trending Dishes</h2>
          </div>
          <button className="btn btn-outline" style={{ fontSize: "0.8rem", padding: "0.5rem 1.1rem" }}>Browse All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
          {DISHES.map((d, i) => (
            <div
              key={d.id}
              className="dish-card"
              style={{ height: i === 0 || i === 3 ? 320 : 220, gridRow: i === 0 || i === 3 ? "span 1" : "span 1" }}
            >
              <img src={d.img} alt={d.name} className="dish-img" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
              <div className="dish-overlay" />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "1rem" }}>
                <p style={{ color: "white", fontWeight: 700, fontSize: "0.9rem", marginBottom: 3, lineHeight: 1.3 }}>{d.name}</p>
                <div className="flex items-center justify-between">
                  <p style={{ color: "rgba(255,255,255,0.75)", fontSize: "0.72rem" }}>{d.restaurant}</p>
                  <div className="flex items-center gap-2">
                    <span style={{ color: "white", fontWeight: 700, fontSize: "0.85rem" }}>{d.price}</span>
                    <button
                      className="btn"
                      onClick={onAdd}
                      style={{ width: 28, height: 28, borderRadius: "50%", background: "var(--accent)", color: "white", padding: 0, fontSize: "1rem" }}
                    >+</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Filter Panel ─────────────────────────────────────────────────────────────

function FilterPanel({
  priceFilter, setPriceFilter, ratingFilter, setRatingFilter,
  openOnly, setOpenOnly, freeDelivery, setFreeDelivery,
  maxDistance, setMaxDistance, onReset,
}: {
  priceFilter: string[]; setPriceFilter: (v: string[]) => void;
  ratingFilter: number; setRatingFilter: (v: number) => void;
  openOnly: boolean; setOpenOnly: (v: boolean) => void;
  freeDelivery: boolean; setFreeDelivery: (v: boolean) => void;
  maxDistance: number; setMaxDistance: (v: number) => void;
  onReset: () => void;
}) {
  const prices = ["$", "$$", "$$$", "$$$$"];
  const togglePrice = (p: string) =>
    setPriceFilter(priceFilter.includes(p) ? priceFilter.filter(x => x !== p) : [...priceFilter, p]);

  return (
    <div className="filter-panel">
      <div className="flex items-center justify-between mb-5">
        <p style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--text)" }}>Filters</p>
        <button onClick={onReset} style={{ fontSize: "0.75rem", color: "var(--accent)", fontWeight: 600, cursor: "pointer", border: "none", background: "transparent" }}>Reset all</button>
      </div>

      {/* Price */}
      <div className="mb-6">
        <p className="section-eyebrow mb-3">Price Range</p>
        <div className="flex gap-2 flex-wrap">
          {prices.map((p) => (
            <button
              key={p}
              onClick={() => togglePrice(p)}
              className="btn"
              style={{
                padding: "0.35rem 0.8rem", borderRadius: "var(--radius-full)", fontSize: "0.8rem",
                background: priceFilter.includes(p) ? "var(--accent)" : "var(--surface-2)",
                color: priceFilter.includes(p) ? "white" : "var(--text-2)",
                fontWeight: 600,
              }}
            >{p}</button>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <p className="section-eyebrow mb-3">Min Rating</p>
        <div className="flex gap-2">
          {[3, 3.5, 4, 4.5].map((r) => (
            <button
              key={r}
              onClick={() => setRatingFilter(r)}
              className="btn"
              style={{
                padding: "0.35rem 0.7rem", borderRadius: "var(--radius-full)", fontSize: "0.78rem",
                background: ratingFilter === r ? "var(--accent)" : "var(--surface-2)",
                color: ratingFilter === r ? "white" : "var(--text-2)",
                fontWeight: 600,
              }}
            >{r}★</button>
          ))}
        </div>
      </div>

      {/* Distance */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <p className="section-eyebrow">Max Distance</p>
          <span className="font-mono text-xs font-bold" style={{ color: "var(--accent)" }}>{maxDistance} mi</span>
        </div>
        <input
          type="range" min={0.5} max={5} step={0.5} value={maxDistance}
          onChange={(e) => setMaxDistance(Number(e.target.value))}
          style={{ "--accent": "#f04e23" } as React.CSSProperties}
        />
        <div className="flex justify-between text-xs mt-1" style={{ color: "var(--text-3)" }}>
          <span>0.5 mi</span><span>5 mi</span>
        </div>
      </div>

      {/* Toggles */}
      <div className="mb-4">
        <p className="section-eyebrow mb-3">Options</p>
        <div className="space-y-3">
          <label className="toggle-wrap">
            <div className={`toggle-track ${openOnly ? "on" : ""}`} onClick={() => setOpenOnly(!openOnly)}>
              <div className="toggle-thumb" />
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text)", cursor: "pointer" }}>Open now only</span>
          </label>
          <label className="toggle-wrap">
            <div className={`toggle-track ${freeDelivery ? "on" : ""}`} onClick={() => setFreeDelivery(!freeDelivery)}>
              <div className="toggle-thumb" />
            </div>
            <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "var(--text)", cursor: "pointer" }}>Free delivery</span>
          </label>
        </div>
      </div>

      <button className="btn btn-primary w-full mt-2" style={{ borderRadius: "var(--radius-md)", padding: "0.7rem", width: "100%" }}>
        Apply Filters
      </button>
    </div>
  );
}

// ─── Nearby Restaurants ───────────────────────────────────────────────────────

function NearbyRestaurants({ favs, onFav, onAdd }: {
  favs: Set<number>; onFav: (id: number) => void; onAdd: () => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const visible = useReveal(ref);
  const [priceFilter, setPriceFilter] = useState<string[]>([]);
  const [ratingFilter, setRatingFilter] = useState(0);
  const [openOnly, setOpenOnly] = useState(false);
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [maxDistance, setMaxDistance] = useState(5);
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "delivery">("rating");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = RESTAURANTS.filter((r) => {
    if (priceFilter.length && !priceFilter.includes(r.price)) return false;
    if (r.rating < ratingFilter) return false;
    if (openOnly && !r.open) return false;
    if (freeDelivery && r.deliveryFee !== "Free") return false;
    if (parseFloat(r.distance) > maxDistance) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "distance") return parseFloat(a.distance) - parseFloat(b.distance);
    return a.deliveryTime.localeCompare(b.deliveryTime);
  });

  const resetFilters = () => {
    setPriceFilter([]); setRatingFilter(0); setOpenOnly(false);
    setFreeDelivery(false); setMaxDistance(5);
  };

  const activeFilterCount = priceFilter.length + (ratingFilter > 0 ? 1 : 0) + (openOnly ? 1 : 0) + (freeDelivery ? 1 : 0) + (maxDistance < 5 ? 1 : 0);

  return (
    <section ref={ref} id="explore" className={`py-14 px-4 md:px-6 reveal ${visible ? "visible" : ""}`} style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="section-eyebrow mb-1">Nearby</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: "var(--text)" }}>
              Restaurants Near You
              <span className="ml-3 chip chip-gray" style={{ fontSize: "0.75rem", verticalAlign: "middle" }}>{filtered.length} results</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <button
              className="btn btn-ghost flex lg:hidden items-center gap-2"
              style={{ position: "relative", fontSize: "0.8rem" }}
              onClick={() => setShowFilters(!showFilters)}
            >
              <Icon.Filter />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 text-xs font-bold text-white rounded-full flex items-center justify-center" style={{ background: "var(--accent)", fontSize: "0.6rem" }}>{activeFilterCount}</span>
              )}
            </button>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="btn btn-ghost"
              style={{ appearance: "none", paddingRight: "1.5rem", background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239e9895' stroke-width='2.5'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E") no-repeat right 0.6rem center`, cursor: "pointer", fontSize: "0.82rem" }}
            >
              <option value="rating">Sort: Rating</option>
              <option value="distance">Sort: Distance</option>
              <option value="delivery">Sort: Delivery Time</option>
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className={`w-72 flex-shrink-0 hidden lg:block`}>
            <FilterPanel
              priceFilter={priceFilter} setPriceFilter={setPriceFilter}
              ratingFilter={ratingFilter} setRatingFilter={setRatingFilter}
              openOnly={openOnly} setOpenOnly={setOpenOnly}
              freeDelivery={freeDelivery} setFreeDelivery={setFreeDelivery}
              maxDistance={maxDistance} setMaxDistance={setMaxDistance}
              onReset={resetFilters}
            />
          </div>

          {/* Mobile filter panel */}
          {showFilters && (
            <div className="lg:hidden fixed inset-0 z-50 flex items-end" style={{ background: "rgba(0,0,0,0.4)" }} onClick={() => setShowFilters(false)}>
              <div style={{ width: "100%", maxHeight: "85vh", overflowY: "auto", borderRadius: "var(--radius-xl) var(--radius-xl) 0 0", background: "white", padding: "1rem" }} onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                  <p className="font-bold text-base">Filters</p>
                  <button onClick={() => setShowFilters(false)}><Icon.X /></button>
                </div>
                <FilterPanel
                  priceFilter={priceFilter} setPriceFilter={setPriceFilter}
                  ratingFilter={ratingFilter} setRatingFilter={setRatingFilter}
                  openOnly={openOnly} setOpenOnly={setOpenOnly}
                  freeDelivery={freeDelivery} setFreeDelivery={setFreeDelivery}
                  maxDistance={maxDistance} setMaxDistance={setMaxDistance}
                  onReset={resetFilters}
                />
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1">
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-5xl mb-4">🔍</div>
                <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text)", marginBottom: 8 }}>No restaurants match your filters</p>
                <p style={{ color: "var(--text-2)", fontSize: "0.88rem", marginBottom: 20 }}>Try adjusting your filters to see more results</p>
                <button className="btn btn-primary" onClick={resetFilters}>Reset Filters</button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filtered.map((r) => (
                  <RestCard key={r.id} r={r} faved={favs.has(r.id)} onFav={() => onFav(r.id)} onAdd={onAdd} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────

function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const visible = useReveal(ref);

  const steps = [
    { emoji: "📍", title: "Set your location", desc: "Tell us where you are and we'll show you the best restaurants nearby." },
    { emoji: "🔍", title: "Browse & discover", desc: "Explore menus, read reviews, filter by cuisine, price, and dietary needs." },
    { emoji: "🛒", title: "Add to your order", desc: "Pick your favourite dishes and customise your order exactly how you like it." },
    { emoji: "🚀", title: "Fast delivery", desc: "Track your order in real-time as it makes its way to your door." },
  ];

  return (
    <section ref={ref} className={`py-16 px-4 md:px-6 reveal ${visible ? "visible" : ""}`} style={{ background: "var(--bg-soft)" }}>
      <div className="max-w-7xl mx-auto text-center">
        <p className="section-eyebrow mb-2">Simple Process</p>
        <h2 className="font-display font-bold text-2xl md:text-3xl mb-10" style={{ color: "var(--text)" }}>How FoodExplorer works</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div
                className="mx-auto mb-4 flex items-center justify-center"
                style={{ width: 72, height: 72, borderRadius: "var(--radius-xl)", background: i % 2 === 0 ? "var(--accent-light)" : "var(--bg-warm)", fontSize: "2rem" }}
              >
                {s.emoji}
              </div>
              <div
                className="font-mono font-bold mb-2"
                style={{ fontSize: "0.65rem", letterSpacing: "0.1em", color: "var(--accent)" }}
              >
                STEP {String(i + 1).padStart(2, "0")}
              </div>
              <p style={{ fontWeight: 700, fontSize: "0.92rem", color: "var(--text)", marginBottom: 6 }}>{s.title}</p>
              <p style={{ fontSize: "0.78rem", color: "var(--text-2)", lineHeight: 1.6 }}>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Cuisines Spotlight ───────────────────────────────────────────────────────

function CuisineSpotlight({ onChange }: { onChange: (c: string) => void }) {
  const ref = useRef<HTMLElement>(null);
  const visible = useReveal(ref);

  const cuisines = [
    { id: "italian", emoji: "🇮🇹", name: "Italian", count: 124, img: "https://images.unsplash.com/photo-1620374645366-9e2aea59e4c1?w=400&h=240&fit=crop&auto=format" },
    { id: "japanese", emoji: "🇯🇵", name: "Japanese", count: 89, img: "https://images.unsplash.com/photo-1570780775848-bc1897788ce0?w=400&h=240&fit=crop&auto=format" },
    { id: "american", emoji: "🇺🇸", name: "American", count: 203, img: "https://images.unsplash.com/photo-1557723434-b7376b3cec47?w=400&h=240&fit=crop&auto=format" },
    { id: "mexican", emoji: "🇲🇽", name: "Mexican", count: 78, img: "https://images.unsplash.com/photo-1590374783065-b6f3264c4693?w=400&h=240&fit=crop&auto=format" },
  ];

  return (
    <section ref={ref} className={`py-14 px-4 md:px-6 reveal ${visible ? "visible" : ""}`} style={{ background: "white" }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="section-eyebrow mb-1">Explore</p>
            <h2 className="font-display font-bold text-2xl md:text-3xl" style={{ color: "var(--text)" }}>Cuisines to Explore</h2>
          </div>
          <button className="btn btn-outline" style={{ fontSize: "0.8rem", padding: "0.5rem 1.1rem" }}>All cuisines</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cuisines.map((c) => (
            <button
              key={c.id}
              className="rest-card text-left"
              onClick={() => { document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <div style={{ height: 150, overflow: "hidden", position: "relative" }}>
                <img src={c.img} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.45s cubic-bezier(.22,1,.36,1)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.55), transparent)" }} />
                <span style={{ position: "absolute", top: 12, right: 12, fontSize: "1.8rem" }}>{c.emoji}</span>
              </div>
              <div style={{ padding: "0.85rem 1rem" }}>
                <p style={{ fontWeight: 700, color: "var(--text)", fontSize: "0.95rem" }}>{c.name}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--text-3)", marginTop: 2 }}>{c.count} restaurants</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Cart Sidebar ─────────────────────────────────────────────────────────────

function CartSidebar({ count, open, onClose }: { count: number; open: boolean; onClose: () => void }) {
  const DEMO_ITEMS = [
    { name: "Truffle Margherita Pizza", restaurant: "Napoli Verace", price: 18, qty: 1, img: "https://images.unsplash.com/photo-1616141215340-34b0e7c661c8?w=80&h=80&fit=crop&auto=format" },
    { name: "Dragon Roll", restaurant: "Sakura Omakase", price: 26, qty: 2, img: "https://images.unsplash.com/photo-1570780775848-bc1897788ce0?w=80&h=80&fit=crop&auto=format" },
  ];

  return (
    <>
      {open && <div className="fixed inset-0 z-40" style={{ background: "rgba(0,0,0,0.35)" }} onClick={onClose} />}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col"
        style={{
          width: 360, background: "white",
          borderLeft: "1px solid var(--border)",
          boxShadow: "var(--shadow-xl)",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.35s cubic-bezier(.22,1,.36,1)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
          <div>
            <p style={{ fontWeight: 700, fontSize: "1rem", color: "var(--text)" }}>Your Order</p>
            <p style={{ fontSize: "0.75rem", color: "var(--text-3)" }}>{DEMO_ITEMS.reduce((s, i) => s + i.qty, 0)} items</p>
          </div>
          <button className="btn-icon" onClick={onClose}><Icon.X /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {DEMO_ITEMS.map((item, i) => (
            <div key={i} className="flex gap-3 items-center">
              <img src={item.img} alt={item.name} style={{ width: 56, height: 56, borderRadius: "var(--radius-md)", objectFit: "cover", flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text)", lineHeight: 1.3 }}>{item.name}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--text-3)", marginTop: 2 }}>{item.restaurant}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "var(--surface-2)", color: "var(--text-2)" }}>−</button>
                  <span style={{ fontWeight: 700, fontSize: "0.82rem", minWidth: 16, textAlign: "center" }}>{item.qty}</span>
                  <button className="w-6 h-6 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "var(--accent)", color: "white" }}>+</button>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--text)" }}>${item.price * item.qty}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: "1.25rem 1.5rem", borderTop: "1px solid var(--border)" }}>
          <div className="space-y-2 mb-4">
            {[
              ["Subtotal", "$70"],
              ["Delivery fee", "Free"],
              ["Service fee", "$2.50"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between text-sm" style={{ color: "var(--text-2)" }}>
                <span>{k}</span>
                <span style={{ fontWeight: v === "Free" ? 600 : 400, color: v === "Free" ? "var(--green)" : undefined }}>{v}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="flex justify-between" style={{ fontWeight: 800, fontSize: "1rem", color: "var(--text)" }}>
              <span>Total</span><span>$72.50</span>
            </div>
          </div>
          <button className="btn btn-primary w-full" style={{ width: "100%", padding: "0.8rem", borderRadius: "var(--radius-md)", fontSize: "0.92rem" }}>
            Checkout · $72.50
          </button>
          <p className="text-center mt-3" style={{ fontSize: "0.72rem", color: "var(--text-3)" }}>Estimated delivery: 28–35 min</p>
        </div>
      </div>
    </>
  );
}

// ─── Mobile Nav ───────────────────────────────────────────────────────────────

function MobileNav({ onCartClick, cartCount }: { onCartClick: () => void; cartCount: number }) {
  const [active, setActive] = useState("home");
  const items = [
    { id: "home", label: "Home", icon: <Icon.Home /> },
    { id: "explore", label: "Explore", icon: <Icon.Compass /> },
    { id: "orders", label: "Orders", icon: <Icon.BookOpen /> },
    { id: "account", label: "Account", icon: <Icon.User /> },
  ];

  return (
    <div className="mobile-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={`mob-nav-item ${active === item.id ? "active" : ""}`}
          style={{ color: active === item.id ? "var(--accent)" : "var(--text-3)" }}
          onClick={() => {
            setActive(item.id);
            document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="mob-nav-icon">{item.icon}</span>
          <span className="mob-nav-label">{item.label}</span>
        </button>
      ))}
      <button
        className={`mob-nav-item`}
        style={{ color: "var(--text-3)", position: "relative" }}
        onClick={onCartClick}
      >
        <span className="mob-nav-icon">🛒</span>
        <span className="mob-nav-label">Cart</span>
        {cartCount > 0 && (
          <span className="absolute top-1 right-2 w-4 h-4 flex items-center justify-center text-white rounded-full" style={{ background: "var(--accent)", fontSize: "0.55rem", fontWeight: 700 }}>{cartCount}</span>
        )}
      </button>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="footer pt-14 pb-10 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ background: "linear-gradient(135deg, #f04e23, #ff7043)" }}>F</div>
              <span className="font-display font-bold text-lg italic" style={{ color: "white" }}>FoodExplorer</span>
            </div>
            <p style={{ fontSize: "0.82rem", lineHeight: 1.7, maxWidth: 200 }}>Discover the best food and restaurants near you, every day.</p>
            <div className="flex gap-2 mt-4">
              {["📱", "🤖"].map((icon, i) => (
                <button key={i} className="btn" style={{ background: "rgba(255,255,255,0.08)", color: "white", borderRadius: "var(--radius-md)", padding: "0.4rem 0.8rem", fontSize: "0.75rem", border: "1px solid rgba(255,255,255,0.1)" }}>
                  {icon} {i === 0 ? "iOS" : "Android"}
                </button>
              ))}
            </div>
          </div>

          {[
            { title: "Discover", links: ["Popular Restaurants", "New Openings", "Top Rated", "Deals & Offers", "Cuisines"] },
            { title: "Company", links: ["About Us", "Careers", "Press", "Blog", "Partners"] },
            { title: "Support", links: ["Help Center", "Contact Us", "Delivery Info", "Refund Policy", "Accessibility"] },
          ].map((col) => (
            <div key={col.title}>
              <p style={{ color: "white", fontWeight: 700, fontSize: "0.85rem", marginBottom: "0.75rem" }}>{col.title}</p>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l}><span className="footer-link">{l}</span></li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider" style={{ background: "rgba(255,255,255,0.1)", marginBottom: "1.5rem" }} />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p style={{ fontSize: "0.78rem" }}>© 2026 FoodExplorer Inc. All rights reserved.</p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms of Service", "Cookie Settings"].map((l) => (
              <span key={l} className="footer-link">{l}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [location, setLocation] = useState("New York, NY");
  const [activeCategory, setActiveCategory] = useState("all");
  const [favs, setFavs] = useState<Set<number>>(new Set([2, 7]));
  const [cartOpen, setCartOpen] = useState(false);
  const [cartCount, setCartCount] = useState(3);
  const [toast, setToast] = useState<string | null>(null);

  const handleFav = (id: number) => {
    setFavs((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); setToast("Removed from favourites"); }
      else { next.add(id); setToast("Added to favourites ❤️"); }
      return next;
    });
  };

  const handleAdd = () => {
    setCartCount((c) => c + 1);
    setToast("Added to your order 🛒");
  };

  const filteredRestaurants = activeCategory === "all"
    ? RESTAURANTS
    : RESTAURANTS.filter((r) => r.category === activeCategory || r.cuisine.toLowerCase().includes(activeCategory));

  return (
    <div style={{ background: "var(--bg)", color: "var(--text)", minHeight: "100vh" }}>
      <Navbar location={location} onLocationChange={setLocation} cartCount={cartCount} onCartClick={() => setCartOpen(true)} />

      <main style={{ paddingTop: 68 }}>
        <Hero location={location} />
        <Categories active={activeCategory} onChange={setActiveCategory} />
        <PopularRestaurants restaurants={filteredRestaurants} favs={favs} onFav={handleFav} onAdd={handleAdd} />
        <PromoBanner />
        <DishDiscovery onAdd={handleAdd} />
        <HowItWorks />
        <CuisineSpotlight onChange={setActiveCategory} />
        <NearbyRestaurants favs={favs} onFav={handleFav} onAdd={handleAdd} />
        <Footer />
      </main>

      <CartSidebar count={cartCount} open={cartOpen} onClose={() => setCartOpen(false)} />
      <MobileNav onCartClick={() => setCartOpen(true)} cartCount={cartCount} />

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
