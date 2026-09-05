import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ALL_RESOURCES = [
  "studio",
  "analytics",
  "pages",
  "music",
  "merch",
  "tickets",
  "tour",
  "news",
  "media",
  "band",
  "users",
  "roles",
  "orders",
  "cms",
  "settings",
  "audit",
  "inbox",
  "fan",
];
const ALL_ACTIONS = [
  "view",
  "create",
  "edit",
  "delete",
  "publish",
  "upload",
  "reorder",
  "manage",
];

function pairs(resource: string, actions: string[]) {
  return actions.map((action) => ({ resource, action }));
}

async function main() {
  await prisma.rolePermission.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.mediaAsset.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.ticketType.deleteMany();
  await prisma.event.deleteMany();
  await prisma.track.deleteMany();
  await prisma.album.deleteMany();
  await prisma.newsArticle.deleteMany();
  await prisma.bandMember.deleteMany();
  await prisma.video.deleteMany();
  await prisma.photo.deleteMany();
  await prisma.pageSection.deleteMany();
  await prisma.sitePage.deleteMany();
  await prisma.siteSetting.deleteMany();

  const roleDefs = [
    {
      name: "Founder",
      slug: "founder",
      description: "Founder of the mark. Full control.",
      perms: ALL_RESOURCES.flatMap((resource) => pairs(resource, ALL_ACTIONS)),
    },
    {
      name: "Super Admin",
      slug: "super-admin",
      description: "Full control of the seal.",
      perms: ALL_RESOURCES.flatMap((resource) => pairs(resource, ALL_ACTIONS)),
    },
    {
      name: "Developer",
      slug: "developer",
      description: "Builder of the seal. Same doors as Founder.",
      perms: ALL_RESOURCES.flatMap((resource) => pairs(resource, ALL_ACTIONS)),
    },
    {
      name: "Band Owner",
      slug: "band-owner",
      description: "Owner of the mark. Almost all doors open.",
      perms: ALL_RESOURCES.flatMap((resource) =>
        pairs(resource, ALL_ACTIONS.filter((action) => action !== "manage" || resource !== "roles")),
      ),
    },
    {
      name: "Manager",
      slug: "manager",
      description: "Runs the house. Users and content, not role law.",
      perms: [
        ...pairs("studio", ["view", "manage"]),
        ...["pages", "music", "merch", "tickets", "tour", "news", "media", "band", "orders", "users", "cms"].flatMap(
          (resource) => pairs(resource, ALL_ACTIONS),
        ),
        ...pairs("audit", ["view"]),
        ...pairs("fan", ["view"]),
      ],
    },
    {
      name: "Content Manager",
      slug: "content-manager",
      description: "Pages, news, media. Merch view only. No tickets.",
      perms: [
        ...pairs("studio", ["view"]),
        ...pairs("pages", ["view", "edit", "upload", "reorder", "publish"]),
        ...pairs("news", ALL_ACTIONS),
        ...pairs("media", ALL_ACTIONS),
        ...pairs("music", ALL_ACTIONS),
        ...pairs("band", ["view", "edit", "upload"]),
        ...pairs("cms", ["view", "edit", "publish"]),
        ...pairs("merch", ["view"]),
      ],
    },
    {
      name: "Merch Manager",
      slug: "merch-manager",
      description: "Relics, inventory, orders.",
      perms: [
        ...pairs("studio", ["view"]),
        ...pairs("merch", ALL_ACTIONS),
        ...pairs("orders", ["view", "edit", "manage"]),
        ...pairs("media", ["view", "upload"]),
      ],
    },
    {
      name: "Tour Manager",
      slug: "tour-manager",
      description: "Dates, ticket types, inventory.",
      perms: [
        ...pairs("studio", ["view"]),
        ...pairs("tour", ALL_ACTIONS),
        ...pairs("tickets", ALL_ACTIONS),
        ...pairs("orders", ["view"]),
      ],
    },
    {
      name: "Editor",
      slug: "editor",
      description: "Drafts and edits. Cannot publish or delete.",
      perms: [
        ...pairs("studio", ["view"]),
        ...["pages", "news", "music", "band", "media"].flatMap((resource) =>
          pairs(resource, ["view", "create", "edit"]),
        ),
      ],
    },
    {
      name: "Band Member",
      slug: "band-member",
      description: "Sees the house. Edits the band page.",
      perms: [
        ...pairs("studio", ["view"]),
        ...pairs("band", ["view", "edit"]),
        ...pairs("music", ["view"]),
        ...pairs("tour", ["view"]),
        ...pairs("media", ["view"]),
        ...pairs("news", ["view"]),
      ],
    },
    {
      name: "Fan",
      slug: "fan",
      description: "The rite of the crowd.",
      perms: [...pairs("fan", ["view", "edit"]), ...pairs("orders", ["view"]), ...pairs("tickets", ["view"])],
    },
  ];

  const roles = new Map<string, string>();
  for (const def of roleDefs) {
    const role = await prisma.role.create({
      data: {
        name: def.name,
        slug: def.slug,
        description: def.description,
        isSystem: true,
        permissions: { create: def.perms },
      },
    });
    roles.set(def.slug, role.id);
  }

  const products = [
    ["blood-sigil-tee", "Blood Sigil Tee", "Apparel", "Heavyweight cotton", "The seal, front and center, printed in blood red on black.", 3800, ["S", "M", "L", "XL", "XXL"]],
    ["thorn-crown-hoodie", "Thorn Crown Hoodie", "Apparel", "Fleece, 400gsm", "A hood for the woods. Crown mark on the chest, thorns on the sleeve.", 7200, ["S", "M", "L", "XL"]],
    ["bone-longsleeve", "Bone Longsleeve", "Apparel", "Garment-dyed cotton", "Bone ink on charcoal. For the long nights between rites.", 4800, ["S", "M", "L", "XL"]],
    ["ash-beanie", "Ash Beanie", "Apparel", "Rib knit", "Small embroidered wyvern. Grey wool, no noise.", 2600, ["One Size"]],
    ["thorn-crown-vinyl", "Thorn Crown Vinyl", "Vinyl", "180g black press", "The first testament. Gatefold, red foil, lyric sheet.", 3400, ['12"']],
    ["sigil-cassette", "Sigil Cassette", "Audio", "Chrome tape", "The first wound, as it was meant to be carried.", 1400, ["CS"]],
    ["tour-poster", "Thorn Crown Tour Poster", "Print", "18 x 24 archival", "MMXXVI dates. Numbered. Built to hang in the dark.", 2200, ["18x24"]],
    ["wyvern-patch-set", "Wyvern Patch Set", "Relic", "Woven + iron-on", "Three marks. Jacket, bag, or altar cloth.", 1600, ["Set of 3"]],
  ] as const;

  for (const [slug, name, kind, fabric, blurb, priceCents, sizes] of products) {
    await prisma.product.create({
      data: {
        slug,
        name,
        kind,
        fabric,
        blurb,
        priceCents,
        imagePath: "/logo.png",
        status: "published",
        variants: {
          create: sizes.map((size) => ({
            size,
            sku: `${slug}-${size.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
            inventory: slug.includes("vinyl") ? 40 : 80,
          })),
        },
      },
    });
  }

  const shows = [
    ["2026-10-18", "Los Angeles, CA", "The Wiltern", "Ash Procession", "on_sale"],
    ["2026-10-22", "Denver, CO", "Ogden Theatre", "Ash Procession", "on_sale"],
    ["2026-10-28", "Chicago, IL", "Metro", "Ash Procession", "sold_out"],
    ["2026-11-04", "Brooklyn, NY", "Warsaw", "Red Litany", "on_sale"],
    ["2026-11-12", "London, UK", "Electric Ballroom", "Red Litany", "on_sale"],
    ["2026-11-16", "Berlin, DE", "SO36", "Red Litany", "on_sale"],
    ["2026-11-21", "Paris, FR", "La Maroquinerie", "Red Litany", "on_sale"],
    ["2026-03-02", "Portland, OR", "Dante's", null, "past"],
    ["2026-03-06", "Seattle, WA", "El Corazon", null, "past"],
    ["2026-03-14", "San Francisco, CA", "Bottom of the Hill", null, "past"],
  ] as const;

  for (const [date, city, venue, support, status] of shows) {
    await prisma.event.create({
      data: {
        date: new Date(`${date}T20:00:00.000Z`),
        city,
        venue,
        support,
        status,
        published: true,
        ticketTypes:
          status === "past"
            ? undefined
            : {
                create: [
                  { name: "General", priceCents: 4500, inventory: status === "sold_out" ? 0 : 120 },
                  { name: "VIP", priceCents: 9500, inventory: status === "sold_out" ? 0 : 24 },
                ],
              },
      },
    });
  }

  await prisma.album.create({
    data: {
      slug: "the-wyverns-wake",
      title: "The Wyvern's Wake",
      type: "Single",
      year: "2026",
      note: "Latest offering",
      tone: "from-blood/25 via-void to-charcoal",
      duration: "6:14",
      label: "Thorn Seal Recordings",
      summary: "A single long cut. No chorus for comfort — only the wake, the wing, and the last red note.",
      lyrics: "Under a crown of thorn and iron\nthe lesser beast remembers its name.",
      tracks: { create: [{ title: "The Wyvern's Wake", duration: "6:14", featured: true, sort: 1 }] },
    },
  });
  await prisma.album.create({
    data: {
      slug: "thorn-crown",
      title: "Thorn Crown",
      type: "Full Length",
      year: "2025",
      note: "The first testament",
      tone: "from-steel/50 via-void to-blood/15",
      duration: "41:08",
      label: "Thorn Seal Recordings",
      summary: "Nine rites. A crown that cuts the wearer.",
      lyrics: "Set the thorn against the brow.\nIf it draws, the rite is true.",
      tracks: {
        create: [
          { title: "Procession of Ash", duration: "2:11", sort: 1 },
          { title: "Thorn Crown", duration: "5:02", featured: true, sort: 2 },
          { title: "Two-Legged God", duration: "4:41", sort: 3 },
          { title: "Black Woods Litany", duration: "6:18", sort: 4 },
          { title: "Lesser Than Kings", duration: "4:09", sort: 5 },
          { title: "Red Seal", duration: "3:54", sort: 6 },
          { title: "Wing and Ruin", duration: "5:27", sort: 7 },
          { title: "The Court Is Dust", duration: "4:33", sort: 8 },
          { title: "Hymn for the End", duration: "4:53", sort: 9 },
        ],
      },
    },
  });
  await prisma.album.create({
    data: {
      slug: "sigil",
      title: "Sigil",
      type: "EP",
      year: "2024",
      note: "The first wound",
      tone: "from-charcoal via-void to-steel/60",
      duration: "18:40",
      label: "Independent",
      summary: "Four first cuts. This is where the name was taken.",
      lyrics: "Carve it once.\nCarry it always.",
      tracks: {
        create: [
          { title: "Mark", duration: "3:48", sort: 1 },
          { title: "Sigil", duration: "5:16", featured: true, sort: 2 },
          { title: "Of the Lesser Fire", duration: "4:29", sort: 3 },
          { title: "Wyvern", duration: "5:07", sort: 4 },
        ],
      },
    },
  });

  await prisma.newsArticle.createMany({
    data: [
      {
        slug: "thorn-crown-tour",
        date: "Aug 12, 2026",
        title: "Thorn Crown Tour — North America and Europe",
        excerpt: "The rites are set. Los Angeles to Paris.",
        body: "The Thorn Crown tour opens October 18 at The Wiltern. Chicago is already gone.",
      },
      {
        slug: "wyverns-wake-out-now",
        date: "Jul 01, 2026",
        title: "New single: The Wyvern's Wake",
        excerpt: "One cut. Six minutes. The first new blood since the full length.",
        body: "The Wyvern's Wake is out now. A visual film follows.",
      },
      {
        slug: "vinyl-second-press",
        date: "Feb 19, 2026",
        title: "Thorn Crown second press",
        excerpt: "Black 180g, red foil restored.",
        body: "The second press of Thorn Crown is in the store.",
      },
    ],
  });

  await prisma.bandMember.createMany({
    data: [
      { name: "Vesper Thorne", role: "Vocals", mark: "V", line: "The throat of the seal.", sort: 1 },
      { name: "Kael Voss", role: "Guitar", mark: "K", line: "Thorns for strings.", sort: 2 },
      { name: "Iri Ashen", role: "Bass", mark: "I", line: "The low hymn under every rite.", sort: 3 },
      { name: "Rook Hale", role: "Drums", mark: "R", line: "War-time and ritual.", sort: 4 },
    ],
  });

  await prisma.video.createMany({
    data: [
      { slug: "the-wyverns-wake", title: "The Wyvern's Wake", kind: "Official Video", year: "2026", length: "6:18", note: "Shot in the black woods." },
      { slug: "thorn-crown-live", title: "Thorn Crown — Live in Chicago", kind: "Live", year: "2025", length: "5:11", note: "Metro, first sold-out night." },
      { slug: "sigil-visualizer", title: "Sigil", kind: "Visualizer", year: "2024", length: "5:16", note: "The wound, turning." },
    ],
  });

  await prisma.photo.createMany({
    data: [
      { caption: "The seal, stage left", place: "Brooklyn" },
      { caption: "Crown lights", place: "London" },
      { caption: "Ash in the rafters", place: "Chicago" },
      { caption: "Two legs, two wings", place: "Berlin" },
    ],
  });

  await prisma.sitePage.create({
    data: {
      slug: "home",
      title: "Home",
      status: "published",
      sections: {
        create: [
          {
            sort: 1,
            type: "banner",
            heading: "A mark carved in blood.",
            body: "The official home of SigilOfTheWyvern.",
            buttonLabel: "Listen",
            buttonHref: "/music",
            background: "void",
            published: true,
          },
        ],
      },
    },
  });

  await prisma.siteSetting.createMany({
    data: [
      { key: "home.tagline", value: "A mark carved in blood. A hymn for the end." },
      { key: "tour.headline", value: "Thorn Crown MMXXVI" },
      { key: "fan.vault", value: "Fan-only cut: rehearsal of Red Seal, unmixed. The woods stay closed to the uninitiated." },
    ],
  });

  console.log("Seeded catalog and roles. No logins were created.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
