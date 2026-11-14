import frontLoadBlackImg from '../assets/images/samsung_model_frontload_black_1794569680955.jpg';
import frontLoadInoxImg from '../assets/images/samsung_model_frontload_inox_1794569682371.jpg';
import comboSilverImg from '../assets/images/samsung_model_combo_silver_1794569682063.jpg';
import samsungTopLoadImg from '../assets/images/samsung_model_topload_pure_1794569704823.jpg';
import semiAutoImg from '../assets/images/samsung_model_semiauto_1794569683481.jpg';

import himstarSilverImg from '../assets/images/himstar_frontload_silver_1794570451040.jpg';
import himstarGraphiteImg from '../assets/images/himstar_frontload_graphite_1794570451168.jpg';
import videoconFrontImg from '../assets/images/videocon_frontload_grey_1794570452608.jpg';
import videoconTopImg from '../assets/images/videocon_topload_pro_1794570452495.jpg';
import panasonicFrontImg from '../assets/images/panasonic_frontload_white_1794570454037.jpg';
import panasonicTopImg from '../assets/images/panasonic_topload_silver_1794570454659.jpg';

import showcaseStudioImg from '../assets/images/samsung_showcase_studio_1794569627061.jpg';
import showcaseEcoBubbleImg from '../assets/images/samsung_showcase_ecobubble_1794569627812.jpg';
import showcaseTopLoadImg from '../assets/images/samsung_showcase_topload_1794569686500.jpg';
import showcaseComboImg from '../assets/images/samsung_showcase_combo_1794569704858.jpg';

import comparisonColdImg from '../assets/images/samsung_comparison_cold_1794569628290.jpg';
import comparisonSteamImg from '../assets/images/samsung_comparison_steam_1794569627669.jpg';
import bentoDialImg from '../assets/images/samsung_bento_dial_1794569628664.jpg';

export type BrandId = 'samsung' | 'himstar' | 'videocon' | 'panasonic';
export type WasherCategory = 'Front Load' | 'Washer Dryer' | 'Top Load' | 'Semi-Automatic';
export type FinishId = 'caviar-black' | 'dark-inox' | 'platinum-silver' | 'pearl-slate';
export type FamilySizeFilter = 'all' | 'small' | 'medium' | 'large';
export type BudgetFilter = 'all' | 'under35' | '35to80' | 'over80';

export interface FinishMeta {
  id: FinishId;
  name: string;
  swatch: string;
}

export const FINISH_META: Record<FinishId, FinishMeta> = {
  'caviar-black': { id: 'caviar-black', name: 'Caviar Black', swatch: '#1C2024' },
  'dark-inox': { id: 'dark-inox', name: 'Brushed Dark Inox', swatch: '#4B5258' },
  'platinum-silver': { id: 'platinum-silver', name: 'Titanium Silver', swatch: '#9BA3AA' },
  'pearl-slate': { id: 'pearl-slate', name: 'Pearl White & Slate', swatch: '#DCE2E8' },
};

export interface WasherModel {
  id: string;
  brand: BrandId;
  brandLabel: string;
  sku: string;
  shortName: string;
  name: string;
  category: WasherCategory;
  capacity: string;
  capacityKg: number;
  mrpNpr: number;
  priceNpr: number;
  discountPct: number;
  emiMonthlyNpr: number;
  spinRpm: string;
  motorWarranty: string;
  steamTech: string;
  energyRating: string;
  defaultFinish: FinishId;
  availableFinishes: FinishId[];
  image: string;
  glowTint: string;
  tagline: string;
  standoutEdge: string;
  sourceUrl: string;
}

export interface BrandSectionMeta {
  id: BrandId;
  name: string;
  kicker: string;
  headline: string;
  description: string;
  highlights: string[];
}

