// Real content from our-company.md. Unknown facts are left empty and simply not shown (client-ready since 2026-11-23);
// the list of what is still missing lives in CLAUDE.md.

export const company = {
  name: 'epox',
  city: 'Faisalabad',
  country: 'Pakistan',
  founded: 2019,
  timezone: 'UTC+5',
  // Empty = not shown anywhere (the contact form is the way in). Fill these and every page links them.
  email: 'info@epox.systems',
  /** one number for calls and WhatsApp (owner, 2026-11-22): local 0308 2982001 */
  phone: '+92 308 2982001',
  phoneHref: 'tel:+923082982001',
  whatsappHref: 'https://wa.me/923082982001',
  /** street address (owner, 2026-11-22) */
  street: 'St#6, Zia Town, Canal Road',
  address: 'St#6, Zia Town, Canal Road, Faisalabad, Pakistan',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=St%236%2C%20Zia%20Town%2C%20Canal%20Road%2C%20Faisalabad',
  bookingUrl: '',
};

export type Service = {
  n: string; slug: string; title: string; promise: string; tags: string[];
  href?: string; // a service with its own page outside /services (our restaurant product)
};
/** where a service links to: its own page if it has one, else /services/<slug> */
export const serviceHref = (s: Service) => s.href ?? `/services/${s.slug}`;

/** /services story chapters: one opinionated paragraph per area (built only from the owner's ticked catalogue) + related case. */
export const serviceStories: Record<string, { story: string; related?: string }> = {
  'web-saas-development': {
    story: 'Most web projects stall because version one tries to do everything. We ship the part your customers use first, on a stack the next developer will understand (React, Next.js, Node, Python, Laravel), then grow it from there: portals, stores, full SaaS products.',
    related: 'rental-inspection-app',
  },
  'mobile-apps': {
    story: 'An app gets judged in its first week. If it is slow, confusing or crashes, it gets deleted. We build for iOS and Android, native or cross-platform with Flutter or React Native, and keep watching after launch so week two is better than week one.',
    related: 'nutrition-coaching-app',
  },
  'business-software': {
    story: 'If your team copies numbers from one spreadsheet into another, that is the first thing we would point at. We build ERP and CRM systems (custom, Odoo, ERPNext, Salesforce, HubSpot), dashboards and internal tools, connected to the payments and accounting you already use.',
  },
  'ai-solutions': {
    story: "We don't add a chatbot because everyone else has one. We find the step in your work that eats the most hours and put AI there: an LLM inside your product, an agent that answers customers, or an automation fed by your own data.",
  },
  'ui-ux-branding': {
    story: 'Good design is why someone finishes signing up. We watch how people use your product, design the screens and the system behind them, and give the brand one look from the logo to the app icon, with motion where it helps.',
  },
  'cloud-devops': {
    story: "Shipping a change shouldn't feel risky. We set up or move your product to AWS, Google Cloud or Azure, and build pipelines that test every change before it reaches your users.",
  },
  'launch-growth-support': {
    story: 'Launch is where many teams hand over the keys and leave. We stay: testing, fixing, updating and marketing the product. We also take over projects another team left half-finished.',
    related: 'rental-inspection-app',
  },
  'restaurant-system': {
    story: 'Most restaurants run the till, the delivery apps, the riders and the loyalty cards as four separate things, and count them up by hand at night. Ours is one system for all of it: every order in one queue, stock tied to recipes, your own website and app, and the numbers ready in the morning. Plans start at $25 per branch a month.',
  },
};

export const services: Service[] = [
  { n: '01', slug: 'web-saas-development', title: 'Web & SaaS development', promise: 'Websites, web apps and SaaS products built to scale.', tags: ['Company sites', 'E-commerce', 'Web portals', 'SaaS', 'Custom web apps'] },
  { n: '02', slug: 'mobile-apps', title: 'Mobile apps', promise: 'iOS and Android apps people keep opening after week one.', tags: ['iOS', 'Android', 'Cross-platform'] },
  { n: '03', slug: 'business-software', title: 'Business software', promise: 'Systems that replace spreadsheets and manual work.', tags: ['ERP', 'CRM', 'Automation', 'Dashboards', 'Integrations', 'Internal tools'] },
  { n: '04', slug: 'ai-solutions', title: 'AI solutions', promise: 'AI that does real work inside your product or team.', tags: ['AI agents & chatbots', 'LLM integration', 'Workflow automation', 'Data pipelines'] },
  { n: '05', slug: 'ui-ux-branding', title: 'UI/UX & branding', promise: 'Design that makes products clear and brands memorable.', tags: ['UI/UX', 'UX research', 'Design systems', 'Brand identity', 'Motion'] },
  { n: '06', slug: 'cloud-devops', title: 'Cloud & DevOps', promise: 'Infrastructure that stays fast and ships safely.', tags: ['Cloud setup & migration', 'CI/CD'] },
  { n: '07', slug: 'launch-growth-support', title: 'Launch, growth & support', promise: 'We stay after launch: testing, marketing and maintenance.', tags: ['QA', 'Maintenance', 'Marketing', 'Project rescue'] },
  { n: '08', slug: 'restaurant-system', href: '/restaurant-system', title: 'Restaurant system', promise: 'Our own system for restaurants and shops: tills, online orders, riders and loyalty.', tags: ['Point of sale', 'Online ordering', 'Delivery riders', 'Loyalty', 'Reports'] },
];
export const alsoServices = ['Desktop apps', 'Blockchain', 'Game development'];

