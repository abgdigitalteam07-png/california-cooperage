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
  metaTitle: string;
  metaDescription: string;
}

export const PRODUCTS: Record<ProductKey, Product> = {
  cr1: {
    key: 'cr1',
    slug: 'cr1-hot-tub',
    modelCode: 'RTO1700MD',
    name: 'CR1',
    subtitle: 'The Classic',
    tagline: 'Five Seats. California Roots. Weekend-Ready.',
    label: 'Model CR1 · RTO1700MD',
    shape: 'Rectangular',
    seats: 5,
    jets: 14,
    badge: '5 Person · Rectangular',
    description: '5-seat rectangular spa with 14 jets and Balboa controls on a compact 173×150cm footprint.',
    heroBody: 'The CR1 is the most accessible spa in the California Cooperage lineup — a 5-seat rectangular rotomold spa on a compact 173×150cm footprint, equipped with 14 jets, Balboa or SpaNet controls, a 3KW heater, and a 2HP two-speed pump. Full foam insulation and a tapered 5″–3″ cover keep operating costs low. Same California heritage. Most accessible price point.',
    specChips: ['5 Person', 'Rectangular', '14 Jets', '3KW Heater', 'Balboa / SpaNet', 'Full Foam'],
    specs: [
      { label: 'Model Code', value: 'RTO1700MD' },
      { label: 'Seating Capacity', value: '5 Persons' },
      { label: 'Shape', value: 'Rectangular' },
      { label: 'Dimensions (L × W × H)', value: '173 × 150 × 76 cm (68″ × 59″ × 30″)' },
      { label: 'Dry Weight', value: '140 kg approx (~309 lbs)' },
      { label: 'Filled Weight', value: '780 kg approx (~1,720 lbs)' },
      { label: 'Total Jets', value: '14 pcs' },
      { label: 'Control System', value: 'Balboa / SpaNet' },
      { label: 'Heater', value: '3 kW' },
      { label: 'Pump 1', value: '2 HP (2-Speed)' },
      { label: 'Lighting', value: '12V / 12W' },
      { label: 'Air Regulator', value: '1 pc' },
      { label: 'Filtration', value: 'Weir top-mount skim filter' },
      { label: 'Cabinet Material', value: 'PE and PS' },
      { label: 'Insulation', value: 'Full foam' },
      { label: 'Cover', value: 'Tapered 5″ → 3″ (max energy savings)' },
    ],
    features: [
      { icon: '⊕', title: 'Balboa / SpaNet Controls', body: 'Industry-standard control system — intuitive, reliable, and compatible with optional Wi-Fi for remote monitoring.' },
      { icon: '▦', title: '5-Person Rectangular Design', body: '173×150cm footprint seats 5 adults — a right-sized spa that fits patios and decks where larger square models won\'t.' },
      { icon: '◷', title: '3KW Heater + Full Foam', body: '3KW heater and full foam insulation work together to heat efficiently and retain temperature — lower costs, longer soaks.' },
      { icon: '✦', title: '14-Jet Hydrotherapy', body: '14 jets powered by a 2HP two-speed pump deliver targeted massage to all 5 seated positions.' },
      { icon: '≈', title: 'Seamless Rotomold Shell', body: 'One-piece LLDPE polyethylene construction — no seams, UV-resistant, freeze-rated for year-round outdoor use.' },
      { icon: '⛨', title: 'California Heritage', body: 'Manufactured to California Cooperage standards by Nantong Bestview — CE, ETL, and ISO 9000 certified since 2003.' },
    ],
    faqs: [
      { q: 'What is the exact footprint of the CR1?', a: 'The CR1 (RTO1700MD) measures 173×150×76 cm (approximately 68″×59″×30″). It has a rectangular footprint — making it an excellent fit for narrower deck spaces or patios where a 205cm square model won\'t fit.' },
      { q: 'What control system does the CR1 use?', a: 'The CR1 uses a Balboa or SpaNet control system — the same trusted platform used in mid-range and premium acrylic spas globally. Optional Wi-Fi upgrade allows remote temperature monitoring from your smartphone.' },
      { q: 'How does the CR1 compare to the CR2 and CR3?', a: 'The CR1 is the most compact and accessible — 5 seats, 14 jets, 173×150cm. The CR2 is the flagship: 7 seats, 25 jets, 205×205cm square. The CR3 is the signature round: 6 seats, 21 jets, ⌀203cm. All three share identical Balboa/SpaNet controls, 3KW heaters, 2HP pumps, and full foam insulation.' },
    ],
    compareWith: ['cr2', 'cr3'],
    image: '/images/cr1-hero.jpg',
    metaTitle: 'CR1 Hot Tub — 5-Person Rectangular Rotomold Spa | California Cooperage',
    metaDescription: 'The CR1 (RTO1700MD) is California Cooperage\'s 5-person rectangular rotomold hot tub — 14 jets, Balboa controls, 3KW heater, full foam insulation. 173×150×76cm compact footprint.',
  },
  cr2: {
    key: 'cr2',
    slug: 'cr2-hot-tub',
    modelCode: 'RTO2000MD',
    name: 'CR2',
    subtitle: 'The Entertainer',
    tagline: 'Seven Seats. The Spa that Owns the Backyard.',
    label: 'Model CR2 · RTO2000MD — Flagship',
    shape: 'Square',
    seats: 7,
    jets: 25,
    badge: '7 Person · Square — Flagship',
    description: 'Flagship 7-seat square spa with 25 jets, 2 headrest pillows, and the largest footprint in the lineup.',
    heroBody: 'The CR2 is the flagship California Cooperage spa — a full 7-seat, 205×205cm square hot tub with 25 jets, 2 headrest pillows, 2 air regulators, and a water diverter. Balboa or SpaNet controls, 3KW heater, 2HP two-speed pump, and full foam insulation deliver the complete luxury rotomold spa experience. The most substantial and fully equipped spa in the lineup.',
    specChips: ['7 Person', 'Square 205cm', '25 Jets', '2 Pillows', '3KW Heater', 'Balboa / SpaNet'],
    specs: [
      { label: 'Model Code', value: 'RTO2000MD' },
      { label: 'Seating Capacity', value: '7 Persons' },
      { label: 'Shape', value: 'Square' },
      { label: 'Dimensions (L × W × H)', value: '205 × 205 × 81 cm (81″ × 81″ × 32″)' },
      { label: 'Dry Weight', value: '441 kg approx (~972 lbs)' },
      { label: 'Filled Weight', value: '1,100 kg approx (~2,425 lbs)' },
      { label: 'Total Jets', value: '25 pcs' },
      { label: 'Headrest Pillows', value: '2 pcs (included)' },
      { label: 'Control System', value: 'Balboa / SpaNet' },
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
      { icon: '⊞', title: '7-Person Flagship Capacity', body: 'The largest spa in the lineup — 205×205cm, 7 adults, 2 headrest pillows, the most complete California Cooperage experience.' },
      { icon: '✦', title: '25-Jet Hydrotherapy', body: '25 jets with water diverter and 2 air regulators give precise control over massage intensity across all seating zones.' },
      { icon: '▦', title: 'Full Square Footprint', body: 'The 205×205cm square design maximizes seating efficiency and aligns naturally to deck and patio edges.' },
      { icon: '⊕', title: 'Balboa / SpaNet Controls', body: 'The CR2\'s Balboa or SpaNet system manages all functions with precision. Optional Wi-Fi puts control on your phone.' },
      { icon: '◷', title: '3KW + Full Foam Efficiency', body: '3KW heater and full foam shell — fast heat-up, superior retention, lower energy consumption month to month.' },
      { icon: '⛨', title: 'Built to California Standards', body: 'The culmination of 50+ years of California Cooperage quality — CE, ETL, and ISO 9000 certified.' },
    ],
    faqs: [
      { q: 'How much does the CR2 weigh when filled?', a: 'The CR2 weighs approximately 441 kg (972 lbs) dry and approximately 1,100 kg (2,425 lbs) filled. Ensure your deck or patio can support this load before installation — consult a structural engineer or contractor. Your dealer can advise on site preparation.' },
      { q: 'What makes the CR2 the flagship model?', a: 'The CR2 is the largest spa at 205×205cm with 7 seats, the most jets at 25, the most included accessories (2 pillows, 1 water diverter, 2 air regulators), and the highest capacity. It delivers the fullest rotomold spa experience in the California Cooperage lineup.' },
      { q: 'What optional upgrades are available?', a: 'All California Cooperage models support: spa entry steps, Wi-Fi connectivity module, mini LED lighting upgrade, and waterfall feature. Ask your dealer about availability and pricing.' },
    ],
    compareWith: ['cr1', 'cr3'],
    image: '/images/cr2-hero.jpg',
    metaTitle: 'CR2 Hot Tub — 7-Person Square Rotomold Spa | California Cooperage',
    metaDescription: 'The CR2 (RTO2000MD) is California Cooperage\'s flagship 7-person square rotomold spa — 25 jets, 2 headrest pillows, Balboa controls, 3KW heater. 205×205×81cm full square footprint.',
  },
  cr3: {
    key: 'cr3',
    slug: 'cr3-hot-tub',
    modelCode: 'RTO2100MD',
    name: 'CR3',
    subtitle: 'The Social',
    tagline: 'Six in the Round. No Bad Seat.',
    label: 'Model CR3 · RTO2100MD — Signature',
    shape: 'Round',
    seats: 6,
    jets: 21,
    badge: '6 Person · Round — Signature',
    description: 'Signature 6-seat round spa with 21 jets. The circular design puts everyone face-to-face.',
    heroBody: 'There\'s something different about a round hot tub. The CR3\'s circular design seats 6 adults face-to-face — no hierarchy, no corner dead zones, just conversation and relaxation. At ⌀203cm and 81cm deep, with 21 jets, Balboa or SpaNet controls, 3KW heater, and full foam insulation, the CR3 is our most distinctive spa and the one California nights were made for.',
    specChips: ['6 Person', 'Round ⌀203cm', '21 Jets', '3KW Heater', 'Balboa / SpaNet', 'Full Foam'],
    specs: [
      { label: 'Model Code', value: 'RTO2100MD' },
      { label: 'Seating Capacity', value: '6 Persons' },
      { label: 'Shape', value: 'Round / Circular' },
      { label: 'Dimensions (⌀ × H)', value: '⌀203 × 81 cm (⌀80″ × 32″)' },
      { label: 'Dry Weight', value: '240 kg approx (~529 lbs)' },
      { label: 'Filled Weight', value: '1,040 kg approx (~2,293 lbs)' },
      { label: 'Total Jets', value: '21 pcs' },
      { label: 'Control System', value: 'Balboa / SpaNet' },
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
      { icon: '◎', title: 'Signature Round Aesthetic', body: 'The ⌀203cm round form is unmistakable — a genuine design statement that elevates any outdoor space.' },
      { icon: '✦', title: '21 Perimeter Jets', body: '21 jets positioned around the perimeter deliver equal hydrotherapy coverage to all 6 seated positions simultaneously.' },
      { icon: '≈', title: 'Seamless Circular Shell', body: 'Round form cast as a single LLDPE piece — no seams at the curves, no weak points, complete structural integrity.' },
      { icon: '⊕', title: 'Balboa / SpaNet Controls', body: 'Industry-standard control system with optional Wi-Fi upgrade — manage temperature and jets from your phone.' },
      { icon: '⛨', title: '50 Years of Heritage', body: 'CE, ETL, ISO 9000 certified construction — the California Cooperage name backed by Nantong Bestview\'s 20+ year manufacturing record.' },
    ],
    faqs: [
      { q: 'What is the exact diameter of the CR3?', a: 'The CR3 (RTO2100MD) has a diameter of 203cm (approximately 80 inches) and is 81cm (32 inches) deep. Its circular footprint is comparable in area to the CR2\'s 205×205cm square, making it suitable for most standard patio and deck installations.' },
      { q: 'How are jets positioned in a round spa?', a: 'The CR3\'s 21 jets are positioned around the perimeter, delivering targeted hydrotherapy to all 6 seated positions simultaneously. Every seat receives equal coverage — one of the primary advantages of the round design over square spas where corner seats can have fewer jets.' },
      { q: 'Is the CR3 harder to maintain than a square spa?', a: 'No. The CR3 uses the same rotomold LLDPE construction, Balboa/SpaNet controls, and weir top-mount skim filter as the CR1 and CR2. Maintenance is identical regardless of shape. The round insulated cover is purpose-fit for the CR3\'s circular form.' },
    ],
    compareWith: ['cr1', 'cr2'],
    image: '/images/cr3-hero.jpg',
    metaTitle: 'CR3 Hot Tub — 6-Person Round Rotomold Spa | California Cooperage',
    metaDescription: 'The CR3 (RTO2100MD) is California Cooperage\'s signature 6-person round rotomold spa — 21 jets, Balboa controls, 3KW heater, ⌀203×81cm circular footprint. The most social spa in the lineup.',
  },
};

