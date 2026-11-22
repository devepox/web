// Real content from our-company.md. Gaps are marked [PLACEHOLDER: …] and tracked in CLAUDE.md.

export const company = {
  name: 'epox',
  city: 'Faisalabad',
  country: 'Pakistan',
  founded: 2019,
  timezone: 'UTC+5',
  email: 'info@epox.systems',
  /** one number for calls and WhatsApp (owner, 2026-11-22): local 0308 2982001 */
  phone: '+92 308 2982001',
  phoneHref: 'tel:+923082982001',
  whatsappHref: 'https://wa.me/923082982001',
  /** street address (owner, 2026-11-22) */
  street: 'St#6, Zia Town, Canal Road',
  address: 'St#6, Zia Town, Canal Road, Faisalabad, Pakistan',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=St%236%2C%20Zia%20Town%2C%20Canal%20Road%2C%20Faisalabad',
  bookingUrl: '', // [PLACEHOLDER: booking link]
};

export type Service = {
  n: string; slug: string; title: string; promise: string; tags: string[];
};

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
};

export const services: Service[] = [
  { n: '01', slug: 'web-saas-development', title: 'Web & SaaS development', promise: 'Websites, web apps and SaaS products built to scale.', tags: ['Company sites', 'E-commerce', 'Web portals', 'SaaS', 'Custom web apps'] },
  { n: '02', slug: 'mobile-apps', title: 'Mobile apps', promise: 'iOS and Android apps people keep opening after week one.', tags: ['iOS', 'Android', 'Cross-platform'] },
  { n: '03', slug: 'business-software', title: 'Business software', promise: 'Systems that replace spreadsheets and manual work.', tags: ['ERP', 'CRM', 'Automation', 'Dashboards', 'Integrations', 'Internal tools'] },
  { n: '04', slug: 'ai-solutions', title: 'AI solutions', promise: 'AI that does real work inside your product or team.', tags: ['AI agents & chatbots', 'LLM integration', 'Workflow automation', 'Data pipelines'] },
  { n: '05', slug: 'ui-ux-branding', title: 'UI/UX & branding', promise: 'Design that makes products clear and brands memorable.', tags: ['UI/UX', 'UX research', 'Design systems', 'Brand identity', 'Motion'] },
  { n: '06', slug: 'cloud-devops', title: 'Cloud & DevOps', promise: 'Infrastructure that stays fast and ships safely.', tags: ['Cloud setup & migration', 'CI/CD'] },
  { n: '07', slug: 'launch-growth-support', title: 'Launch, growth & support', promise: 'We stay after launch: testing, marketing and maintenance.', tags: ['QA', 'Maintenance', 'Marketing', 'Project rescue'] },
];
export const alsoServices = ['Desktop apps', 'Blockchain', 'Game development'];

export type CaseStudy = {
  n: string; slug: string; headline: string; summary: string; sector: string; region?: string;
  client: string; platforms: string; engagement: string; status: string; duration: string; asset: string;
};

export const cases: CaseStudy[] = [
  {
    n: '001', slug: 'rental-inspection-app', headline: 'Apps that settle rental disputes before they start',
    summary: 'Tenants photograph the property at move-in into a tamper-proof record, then both sides compare it side by side at move-out.',
    sector: 'PropTech', region: 'Europe', client: '[PLACEHOLDER: client descriptor]', platforms: 'iOS · Android · Web',
    engagement: 'Build, marketing, maintenance', status: 'Live', duration: '[PLACEHOLDER: duration]', asset: 'case 001 hero · 16:10',
  },
  {
    n: '002', slug: 'nutrition-coaching-app', headline: 'A nutrition app with a real nutritionist inside',
    summary: 'People log meals and track their nutrition, then talk directly to a real nutrition doctor inside the app, not a generic diet bot.',
    sector: 'Health & nutrition', client: '[PLACEHOLDER: client descriptor]', platforms: 'iOS · Android · Web',
    engagement: 'Build, marketing, maintenance', status: 'Live', duration: '[PLACEHOLDER: duration]', asset: 'case 002 hero · 16:10',
  },
];

/** Home "What we found": the problem each build started from (copy from the case stories). Results wait for the owner's numbers. */
export const findings = [
  {
    slug: 'rental-inspection-app', n: '001', sector: 'PropTech · Europe',
    // \u2011 = non-breaking hyphen, so "move-in" never splits across lines
    found: "Tenants and landlords didn't trust a move\u2011in record the other side could have changed.",
    built: 'A sealed photo record, made room by room at move\u2011in and compared side by side at move\u2011out.',
    result: '[PLACEHOLDER: before → after, e.g. deposit disputes per 100 move\u2011outs]',
  },
  {
    slug: 'nutrition-coaching-app', n: '002', sector: 'Health & nutrition',
    found: 'People logging meals had nobody to ask what the numbers meant, so most stopped within weeks.',
    built: 'A real nutritionist inside the app, in the same place people track what they eat.',
    result: '[PLACEHOLDER: before → after, e.g. people still logging after 30 days]',
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

/** /how-we-work communication. Specifics the owner hasn't confirmed are placeholders. */
export const communication = [
  { title: 'One project lead', text: 'One person on our side who knows your project and answers your messages.' },
  { title: 'A written update every week', text: 'What shipped, what is next and what we need from you, in a few lines.', confirm: '[PLACEHOLDER: confirm update cadence]' },
  { title: 'Your tools or ours', text: 'We work in the tools your team already uses, or set up ours.', confirm: '[PLACEHOLDER: tools, e.g. Slack, Jira, GitHub]' },
];

export const steps = [
  { n: '01', title: 'Find', text: 'We look at what you run today and name the problem worth solving first.' },
  { n: '02', title: 'Plan', text: 'Scope, timeline and team, agreed before anyone writes code.' },
  { n: '03', title: 'Build', text: 'Weekly demos and written updates. You always see working software.' },
  { n: '04', title: 'Run', text: 'Launch, then marketing and maintenance. We stay.' },
];

export const stats = [
  { value: 2019, label: 'Building since', raw: true },
  { value: 2, label: 'Products live, still run by us' },
  { value: 7, label: 'Service areas' },
  { value: null as number | null, label: '[PLACEHOLDER: countries delivered to]' },
];

export const industries = [
  { name: 'PropTech', count: 1, line: 'Move-in and move-out records tenants and landlords both trust.' },
  { name: 'Health & nutrition', count: 1, line: 'Meal tracking with real nutritionists in the loop.' },
  { name: '[PLACEHOLDER: industry]', count: 0, line: '[PLACEHOLDER: one-line outcome]' },
];

/** Contact page trust strip: only facts not already on that page (NDA and location are said elsewhere there). */
export const trust = ['Building since 2019', '2 products live, run by us', 'A reply within one working day'];