export const BRAND_SECTIONS: BrandSectionMeta[] = [
  {
    id: 'samsung',
    name: 'Samsung',
    kicker: 'Authorized Flagship Lineup · EcoBubble & AI Control',
    headline: 'Samsung Washing Machines',
    description:
      'Flagship front-load, washer-dryer combo, automatic top-load, and twin-tub washers featuring Digital Inverter motors with 20-year warranty, Hygiene Steam, and SmartThings Wi-Fi.',
    highlights: ['EcoBubble Micro-Foam', '20-Year Motor Warranty', 'Hygiene Steam 99.9%'],
  },
  {
    id: 'himstar',
    name: 'Himstar',
    kicker: 'Direct Drive & BLDC Inverter Series',
    headline: 'Himstar Washing Machines',
    description:
      'Engineered for Nepali homes with Direct Drive & BLDC Inverter motors, 11 specialized wash programs, built-in heater, easy-access drain filters, and anti-rat base protection.',
    highlights: ['30% Energy Savings', 'Anti-Rat Base Shield', '10-Year Motor Warranty'],
  },
  {
    id: 'videocon',
    name: 'Videocon',
    kicker: 'Heavy-Duty Performance & Everyday Value',
    headline: 'Videocon Washing Machines',
    description:
      'Practical power built for daily family loads — from A+++ 90°C heat-wash front loaders with Add Garment to AI Diamond Tub top-loaders with waterproof PCBs and collar-scrubber twin tubs.',
    highlights: ['90°C Heat Wash', 'Waterproof PCB & Air Damping', 'Up to 10-Yr Motor Warranty'],
  },
  {
    id: 'panasonic',
    name: 'Panasonic',
    kicker: 'Japanese StainMaster+ & Active Foam Care',
    headline: 'Panasonic Washing Machines',
    description:
      'Precision Japanese laundry engineering combining Active Foam high-density suds, StainMaster+ steam bacteria elimination, and Sazanami dimpled drums for gentle fabric care.',
    highlights: ['StainMaster+ Steam', 'Active Foam System', '10-Year Motor Warranty'],
  },
];