export type CaseStudy = {
  n: string; slug: string; headline: string; summary: string; sector: string; region?: string;
  client?: string; platforms: string; engagement: string; status: string; duration?: string; tech?: string[];
};

export const cases: CaseStudy[] = [
  {
    n: '001', slug: 'rental-inspection-app', headline: 'Apps that settle rental disputes before they start',
    summary: 'Tenants photograph the property at move-in into a tamper-proof record, then both sides compare it side by side at move-out.',
    sector: 'PropTech', region: 'Europe', platforms: 'iOS · Android · Web',
    engagement: 'Build, marketing, maintenance', status: 'Live',
  },
  {
    n: '002', slug: 'nutrition-coaching-app', headline: 'A nutrition app with a real nutritionist inside',
    summary: 'People log meals and track their nutrition, then talk directly to a real nutrition doctor inside the app, not a generic diet bot.',
    sector: 'Health & nutrition', platforms: 'iOS · Android · Web',
    engagement: 'Build, marketing, maintenance', status: 'Live',
  },
];

export const models = [
  { n: '01', title: 'Fixed project', best: 'A defined product or feature with a clear finish line.', points: ['Agreed scope, timeline and deliverables', 'One accountable project lead', 'Handover with docs and source code'] },
  { n: '02', title: 'Dedicated developers', best: 'Teams that need more hands without hiring.', points: ['Engineers working as part of your team', 'Your tools, your rituals', 'Scale up or down monthly'] },
  { n: '03', title: 'Monthly retainer', best: 'Live products that need to keep improving.', points: ['Ongoing development and fixes', 'Marketing and maintenance', 'A fixed monthly plan, reviewed together'] },
];

/** /how-we-work comparison rows (no prices). Same order as `models`. */
export const modelCompare = {
  rows: ['Best for', 'Team', 'Timeline', 'You get'] as const,
  cells: [
    { team: 'A project lead plus the designers and developers the scope needs', timeline: 'Agreed before we start, delivered in milestones' },
    { team: 'epox developers who join your team and work in your tools', timeline: 'Ongoing; scale up or down each month' },
    { team: 'A small epox team that already knows your product', timeline: 'Rolling, month to month' },
  ],
};

/** /how-we-work communication (default terms written 2026-11-23, owner to confirm). */
export const communication = [
  { title: 'One project lead', text: 'One person on our side who knows your project and answers your messages.' },
  { title: 'A written update every week', text: 'What shipped, what is next and what we need from you, in a few lines, plus a demo of working software.' },
  { title: 'Your tools or ours', text: 'Slack, Jira, Trello, GitHub or WhatsApp: we work in what your team already uses, or set up ours.' },
];

/**
 * Terms shown on /how-we-work, /about and service FAQs. Sensible defaults written 2026-11-23 for the owner to confirm
 * (owner chose "write sensible defaults" before a client meeting). Change them here and every page follows.
 */
export const terms = {
  overlap: 'UK and European mornings, and the start of the US East Coast day',
  ownership: 'Once the work is paid for, the code, designs and accounts are yours. At handover you get the repository, every login and the documentation.',
  payment: 'Fixed projects are paid in milestones: 40% to start, 40% at the halfway demo, 20% at launch. Dedicated developers and retainers are paid monthly in advance.',
  stores: 'Apps go out under your own App Store and Google Play accounts, so they stay yours. We help you set those up if you don\'t have them yet.',
  response: 'Something broken in a live product: we start on it the same working day. Everything else: a reply within one working day.',
  retainer: 'A set number of hours each month for fixes, updates, testing and marketing, planned with you at the start of the month, plus monitoring of the live product.',
  training: 'Every handover includes written guides and a walkthrough session with your team, recorded so new staff can watch it later.',
  aiData: 'We use established providers (OpenAI, Anthropic, Google) on business plans that do not train on your data, and agree with you up front which data an AI system can see.',
};

export const steps = [
  { n: '01', title: 'Find', text: 'We look at what you run today and name the problem worth solving first.' },
  { n: '02', title: 'Plan', text: 'Scope, timeline and team, agreed before anyone writes code.' },
  { n: '03', title: 'Build', text: 'Weekly demos and written updates. You always see working software.' },
  { n: '04', title: 'Run', text: 'Launch, then marketing and maintenance. We stay.' },
];

export const stats = [
  { value: 2019, label: 'Building since', raw: true },
  { value: 8, label: 'Service areas' },
  { value: 1, label: 'Working day to reply' },
];

export const industries = [
  { name: 'PropTech', meta: '1 project', line: 'Move-in and move-out records tenants and landlords both trust.' },
  { name: 'Health & nutrition', meta: '1 project', line: 'Meal tracking with real nutritionists in the loop.' },
  { name: 'Restaurants & retail', meta: 'Our own product', line: 'Tills, online orders, riders and loyalty in one system.' },
];

/** Contact page trust strip: only facts not already on that page (NDA and location are said elsewhere there). */
export const trust = ['Building since 2019', 'Apps we built, still live and run by us', 'A reply within one working day'];
