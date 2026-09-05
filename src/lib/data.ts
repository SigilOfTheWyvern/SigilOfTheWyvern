export const band = {
  name: "SigilOfTheWyvern",
  displayName: "Sigil Of The Wyvern",
  tagline: "A mark carved in blood. A hymn for the end.",
  established: "MMXXIV",
  genre: "Blackened Death",
  origin: "The Black Woods",
};

export const navLinks = [
  { href: "/music", label: "Music" },
  { href: "/tour", label: "Tour" },
  { href: "/store", label: "Store" },
  { href: "/media", label: "Media" },
  { href: "/band", label: "Band" },
  { href: "/contact", label: "Contact" },
] as const;

export const members = [
  {
    name: "Vesper Thorne",
    role: "Vocals",
    mark: "V",
    line: "The throat of the seal. Writes in ash and speaks in iron.",
  },
  {
    name: "Kael Voss",
    role: "Guitar",
    mark: "K",
    line: "Thorns for strings. Builds the crown one cut at a time.",
  },
  {
    name: "Iri Ashen",
    role: "Bass",
    mark: "I",
    line: "The low hymn under every rite. Holds the floor of the woods.",
  },
  {
    name: "Rook Hale",
    role: "Drums",
    mark: "R",
    line: "War-time and ritual. Counts the end until it arrives.",
  },
] as const;

export const albums = [
  {
    slug: "the-wyverns-wake",
    title: "The Wyvern's Wake",
    type: "Single",
    year: "2026",
    note: "Latest offering",
    tone: "from-blood/25 via-void to-charcoal",
    duration: "6:14",
    label: "Thorn Seal Recordings",
    summary:
      "A single long cut. No chorus for comfort — only the wake, the wing, and the last red note.",
    tracks: [
      { title: "The Wyvern's Wake", duration: "6:14", featured: true },
    ],
    lyrics: `Under a crown of thorn and iron
the lesser beast remembers its name.
Not dragon. Not servant.
A sigil burned into the rain.

Wake, and keep the mark.
Wake, and spend the blood.
Wake, until the woods go quiet
and the hymn is understood.`,
  },
  {
    slug: "thorn-crown",
    title: "Thorn Crown",
    type: "Full Length",
    year: "2025",
    note: "The first testament",
    tone: "from-steel/50 via-void to-blood/15",
    duration: "41:08",
    label: "Thorn Seal Recordings",
    summary:
      "Nine rites. A crown that cuts the wearer. The record that named the tour and the color of the seal.",
    tracks: [
      { title: "Procession of Ash", duration: "2:11", featured: false },
      { title: "Thorn Crown", duration: "5:02", featured: true },
      { title: "Two-Legged God", duration: "4:41", featured: false },
      { title: "Black Woods Litany", duration: "6:18", featured: false },
      { title: "Lesser Than Kings", duration: "4:09", featured: false },
      { title: "Red Seal", duration: "3:54", featured: false },
      { title: "Wing and Ruin", duration: "5:27", featured: false },
      { title: "The Court Is Dust", duration: "4:33", featured: false },
      { title: "Hymn for the End", duration: "4:53", featured: false },
    ],
    lyrics: `Set the thorn against the brow.
If it draws, the rite is true.
If it sings, the woods will answer.
If it breaks, it breaks on you.`,
  },
  {
    slug: "sigil",
    title: "Sigil",
    type: "EP",
    year: "2024",
    note: "The first wound",
    tone: "from-charcoal via-void to-steel/60",
    duration: "18:40",
    label: "Independent",
    summary:
      "Four first cuts. Rawer, closer, the wound before the crown. This is where the name was taken.",
    tracks: [
      { title: "Mark", duration: "3:48", featured: false },
      { title: "Sigil", duration: "5:16", featured: true },
      { title: "Of the Lesser Fire", duration: "4:29", featured: false },
      { title: "Wyvern", duration: "5:07", featured: false },
    ],
    lyrics: `Carve it once.
Carry it always.
If they ask the name,
give them the wound.`,
  },
] as const;

export const shows = [
  {
    date: "Oct 18, 2026",
    iso: "2026-10-18",
    city: "Los Angeles, CA",
    venue: "The Wiltern",
    status: "On Sale" as const,
    support: "Ash Procession",
  },
  {
    date: "Oct 22, 2026",
    iso: "2026-10-22",
    city: "Denver, CO",
    venue: "Ogden Theatre",
    status: "On Sale" as const,
    support: "Ash Procession",
  },
  {
    date: "Oct 28, 2026",
    iso: "2026-10-28",
    city: "Chicago, IL",
    venue: "Metro",
    status: "Sold Out" as const,
    support: "Ash Procession",
  },
  {
    date: "Nov 04, 2026",
    iso: "2026-11-04",
    city: "Brooklyn, NY",
    venue: "Warsaw",
    status: "On Sale" as const,
    support: "Red Litany",
  },
  {
    date: "Nov 12, 2026",
    iso: "2026-11-12",
    city: "London, UK",
    venue: "Electric Ballroom",
    status: "On Sale" as const,
    support: "Red Litany",
  },
  {
    date: "Nov 16, 2026",
    iso: "2026-11-16",
    city: "Berlin, DE",
    venue: "SO36",
    status: "On Sale" as const,
    support: "Red Litany",
  },
  {
    date: "Nov 21, 2026",
    iso: "2026-11-21",
    city: "Paris, FR",
    venue: "La Maroquinerie",
    status: "On Sale" as const,
    support: "Red Litany",
  },
];