export const ALL_WASHER_MODELS: WasherModel[] = [
  // SAMSUNG (6 models)
  {
    id: 'ww12dg6b24abim',
    brand: 'samsung',
    brandLabel: 'Samsung',
    sku: 'WW12DG6B24ABIM',
    shortName: '12 kg Bespoke AI',
    name: 'Samsung 12kg AI EcoBubble Front Load',
    category: 'Front Load',
    capacity: '12 kg',
    capacityKg: 12,
    mrpNpr: 127040,
    priceNpr: 120990,
    discountPct: 5,
    emiMonthlyNpr: 11092,
    spinRpm: '1400 RPM',
    motorWarranty: '20 Years Digital Inverter',
    steamTech: 'Hygiene Steam + Super Speed 39m',
    energyRating: 'AI Energy Mode (A+++)',
    defaultFinish: 'caviar-black',
    availableFinishes: ['caviar-black', 'dark-inox'],
    image: frontLoadBlackImg,
    glowTint: 'rgba(20, 40, 160, 0.22)',
    tagline: 'SpaceMax 12 kg drum capacity in a 600 mm cabinet with 39-min Super Speed wash.',
    standoutEdge: 'Largest 12 kg drum in standard depth',
    sourceUrl: 'https://joinelectroniccenter.com/product/samsung-12kg-ai-ecobubble-front-load-washing-machine-249/',
  },
  {
    id: 'wd11tp34dsx',
    brand: 'samsung',
    brandLabel: 'Samsung',
    sku: 'WD11TP34DSX/FQ',
    shortName: '11/7 kg Combo',
    name: 'Samsung 11kg AI EcoBubble Washer Dryer Combo',
    category: 'Washer Dryer',
    capacity: '11 kg Wash · 7 kg Dry',
    capacityKg: 11,
    mrpNpr: 159590,
    priceNpr: 151990,
    discountPct: 5,
    emiMonthlyNpr: 13934,
    spinRpm: '1400 RPM',
    motorWarranty: '20 Years Digital Inverter',
    steamTech: 'Air Wash + Hygiene Steam 99.9%',
    energyRating: 'Digital Inverter A+++',
    defaultFinish: 'platinum-silver',
    availableFinishes: ['platinum-silver', 'dark-inox'],
    image: comboSilverImg,
    glowTint: 'rgba(92, 128, 188, 0.24)',
    tagline: 'All-in-one wash and air-condensing dry cycle with SmartThings Wi-Fi and Air Wash.',
    standoutEdge: 'Complete 11 kg wash + 7 kg dryer in one unit',
    sourceUrl: 'https://joinelectroniccenter.com/product/samsung-11kg-ai-ecobubble-front-load-washer-dryer-combo-248/',
  },
  {
    id: 'ww90dg6u24axim',
    brand: 'samsung',
    brandLabel: 'Samsung',
    sku: 'WW90DG6U24AXIM',
    shortName: '9 kg AI Inox',
    name: 'Samsung 9kg AI EcoBubble Front Load Inox',
    category: 'Front Load',
    capacity: '9 kg',
    capacityKg: 9,
    mrpNpr: 111290,
    priceNpr: 105990,
    discountPct: 5,
    emiMonthlyNpr: 9717,
    spinRpm: '1400 RPM',
    motorWarranty: '20 Years Digital Inverter',
    steamTech: 'EcoBubble + Hygiene Steam',
    energyRating: 'SmartThings AI Energy',
    defaultFinish: 'dark-inox',
    availableFinishes: ['dark-inox', 'caviar-black'],
    image: frontLoadInoxImg,
    glowTint: 'rgba(59, 102, 245, 0.20)',
    tagline: 'AI Control learns household habits, suggests cycles, and runs Hygiene Steam.',
    standoutEdge: 'EcoBubble foam + 20-year Digital Inverter warranty',
    sourceUrl: 'https://joinelectroniccenter.com/product/samsung-9kg-ai-ecobubble-front-load-washing-machine-inox-257/',
  },
  {
    id: 'ww90dg5u24axim',
    brand: 'samsung',
    brandLabel: 'Samsung',
    sku: 'WW90DG5U24AXIM',
    shortName: '9 kg EcoBubble',
    name: 'Samsung 9kg EcoBubble Hygiene Steam Front Load',
    category: 'Front Load',
    capacity: '9 kg',
    capacityKg: 9,
    mrpNpr: 107090,
    priceNpr: 101990,
    discountPct: 5,
    emiMonthlyNpr: 9350,
    spinRpm: '1400 RPM',
    motorWarranty: '20 Years Digital Inverter',
    steamTech: 'Hygiene Steam + Bubble Soak',
    energyRating: 'Eco 40-60 Inverter',
    defaultFinish: 'dark-inox',
    availableFinishes: ['dark-inox', 'platinum-silver'],
    image: frontLoadInoxImg,
    glowTint: 'rgba(72, 118, 178, 0.20)',
    tagline: 'Deep Hygiene Steam sanitization, Bubble Soak, and 15-minute Quick Wash.',
    standoutEdge: '15-min Quick Wash + Bubble Soak',
    sourceUrl: 'https://joinelectroniccenter.com/product/samsung-9kg-ecobubble-front-load-washer-258/',
  },
  {
    id: 'wa80bg4545bvim',
    brand: 'samsung',
    brandLabel: 'Samsung',
    sku: 'WA80BG4545BVIM',
    shortName: '8 kg Top Load',
    name: 'Samsung 8kg EcoBubble Automatic Top Load',
    category: 'Top Load',
    capacity: '8 kg',
    capacityKg: 8,
    mrpNpr: 59840,
    priceNpr: 56990,
    discountPct: 5,
    emiMonthlyNpr: 5225,
    spinRpm: '700 RPM',
    motorWarranty: '20 Years Digital Inverter',
    steamTech: 'EcoBubble + Super Clean',
    energyRating: '73% Energy Saving DIT',
    defaultFinish: 'dark-inox',
    availableFinishes: ['dark-inox', 'caviar-black'],
    image: samsungTopLoadImg,
    glowTint: 'rgba(64, 88, 130, 0.22)',
    tagline: 'Dual Storm pulsator and EcoBubble technology with soft-close tempered glass lid.',
    standoutEdge: 'EcoBubble top-load with soft-close glass lid',
    sourceUrl: 'https://joinelectroniccenter.com/product/samsung-8kg-ecobubble-fully-automatic-top-load-washer-252/',
  },
  {
    id: 'wt70c3200ll',
    brand: 'samsung',
    brandLabel: 'Samsung',
    sku: 'WT70C3200LL/TL',
    shortName: '7 kg Twin Tub',
    name: 'Samsung 7kg Semi-Automatic Twin-Tub Washer',
    category: 'Semi-Automatic',
    capacity: '7 kg',
    capacityKg: 7,
    mrpNpr: 27290,
    priceNpr: 25990,
    discountPct: 5,
    emiMonthlyNpr: 2383,
    spinRpm: '1300 RPM Spin',
    motorWarranty: '5 Years Motor Warranty',
    steamTech: 'Air Turbo Spin Drying',
    energyRating: '5-Star Power Savings',
    defaultFinish: 'pearl-slate',
    availableFinishes: ['pearl-slate'],
    image: semiAutoImg,
    glowTint: 'rgba(84, 136, 210, 0.20)',
    tagline: 'Air Turbo drying system, rust-proof body, and Center Jet pulsator.',
    standoutEdge: 'Lightweight twin-tub with fast Air Turbo spin',
    sourceUrl: 'https://joinelectroniccenter.com/product/samsung-7kg-semi-automatic-washing-machine-251/',
  },

  // HIMSTAR (4 models)
  {
    id: 'himstar-10fbwa2dtk',
    brand: 'himstar',
    brandLabel: 'Himstar',
    sku: '10FBWA2DTK/NJ',
    shortName: 'Himstar 10 kg DD',
    name: 'Himstar 10kg Direct Drive Inverter Front Load',
    category: 'Front Load',
    capacity: '10 kg',
    capacityKg: 10,
    mrpNpr: 104999,
    priceNpr: 99999,
    discountPct: 5,
    emiMonthlyNpr: 9168,
    spinRpm: '1400 RPM',
    motorWarranty: '10 Years Brand Warranty',
    steamTech: 'Built-In Steam Wash',
    energyRating: 'Direct Drive Inverter',
    defaultFinish: 'platinum-silver',
    availableFinishes: ['platinum-silver', 'dark-inox'],
    image: himstarSilverImg,
    glowTint: 'rgba(100, 116, 139, 0.22)',
    tagline: 'Direct Drive inverter motor for low-noise stability, 11 wash programs, LED touch panel & steam wash.',
    standoutEdge: '10 kg Direct Drive under Rs. 1 Lakh',
    sourceUrl: 'https://joinelectroniccenter.com/product/himstar-10-kg-washing-machine-direct-drive-inverter-dd-motor-10fbwa2dtk-nj-105/',
  },
  {
    id: 'himstar-hwfaw82itk',
    brand: 'himstar',
    brandLabel: 'Himstar',
    sku: 'HWFAW82ITK/NJ',
    shortName: 'Himstar 8 kg Steam',
    name: 'Himstar 8kg Inverter Steam & Storm Front Load',
    category: 'Front Load',
    capacity: '8 kg',
    capacityKg: 8,
    mrpNpr: 86099,
    priceNpr: 81999,
    discountPct: 5,
    emiMonthlyNpr: 7518,
    spinRpm: '1400 RPM',
    motorWarranty: '10 Years Motor Warranty',
    steamTech: 'Steam Wash + Storm Wash',
    energyRating: '30% Energy-Saving Inverter',
    defaultFinish: 'dark-inox',
    availableFinishes: ['dark-inox', 'platinum-silver'],
    image: himstarGraphiteImg,
    glowTint: 'rgba(71, 85, 105, 0.24)',
    tagline: '30% energy-saving inverter motor, easy-clean front drain cap, steam wash, and anti-rat base guard.',
    standoutEdge: 'Anti-rat base shield + easy drain access',
    sourceUrl: 'https://joinelectroniccenter.com/product/himstar-8-kg-fully-automatic-front-load-washing-machine-hwfaw82itk-nj-energy-sav-106/',
  },
  {
    id: 'himstar-hw80faw82',
    brand: 'himstar',
    brandLabel: 'Himstar',
    sku: 'HW-80FAW82ITK/NJ',
    shortName: 'Himstar 8 kg BLDC',
    name: 'Himstar 8kg BLDC Inverter Front Load',
    category: 'Front Load',
    capacity: '8 kg',
    capacityKg: 8,
    mrpNpr: 78740,
    priceNpr: 74990,
    discountPct: 5,
    emiMonthlyNpr: 6875,
    spinRpm: '1200 RPM',
    motorWarranty: '10 Years Motor Warranty',
    steamTech: 'Built-In Water Heater',
    energyRating: 'BLDC Inverter',
    defaultFinish: 'dark-inox',
    availableFinishes: ['dark-inox', 'caviar-black'],
    image: himstarGraphiteImg,
    glowTint: 'rgba(51, 65, 85, 0.22)',
    tagline: 'BLDC Inverter motor with 1200 RPM fast spin dry, built-in water heater, 11 programs & child lock.',
    standoutEdge: 'Built-in heater BLDC front load value',
    sourceUrl: 'https://joinelectroniccenter.com/product/himstar-8kg-inverter-motor-front-load-fully-automatic-washing-machine-hw-80faw82-107/',
  },
  {
    id: 'himstar-hw75fxquti',
    brand: 'himstar',
    brandLabel: 'Himstar',
    sku: 'HW-75FXQUTI/GZ',
    shortName: 'Himstar 7 kg Auto',
    name: 'Himstar 7kg Automatic Front Load Washer',
    category: 'Front Load',
    capacity: '7 kg',
    capacityKg: 7,
    mrpNpr: 51755,
    priceNpr: 49290,
    discountPct: 5,
    emiMonthlyNpr: 4519,
    spinRpm: '1200 RPM',
    motorWarranty: '10 Years Motor Warranty',
    steamTech: 'Warm Temperature Wash',
    energyRating: 'High-Efficiency Inverter',
    defaultFinish: 'platinum-silver',
    availableFinishes: ['platinum-silver'],
    image: himstarSilverImg,
    glowTint: 'rgba(100, 116, 139, 0.20)',
    tagline: 'Compact 7 kg front-load design for apartments with quick wash, delicate care, and delay start.',
    standoutEdge: 'Entry front-load under Rs. 50,000',
    sourceUrl: 'https://joinelectroniccenter.com/product/himstar-7kg-washing-machine-hw-75fxquti-gz-104/',
  },

  // VIDEOCON (4 models)
  {
    id: 'videocon-vwmfl85',
    brand: 'videocon',
    brandLabel: 'Videocon',
    sku: 'VWMFL8.5-CNOP',
    shortName: 'Videocon 8 kg Front',
    name: 'Videocon 8kg A+++ Inverter Front Load',
    category: 'Front Load',
    capacity: '8 kg',
    capacityKg: 8,
    mrpNpr: 73500,
    priceNpr: 70000,
    discountPct: 5,
    emiMonthlyNpr: 6418,
    spinRpm: '1400 RPM',
    motorWarranty: '10 Years Motor Warranty',
    steamTech: '90°C Heat Wash + Add Garment',
    energyRating: 'A+++ Energy Saving',
    defaultFinish: 'dark-inox',
    availableFinishes: ['dark-inox', 'caviar-black'],
    image: videoconFrontImg,
    glowTint: 'rgba(56, 103, 214, 0.20)',
    tagline: 'A+++ energy-saving inverter motor, 90°C heat wash, Add Garment mid-cycle, and honeycomb drum.',
    standoutEdge: '90°C Heat Wash + 1400 RPM at Rs. 70,000',
    sourceUrl: 'https://joinelectroniccenter.com/product/videocon-8-kg-inverter-front-loading-washing-machine-fully-automatic-335/',
  },
  {
    id: 'videocon-vd80pro',
    brand: 'videocon',
    brandLabel: 'Videocon',
    sku: 'VD-8.0 PRO+',
    shortName: 'Videocon 8 kg Top',
    name: 'Videocon 8kg AI Diamond Tub Top Load',
    category: 'Top Load',
    capacity: '8 kg',
    capacityKg: 8,
    mrpNpr: 34650,
    priceNpr: 33000,
    discountPct: 5,
    emiMonthlyNpr: 3025,
    spinRpm: '720 RPM',
    motorWarranty: '10 Years Motor Warranty',
    steamTech: 'AI Fuzzy Logic + Magic Filter',
    energyRating: 'Waterproof PCB Protection',
    defaultFinish: 'platinum-silver',
    availableFinishes: ['platinum-silver', 'dark-inox'],
    image: videoconTopImg,
    glowTint: 'rgba(90, 112, 145, 0.20)',
    tagline: 'AI Fuzzy Logic, Diamond Tub, air damping suspension, waterproof PCB, and rat-proof body.',
    standoutEdge: '8 kg fully automatic top load at Rs. 33,000',
    sourceUrl: 'https://joinelectroniccenter.com/product/videocon-8kg-fully-automatic-top-load-washing-machine-vd-8-0-pro-337/',
  },
  {
    id: 'videocon-vwm80sar',
    brand: 'videocon',
    brandLabel: 'Videocon',
    sku: 'VWM-8.0SAR',
    shortName: 'Videocon 8 kg Semi',
    name: 'Videocon 8kg Heavy Semi-Automatic Washer',
    category: 'Semi-Automatic',
    capacity: '8 kg',
    capacityKg: 8,
    mrpNpr: 24675,
    priceNpr: 23500,
    discountPct: 5,
    emiMonthlyNpr: 2154,
    spinRpm: '1300 RPM Spin',
    motorWarranty: '5 Years Motor Warranty',
    steamTech: 'Collar Scrubber + Spin Shower',
    energyRating: 'Thermal Motor Protection',
    defaultFinish: 'pearl-slate',
    availableFinishes: ['pearl-slate'],
    image: semiAutoImg,
    glowTint: 'rgba(84, 136, 210, 0.18)',
    tagline: 'Collar scrubber, Turbo Wash, Spin Shower, anti-rat design, and 24-month full home warranty.',
    standoutEdge: '24-month full home warranty + 8 kg tub',
    sourceUrl: 'https://joinelectroniccenter.com/product/videocon-8-kg-semi-automatic-washing-machine-336/',
  },
  {
    id: 'videocon-vt75sa',
    brand: 'videocon',
    brandLabel: 'Videocon',
    sku: 'VT-75SA',
    shortName: 'Videocon 7.5 kg Semi',
    name: 'Videocon 7.5kg Semi-Automatic Twin Tub',
    category: 'Semi-Automatic',
    capacity: '7.5 kg',
    capacityKg: 7.5,
    mrpNpr: 20990,
    priceNpr: 19990,
    discountPct: 5,
    emiMonthlyNpr: 1833,
    spinRpm: '1300 RPM Spin',
    motorWarranty: '5 Years Motor Warranty',
    steamTech: 'Collar Scrubber + Magic Filter',
    energyRating: 'Rust-Free Fiber Cabinet',
    defaultFinish: 'pearl-slate',
    availableFinishes: ['pearl-slate'],
    image: semiAutoImg,
    glowTint: 'rgba(84, 136, 210, 0.18)',
    tagline: 'High-torque wash motor, Magic Filter, collar scrubber, rust-free fiber cabinet & castor wheels.',
    standoutEdge: 'Most affordable 7.5 kg washer at Rs. 19,990',
    sourceUrl: 'https://joinelectroniccenter.com/product/videocon-7-5kg-semi-automatic-washing-machine-334/',
  },

  // PANASONIC (2 models)
  {
    id: 'panasonic-na148mb2w01',
    brand: 'panasonic',
    brandLabel: 'Panasonic',
    sku: 'NA-148MB2W01',
    shortName: 'Panasonic 8 kg Front',
    name: 'Panasonic 8kg StainMaster+ Inverter Front Load',
    category: 'Front Load',
    capacity: '8 kg',
    capacityKg: 8,
    mrpNpr: 82940,
    priceNpr: 78990,
    discountPct: 5,
    emiMonthlyNpr: 7242,
    spinRpm: '1400 RPM',
    motorWarranty: '10 Years Motor Warranty',
    steamTech: 'StainMaster+ Steam Bacteria Removal',
    energyRating: 'Japanese Inverter Drive',
    defaultFinish: 'pearl-slate',
    availableFinishes: ['pearl-slate', 'platinum-silver'],
    image: panasonicFrontImg,
    glowTint: 'rgba(20, 90, 190, 0.20)',
    tagline: 'StainMaster+ steam bacteria elimination, 1400 RPM spin, Pause & Add, and 15 tailored wash cycles.',
    standoutEdge: 'StainMaster+ Japanese hot-steam stain removal',
    sourceUrl: 'https://joinelectroniccenter.com/product/panasonic-8kg-front-load-inverter-washing-machine-187/',
  },
  {
    id: 'panasonic-naf75b10hrb',
    brand: 'panasonic',
    brandLabel: 'Panasonic',
    sku: 'NA-F75B10HRB',
    shortName: 'Panasonic 7.5 kg Top',
    name: 'Panasonic 7.5kg Active Foam Top Load',
    category: 'Top Load',
    capacity: '7.5 kg',
    capacityKg: 7.5,
    mrpNpr: 48290,
    priceNpr: 45990,
    discountPct: 5,
    emiMonthlyNpr: 4216,
    spinRpm: '700 RPM',
    motorWarranty: '10 Years Motor Warranty',
    steamTech: 'Active Foam + Aquabeat Agitation',
    energyRating: 'Sazanami Gentle Drum',
    defaultFinish: 'platinum-silver',
    availableFinishes: ['platinum-silver', 'dark-inox'],
    image: panasonicTopImg,
    glowTint: 'rgba(72, 108, 160, 0.20)',
    tagline: 'Active Foam dense lather, Aquabeat triple-motion agitation, Sazanami drum & soft-close lid.',
    standoutEdge: 'Active Foam dense lather + Sazanami drum',
    sourceUrl: 'https://joinelectroniccenter.com/product/panasonic-7-5kg-fully-automatic-top-load-washing-machine-186/',
  },
];

