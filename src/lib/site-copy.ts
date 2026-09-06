export const HOME_FIELDS = [
  { key: "site.name", label: "Site name", hint: "Shown in the header, footer, and homepage title." },
  { key: "home.year", label: "Established", hint: "Top line on the homepage, left of genre." },
  { key: "home.genre", label: "Genre", hint: "Top line on the homepage, right of year." },
  { key: "home.tagline", label: "Hero tagline", hint: "The line under the logo on the main page." },
  { key: "home.listenLabel", label: "Listen button", hint: "Red button on the homepage." },
  { key: "home.tourLabel", label: "Tour button", hint: "Second button on the homepage." },
  { key: "home.latestKicker", label: "Latest offering label", hint: "Small line above the newest album." },
  { key: "home.nextKicker", label: "Next date label", hint: "Small line above the next show." },
  { key: "home.newsKicker", label: "News strip label", hint: "Small line above the latest article." },
  { key: "home.allNews", label: "All news button", hint: "Button on the homepage news strip." },
  { key: "home.musicCopy", label: "Music card", hint: "Third-row Music card on the homepage." },
  { key: "home.mediaCopy", label: "Media card", hint: "Third-row Media card on the homepage." },
  { key: "home.storeCopy", label: "Store card", hint: "Third-row Store card on the homepage." },
  { key: "music.intro", label: "Music page intro", hint: "Paragraph at the top of /music." },
  { key: "music.spotify", label: "Spotify link", hint: "Full https link. Leave blank to hide." },
  { key: "music.bandcamp", label: "Bandcamp link", hint: "Full https link. Leave blank to hide." },
  { key: "music.apple", label: "Apple Music link", hint: "Full https link. Leave blank to hide." },
  { key: "music.youtube", label: "YouTube link", hint: "Full https link. Leave blank to hide." },
  { key: "tour.kicker", label: "Tour page label", hint: "Small line above the tour title." },
  { key: "tour.headline", label: "Tour headline", hint: "Large title on the public tour page." },
  { key: "tour.past", label: "Past dates label", hint: "Heading above old dates." },
  { key: "store.kicker", label: "Store page label", hint: "Small line above the store title." },
  { key: "store.intro", label: "Store page intro", hint: "Short line on the store page." },
  { key: "media.kicker", label: "Media page label", hint: "Small line above the media title." },
  { key: "band.kicker", label: "Band page label", hint: "Small line above the band title." },
  { key: "band.headline", label: "Band headline", hint: "Large title on the Band page." },
  { key: "band.lead", label: "Band lead", hint: "First paragraph on the Band page." },
  { key: "band.body", label: "Band body", hint: "Second paragraph on the Band page." },
  { key: "news.kicker", label: "News page label", hint: "Small line above the news title." },
  { key: "news.intro", label: "News page intro", hint: "Optional paragraph under the news title." },
  { key: "contact.kicker", label: "Contact page label", hint: "Small line above the contact title." },
  { key: "contact.intro", label: "Contact intro", hint: "Paragraph on the contact page." },
  { key: "contact.booking", label: "Booking email", hint: "Shown on the contact page." },
  { key: "contact.press", label: "Press email", hint: "Shown on the contact page." },
  { key: "contact.origin", label: "Origin", hint: "Shown on the contact page if you want a location line." },
  { key: "contact.pressKit", label: "Press kit note", hint: "Optional note on the contact page. Leave blank to hide." },
  { key: "contact.mailingIntro", label: "Mailing list line", hint: "Short line above the email box." },
  { key: "contact.title", label: "Contact title", hint: "Large title on the contact page." },
  { key: "music.title", label: "Music title", hint: "Large title on the music page." },
  { key: "media.title", label: "Media title", hint: "Large title on the media page." },
  { key: "news.title", label: "News title", hint: "Large title on the news page." },
  { key: "store.title", label: "Store title", hint: "Large title on the store page." },
  { key: "nav.music", label: "Nav · Music", hint: "Header and footer label." },
  { key: "nav.tour", label: "Nav · Tour", hint: "Header and footer label." },
  { key: "nav.store", label: "Nav · Store", hint: "Header and footer label." },
  { key: "nav.media", label: "Nav · Media", hint: "Header and footer label." },
  { key: "nav.band", label: "Nav · Band", hint: "Header and footer label." },
  { key: "nav.news", label: "Nav · News", hint: "Header and footer label." },
  { key: "nav.contact", label: "Nav · Contact", hint: "Header and footer label." },
  { key: "nav.hidden", label: "Hidden nav paths", hint: "Comma-separated paths to hide, like /news,/store." },
  { key: "seo.description", label: "SEO description", hint: "Search and social description for the site." },
  { key: "footer.more", label: "Footer more heading", hint: "Heading above News and Booking links." },
  { key: "footer.blurb", label: "Footer line", hint: "Small paragraph in the site footer." },
  { key: "social.instagram", label: "Instagram", hint: "Full https link. Leave blank to hide." },
  { key: "social.facebook", label: "Facebook", hint: "Full https link. Leave blank to hide." },
  { key: "social.youtube", label: "YouTube", hint: "Full https link. Leave blank to hide." },
  { key: "social.tiktok", label: "TikTok", hint: "Full https link. Leave blank to hide." },
  { key: "social.bandcamp", label: "Bandcamp social", hint: "Full https link. Leave blank to hide." },
  { key: "social.spotify", label: "Spotify social", hint: "Full https link. Leave blank to hide." },
  { key: "home.sponsors", label: "Sponsors", hint: "One name per line. Leave blank to hide the homepage block." },
  { key: "home.testimonials", label: "Testimonials", hint: "One quote per line. Leave blank to hide the homepage block." },
  { key: "fan.vault", label: "Fan vault note", hint: "Private copy inside the fan hall." },
] as const;

