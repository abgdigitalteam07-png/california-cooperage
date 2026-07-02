export type ProductKey = 'cr1' | 'cr2' | 'cr3';

export interface ProductSpec {
  label: string;
  value: string;
}

export interface ProductFeature {
  icon: string;
  title: string;
  body: string;
}

export interface FAQ {
  q: string;
  a: string;
}

export interface Product {
  key: ProductKey;
  slug: string;
  modelCode: string;
  name: string;
  subtitle: string;
  tagline: string;
  label: string;
  shape: string;
  seats: number;
  jets: number;
  badge: string;
  description: string;
  heroBody: string;
  specChips: string[];
  specs: ProductSpec[];
  features: ProductFeature[];
  faqs: FAQ[];
  compareWith: ProductKey[];
  image: string;
  model: string;
  metaTitle: string;
  metaDescription: string;
}

export const PRODUCTS: Record<ProductKey, Product> = {
  cr1: {
    key: 'cr1',
    slug: 'cr1-hot-tub',
    modelCode: 'CR1',
    name: 'CR1',
    subtitle: 'CR1',
    tagline: 'Five Seats. California Roots. Weekend-Ready.',
    label: '5-Person Rectangular',
    shape: 'Rectangular',
    seats: 5,
    jets: 14,
    badge: '5 Person · Rectangular',
    description: '5-seat rectangular spa with 14 jets and Balboa controls on a compact 68″ × 59″ footprint.',
    heroBody: 'The CR1 is the most accessible spa in the California Cooperage lineup — a 5-seat rectangular rotomold spa on a compact 68″ × 59″ footprint, equipped with 14 jets, Balboa controls, a 3KW heater, and a 2HP two-speed pump. Full foam insulation and a tapered 5″–3″ cover keep operating costs low. Same California heritage. Most accessible price point.',
    specChips: ['5 Person', 'Rectangular', '14 Jets', '3KW Heater', 'Balboa Controls', 'Full Foam'],
    specs: [
      { label: 'Model', value: 'CR1' },
      { label: 'Seating Capacity', value: '5 Persons' },
      { label: 'Shape', value: 'Rectangular' },
      { label: 'Dimensions (L × W × H)', value: '69″ × 60″ × 30″ (175 × 152 × 76 cm)' },
      { label: 'Dry Weight', value: '~309 lbs (~140 kg)' },
      { label: 'Filled Weight', value: '~1,720 lbs (~780 kg)' },
      { label: 'Total Jets', value: '14 pcs' },
      { label: 'Control System', value: 'Balboa Controls' },
      { label: 'Heater', value: '3 kW' },
      { label: 'Pump 1', value: '1.5 HP (2-Speed)' },
      { label: 'Lighting', value: '12V / 12W' },
      { label: 'Air Regulator', value: '1 pc' },
      { label: 'Filtration', value: 'Weir top-mount skim filter' },
      { label: 'Cabinet Material', value: 'PE and PS' },
      { label: 'Insulation', value: 'Full foam' },
      { label: 'Cover', value: 'Tapered 5″ → 3″ (max energy savings)' },
    ],
    features: [
      { icon: '⊕', title: 'Balboa Controls', body: 'Industry-standard control system — intuitive, reliable, and compatible with optional Wi-Fi for remote monitoring.' },
      { icon: '▦', title: '5-Person Rectangular Design', body: '68″ × 59″ footprint seats 5 adults — a right-sized spa that fits patios and decks where larger square models won\'t.' },
      { icon: '◷', title: '3KW Heater + Full Foam', body: '3KW heater and full foam insulation work together to heat efficiently and retain temperature — lower costs, longer soaks.' },
      { icon: '✦', title: '14-Jet Hydrotherapy', body: '14 jets powered by a 2HP two-speed pump deliver targeted massage to all 5 seated positions.' },
      { icon: '≈', title: 'Seamless Rotomold Shell', body: 'One-piece HDPE polyethylene construction — no seams, UV-resistant, freeze-rated for year-round outdoor use.' },
      { icon: '⛨', title: 'Entry Steps', body: 'Includes entry steps for easy access — get in and out of your spa comfortably every time.' },
    ],
    faqs: [
      { q: 'What is the exact footprint of the CR1?', a: 'The CR1 measures 69″ × 60″ × 30″ (approximately 175 × 152 × 76 cm). Its rectangular footprint makes it an excellent fit for narrower deck spaces or patios where a square model won\'t fit.' },
      { q: 'What control system does the CR1 use?', a: 'The CR1 uses a Balboa control system — the same trusted platform used in mid-range and premium acrylic spas globally. Optional Wi-Fi upgrade allows remote temperature monitoring from your smartphone.' },
      { q: 'How does the CR1 compare to the CR2 and CR3?', a: 'The CR1 is the most compact and accessible — 5 seats, 14 jets, 68″ × 59″. The CR2 is the flagship: 7 seats, 25 jets, 81″ × 81″ square. The CR3 is the signature round: 6 seats, 21 jets, ⌀81″. All three share identical Balboa controls, 3KW heaters, 2HP pumps, and full foam insulation.' },
    ],
    compareWith: ['cr2', 'cr3'],
    image: '/images/cr1-hero.jpg',
    model: '/models/cr1.glb',
    metaTitle: 'CR1 Hot Tub — 5-Person Rectangular Rotomold Spa | California Cooperage',
    metaDescription: 'The CR1 is California Cooperage\'s 5-person rectangular rotomold hot tub — 14 jets, Balboa controls, 3KW heater, full foam insulation. 68″ × 59″ × 30″ compact footprint.',
  },
  cr2: {
    key: 'cr2',
    slug: 'cr2-hot-tub',
    modelCode: 'CR2',
    name: 'CR2',
    subtitle: 'CR2',
    tagline: 'Seven Seats. The Spa that Owns the Backyard.',
    label: '7-Person Square · Flagship',
    shape: 'Square',
    seats: 7,
    jets: 25,
    badge: '7 Person · Square — Flagship',
    description: 'Flagship 7-seat square spa with 25 jets, 2 headrest pillows, and the largest footprint in the lineup.',
    heroBody: 'The CR2 is the flagship California Cooperage spa — a full 7-seat, 81″ × 81″ square hot tub with 25 jets, 2 headrest pillows, 2 air regulators, and a water diverter. Balboa controls, 3KW heater, 2HP two-speed pump, and full foam insulation deliver the complete luxury rotomold spa experience. The most substantial and fully equipped spa in the lineup.',
    specChips: ['7 Person', 'Square 81″', '25 Jets', '2 Pillows', '3KW Heater', 'Balboa Controls'],
    specs: [
      { label: 'Model Code', value: 'CR2' },
      { label: 'Seating Capacity', value: '7 Persons' },
      { label: 'Shape', value: 'Square' },
      { label: 'Dimensions (L × W × H)', value: '81″ × 81″ × 32″ (205 × 205 × 81 cm)' },
      { label: 'Dry Weight', value: '~441 lbs (~200 kg)' },
      { label: 'Filled Weight', value: '~2,426 lbs (~1,100 kg)' },
      { label: 'Total Jets', value: '25 pcs' },
      { label: 'Headrest Pillows', value: '2 pcs (included)' },
      { label: 'Control System', value: 'Balboa' },
      { label: 'Heater', value: '3 kW' },
      { label: 'Pump 1', value: '2 HP (2-Speed)' },
      { label: 'Lighting', value: '12V / 12W' },
      { label: 'Water Diverter', value: '1 pc' },
      { label: 'Air Regulators', value: '2 pcs' },
      { label: 'Filtration', value: 'Weir top-mount skim filter' },
      { label: 'Cabinet Material', value: 'PE and PS' },
      { label: 'Insulation', value: 'Full foam' },
      { label: 'Cover', value: 'Tapered 5″ → 3″ (max energy savings)' },
    ],
    features: [
      { icon: '⊞', title: '7-Person Flagship Capacity', body: 'The largest spa in the lineup — 81″ × 81″, 7 adults, 2 headrest pillows, the most complete California Cooperage experience.' },
      { icon: '✦', title: '25-Jet Hydrotherapy', body: '25 jets with water diverter and 2 air regulators give precise control over massage intensity across all seating zones.' },
      { icon: '▦', title: 'Full Square Footprint', body: 'The 81″ × 81″ square design maximizes seating efficiency and aligns naturally to deck and patio edges.' },
      { icon: '⊕', title: 'Balboa Controls', body: 'The CR2\'s Balboa system manages all functions with precision. Optional Wi-Fi puts control on your phone.' },
      { icon: '◷', title: '3KW + Full Foam Efficiency', body: '3KW heater and full foam shell — fast heat-up, superior retention, lower energy consumption month to month.' },
      { icon: '⛨', title: 'Entry Steps', body: 'Includes entry steps for easy access — built for the way real people use their spa every day.' },
    ],
    faqs: [
      { q: 'How much does the CR2 weigh when filled?', a: 'The CR2 weighs approximately 441 lbs (~200 kg) dry and approximately 2,426 lbs (~1,100 kg) filled. Ensure your deck or patio can support this load before installation — consult a structural engineer or contractor. Your dealer can advise on site preparation.' },
      { q: 'What makes the CR2 the flagship model?', a: 'The CR2 is the largest spa at 81″ × 81″ with 7 seats, the most jets at 25, the most included accessories (2 pillows, 1 water diverter, 2 air regulators), and the highest capacity. It delivers the fullest rotomold spa experience in the California Cooperage lineup.' },
      { q: 'What optional upgrades are available?', a: 'All California Cooperage models support: spa entry steps, Wi-Fi connectivity module, mini LED lighting upgrade, and waterfall feature. Ask your dealer about availability and pricing.' },
    ],
    compareWith: ['cr1', 'cr3'],
    image: '/images/cr2-hero.jpg',
    model: '/models/cr2.glb',
    metaTitle: 'CR2 Hot Tub — 7-Person Square Rotomold Spa | California Cooperage',
    metaDescription: 'The CR2 is California Cooperage\'s flagship 7-person square rotomold spa — 25 jets, 2 headrest pillows, Balboa controls, 3KW heater. 81″ × 81″ × 32″ full square footprint.',
  },
  cr3: {
    key: 'cr3',
    slug: 'cr3-hot-tub',
    modelCode: 'CR3',
    name: 'CR3',
    subtitle: 'CR3',
    tagline: 'Six in the Round. No Bad Seat.',
    label: '6-Person Round',
    shape: 'Round',
    seats: 6,
    jets: 21,
    badge: '6 Person · Round',
    description: '6-seat round spa with 21 jets. The circular design puts everyone face-to-face.',
    heroBody: 'There\'s something different about a round hot tub. The CR3\'s circular design seats 6 adults face-to-face — no hierarchy, no corner dead zones, just conversation and relaxation. At ⌀81″ and 32″ deep, with 21 jets, Balboa controls, 3KW heater, and full foam insulation, the CR3 is our most distinctive spa and the one California nights were made for.',
    specChips: ['6 Person', 'Round ⌀81″', '21 Jets', '3KW Heater', 'Balboa Controls', 'Full Foam'],
    specs: [
      { label: 'Model Code', value: 'CR3' },
      { label: 'Seating Capacity', value: '6 Persons' },
      { label: 'Shape', value: 'Round / Circular' },
      { label: 'Dimensions (L × W × H)', value: '80″ × 80″ × 32″ (203 × 203 × 81 cm)' },
      { label: 'Dry Weight', value: '~529 lbs (240 kg)' },
      { label: 'Filled Weight', value: '~2,293 lbs (1,040 kg)' },
      { label: 'Total Jets', value: '21 pcs' },
      { label: 'Control System', value: 'Balboa' },
      { label: 'Heater', value: '3 kW' },
      { label: 'Pump 1', value: '2 HP (2-Speed)' },
      { label: 'Lighting', value: '12V / 12W' },
      { label: 'Air Regulator', value: '1 pc' },
      { label: 'Filtration', value: 'Weir top-mount skim filter' },
      { label: 'Cabinet Material', value: 'PE and PS' },
      { label: 'Insulation', value: 'Full foam' },
      { label: 'Cover', value: 'Round tapered 5″ → 3″ (max energy savings)' },
    ],
    features: [
      { icon: '○', title: '6-Seat Social Round Design', body: 'Everyone sits face-to-face in the circular arrangement — no bad seat, no hierarchy, built for real connection.' },
      { icon: '◎', title: 'Signature Round Aesthetic', body: 'The ⌀81″ round form is unmistakable — a genuine design statement that elevates any outdoor space.' },
      { icon: '✦', title: '21 Perimeter Jets', body: '21 jets positioned around the perimeter deliver equal hydrotherapy coverage to all 6 seated positions simultaneously.' },
      { icon: '≈', title: 'Seamless Circular Shell', body: 'Round form cast as a single HDPE piece — no seams at the curves, no weak points, complete structural integrity.' },
      { icon: '⊕', title: 'Balboa Controls', body: 'Industry-standard control system with optional Wi-Fi upgrade — manage temperature and jets from your phone.' },
      { icon: '⛨', title: 'Entry Steps', body: 'Includes entry steps for easy access — because every soak should start and end comfortably.' },
    ],
    faqs: [
      { q: 'What are the dimensions of the CR3?', a: 'The CR3 is 80″ × 80″ × 32″ (203 × 203 × 81 cm). Its round footprint is comparable in area to the CR2\'s square, making it suitable for most standard patio and deck installations.' },
      { q: 'How are jets positioned in a round spa?', a: 'The CR3\'s 21 jets are positioned around the perimeter, delivering targeted hydrotherapy to all 6 seated positions simultaneously. Every seat receives equal coverage — one of the primary advantages of the round design over square spas where corner seats can have fewer jets.' },
      { q: 'Is the CR3 harder to maintain than a square spa?', a: 'No. The CR3 uses the same rotomold HDPE construction, Balboa controls, and weir top-mount skim filter as the CR1 and CR2. Maintenance is identical regardless of shape. The round insulated cover is purpose-fit for the CR3\'s circular form.' },
    ],
    compareWith: ['cr1', 'cr2'],
    image: '/images/cr3-hero.jpg',
    model: '/models/cr3.glb',
    metaTitle: 'CR3 Hot Tub — 6-Person Round Rotomold Spa | California Cooperage',
    metaDescription: 'The CR3 is California Cooperage\'s 6-person round rotomold spa — 21 jets, Balboa controls, 3KW heater, ⌀81″ × 32″ circular footprint. The most social spa in the lineup.',
  },
};