export const SAMSUNG_MODELS = ALL_WASHER_MODELS.filter((m) => m.brand === 'samsung');

export const COMPARE_SCROLL_STAGES = [
  {
    modelId: 'ww90dg6u24axim',
    brand: 'Samsung',
    title: 'Samsung 9kg AI EcoBubble',
    mrp: 'Rs. 1,11,290',
    price: 'Rs. 1,05,990',
    discountPct: 5,
    sub: 'EcoBubble foam at 25°C, SmartThings AI Control, and an industry-leading 20-year Digital Inverter motor warranty.',
    badge: '20-Yr Motor Warranty',
    src: frontLoadInoxImg,
    alt: 'Samsung 9kg AI EcoBubble Front Load washing machine in Brushed Dark Inox',
  },
  {
    modelId: 'himstar-10fbwa2dtk',
    brand: 'Himstar',
    title: 'Himstar 10kg Direct Drive',
    mrp: 'Rs. 1,04,999',
    price: 'Rs. 99,999',
    discountPct: 5,
    sub: 'Direct Drive quiet drum motor with 10 kg capacity, built-in steam wash, and anti-rat base protection under Rs. 1 Lakh.',
    badge: '10 kg Under Rs. 1L',
    src: himstarSilverImg,
    alt: 'Himstar 10kg Direct Drive Inverter Front Load washing machine in Titanium Silver',
  },
  {
    modelId: 'panasonic-na148mb2w01',
    brand: 'Panasonic',
    title: 'Panasonic 8kg StainMaster+',
    mrp: 'Rs. 82,940',
    price: 'Rs. 78,990',
    discountPct: 5,
    sub: 'Japanese StainMaster+ steam sanitization removes collar grime and 99.99% bacteria with 1400 RPM extraction.',
    badge: 'StainMaster+ Steam',
    src: panasonicFrontImg,
    alt: 'Panasonic 8kg StainMaster+ Inverter Front Load washing machine in Pearl White',
  },
  {
    modelId: 'videocon-vwmfl85',
    brand: 'Videocon',
    title: 'Videocon 8kg A+++ Inverter',
    mrp: 'Rs. 73,500',
    price: 'Rs. 70,000',
    discountPct: 5,
    sub: 'High-value 1400 RPM inverter front loader featuring 90°C heat wash, Add Garment mid-cycle, and honeycomb drum.',
    badge: '90°C Heat Wash Value',
    src: videoconFrontImg,
    alt: 'Videocon 8kg A+++ Inverter Front Load washing machine in Gunmetal Grey',
  },
];

