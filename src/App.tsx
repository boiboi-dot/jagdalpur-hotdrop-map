import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Flame, 
  Heart, 
  Navigation, 
  Info, 
  Share2, 
  X, 
  Camera, 
  MapPin, 
  Clock, 
  Ticket, 
  Calendar, 
  ShoppingBag,
  Compass,
  TreePine,
  Coffee,
  UtensilsCrossed,
  Landmark,
  Hammer
} from 'lucide-react';
import { SEED_PLACES, Place } from './data/places';

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeLorePlace, setActiveLorePlace] = useState<Place | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [hasLiked, setHasLiked] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Filtered places
  const places = selectedCategory === 'all' 
    ? SEED_PLACES 
    : SEED_PLACES.filter(p => p.category === selectedCategory);

  // Handle Like Button
  const handleLike = (id: string, initialScore: number) => {
    const isCurrentlyLiked = hasLiked[id];
    setHasLiked(prev => ({ ...prev, [id]: !isCurrentlyLiked }));
    setLikes(prev => ({
      ...prev,
      [id]: (prev[id] ?? initialScore) + (isCurrentlyLiked ? -1 : 1)
    }));
  };

  // 1-Tap Google Maps Navigation
  const startNavigation = (coords: [number, number]) => {
    const [lng, lat] = coords;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`, '_blank');
  };

  // Mood Roulette (Random Pick)
  const handleRandomPick = () => {
    if (!places.length) return;
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.8 } });

    const randomIndex = Math.floor(Math.random() * places.length);
    const luckyPlace = places[randomIndex];

    const element = cardRefs.current[luckyPlace.id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Native Share / Copy Link
  const handleShare = (place: Place) => {
    if (navigator.share) {
      navigator.share({
        title: `${place.name} | Aamcho Bastar`,
        text: `Discover ${place.name} in Jagdalpur: ${place.famousFor}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${place.name} - ${place.famousFor}`);
      setCopiedId(place.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  return (
    <div className="relative w-screen h-[100dvh] bg-slate-950 text-white font-sans overflow-hidden select-none">
      
      {/* Top Floating Glass Header */}
      <header className="absolute top-0 left-0 right-0 z-30 pt-3 pb-2 px-4 bg-gradient-to-b from-slate-950/90 via-slate-950/50 to-transparent pointer-events-none">
        <div className="flex items-center justify-between mb-2">
          <div className="pointer-events-auto flex items-center gap-2 bg-slate-900/80 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-full shadow-lg">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <h1 className="text-xs font-black tracking-widest uppercase bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
              Aamcho Jagdalpur
            </h1>
          </div>

          <button
            onClick={handleRandomPick}
            className="pointer-events-auto flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 px-3.5 py-1.5 rounded-full font-bold text-xs uppercase tracking-wider text-slate-950 shadow-lg shadow-orange-500/25 active:scale-90 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Surprise Me</span>
          </button>
        </div>

        {/* Category Horizontal Filter Bar */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pointer-events-auto py-1">
          {[
            { id: 'all', label: 'All', icon: Compass },
            { id: 'nature', label: 'Waterfalls & Caves', icon: TreePine },
            { id: 'chai_pani', label: 'Chai & Views', icon: Coffee },
            { id: 'food', label: 'Bastar Feasts', icon: UtensilsCrossed },
            { id: 'heritage', label: 'Heritage', icon: Landmark },
            { id: 'crafts', label: 'Handicrafts', icon: Hammer }
          ].map(tab => {
            const Icon = tab.icon;
            const active = selectedCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap backdrop-blur-md transition border shrink-0 ${
                  active 
                    ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md scale-105' 
                    : 'bg-slate-900/80 border-white/10 text-slate-300 hover:text-white'
                }`}
              >
                <Icon className="w-3 h-3" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </header>

      {/* Main Snap Reel Feed */}
      <main className="w-full h-full overflow-y-scroll snap-y snap-mandatory no-scrollbar">
        {places.map(place => {
          const currentLikes = likes[place.id] ?? place.hotdropScore;
          const liked = hasLiked[place.id] ?? false;

          return (
            <div
              key={place.id}
              ref={el => (cardRefs.current[place.id] = el)}
              className="relative w-full h-[100dvh] snap-start shrink-0 flex flex-col justify-end p-5 overflow-hidden"
            >
              {/* Cinematic Background Image */}
              <img
                src={place.photoUrl}
                alt={place.name}
                className="absolute inset-0 w-full h-full object-cover z-0"
              />

              {/* Multi-Layer Vignette & Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/20 z-10" />
              <div className="absolute inset-0 bg-black/25 z-10" />

              {/* Right Side Floating Social Action Column */}
              <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-4">
                {/* Like Button */}
                <button
                  onClick={() => handleLike(place.id, place.hotdropScore)}
                  className="flex flex-col items-center gap-1 group"
                >
                  <div className={`p-3 rounded-full backdrop-blur-xl border transition ${
                    liked 
                      ? 'bg-red-500/30 border-red-400 text-red-500 scale-110' 
                      : 'bg-slate-900/70 border-white/15 text-white hover:bg-slate-800'
                  }`}>
                    <Heart className={`w-5 h-5 ${liked ? 'fill-red-500' : ''}`} />
                  </div>
                  <span className="text-[11px] font-bold tracking-tight text-white drop-shadow">
                    {currentLikes}
                  </span>
                </button>

                {/* Lore / Full Details Trigger */}
                <button
                  onClick={() => setActiveLorePlace(place)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="p-3 rounded-full bg-slate-900/70 backdrop-blur-xl border border-white/15 text-amber-400 hover:bg-slate-800 active:scale-90 transition">
                    <Info className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-200 drop-shadow">
                    Lore
                  </span>
                </button>

                {/* Share Button */}
                <button
                  onClick={() => handleShare(place)}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="p-3 rounded-full bg-slate-900/70 backdrop-blur-xl border border-white/15 text-white hover:bg-slate-800 active:scale-90 transition">
                    <Share2 className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-semibold text-slate-200 drop-shadow">
                    {copiedId === place.id ? 'Copied!' : 'Share'}
                  </span>
                </button>
              </div>

              {/* Bottom Card Content */}
              <div className="relative z-20 pr-16 pb-2">
                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {place.isHotdrop && (
                    <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-orange-500/30 text-orange-400 border border-orange-500/40 px-2.5 py-0.5 rounded-full backdrop-blur-md">
                      <Flame className="w-3 h-3 animate-bounce" /> Trending Hotdrop
                    </span>
                  )}
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-white/10 text-slate-300 border border-white/10 px-2 py-0.5 rounded-full backdrop-blur-md">
                    {place.category.replace('_', ' ')}
                  </span>
                </div>

                {/* Place Name & Tagline */}
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                  {place.name}
                </h2>
                <p className="text-xs text-amber-300/90 font-medium mt-1 line-clamp-2 drop-shadow">
                  {place.famousFor}
                </p>

                {/* Quick Info Strip */}
                <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-300">
                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {place.distanceFromCity.split('(')[0]}
                  </span>
                  <span className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/10">
                    <Clock className="w-3 h-3 text-emerald-400" />
                    {place.timings.split('(')[0]}
                  </span>
                </div>

                {/* Photographer Attribution Link */}
                <div className="mt-3 flex items-center justify-between">
                  <a
                    href={`https://instagram.com/${place.photographer.instagramHandle}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[10px] text-slate-300 bg-slate-900/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-full hover:text-amber-400 transition"
                  >
                    <Camera className="w-3 h-3 text-pink-400" />
                    <span>Photo by @{place.photographer.instagramHandle}</span>
                  </a>
                </div>

                {/* Primary Action Button: 1-Tap Google Navigation */}
                <button
                  onClick={() => startNavigation(place.coordinates)}
                  className="w-full mt-3 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 active:scale-95 transition"
                >
                  <Navigation className="w-4 h-4 fill-white" />
                  Navigate with Google Maps
                </button>
              </div>
            </div>
          );
        })}
      </main>

      {/* Full Deep Lore & Yatri Drawer Modal */}
      {activeLorePlace && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
          <div 
            className="w-full max-h-[85dvh] overflow-y-auto bg-slate-950 border-t border-slate-700/80 p-5 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-amber-400 border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 rounded-full">
                  {activeLorePlace.category.replace('_', ' ')}
                </span>
                <h3 className="text-xl font-black text-white mt-1">
                  {activeLorePlace.name}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {activeLorePlace.famousFor}
                </p>
              </div>
              <button
                onClick={() => setActiveLorePlace(null)}
                className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Distance</span>
                  <span className="text-slate-200">{activeLorePlace.distanceFromCity}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Timings</span>
                  <span className="text-slate-200">{activeLorePlace.timings}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Ticket className="w-4 h-4 text-blue-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ticket</span>
                  <span className="text-slate-200">{activeLorePlace.entryFee}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-semibold">Best Season</span>
                  <span className="text-slate-200">{activeLorePlace.bestSeason}</span>
                </div>
              </div>
            </div>

            {/* Must Try / Buy Highlight */}
            <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25 mb-3 text-xs flex items-start gap-2.5">
              <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-amber-400 block text-[11px] uppercase">Must Try or Buy</span>
                <p className="text-slate-200 mt-0.5">{activeLorePlace.mustTryOrBuy}</p>
              </div>
            </div>

            {/* Live Operational Status */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs mb-3">
              <span className="font-bold text-emerald-400 block text-[11px] uppercase mb-0.5">⚡ Live Operational Update</span>
              <p className="text-slate-300">{activeLorePlace.recentNews}</p>
            </div>

            {/* Cultural Lore & Key Person */}
            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs mb-3">
              <span className="font-bold text-slate-400 block text-[11px] uppercase mb-0.5">👑 Associated Figure & Lore</span>
              <p className="text-slate-200">{activeLorePlace.keyFigure}</p>
            </div>

            {/* Deep History */}
            <div className="border-t border-slate-800 pt-3 text-xs text-slate-400 leading-relaxed">
              <span className="font-semibold text-slate-200 block mb-1 uppercase text-[11px]">Deep History & Cultural Roots</span>
              {activeLorePlace.history}
            </div>

            {/* Navigation Button Inside Modal */}
            <button
              onClick={() => startNavigation(activeLorePlace.coordinates)}
              className="w-full mt-4 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg"
            >
              <Navigation className="w-4 h-4 fill-white" />
              Start Driving Route
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