export const pastShows = [
  { date: "Mar 02, 2026", city: "Portland, OR", venue: "Dante's" },
  { date: "Mar 06, 2026", city: "Seattle, WA", venue: "El Corazon" },
  { date: "Mar 14, 2026", city: "San Francisco, CA", venue: "Bottom of the Hill" },
] as const;

export const products = [
  {
    slug: "blood-sigil-tee",
    name: "Blood Sigil Tee",
    price: 38,
    kind: "Apparel",
    fabric: "Heavyweight cotton",
    blurb: "The seal, front and center, printed in blood red on black.",
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    slug: "thorn-crown-hoodie",
    name: "Thorn Crown Hoodie",
    price: 72,
    kind: "Apparel",
    fabric: "Fleece, 400gsm",
    blurb: "A hood for the woods. Crown mark on the chest, thorns on the sleeve.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    slug: "bone-longsleeve",
    name: "Bone Longsleeve",
    price: 48,
    kind: "Apparel",
    fabric: "Garment-dyed cotton",
    blurb: "Bone ink on charcoal. For the long nights between rites.",
    sizes: ["S", "M", "L", "XL"],
  },
  {
    slug: "ash-beanie",
    name: "Ash Beanie",
    price: 26,
    kind: "Apparel",
    fabric: "Rib knit",
    blurb: "Small embroidered wyvern. Grey wool, no noise.",
    sizes: ["One Size"],
  },
  {
    slug: "thorn-crown-vinyl",
    name: "Thorn Crown Vinyl",
    price: 34,
    kind: "Vinyl",
    fabric: "180g black press",
    blurb: "The first testament. Gatefold, red foil, lyric sheet.",
    sizes: ["12\""],
  },
  {
    slug: "sigil-cassette",
    name: "Sigil Cassette",
    price: 14,
    kind: "Audio",
    fabric: "Chrome tape",
    blurb: "The first wound, as it was meant to be carried.",
    sizes: ["CS"],
  },
  {
    slug: "tour-poster",
    name: "Thorn Crown Tour Poster",
    price: 22,
    kind: "Print",
    fabric: "18 x 24 archival",
    blurb: "MMXXVI dates. Numbered. Built to hang in the dark.",
    sizes: ["18x24"],
  },
  {
    slug: "wyvern-patch-set",
    name: "Wyvern Patch Set",
    price: 16,
    kind: "Relic",
    fabric: "Woven + iron-on",
    blurb: "Three marks. Jacket, bag, or altar cloth.",
    sizes: ["Set of 3"],
  },
] as const;

export const videos = [
  {
    slug: "the-wyverns-wake",
    title: "The Wyvern's Wake",
    kind: "Official Video",
    year: "2026",
    length: "6:18",
    note: "Shot in the black woods. No faces. Only the seal.",
  },
  {
    slug: "thorn-crown-live",
    title: "Thorn Crown — Live in Chicago",
    kind: "Live",
    year: "2025",
    length: "5:11",
    note: "Metro, first night the crown sold the room out.",
  },
  {
    slug: "sigil-visualizer",
    title: "Sigil",
    kind: "Visualizer",
    year: "2024",
    length: "5:16",
    note: "The wound, rendered as a single turning mark.",
  },
  {
    slug: "red-seal-rehearsal",
    title: "Red Seal — Rehearsal Tape",
    kind: "Rehearsal",
    year: "2025",
    length: "4:02",
    note: "Four voices, one room, no audience.",
  },
] as const;

export const photos = [
  { caption: "The seal, stage left", place: "Brooklyn" },
  { caption: "Crown lights", place: "London" },
  { caption: "Ash in the rafters", place: "Chicago" },
  { caption: "Two legs, two wings", place: "Berlin" },
  { caption: "Red on black", place: "Los Angeles" },
  { caption: "After the hymn", place: "Portland" },
] as const;

export const news = [
  {
    slug: "thorn-crown-tour",
    date: "Aug 12, 2026",
    title: "Thorn Crown Tour — North America and Europe",
    excerpt:
      "The rites are set. Los Angeles to Paris. Support from Ash Procession and Red Litany.",
    body: "The Thorn Crown tour opens October 18 at The Wiltern. Chicago is already gone. VIP early entry and a numbered print are available on the remaining dates. The woods travel with us.",
  },
  {
    slug: "wyverns-wake-out-now",
    date: "Jul 01, 2026",
    title: "New single: The Wyvern's Wake",
    excerpt:
      "One cut. Six minutes. The first new blood since the full length.",
    body: "The Wyvern's Wake is out now on all platforms and as a limited bone-and-red 7 inch from the store. A visual film follows. This is not a preview of the next record. It is a mark of its own.",
  },
  {
    slug: "vinyl-second-press",
    date: "Feb 19, 2026",
    title: "Thorn Crown second press",
    excerpt:
      "Black 180g, red foil restored. The first press is gone.",
    body: "The second press of Thorn Crown is in the store. Same gatefold, same lyric sheet, new foil run. If you missed the first wound on wax, this is the hour.",
  },
] as const;

export const platforms = [
  { name: "Spotify", href: "/music" },
  { name: "Bandcamp", href: "/store" },
  { name: "Apple Music", href: "/music" },
  { name: "YouTube", href: "/media" },
] as const;

export function formatPrice(value: number) {
  return `$${value}`;
}

export function getAlbum(slug: string) {
  return albums.find((album) => album.slug === slug);
}

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getNews(slug: string) {
  return news.find((item) => item.slug === slug);
}

export function getNextShow() {
  return shows[0];
}