export const SITE_SECTIONS = [
  {
    id: "home",
    label: "Homepage",
    hint: "Logo, tagline, buttons, and cards on the main page.",
    keys: [
      "site.name",
      "home.year",
      "home.genre",
      "home.tagline",
      "home.listenLabel",
      "home.tourLabel",
      "home.latestKicker",
      "home.nextKicker",
      "home.newsKicker",
      "home.allNews",
      "home.musicCopy",
      "home.mediaCopy",
      "home.storeCopy",
      "home.sponsors",
      "home.testimonials",
    ],
  },
  {
    id: "music",
    label: "Music page",
    hint: "Intro and platform links on /music.",
    keys: ["music.title", "music.intro", "music.spotify", "music.bandcamp", "music.apple", "music.youtube"],
  },
  {
    id: "tour",
    label: "Tour page",
    hint: "Headings on /tour. Dates themselves are edited under Tour.",
    keys: ["tour.kicker", "tour.headline", "tour.past"],
  },
  {
    id: "store",
    label: "Store page",
    hint: "Headings on /store. Relics themselves are edited under Merch.",
    keys: ["store.title", "store.kicker", "store.intro"],
  },
  {
    id: "media",
    label: "Media page",
    hint: "Heading on /media. Photos and films are edited under Media.",
    keys: ["media.title", "media.kicker"],
  },
  {
    id: "band",
    label: "Band page",
    hint: "Story on /band. Members are edited under Band.",
    keys: ["band.kicker", "band.headline", "band.lead", "band.body"],
  },
  {
    id: "news",
    label: "News page",
    hint: "Heading on /news. Articles are edited under News.",
    keys: ["news.title", "news.kicker", "news.intro"],
  },
  {
    id: "contact",
    label: "Contact page",
    hint: "Copy and emails on /contact.",
    keys: [
      "contact.title",
      "contact.kicker",
      "contact.intro",
      "contact.booking",
      "contact.press",
      "contact.origin",
      "contact.pressKit",
      "contact.mailingIntro",
    ],
  },
  {
    id: "nav",
    label: "Navigation",
    hint: "Header and footer labels. Hide a page by adding its path to Hidden nav paths.",
    keys: ["nav.music", "nav.tour", "nav.store", "nav.media", "nav.band", "nav.news", "nav.contact", "nav.hidden"],
  },
  {
    id: "seo",
    label: "SEO",
    hint: "The description search engines and shares use.",
    keys: ["seo.description"],
  },
  {
    id: "footer",
    label: "Footer",
    hint: "The line under the band name at the bottom of every public page.",
    keys: ["footer.blurb", "footer.more"],
  },
  {
    id: "social",
    label: "Social links",
    hint: "Shown in the footer when a full https link is saved.",
    keys: [
      "social.instagram",
      "social.facebook",
      "social.youtube",
      "social.tiktok",
      "social.bandcamp",
      "social.spotify",
    ],
  },
  {
    id: "hall",
    label: "Fan hall",
    hint: "Private copy inside the fan vault.",
    keys: ["fan.vault"],
  },
] as const;

const LONG_KEYS = new Set([
  "home.tagline",
  "home.musicCopy",
  "home.mediaCopy",
  "home.storeCopy",
  "music.intro",
  "store.intro",
  "band.lead",
  "band.body",
  "news.intro",
  "contact.intro",
  "contact.pressKit",
  "contact.mailingIntro",
  "footer.blurb",
  "home.sponsors",
  "home.testimonials",
  "fan.vault",
]);

export function isLongSetting(key: string) {
  return LONG_KEYS.has(key) || key.endsWith("body") || key.endsWith("lead") || key.endsWith("Copy") || key.endsWith("intro") || key.endsWith("blurb");
}

export function fieldByKey(key: string) {
  return HOME_FIELDS.find((field) => field.key === key);
}

export function setting(settings: Record<string, string>, key: string, fallback = "") {
  const value = settings[key]?.trim();
  return value || fallback;
}

export function musicPlatforms(settings: Record<string, string>) {
  return [
    { name: "Spotify", href: settings["music.spotify"]?.trim() ?? "" },
    { name: "Bandcamp", href: settings["music.bandcamp"]?.trim() ?? "" },
    { name: "Apple Music", href: settings["music.apple"]?.trim() ?? "" },
    { name: "YouTube", href: settings["music.youtube"]?.trim() ?? "" },
  ].filter((platform) => platform.href);
}

export function socialLinks(settings: Record<string, string>) {
  return [
    { name: "Instagram", href: settings["social.instagram"]?.trim() ?? "" },
    { name: "Facebook", href: settings["social.facebook"]?.trim() ?? "" },
    { name: "YouTube", href: settings["social.youtube"]?.trim() ?? "" },
    { name: "TikTok", href: settings["social.tiktok"]?.trim() ?? "" },
    { name: "Bandcamp", href: settings["social.bandcamp"]?.trim() ?? "" },
    { name: "Spotify", href: settings["social.spotify"]?.trim() ?? "" },
  ].filter((link) => link.href.startsWith("https://"));
}

export function settingLines(settings: Record<string, string>, key: string) {
  return setting(settings, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}