export const SHOWCASE_STAGES = [
  {
    src: showcaseStudioImg,
    alt: 'Samsung Bespoke AI Front Load washing machine integrated into a modern architectural stone laundry suite',
    title: 'Architectural Fit',
    sub: 'SpaceMax 12 kg capacity inside a flush 600 mm chassis',
  },
  {
    src: showcaseEcoBubbleImg,
    alt: 'Close-up of Samsung EcoBubble micro-foam penetrating fabrics inside the stainless drum',
    title: 'EcoBubble Micro-Foam',
    sub: 'Dissolves detergent 40x faster for spotless cold-water washes',
  },
  {
    src: showcaseTopLoadImg,
    alt: 'Samsung 8kg EcoBubble Top Load washing machine in a sunlit travertine utility room',
    title: 'Dual Storm Top Load',
    sub: 'Soft-close tempered glass lid and zero-tangle pulsator action',
  },
  {
    src: showcaseComboImg,
    alt: 'Samsung 11kg AI EcoBubble Washer-Dryer Combo illuminated in an evening home laundry suite',
    title: 'Wash & Dry in One',
    sub: 'Seamless 11 kg wash and 7 kg dry cycle managed via SmartThings',
  },
];

export const MEDIA_ASSETS = {
  comparisonCold: comparisonColdImg,
  comparisonSteam: comparisonSteamImg,
  bentoDial: bentoDialImg,
  bentoEcoBubble: showcaseEcoBubbleImg,
};