export const HOME_FAQS = [
  { q: 'What is a rotomolded hot tub?', a: 'Rotomolded hot tubs are made by pouring LLDPE polyethylene resin into a mold, heating it, and spinning it so the resin coats the inside evenly — producing a seamless, one-piece shell that is lightweight, UV-resistant, freeze-resistant, and virtually indestructible. All California Cooperage spas use this construction.' },
  { q: 'What control systems do California Cooperage spas use?', a: 'All three models use Balboa or SpaNet control systems — the industry standard found in mid-range and premium acrylic spas worldwide. Optional Wi-Fi connectivity is available as an upgrade on all models.' },
  { q: 'What are the electrical requirements?', a: 'All California Cooperage spas are rated 220–240V / 50Hz / 16–32A per manufacturer specification. Please consult your authorized dealer to confirm North American 110–120V / 60Hz configuration availability.' },
  { q: 'What is the difference between the CR1, CR2, and CR3?', a: 'The CR1 is a 5-person rectangular spa (173×150×76cm) with 14 jets. The CR2 is the flagship 7-person square spa (205×205×81cm) with 25 jets and 2 pillows. The CR3 is the signature 6-person round spa (⌀203×81cm) with 21 jets. All share Balboa/SpaNet controls, 3KW heater, 2HP pump, and full foam insulation.' },
  { q: 'Are California Cooperage spas certified?', a: 'Yes. Manufactured by Nantong Bestview Spa Co., Ltd., which holds CE, ETL, RoHS, SAA, and ISO 9000 certifications. Please confirm applicable certifications for your market with your dealer.' },
];

export const WARRANTY_FAQS = [
  { q: 'What does the warranty cover?', a: 'Shell and cabinet: 3 years. Balboa/SpaNet controls, 3KW heater, and 2HP pump: 2 years. Authorized labor: 1 year. See your warranty certificate for complete terms and exclusions.' },
  { q: 'Does the warranty cover outdoor weather damage?', a: 'California Cooperage LLDPE spas are engineered and warranted for all-weather outdoor use. The UV-stabilized shell and full foam insulation are designed for year-round operation. Damage from misuse, improper chemical treatment, or failure to follow maintenance guidelines is not covered.' },
  { q: 'How do I register my warranty?', a: 'Register within 30 days of purchase to activate full coverage. Contact your authorized California Cooperage dealer or use the contact form on this site, referencing your model code, serial number, and purchase date.' },
  { q: 'Where can I get Balboa/SpaNet support?', a: 'Contact your authorized California Cooperage dealer. Balboa Water Group and SpaNet maintain extensive service networks. Because these are industry-standard platforms, qualified technicians are widely available in most markets.' },
];
