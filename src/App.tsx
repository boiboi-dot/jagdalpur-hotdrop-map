import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Flame, 
  X, 
  Camera, 
  Compass, 
  TreePine, 
  Coffee, 
  Landmark, 
  Hammer, 
  UtensilsCrossed,
  Clock,
  Ticket,
  MapPin,
  Calendar,
  ShoppingBag
} from 'lucide-react';
import { SEED_PLACES, Place } from './data/places';

export default function App() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isSpinning, setIsSpinning] = useState(false);

  // Initialize Map Once
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json',
      center: [82.0100, 19.0800], // Centered right on Jagdalpur
      zoom: 11.5,
      pitch: 0, // Flat 2D view prevents markers from floating/drifting
      bearing: 0,
      antialias: true
    });

    map.current.on('load', () => {
      map.current?.resize();
      renderMarkers('all');
    });

    // Resize cleanly on mobile screen rotate/resize
    window.addEventListener('resize', () => map.current?.resize());
  }, []);

  // Update Markers when Category changes
  const renderMarkers = (category: string) => {
    if (!map.current) return;

    // Remove existing markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const filtered = category === 'all' 
      ? SEED_PLACES 
      : SEED_PLACES.filter(p => p.category === category);

    const categoryIcons: Record<string, string> = {
      nature: '🌿',
      chai_pani: '☕',
      food: '🍲',
      heritage: '🏛️',
      crafts: '🏺'
    };

    filtered.forEach((place) => {
      const el = document.createElement('div');
      el.className = `marker-wrapper ${place.isHotdrop ? 'hotdrop-radar' : ''}`;
      el.innerHTML = `
        <div class="marker-disc">
          <span>${categoryIcons[place.category] || '📍'}</span>
        </div>
      `;

      el.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateToSpot(place);
      });

      // anchor: 'center' keeps the marker glued to exact GPS coordinates
      const marker = new maplibregl.Marker({ element: el, anchor: 'center' })
        .setLngLat(place.coordinates)
        .addTo(map.current!);

      markersRef.current.push(marker);
    });
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    renderMarkers(category);
  };

  const navigateToSpot = (place: Place) => {
    setSelectedPlace(place);
    map.current?.flyTo({
      center: place.coordinates,
      zoom: 14.8,
      duration: 1800,
      essential: true
    });
  };

  const handleRoulette = () => {
    setIsSpinning(true);
    const pool = activeCategory === 'all' 
      ? SEED_PLACES 
      : SEED_PLACES.filter(p => p.category === activeCategory);

    if (!pool.length) return;

    confetti({ 
      particleCount: 50, 
      spread: 60, 
      origin: { y: 0.85 } 
    });

    setTimeout(() => {
      const randomTarget = pool[Math.floor(Math.random() * pool.length)];
      navigateToSpot(randomTarget);
      setIsSpinning(false);
    }, 450);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bastar-950 font-sans text-white">
      {/* Mapbox Canvas */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />

      {/* Floating Top Header */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-bastar-900/90 backdrop-blur-xl border border-white/15 px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Aamcho Jagdalpur
          </span>
        </div>

        {/* Random Pick Button */}
        <button
          onClick={handleRoulette}
          disabled={isSpinning}
          className="pointer-events-auto flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 px-3.5 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/25 active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isSpinning ? 'Rolling...' : 'Random Pick'}
        </button>
      </div>

      {/* Category Filter Pills (Now fully updates map pins) */}
      <div className="absolute top-16 left-4 right-4 z-20 flex gap-2 overflow-x-auto no-scrollbar py-1 pointer-events-auto">
        {[
          { id: 'all', label: 'All Radar', icon: Compass },
          { id: 'nature', label: 'Nature', icon: TreePine },
          { id: 'chai_pani', label: 'Chai & Views', icon: Coffee },
          { id: 'food', label: 'Local Food', icon: UtensilsCrossed },
          { id: 'heritage', label: 'Heritage', icon: Landmark },
          { id: 'crafts', label: 'Handicrafts', icon: Hammer }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition border shrink-0 ${
                activeCategory === tab.id
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md scale-105'
                  : 'bg-bastar-900/85 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Rich Details Bottom Drawer */}
      {selectedPlace && (
        <div className="absolute bottom-0 left-0 right-0 z-30 max-h-[82vh] overflow-y-auto bg-bastar-950/95 backdrop-blur-2xl border-t border-slate-700/60 p-5 md:p-6 rounded-t-3xl shadow-2xl transition-all">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {selectedPlace.isHotdrop && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3" /> Trending ({selectedPlace.hotdropScore}%)
                  </span>
                )}
                <span className="text-[10px] uppercase font-bold text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full">
                  {selectedPlace.category.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">{selectedPlace.name}</h2>
              <p className="text-xs text-amber-400 font-medium mt-0.5">{selectedPlace.famousFor}</p>
            </div>
            <button
              onClick={() => setSelectedPlace(null)}
              className="p-1.5 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Photo with Instagram Tag */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-3">
            <img 
              src={selectedPlace.photoUrl} 
              alt={selectedPlace.name} 
              className="w-full h-44 object-cover"
            />
            <a 
              href={`https://instagram.com/${selectedPlace.photographer.instagramHandle}`}
              target="_blank"
              rel="noreferrer"
              className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] text-slate-200 hover:text-amber-400 transition"
            >
              <Camera className="w-3 h-3 text-pink-400" />
              <span>By @{selectedPlace.photographer.instagramHandle}</span>
            </a>
          </div>

          {/* Practical Yatri Essentials Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
            <div className="p-2.5 rounded-xl bg-bastar-900/90 border border-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Distance</span>
                <span className="text-slate-200">{selectedPlace.distanceFromCity}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-bastar-900/90 border border-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Timings</span>
                <span className="text-slate-200">{selectedPlace.timings}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-bastar-900/90 border border-slate-800 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ticket / Entry</span>
                <span className="text-slate-200">{selectedPlace.entryFee}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-bastar-900/90 border border-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Best Season</span>
                <span className="text-slate-200">{selectedPlace.bestSeason}</span>
              </div>
            </div>
          </div>

          {/* Must Try / Buy Highlight */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25 mb-3 text-xs flex items-start gap-2.5">
            <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400 block text-[11px] uppercase">Must Experience / Buy</span>
              <p className="text-slate-200 mt-0.5">{selectedPlace.mustTryOrBuy}</p>
            </div>
          </div>

          {/* Operational Update & Figure */}
          <div className="space-y-2 mb-3">
            <div className="p-2.5 rounded-xl bg-bastar-900 border border-slate-800 text-xs">
              <span className="font-bold text-slate-400 block text-[11px] mb-0.5">⚡ Live Operational Update</span>
              <p className="text-slate-300">{selectedPlace.recentNews}</p>
            </div>

            <div className="p-2.5 rounded-xl bg-bastar-900 border border-slate-800 text-xs">
              <span className="font-bold text-slate-400 block text-[11px] mb-0.5">👑 Associated Figure & Lore</span>
              <p className="text-slate-200">{selectedPlace.keyFigure}</p>
            </div>
          </div>

          {/* Deep Lore & History */}
          <div className="border-t border-slate-800/80 pt-3 text-xs leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-200 block mb-1">Deep History & Heritage</span>
            {selectedPlace.history}
          </div>
        </div>
      )}
    </div>
  );
}