export interface TradeInTier {
  id: string;
  label: string;
  bonusNpr: number;
}

export const TRADE_IN_TIERS: TradeInTier[] = [
  { id: 'none', label: 'No Exchange (Standard Price)', bonusNpr: 0 },
  { id: 'semi', label: 'Old Semi-Auto Washer', bonusNpr: 4500 },
  { id: 'topload', label: 'Old Top-Load Washer', bonusNpr: 6500 },
  { id: 'frontload-tv', label: 'Old Front-Load / LED TV', bonusNpr: 8000 },
];

export interface DeliveryZone {
  id: string;
  name: string;
  eta: string;
  feeLabel: string;
  installationNote: string;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  {
    id: 'ktm',
    name: 'Kathmandu Ring Road',
    eta: 'Same-Day Dispatch (2–5 hrs)',
    feeLabel: 'Free Delivery',
    installationNote: 'Free standard unboxing & demo included',
  },
  {
    id: 'lalitpur',
    name: 'Lalitpur / Patan',
    eta: 'Same-Day / Next-Morning',
    feeLabel: 'Free Delivery',
    installationNote: 'Free standard unboxing & demo included',
  },
  {
    id: 'bhaktapur',
    name: 'Bhaktapur / Kirtipur',
    eta: 'Next-Day Valley Van',
    feeLabel: 'Free Delivery',
    installationNote: 'Technician setup scheduled with delivery',
  },
  {
    id: 'outside',
    name: 'Outside Kathmandu Valley',
    eta: '2–4 Days Insured Cargo',
    feeLabel: 'Highway Courier Quote',
    installationNote: 'Authorized brand service installation nationwide',
  },
];