export const HOME_FAQS = [
  { q: 'What is a rotomolded hot tub?', a: 'Rotomolded hot tubs are made by pouring HDPE polyethylene resin into a mold, heating it, and spinning it so the resin coats the inside evenly — producing a seamless, one-piece shell that is lightweight, UV-resistant, freeze-resistant, and virtually indestructible. All California Cooperage spas use this construction.' },
  { q: 'Do these spas use Balboa controls?', a: 'Yes. All three models use Balboa control systems — the industry standard found in mid-range and premium acrylic spas worldwide. Optional Wi-Fi connectivity is available as an upgrade on all models.' },
  { q: 'Do I need an electrician to install?', a: 'All California Cooperage spas are Plug & Play — designed to operate on a standard 110V / 15 amp outlet, no electrician required. Higher-voltage configurations are also available; confirm setup with your authorized dealer.' },
  { q: 'What is the difference between the CR1, CR2, and CR3?', a: 'The CR1 is a 5-person rectangular spa (68″ × 59″ × 30″) with 14 jets. The CR2 is the flagship 7-person square spa (81″ × 81″ × 32″) with 25 jets and 2 pillows. The CR3 is the 6-person round spa (⌀81″ × 32″) with 21 jets. All share Balboa controls, 3KW heater, 2HP pump, and full foam insulation.' },
];

export const WARRANTY_FAQS = [
  { q: 'What does the warranty cover?', a: 'Shell and cabinet: 3 years. Balboa controls, 3KW heater, and 2HP pump: 2 years. Authorized labor: 1 year. See your warranty certificate for complete terms and exclusions.' },
  { q: 'Does the warranty cover outdoor weather damage?', a: 'California Cooperage HDPE spas are engineered and warranted for all-weather outdoor use. The UV-stabilized shell and full foam insulation are designed for year-round operation. Damage from misuse, improper chemical treatment, or failure to follow maintenance guidelines is not covered.' },
  { q: 'How do I register my warranty?', a: 'Register within 30 days of purchase to activate full coverage. Contact your authorized California Cooperage dealer or use the contact form on this site, referencing your model, serial number, and purchase date.' },
  { q: 'Where can I get Balboa support?', a: 'Contact your authorized California Cooperage dealer. Balboa Water Group maintains an extensive service network — because Balboa is an industry-standard platform, qualified technicians are widely available in most markets.' },
];
