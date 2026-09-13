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
  ShoppingBag,
  Navigation,
  Layers,
  Crosshair
} from 'lucide-react';
import { SEED_PLACES, Place } from './data/places';

// Styles for God's Eye View (Free, no credit card or tokens needed)
const MAP_STYLES = {
  satellite: {
    version: 8,
    sources: {
      'esri-satellite': {
        type: 'raster',
        tiles: [
          'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
        ],
        tileSize: 256
      }
    },
    layers: [
      {
        id: 'satellite-layer',
        type: 'raster',
        source: 'esri-satellite'
      }
    ]
  },
  tacticalDark: 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json'
};

export default function App() {
  const mapContainer = useRef<HTMLDivElement | null>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [mapMode, setMapMode] = useState<'satellite' | 'tacticalDark'>('satellite');
  const [isSpinning, setIsSpinning] = useState(false);
  const [hudCoords, setHudCoords] = useState<string>('19.0800° N, 82.0100° E');

  // Convert places to WebGL GeoJSON features
  const getGeoJsonData = (category: string) => {
    const filtered = category === 'all' 
      ? SEED_PLACES 
      : SEED_PLACES.filter(p => p.category === category);

    return {
      type: 'FeatureCollection',
      features: filtered.map(place => ({
        type: 'Feature',
        properties: { ...place },
        geometry: {
          type: 'Point',
          coordinates: place.coordinates
        }
      }))
    };
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    // Initialize MapLibre in God's Eye Satellite Mode
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: MAP_STYLES[mapMode] as any,
      center: [82.0200, 19.0800],
      zoom: 11.8,
      pitch: 45, // Drone angle
      bearing: -10,
      antialias: true
    });

    map.current.on('load', () => {
      setupNativeLayers();
    });

    map.current.on('move', () => {
      if (map.current) {
        const c = map.current.getCenter();
        setHudCoords(`${c.lat.toFixed(4)}° N, ${c.lng.toFixed(4)}° E`);
      }
    });

    window.addEventListener('resize', () => map.current?.resize());
  }, []);

  // Inject Native WebGL Layers (Glued to the map, zero floating)
  const setupNativeLayers = () => {
    if (!map.current) return;

    if (!map.current.getSource('bastar-spots')) {
      map.current.addSource('bastar-spots', {
        type: 'geojson',
        data: getGeoJsonData('all') as any
      });
    }

    // 1. Radar Pulse Ring (WebGL Canvas)
    if (!map.current.getLayer('spots-glow')) {
      map.current.addLayer({
        id: 'spots-glow',
        type: 'circle',
        source: 'bastar-spots',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 14, 15, 24],
          'circle-color': '#f59e0b',
          'circle-opacity': 0.3,
          'circle-blur': 0.8
        }
      });
    }

    // 2. Solid Core Pin (WebGL Canvas)
    if (!map.current.getLayer('spots-core')) {
      map.current.addLayer({
        id: 'spots-core',
        type: 'circle',
        source: 'bastar-spots',
        paint: {
          'circle-radius': ['interpolate', ['linear'], ['zoom'], 10, 6, 15, 10],
          'circle-color': '#ff4d2e',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff'
        }
      });
    }

    // 3. Name Label (WebGL Canvas)
    if (!map.current.getLayer('spots-label')) {
      map.current.addLayer({
        id: 'spots-label',
        type: 'symbol',
        source: 'bastar-spots',
        layout: {
          'text-field': ['get', 'name'],
          'text-size': 11,
          'text-offset': [0, 1.4],
          'text-anchor': 'top',
          'text-font': ['Open Sans Bold']
        },
        paint: {
          'text-color': '#ffffff',
          'text-halo-color': '#000000',
          'text-halo-width': 2
        }
      });
    }

    // Click handler for WebGL elements
    map.current.on('click', 'spots-core', (e) => {
      if (e.features && e.features[0]) {
        const p = e.features[0].properties as unknown as Place;
        navigateToSpot(p);
      }
    });

    map.current.on('mouseenter', 'spots-core', () => {
      if (map.current) map.current.getCanvas().style.cursor = 'pointer';
    });
    map.current.on('mouseleave', 'spots-core', () => {
      if (map.current) map.current.getCanvas().style.cursor = '';
    });
  };

  // Switch between God's Eye Satellite and Tactical Dark Radar
  const toggleMapStyle = () => {
    const nextMode = mapMode === 'satellite' ? 'tacticalDark' : 'satellite';
    setMapMode(nextMode);
    if (map.current) {
      map.current.setStyle(MAP_STYLES[nextMode] as any);
      map.current.once('style.load', () => {
        setupNativeLayers();
      });
    }
  };

  // Filter Categories
  const handleCategoryChange = (cat: string) => {
    setActiveCategory(cat);
    if (map.current && map.current.getSource('bastar-spots')) {
      (map.current.getSource('bastar-spots') as any).setData(getGeoJsonData(cat));
    }
  };

  const navigateToSpot = (place: Place) => {
    setSelectedPlace(place);
    map.current?.flyTo({
      center: place.coordinates,
      zoom: 15.5,
      pitch: 55,
      bearing: Math.floor(Math.random() * 40) - 20,
      duration: 1800,
      essential: true
    });
  };

  // Launch Google Maps Live Traffic Navigation
  const startLiveNavigation = (coords: [number, number]) => {
    const [lng, lat] = coords;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const handleRoulette = () => {
    setIsSpinning(true);
    const pool = activeCategory === 'all' 
      ? SEED_PLACES 
      : SEED_PLACES.filter(p => p.category === activeCategory);

    if (!pool.length) return;

    confetti({ particleCount: 50, spread: 60, origin: { y: 0.85 } });

    setTimeout(() => {
      const lucky = pool[Math.floor(Math.random() * pool.length)];
      navigateToSpot(lucky);
      setIsSpinning(false);
    }, 400);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-950 font-sans text-white">
      {/* Mapbox Canvas */}
      <div ref={mapContainer} className="absolute inset-0 w-full h-full z-0" />

      {/* God's Eye Drone HUD (Top Bar) */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="pointer-events-auto bg-slate-950/85 backdrop-blur-xl border border-white/15 px-3 py-1.5 rounded-xl shadow-2xl flex items-center gap-2">
          <Crosshair className="w-3.5 h-3.5 text-red-500 animate-spin" />
          <span className="text-[10px] font-mono tracking-widest text-slate-300">
            {hudCoords}
          </span>
        </div>

        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Style Toggle (Satellite vs Dark) */}
          <button
            onClick={toggleMapStyle}
            className="p-2 rounded-xl bg-slate-900/90 backdrop-blur-md border border-white/20 text-slate-200 hover:text-white shadow-lg"
            title="Toggle God's Eye Satellite"
          >
            <Layers className="w-4 h-4 text-cyan-400" />
          </button>

          {/* Random Roulette */}
          <button
            onClick={handleRoulette}
            disabled={isSpinning}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-600 px-3.5 py-1.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 shadow-lg shadow-orange-500/30 active:scale-95 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {isSpinning ? 'Rolling...' : 'Random'}
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="absolute top-14 left-3 right-3 z-20 flex gap-1.5 overflow-x-auto no-scrollbar py-1 pointer-events-auto">
        {[
          { id: 'all', label: 'All Radar', icon: Compass },
          { id: 'nature', label: 'Nature', icon: TreePine },
          { id: 'chai_pani', label: 'Chai & Views', icon: Coffee },
          { id: 'food', label: 'Local Food', icon: UtensilsCrossed },
          { id: 'heritage', label: 'Heritage', icon: Landmark },
          { id: 'crafts', label: 'Crafts', icon: Hammer }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => handleCategoryChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md transition border shrink-0 ${
                activeCategory === tab.id
                  ? 'bg-amber-500 border-amber-400 text-slate-950 shadow-md'
                  : 'bg-slate-950/80 border-white/10 text-slate-300 hover:text-white'
              }`}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* God's Eye Target Center Crosshair Overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-30 z-10">
        <div className="w-12 h-12 border border-dashed border-amber-400/50 rounded-full flex items-center justify-center">
          <div className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
        </div>
      </div>

      {/* Detailed Information & Navigation Bottom Drawer */}
      {selectedPlace && (
        <div className="absolute bottom-0 left-0 right-0 z-30 max-h-[82vh] overflow-y-auto bg-slate-950/95 backdrop-blur-2xl border-t border-slate-700/80 p-5 rounded-t-3xl shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="flex items-center gap-2 mb-1">
                {selectedPlace.isHotdrop && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3" /> Trending Hotdrop ({selectedPlace.hotdropScore}%)
                  </span>
                )}
                <span className="text-[10px] uppercase font-bold text-slate-400 border border-slate-800 px-2 py-0.5 rounded-full">
                  {selectedPlace.category.replace('_', ' ')}
                </span>
              </div>
              <h2 className="text-xl font-black text-white">{selectedPlace.name}</h2>
              <p className="text-xs text-amber-400 font-medium">{selectedPlace.famousFor}</p>
            </div>
            <button
              onClick={() => setSelectedPlace(null)}
              className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Primary Action Button: Live Traffic Navigation */}
          <button
            onClick={() => startLiveNavigation(selectedPlace.coordinates)}
            className="w-full my-3 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 active:scale-95 transition"
          >
            <Navigation className="w-4 h-4 fill-white" />
            Start Live Navigation (Google Traffic)
          </button>

          {/* Photo & Creator Tag */}
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
              className="absolute bottom-2.5 left-2.5 bg-slate-950/80 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full flex items-center gap-1.5 text-[11px] text-slate-200 hover:text-amber-400"
            >
              <Camera className="w-3 h-3 text-pink-400" />
              <span>By @{selectedPlace.photographer.instagramHandle}</span>
            </a>
          </div>

          {/* Practical Yatri Information */}
          <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Distance</span>
                <span className="text-slate-200">{selectedPlace.distanceFromCity}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Timings</span>
                <span className="text-slate-200">{selectedPlace.timings}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Ticket className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Ticket / Entry</span>
                <span className="text-slate-200">{selectedPlace.entryFee}</span>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Best Season</span>
                <span className="text-slate-200">{selectedPlace.bestSeason}</span>
              </div>
            </div>
          </div>

          {/* Must Try / Buy */}
          <div className="p-3 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/25 mb-3 text-xs flex items-start gap-2.5">
            <ShoppingBag className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-amber-400 block text-[11px] uppercase">Must Experience / Buy</span>
              <p className="text-slate-200 mt-0.5">{selectedPlace.mustTryOrBuy}</p>
            </div>
          </div>

          {/* Live News */}
          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs mb-3">
            <span className="font-bold text-amber-400 block text-[11px] mb-0.5">⚡ Operational Status</span>
            <p className="text-slate-300">{selectedPlace.recentNews}</p>
          </div>

          {/* Deep Lore */}
          <div className="border-t border-slate-800/80 pt-3 text-xs leading-relaxed text-slate-400">
            <span className="font-semibold text-slate-200 block mb-1">Deep Heritage & History</span>
            {selectedPlace.history}
          </div>
        </div>
      )}
    </div>
  );
}