export const EMI_TENURES = [
  { months: 0, label: 'Full Cash' },
  { months: 6, label: '6 Mo (0% EMI)' },
  { months: 9, label: '9 Mo (0% EMI)' },
  { months: 12, label: '12 Mo (0% EMI)' },
  { months: 18, label: '18 Mo Plan' },
];

export const LOCAL_TESTIMONIALS = [
  {
    quote:
      'Upgraded our old twin-tub via Sata-Pata exchange and got Rs. 8,000 off the Samsung 12kg Bespoke AI. Delivered to Lazimpat the same afternoon.',
    author: 'Suman Adhikari',
    location: 'Lazimpat, Kathmandu',
    model: 'Samsung WW12DG6B24ABIM',
  },
  {
    quote:
      'Compared Himstar 10kg Direct Drive and Samsung side-by-side at Samakhushi. The anti-rat base guard and whisper-quiet spin convinced us immediately.',
    author: 'Prativa Maharjan',
    location: 'Jhamsikhel, Lalitpur',
    model: 'Himstar 10FBWA2DTK/NJ',
  },
  {
    quote:
      'Ordered the Panasonic 8kg StainMaster+ on 0% EMI for 12 months. Zero hidden charges and the technician completed inlet fitting on the spot.',
    author: 'Bikash Gurung',
    location: 'Suryabinayak, Bhaktapur',
    model: 'Panasonic NA-148MB2W01',
  },
];

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  actionLabel?: string;
  actionHref?: string;
}

