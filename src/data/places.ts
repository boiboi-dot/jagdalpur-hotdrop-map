export interface Place {
  id: string;
  name: string;
  category: 'chai_pani' | 'food' | 'nature' | 'crafts' | 'heritage';
  coordinates: [number, number];
  hotdropScore: number;
  isHotdrop: boolean;
  famousFor: string;
  keyFigure: string;
  history: string;
  recentNews: string;
  photoUrl: string;
  photographer: {
    name: string;
    instagramHandle: string;
  };
}

export const SEED_PLACES: Place[] = [
  {
    id: 'chitrakote',
    name: 'Chitrakote Waterfalls',
    category: 'nature',
    coordinates: [81.7061, 19.2014],
    hotdropScore: 96,
    isHotdrop: true,
    famousFor: 'India’s widest horseshoe waterfall (~300m) on Indravati River',
    keyFigure: 'Indravati River Basin & Sacred Tribal River Lore',
    history: 'Carved across horizontal sandstone formations over millennia. Revered by Maria and Muria tribes as a divine sanctuary and historical natural defense barrier.',
    recentNews: 'Boating open at bottom basin; evening cliff-edge light and fountain show operational.',
    photoUrl: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=900&auto=format&fit=crop&q=80',
    photographer: {
      name: 'Bastar Explorer',
      instagramHandle: 'bastar_clicks'
    }
  },
  {
    id: 'tirathgarh',
    name: 'Tirathgarh Falls',
    category: 'nature',
    coordinates: [81.8653, 18.9136],
    hotdropScore: 91,
    isHotdrop: true,
    famousFor: '300-foot multi-tiered zigzag cascading drop inside Kanger Valley',
    keyFigure: 'Kanger Valley Forest Guardians',
    history: 'A classic geological block-fault waterfall where the Mugabahar River breaks into multiple cascading channels over stepped rock ledges.',
    recentNews: 'Lower stairs cleared; morning mist window best between 8:00 AM and 11:00 AM.',
    photoUrl: 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=900&auto=format&fit=crop&q=80',
    photographer: {
      name: 'Wanderlust Bastar',
      instagramHandle: 'explore_bastar'
    }
  },
  {
    id: 'dalpat-sagar',
    name: 'Dalpat Sagar Lake & Chai Tapri',
    category: 'chai_pani',
    coordinates: [82.0232, 19.0805],
    hotdropScore: 88,
    isHotdrop: true,
    famousFor: '400-year-old reservoir, sunset congregation point, island temple, and tea stalls',
    keyFigure: 'Raja Dalpat Deo (16th Century Kakatiya Monarch)',
    history: 'Excavated 400 years ago by Raja Dalpat Deo to harvest monsoon rainfall for the royal capital. Now serves as the premier evening spot for local tea and street food.',
    recentNews: 'New lakeside LED walkway and boating docks completely open for sunset visitors.',
    photoUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&auto=format&fit=crop&q=80',
    photographer: {
      name: 'Jagdalpur Shutter',
      instagramHandle: 'jagdalpur_frames'
    }
  },
  {
    id: 'bastar-palace',
    name: 'Bastar Palace',
    category: 'heritage',
    coordinates: [82.0360, 19.0735],
    hotdropScore: 82,
    isHotdrop: false,
    famousFor: 'Seat of the 75-Day Bastar Dussehra (World’s Longest Festival)',
    keyFigure: 'Maharaja Pravir Chandra Bhanj Deo (20th Century Folk Hero)',
    history: 'Built after the Kakatiya dynasty transferred its royal administrative center to Jagdalpur. Houses traditional royal armories, wooden artifacts, and sacred festival halls.',
    recentNews: 'Royal Dussehra wooden chariot workshop open for guided public walking tours.',
    photoUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=900&auto=format&fit=crop&q=80',
    photographer: {
      name: 'Heritage Bastar',
      instagramHandle: 'bastar_heritage'
    }
  },
  {
    id: 'kumharpara',
    name: 'Kumharpara Dhokra Village',
    category: 'crafts',
    coordinates: [82.0195, 19.0650],
    hotdropScore: 79,
    isHotdrop: false,
    famousFor: 'GI-Tagged Lost-Wax Bell Metal (Dhokra) & Wrought Iron Statues',
    keyFigure: 'Ghadwa Artisan Community & Shilp Gurus',
    history: 'Home to the indigenous bell-metal sculptors who still utilize 4,000-year-old Indus Valley lost-wax casting methods using beeswax and riverbed clay.',
    recentNews: 'Artisans providing direct live metal-pouring demonstrations every Saturday.',
    photoUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=900&auto=format&fit=crop&q=80',
    photographer: {
      name: 'Tribal Craft Lore',
      instagramHandle: 'crafts_of_bastar'
    }
  },
  {
    id: 'sanjay-market',
    name: 'Sanjay Market (Sunday Haat)',
    category: 'food',
    coordinates: [82.0298, 19.0772],
    hotdropScore: 85,
    isHotdrop: false,
    famousFor: 'Traditional Tribal Food, Chaprah (Red Ant Chutney), Mahua, Fresh Produce',
    keyFigure: 'Rural Forest Gatherers & Weekly Haat Traders',
    history: 'The economic nerve center of Bastar where forest-dwelling villagers trade non-timber forest produce, medicinal plants, and distinct regional delicacies.',
    recentNews: 'Sunday haat peak hours active from 9:00 AM to 3:00 PM.',
    photoUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=80',
    photographer: {
      name: 'Flavors of CG',
      instagramHandle: 'bastar_foodies'
    }
  }
];
