import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Flame, 
  X, 
  camera, 
  Compass, 
  TreePine, 
  Coffee, 
  Landmark, 
  Hammer, 
  UtensilsCrossed 
} from 'lucide-react';
import { SEED_PLACES, Place } from './data/places';

mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA';

export default function App() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [82.0000, 19.1000],
      zoom: 11,
      pitch: 58,
      bearing: -15,
      antialias: true
    });

    map.current.on('load', () => {
      map.current?.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14
      });
      map.current?.setTerrain({ source: 'mapbox-dem', exaggeration: 1.35 });

      map.current?.setFog({
        color: 'rgb(7, 10, 18)',
        'high-color': 'rgb(20, 30, 50)',
        'horizon-blend': 0.12,
      });

      SEED_PLACES.forEach((place) => {
        const markerEl = document.createElement('div');
        markerEl.className = `marker-wrapper ${place.isHotdrop ? 'hotdrop-radar' : ''}`;
        
        const categoryIcons: Record<string, string> = {
          nature: '🌿',
          chai_pani: '☕',
          food: '🍲',
          heritage: '🏛️',
          crafts: '🏺'
        };

        markerEl.innerHTML = `
          <div class="marker-disc">
            <span>${categoryIcons[place.category] || '📍'}</span>
          </div>
        `;

        markerEl.addEventListener('click', () => {
          navigateToSpot(place);
        });

        new mapboxgl.Marker(markerEl)
          .setLngLat(place.coordinates)
          .addTo(map.current!);
      });
    });
  }, []);

  const navigateToSpot = (place: Place) => {
    setSelectedPlace(place);
    map.current?.flyTo({
      center: place.coordinates,
      zoom: 15.2,
      pitch: 65,
      bearing: Math.floor(Math.random() * 60) - 30,
      duration: 2200,
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
      particleCount: 60, 
      spread: 70, 
      origin: { y: 0.85 } 
    });

    setTimeout(() => {
      const randomTarget = pool[Math.floor(Math.random() * pool.length)];
      navigateToSpot(randomTarget);
      setIsSpinning(false);
    }, 500);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-bastar-950 font-sans text-white">
      <div ref={mapContainer} className="w-full h-full" />

      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-bastar-900/85 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-2xl shadow-xl flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-black tracking-widest uppercase bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Aamcho Jagdalpur
          </span>
        </div>

        <button
          onClick={handleRoulette}
          disabled={isSpinning}
          className="pointer-events-auto flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 px-4 py-2 rounded-2xl font-bold text-xs uppercase tracking-wider text-slate-950 shadow-lg shadow-amber-500/25 active:scale-95 transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          {isSpinning ? 'Exploring...' : 'Random Pick'}
        </button>
      </div>

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
              onClick={() => setActiveCategory(tab.id)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md transition border shrink-0 ${
                activeCategory === tab.id
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md'
                  : 'bg-bastar-900/75 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {selectedPlace && (
        <div className="absolute bottom-0 left-0 right-0 z-30 max-h-[80vh] overflow-y-auto bg-bastar-950/95 backdrop-blur-2xl border-t border-slate-700/60 p-5 md:p-7 rounded-t-3xl shadow-2xl transition-transform">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                {selectedPlace.isHotdrop && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3" /> Trending Hotdrop ({selectedPlace.hotdropScore}%)
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-3">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 group">
              <img 
                src={selectedPlace.photoUrl} 
                alt={selectedPlace.name} 
                className="w-full h-48 object-cover group-hover:scale-105 transition duration-500"
              />
              <a 
                href={`https://instagram.com/${selectedPlace.photographer.instagramHandle}`}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] text-slate-200 hover:text-amber-400 transition"
              >
                <camera className="w-3 h-3 text-pink-400" />
                <span>By @{selectedPlace.photographer.instagramHandle}</span>
              </a>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                <span className="font-bold text-amber-400 block mb-0.5">⚡ Live Operational Update</span>
                <p className="text-slate-300">{selectedPlace.recentNews}</p>
              </div>

              <div className="p-3 rounded-xl bg-bastar-900 border border-slate-800 text-xs">
                <span className="font-bold text-slate-400 block mb-0.5">👑 Associated Figure & Lore</span>
                <p className="text-slate-200">{selectedPlace.keyFigure}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800/80 pt-3 mt-2 text-xs leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-200 block mb-1">Deep History & Cultural Heritage</span>
            {selectedPlace.history}
          </div>
        </div>
      )}
    </div>
  );
}