export const KATHMANDU_FAQS: FaqEntry[] = [
  {
    id: 'front-vs-top-ktm',
    question: 'Front Load vs. Top Load: Which washing machine suits Kathmandu homes better?',
    answer:
      'Front-load washers (like Samsung EcoBubble or Himstar Direct Drive) use only 45–65 L per wash—ideal if your Kathmandu home relies on tanker water—and include built-in heaters (60°C–90°C) for cold winters. Fully automatic top-load washers handle low overhead-tank pressure and allow mid-cycle bucket top-ups if municipal water supply fluctuates.',
    actionLabel: 'Compare Front vs Top Load Models',
    actionHref: '#compare-matrix',
  },
  {
    id: 'emi-without-card',
    question: 'How can I buy a washing machine on 0% EMI in Kathmandu without a credit card?',
    answer:
      'Join Electronic Center offers both bank-card 0% EMI and institutional financing (6, 9, or 12 months) for Kathmandu Valley buyers without a credit card. Bring your Nepali Citizenship Certificate (Nagarikta), two passport photos, basic income/salary proof, and a local guarantor at our Samakhushi Chowk showroom or confirm eligibility via WhatsApp.',
    actionLabel: 'Calculate Monthly EMI',
    actionHref: '#order',
  },
  {
    id: 'hard-water-care',
    question: 'How do I protect my washing machine from Kathmandu Valley hard water scaling?',
    answer:
      'Borehole and ground water across Kathmandu, Lalitpur, and Bhaktapur can leave calcium scale on heaters and tubs. Run a monthly Drum Clean / Tub Clean cycle with descaling powder, use built-in hot wash cycles periodically, and add an inline inlet water-softener cartridge during installation.',
  },
  {
    id: 'family-capacity-nepal',
    question: 'What washing machine kg capacity should I choose for a Nepali family?',
    answer:
      'For 1–2 people, a 7 kg to 7.5 kg drum (starting from Rs. 19,990) is ideal. For a standard 3–4 member Kathmandu household, choose an 8 kg or 9 kg inverter machine to handle heavy winter jackets and bedsheets without straining the motor. Families of 5+ should pick a 10 kg Himstar Direct Drive or 12 kg Samsung SpaceMax.',
    actionLabel: 'Filter by Family Size',
    actionHref: '#finder',
  },
  {
    id: 'sata-pata-exchange',
    question: 'How does the Sata-Pata old appliance exchange offer work in Kathmandu?',
    answer:
      'You can trade in any old semi-automatic washer (Rs. 4,500 off), top-load washer (Rs. 6,500 off), or old front-load / LED TV (up to Rs. 8,000 off) directly toward your new Samsung, Himstar, Videocon, or Panasonic machine. Our Valley delivery van picks up the old appliance when delivering your new unit.',
    actionLabel: 'Estimate Trade-In Savings',
    actionHref: '#order',
  },
  {
    id: 'transit-bolts-delivery',
    question: 'Is Kathmandu Valley delivery and technician installation free?',
    answer:
      'Yes. Same-day free delivery applies within Kathmandu Ring Road, Lalitpur/Patan, and next-day across Bhaktapur & Kirtipur. For every front-load washer, an authorized brand technician removes the rear shipping transit bolts and levels the drum before the first spin cycle.',
    actionLabel: 'Check Your Delivery Zone',
    actionHref: '#order',
  },
];

export const TRADE_IN_BONUS_NPR = 8000;
export const JEC_WHATSAPP_NUMBER = '9779851045662';

export function formatNpr(amount: number): string {
  return `Rs. ${amount.toLocaleString('en-IN')}`;
}

