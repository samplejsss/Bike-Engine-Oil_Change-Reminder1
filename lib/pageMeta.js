// Centralised per-page SEO metadata for all routes
// Used by each route's metadata.js file (separate from client page.js)

const BASE = "https://myvehiclecares.vercel.app";

export const PAGE_META = {
  dashboard: {
    title: "Dashboard",
    description: "Your BikeCare dashboard — oil change progress, total km, fuel efficiency, upcoming maintenance tasks, and monthly expenses at a glance.",
    keywords: ["bike dashboard", "oil change progress", "motorcycle health", "km tracker"],
    path: "/dashboard",
  },
  maintenance: {
    title: "Maintenance Tracker",
    description: "Track all motorcycle maintenance — oil changes, tyre checks, brake pads, chain lube, and more. Get due-date km alerts before you miss a service.",
    keywords: ["motorcycle maintenance tracker", "bike service schedule", "oil change reminder", "tyre check reminder"],
    path: "/maintenance",
  },
  fuel: {
    title: "Fuel Log & Efficiency",
    description: "Log every fuel fill-up and auto-calculate km/L efficiency over time. Spot mileage trends and reduce fuel costs for your bike.",
    keywords: ["bike fuel tracker", "km per litre", "fuel efficiency motorcycle", "petrol log"],
    path: "/fuel",
  },
  analytics: {
    title: "Ride & Expense Analytics",
    description: "Beautiful charts — riding distance, fuel efficiency trends, expense breakdown by category, and cost per km. All in one analytics view.",
    keywords: ["motorcycle analytics", "bike expense charts", "ride distance analytics", "fuel trend graph"],
    path: "/analytics",
  },
  history: {
    title: "Ride History",
    description: "Browse your full motorcycle ride history with dates, distances, and odometer readings. Filter, export, and download ride records.",
    keywords: ["bike ride history", "motorcycle odometer log", "ride log", "trip history"],
    path: "/history",
  },
  expenses: {
    title: "Expense Tracker",
    description: "Track all motorcycle expenses — fuel, servicing, spare parts, and accessories. See monthly totals and category-wise breakdowns in rupees.",
    keywords: ["bike expense tracker", "motorcycle cost tracker", "two wheeler expense", "bike service cost India"],
    path: "/expenses",
  },
  bikes: {
    title: "My Bikes",
    description: "Manage all your motorcycle profiles. Add multiple bikes and track each independently with its own stats, maintenance history, and service schedule.",
    keywords: ["multiple bike profiles", "manage motorcycles", "bike profile", "two wheeler tracker"],
    path: "/bikes",
  },
  documents: {
    title: "Document Vault",
    description: "Store RC, insurance, PUC, and vehicle documents securely. Get automatic expiry alerts so your paperwork never lapses.",
    keywords: ["bike RC document", "vehicle insurance tracker", "PUC reminder", "RC book digital"],
    path: "/documents",
  },
  advisor: {
    title: "AI Mechanic Advisor",
    description: "Get personalised motorcycle maintenance advice from an AI trained on your own bike data. Ask about engine, tyres, brakes, and servicing.",
    keywords: ["AI bike advisor", "motorcycle maintenance AI", "bike mechanic chatbot", "smart bike advisor"],
    path: "/advisor",
  },
  services: {
    title: "Service History",
    description: "Complete motorcycle service history in one place. Log workshop visits, parts replaced, and costs for each service event.",
    keywords: ["motorcycle service history", "bike workshop log", "service record"],
    path: "/services",
  },
  checklists: {
    title: "Maintenance Checklists",
    description: "Pre-ride and periodic maintenance checklists for your motorcycle. Ensure every safety check is done before hitting the road.",
    keywords: ["motorcycle checklist", "pre ride check", "bike safety checklist"],
    path: "/checklists",
  },
};

export function buildMeta(key) {
  const p = PAGE_META[key];
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    keywords: p.keywords,
    alternates: { canonical: `${BASE}${p.path}` },
    openGraph: {
      title: `${p.title} | BikeCare Tracker`,
      description: p.description,
      url: `${BASE}${p.path}`,
      siteName: "BikeCare Tracker",
      images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${p.title} | BikeCare Tracker`,
      description: p.description,
      images: [`${BASE}/og-image.png`],
    },
  };
}
