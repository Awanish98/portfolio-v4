/* ============================================================
   SHARED PROJECT DATA - used by showcase.html and index.html
   ============================================================ */
window.PROJECT_DATA = (function () {
  'use strict';
  const BASE = 'https://awanish98.github.io/premium-web-demos/';
/* ---------------- 50 PREMIUM WEBSITE DEMOS ---------------- */
const demos = [
  { n: 1,  name: 'Aurelia House',          sub: 'Luxury Hotel',              cat: 'Hospitality',        desc: 'Booking-first luxury stay experience with rich imagery and room details.', url: BASE + '01-hotel-resort/' },
  { n: 2,  name: 'The Ivory Court',        sub: 'Wedding Banquet',           cat: 'Hospitality',        desc: 'Elegant banquet and celebration showcase for a premium venue.', url: BASE + '02-wedding-banquet/' },
  { n: 3,  name: 'Ember & Thyme',           sub: 'Restaurant',                cat: 'Food & Fitness',     desc: 'Modern restaurant site with menu, dining details and reservations.', url: BASE + '03-restaurant/' },
  { n: 4,  name: 'Sidequest Cafe',         sub: 'Cafe & Quick Service',      cat: 'Food & Fitness',     desc: 'Bold, energetic cafe landing page built for quick service.', url: BASE + '04-cafe-fast-food/' },
  { n: 5,  name: 'Iron District',          sub: 'Strength Gym',              cat: 'Food & Fitness',     desc: 'High-energy gym website with classes and membership focus.', url: BASE + '05-gym/' },
  { n: 6,  name: 'Maison Muse',            sub: 'Salon & Beauty',            cat: 'Food & Fitness',     desc: 'Refined salon and beauty showcase with service highlights.', url: BASE + '06-salon-beauty/' },
  { n: 7,  name: 'Carewell Medical Centre',sub: 'Clinic Demo',               cat: 'Health',             desc: 'Clear, calm clinic information site with departments and care.', url: BASE + '07-hospital-clinic/' },
  { n: 8,  name: 'The Garden Estate',      sub: 'Wedding Lawn',              cat: 'Hospitality',        desc: 'Lawn and venue event showcase with a soft, romantic feel.', url: BASE + '08-wedding-lawn-events/' },
  { n: 9,  name: 'The Meridian Inn',       sub: 'Boutique Hotel',            cat: 'Hospitality',        desc: 'Boutique stay experience with rooms and atmosphere up front.', url: BASE + '09-boutique-hotel/' },
  { n: 10, name: 'Pulse Social Club',      sub: 'Fitness Club',              cat: 'Food & Fitness',     desc: 'Premium fitness club landing page with a strong visual identity.', url: BASE + '10-fitness-club/' },
  { n: 11, name: 'Northline Estates',      sub: 'Property Developer',        cat: 'Property & Trades',  desc: 'Property developer site showcasing projects and developments.', url: BASE + '11-real-estate-property-developer/' },
  { n: 12, name: 'Brightpath Academy',     sub: 'Coaching & EdTech',         cat: 'Education',          desc: 'Coaching and edtech platform with courses and learning paths.', url: BASE + '12-coaching-institute-edtech/' },
  { n: 13, name: 'Sunward Energy',         sub: 'Solar Solutions',           cat: 'Property & Trades',  desc: 'Solar solutions site focused on clean energy and installations.', url: BASE + '13-solar-energy-company/' },
  { n: 14, name: 'Voltara Motors',         sub: 'EV Showroom & Charging',    cat: 'Property & Trades',  desc: 'EV showroom and charging network landing experience.', url: BASE + '14-ev-showroom-charging-station/' },
  { n: 15, name: 'Paw & Care Clinic',      sub: 'Pet Care & Veterinary',     cat: 'Health',             desc: 'Friendly veterinary and pet care clinic website.', url: BASE + '15-pet-care-veterinary-services/' },
  { n: 16, name: 'Stillframe Studio',      sub: 'Photography Studio',        cat: 'Creative',           desc: 'Photography and videography studio portfolio-style showcase.', url: BASE + '16-photography-videography-studio/' },
  { n: 17, name: 'Atelier Stone',          sub: 'Interior Design',           cat: 'Creative',           desc: 'Interior design and architecture studio with a refined layout.', url: BASE + '17-interior-design-architecture-studio/' },
  { n: 18, name: 'Redline Detailing',      sub: 'Car Detailing',             cat: 'Property & Trades',  desc: 'Car detailing and automobile garage service website.', url: BASE + '18-car-detailing-automobile-garage/' },
  { n: 19, name: 'Maison Dore',            sub: 'Fashion & Jewellery',       cat: 'Creative',           desc: 'Fashion and jewellery D2C storefront with editorial styling.', url: BASE + '19-fashion-jewellery-d2c-e-commerce/' },
  { n: 20, name: 'Wandernorth',            sub: 'Travel & Tours',            cat: 'Creative',           desc: 'Travel agency and tour operator site built for discovery.', url: BASE + '20-travel-agency-tour-operator/' },
  { n: 21, name: 'Northgate Visa',         sub: 'Immigration Consultancy',   cat: 'Professional',       desc: 'Immigration and visa consultancy with a trustworthy layout.', url: BASE + '21-immigration-visa-consultancy/' },
  { n: 22, name: 'Ledger & Co.',           sub: 'CA & Tax',                  cat: 'Professional',       desc: 'Chartered accountant and tax consultancy website.', url: BASE + '22-ca-tax-consultancy/' },
  { n: 23, name: 'Harrison & Vale',        sub: 'Law Firm',                  cat: 'Professional',       desc: 'Law firm and legal consultancy with a formal, confident tone.', url: BASE + '23-law-firm-legal-consultancy/' },
  { n: 24, name: 'Signalrise',             sub: 'Digital Marketing',         cat: 'Professional',       desc: 'Digital marketing agency showcasing growth and campaigns.', url: BASE + '24-digital-marketing-agency/' },
  { n: 25, name: 'Codeforge Labs',         sub: 'Software Company',          cat: 'Tech',               desc: 'IT and software development company landing page.', url: BASE + '25-it-software-development-company/' },
  { n: 26, name: 'The Common Desk',        sub: 'Coworking Space',           cat: 'Property & Trades',  desc: 'Coworking space site with memberships and community focus.', url: BASE + '26-co-working-space/' },
  { n: 27, name: 'Ironwork Industries',    sub: 'Manufacturing',             cat: 'Property & Trades',  desc: 'Manufacturing and industrial company website.', url: BASE + '27-manufacturing-industrial-company/' },
  { n: 28, name: 'Haven & Grain',          sub: 'Furniture & Decor',         cat: 'Creative',           desc: 'Furniture and home decor store with warm product styling.', url: BASE + '28-furniture-home-decor-store/' },
  { n: 29, name: 'Fixright Home',          sub: 'Home Repair',               cat: 'Property & Trades',  desc: 'Home repair and maintenance service booking website.', url: BASE + '29-home-repair-maintenance/' },
  { n: 30, name: 'Freshloop',              sub: 'Laundry & Dry Cleaning',    cat: 'Property & Trades',  desc: 'Laundry and dry cleaning service with pickup and delivery.', url: BASE + '30-laundry-dry-cleaning/' },
  { n: 31, name: 'Strata Build',           sub: 'Construction',              cat: 'Property & Trades',  desc: 'Construction and infrastructure company showcase.', url: BASE + '31-construction-infrastructure-company/' },
  { n: 32, name: 'Smilewell Dental',       sub: 'Dental Clinic',             cat: 'Health',             desc: 'Dental clinic site with treatments and patient comfort.', url: BASE + '32-dental-clinic/' },
  { n: 33, name: 'Clearpath Labs',         sub: 'Diagnostics',               cat: 'Health',             desc: 'Diagnostic lab and pathology centre information site.', url: BASE + '33-diagnostic-lab-pathology-centre/' },
  { n: 34, name: 'Moment House',           sub: 'Event Management',          cat: 'Hospitality',        desc: 'Event management company showcasing experiences and moments.', url: BASE + '34-event-management-company/' },
  { n: 35, name: 'Relay Express',          sub: 'Courier & Logistics',       cat: 'Professional',       desc: 'Courier and logistics company with tracking-led messaging.', url: BASE + '35-courier-logistics-company/' },
  { n: 36, name: 'Fieldroot Agri',         sub: 'Agriculture & AgriTech',    cat: 'Professional',       desc: 'Agriculture and agritech company website.', url: BASE + '36-agriculture-agritech/' },
  { n: 37, name: 'Little Lantern',         sub: 'Preschool & Daycare',       cat: 'Education',          desc: 'Preschool and daycare site with a playful, caring feel.', url: BASE + '37-preschool-daycare/' },
  { n: 38, name: 'Soundroom Studio',       sub: 'Recording Studio',          cat: 'Creative',           desc: 'Music recording studio showcase with gear and credits.', url: BASE + '38-music-recording-studio/' },
  { n: 39, name: 'Sentinel Secure',        sub: 'Security Solutions',        cat: 'Tech',               desc: 'CCTV and security solutions website for homes and businesses.', url: BASE + '39-cctv-security-solutions/' },
  { n: 40, name: 'Pureflow Water',         sub: 'Water Treatment',           cat: 'Property & Trades',  desc: 'RO, water purifier and water treatment solutions site.', url: BASE + '40-ro-water-purifier-water-treatment/' },
  { n: 41, name: 'Alex Rivera',            sub: 'Developer Portfolio',       cat: 'Portfolios',         desc: 'Clean developer portfolio with projects and experience.', url: BASE + '41-web-developer-portfolio/' },
  { n: 42, name: 'Maya Sen',               sub: 'UI/UX Portfolio',           cat: 'Portfolios',         desc: 'UI/UX designer portfolio with case studies and visuals.', url: BASE + '42-ui-ux-designer-portfolio/' },
  { n: 43, name: 'Noah Reed',              sub: 'Photographer Portfolio',    cat: 'Portfolios',         desc: 'Photographer portfolio built around a strong gallery.', url: BASE + '43-photographer-portfolio/' },
  { n: 44, name: 'Elena Voss',             sub: 'Filmmaker Portfolio',       cat: 'Portfolios',         desc: 'Video editor and filmmaker portfolio with reel-first layout.', url: BASE + '44-video-editor-filmmaker-portfolio/' },
  { n: 45, name: 'Ria Kapoor',             sub: 'Graphic Design Portfolio',  cat: 'Portfolios',         desc: 'Graphic designer portfolio with bold typographic work.', url: BASE + '45-graphic-designer-portfolio/' },
  { n: 46, name: 'Daniel Crane',           sub: 'Architect Portfolio',       cat: 'Portfolios',         desc: 'Architect portfolio showcasing built work and concepts.', url: BASE + '46-architect-portfolio/' },
  { n: 47, name: 'Isla Moreno',            sub: 'Fashion Designer',          cat: 'Portfolios',         desc: 'Fashion designer portfolio with an editorial presentation.', url: BASE + '47-fashion-designer-portfolio/' },
  { n: 48, name: 'Sam Wright',             sub: 'Writer & Copywriter',       cat: 'Portfolios',         desc: 'Content writer and copywriter portfolio with writing samples.', url: BASE + '48-content-writer-copywriter-portfolio/' },
  { n: 49, name: 'Kai Nakamura',           sub: '3D Artist Portfolio',       cat: 'Portfolios',         desc: '3D and digital artist portfolio with a cinematic gallery.', url: BASE + '49-3d-artist-digital-artist-portfolio/' },
  { n: 50, name: 'Zoe Lane',               sub: 'Creator Portfolio',         cat: 'Portfolios',         desc: 'Influencer and content creator portfolio with a personal brand.', url: BASE + '50-influencer-content-creator-portfolio/' }
];

/* ---------------- LIVE APPS & PLATFORMS ---------------- */
const apps = [
  { name: 'Aura Music',               sub: 'AI music player · Web + Android', desc: 'AI-powered YouTube music player and web radio with 40+ mood stations, synced lyrics, Full HD theater, WebRTC listening rooms and a shipped Android app.', tags: ['React', 'WebRTC', 'AI', 'Android'], url: 'https://aura-music-1no9.onrender.com', preview: 'https://awanish98.github.io/Aura-Music/' },
  { name: 'LDM Paramedical College',  sub: 'Client website',                  desc: 'Modern, responsive college site with structured navigation for courses, admissions, faculty information and college updates.', tags: ['React', 'Responsive', 'UI / UX'], url: 'https://ldmcollege.com' },
  { name: 'Jordan Personal Portfolio',sub: 'Portfolio · Netlify',             desc: 'The original personal portfolio — a clean, responsive home for projects, experience and everything in between.', tags: ['Portfolio', 'Netlify', 'Web'], url: 'https://jordan005.netlify.app' }
];

/* ---------------- OPEN SOURCE / EXPERIMENTS ---------------- */
const openSource = [
  { name: 'Living Universe',        desc: 'Interactive generative art experiment — a living cosmos rendered with canvas animations and particle physics.', tags: ['Canvas', 'JavaScript', 'Creative'], url: 'https://github.com/Awanish98/Living-Universe' },
  { name: 'PREMIER',                desc: 'Premium front-end build with advanced layout techniques, smooth scroll interactions and high-fidelity UI.', tags: ['HTML', 'CSS', 'JavaScript'], url: 'https://github.com/Awanish98/Premier' },
  { name: 'Birth of a Black Hole',  desc: 'Cinematic WebGL-inspired simulation of a black hole forming — dark, dramatic visual storytelling.', tags: ['WebGL', 'Canvas', 'Simulation'], url: 'https://github.com/Awanish98/birth-of-a-black-hole' },
  { name: 'Ishq Radio',             desc: 'Live Bollywood and Hindi radio streaming app with curated stations and smooth player controls.', tags: ['Streaming', 'Radio', 'JavaScript'], url: 'https://github.com/Awanish98/Ishq-Radio' },
  { name: 'Web Scraping Suite',     desc: 'Modular Python scrapers with BeautifulSoup, Scrapy and Pyppeteer for e-commerce, news and catalogue data.', tags: ['Python', 'Scrapy', 'BeautifulSoup'], url: 'https://github.com/Awanish98/Web_Scraping' },
  { name: 'Spotify Tooling',        desc: 'Automation scripts for Spotify — playlist exports, track metadata and playback experiments.', tags: ['Python', 'Spotify API', 'Automation'], url: 'https://github.com/Awanish98/Spotify' },
  { name: 'Python Projects',        desc: 'A curated collection of Python utilities — scrapers, data reporters, automation bots and AI tool experiments.', tags: ['Python', 'Automation', 'Scripts'], url: 'https://github.com/Awanish98/Python_projects' },
  { name: 'Portfolio v1',           desc: 'First iteration of the personal portfolio — clean layout, project showcase and responsive design.', tags: ['Portfolio', 'HTML', 'CSS'], url: 'https://github.com/Awanish98/Portfolio' },
  { name: 'Portfolio Spline React', desc: 'Experimental React portfolio with immersive 3D Spline scenes as hero backgrounds.', tags: ['React', 'Spline', '3D'], url: 'https://github.com/Awanish98/Portfolio-spline-React' },
  { name: 'College Projects',       desc: 'Academic B.Tech projects covering data structures, databases and software engineering assignments.', tags: ['Academic', 'Python', 'SQL'], url: 'https://github.com/Awanish98/college_test' },
  { name: 'Vision — AI Knowledge Platform', desc: 'AI-powered learning and knowledge platform with structured content, smart search and LLM-assisted study flows.', tags: ['AI', 'LLM', 'Python'] }
];

/* ---------------- TOOLS & SCRIPTS (PYTHON AUTOMATION) ---------------- */
const tools = [
  { name: 'E-Commerce Data Collection Suite', desc: 'Python, Pyppeteer, XPath and asyncio scraping across e-commerce sites.', tags: ['Python', 'Pyppeteer', 'asyncio'] },
  { name: 'Fortune 1000+ Product Data Scraper', desc: 'Scraped 1,000+ products (Men, Women, Kids) using XPath and asyncio.', tags: ['XPath', 'asyncio'] },
  { name: 'Le Chocolat Product Scraper', desc: 'Extracted 500+ chocolate products with automated pricing calculations.', tags: ['Scraping', 'Pricing'] },
  { name: "Trader Joe's Product Scraper", desc: 'Collected 700+ products (Flowers, Beverages) with pagination handling.', tags: ['Scraping', 'Pagination'] },
  { name: 'Audible Data Scraping', desc: 'Automated audiobook catalogue data collection.', tags: ['Python'] },
  { name: 'Hacker News Data Scraping', desc: 'Story and metadata collection from Hacker News.', tags: ['Python'] },
  { name: 'Bollywood / Movie Data Scraping', desc: 'Movie metadata collection pipeline.', tags: ['Python'] },
  { name: 'Spotify Playlist Automation', desc: 'Automated playlist handling and exports.', tags: ['Automation'] },
  { name: 'YouTube Playlist Processing Automation', desc: 'Bulk playlist processing workflow.', tags: ['Automation'] },
  { name: 'Hotel Booking Automation Bot', desc: 'Automated hotel search and booking workflow.', tags: ['Bot'] },
  { name: 'PyAutoGUI Desktop Automation', desc: 'Desktop UI automation with PyAutoGUI.', tags: ['PyAutoGUI'] },
  { name: 'Python Code Reviewer', desc: 'Automated review helpers for Python code.', tags: ['Python'] },
  { name: 'News Reporting Automation', desc: 'Automated news collection and reporting.', tags: ['Automation'] },
  { name: 'Weather Reporting Automation', desc: 'Automated weather data reporting.', tags: ['Automation'] }
];

/* ---------------- AI SYSTEMS ---------------- */
const ai = [
  { name: 'AI Lead Agent — Business Lead Generation System', desc: 'FastAPI, SQLite, Chrome Extension and Groq-powered lead generation.', tags: ['FastAPI', 'SQLite', 'Groq'] },
  { name: 'AI Web Research & Business Discovery', desc: 'Automated research and business discovery flow.', tags: ['AI', 'Research'] },
  { name: 'Google Maps Business Data Collection', desc: 'Business listings collection from Google Maps.', tags: ['Maps', 'Data'] },
  { name: 'DuckDuckGo Search Automation', desc: 'Automated search-result collection.', tags: ['Automation'] },
  { name: 'Browser-Based Web Scraping Automation', desc: 'Browser-driven scraping pipeline.', tags: ['Browser', 'Scraping'] },
  { name: 'Local AI Coding Assistant — Ollama / Llama', desc: 'Local LLM coding experiments and helpers.', tags: ['Ollama', 'Llama'] }
];

/* ---------------- MUSIC & MEDIA ---------------- */
const media = [
  { name: 'ISHQ Radio — Live Radio Streaming', desc: 'Live radio streaming experience.', tags: ['Radio', 'Streaming'] },
  { name: 'Aura Music Backend', desc: 'Backend and API behind the Aura Music platform.', tags: ['Backend', 'API'] },
  { name: 'Aura Music Android Application', desc: 'Android build of the Aura Music player.', tags: ['Android'] },
  { name: 'Aura Music Web Player', desc: 'Browser music player with queue and playback controls.', tags: ['Web', 'Player'] },
  { name: 'Aura Lyrics Visualizer', desc: 'Synced, animated lyric experience.', tags: ['Lyrics', 'Animation'] },
  { name: 'Insta LRC Player', desc: 'LRC-format lyrics player experiment.', tags: ['LRC', 'Audio'] },
  { name: 'Cinematic Word-by-Word Lyrics Animation', desc: 'Word-level animated lyrics rendering.', tags: ['Animation'] },
  { name: 'Jordy — YouTube Playlist to Google Drive Music Automation', desc: 'Automated playlist-to-Drive music workflow.', tags: ['Automation', 'YouTube'] }
];

/* ---------------- IN THE LAB ---------------- */
const lab = [
  { name: 'Jarvis Personal AI Assistant', status: 'building', desc: 'Central assistant core for memory, tasks, tool execution and model routing.' },
  { name: 'Deadpool Context Bridge', status: 'planned', desc: 'Context hand-off layer between agents and tools.' },
  { name: 'Oracle Memory Agent', status: 'planned', desc: 'Long-term memory and retrieval agent.' },
  { name: 'Raptor Job Hunter', status: 'building', desc: 'Job search and recruitment workflow agent.' },
  { name: 'Friday Job Assistant', status: 'planned', desc: 'Assistant for applications, follow-ups and tracking.' },
  { name: 'Watcher Business Agent', status: 'planned', desc: 'Business monitoring and signal collection agent.' },
  { name: 'Adam Meta-Agent', status: 'planned', desc: 'Orchestration layer for specialized agents.' },
  { name: 'Ultron Security Agent', status: 'planned', desc: 'Security-focused monitoring and response agent.' },
  { name: 'Genesis Agent', status: 'planned', desc: 'General-purpose agent foundation.' },
  { name: 'Memory Core', status: 'building', desc: 'Shared memory layer for the agent ecosystem.' },
  { name: 'AI Reel Creator', status: 'planned', desc: 'Automated short-form video generation workflow.' },
  { name: 'Twilio Voice AI Agent', status: 'planned', desc: 'Voice-based AI calling agent experiment.' },
  { name: 'Exam Form Application Tracker', status: 'planned', desc: 'Tracker for exam forms and application deadlines.' },
  { name: 'Freelancing Automation System', status: 'planned', desc: 'Client, proposal and delivery automation system.' }
];

/* ---------------- UNIFIED GROUPS ---------------- */
const groups = [
  { key: 'web',   icon: '◈', label: 'Websites for Your Business', short: 'Websites', note: '50 live, ready-to-try website demos — pick the one that fits your business and see it in action.', items: demos.map(d => ({ name: d.name, sub: d.sub, desc: d.desc, tags: [d.cat, 'Live Demo'], preview: d.url, url: d.url, status: 'live' })) },
  { key: 'apps',  icon: '▣', label: 'Apps & Platforms',note: 'Shipped products and client platforms, live on the web.',              items: apps.map(a => ({ ...a, status: 'live' })) },
  { key: 'code',  icon: '⌘', label: 'Open Source',     note: 'Experiments, earlier builds and creative coding on GitHub.',            items: openSource.map(i => ({ ...i, sub: 'GitHub Project', status: 'done' })) },
  { key: 'tools', icon: '⌁', label: 'Tools & Scripts', note: 'Python scrapers, collectors and workflow automation.',                  items: tools.map(i => ({ ...i, sub: 'Automation / Script', status: 'done' })) },
  { key: 'ai',    icon: '✦', label: 'AI Systems',      note: 'AI-assisted research, lead generation and local model experiments.',    items: ai.map(i => ({ ...i, sub: 'AI / Automation', status: 'done' })) },
  { key: 'media', icon: '♫', label: 'Music & Media',   note: 'Streaming, players, lyrics and the builds behind Aura Music.',          items: media.map(i => ({ ...i, sub: 'Media Build', status: 'done' })) },
  { key: 'lab',   icon: '◐', label: 'In the Lab',      note: 'Ideas and agents currently in progress or on the roadmap.',             items: lab.map(i => ({ ...i, sub: 'In Progress', status: i.status })) }
];

const allItems = groups.flatMap(g => g.items.map(i => ({ ...i, group: g.key, groupLabel: g.short || g.label, groupIcon: g.icon })));


  return { groups: groups, allItems: allItems, demos: demos };
})();
