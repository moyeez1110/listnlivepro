// ============================================================
//  ListnLive — Choutuppal 2.0
//  Replace sheet URLs below with your published Google Sheet CSV links
//  File → Share → Publish to web → Each Tab → CSV → Copy link
// ============================================================

const SHEET_URLS = {
  businesses: 'YOUR_BUSINESSES_TAB_CSV_URL',
  news:       'YOUR_NEWS_TAB_CSV_URL',
  realestate: 'YOUR_REALESTATE_TAB_CSV_URL',
};

// ============================================================
//  SAMPLE DATA (shown until Google Sheets connected)
// ============================================================
const SAMPLE_BUSINESSES = [
  { name:'Sri Lakshmi Tiffins', category:'Tiffin', description:'ఉదయం 6 నుండి తాజా ఇడ్లీ, దోశ, పొంగల్ అందుబాటులో ఉంటాయి', phone:'9876543210', rating:'4.8', badge:'Featured' },
  { name:'City Medical Store', category:'Medicals', description:'24/7 మెడికల్ స్టోర్ — అన్ని మందులు, సర్జికల్ items దొరుకుతాయి', phone:'9876543211', rating:'4.9', badge:'Featured' },
  { name:'Rahul Hair Studio', category:'Salons', description:'Modern haircuts, hair coloring, bridal packages available', phone:'9876543212', rating:'4.7', badge:'New' },
  { name:'Krishna Plumbing Works', category:'Plumbers', description:'House plumbing, bore-well, pipeline repair — 24hr service', phone:'9876543213', rating:'4.6', badge:'New' },
  { name:'Nanda Electronics', category:'Electronics', description:'TV, fridge, washing machine repairs & new appliances', phone:'9876543214', rating:'4.5', badge:'' },
  { name:'Green Valley School', category:'Education', description:'CBSE School, KG to 10th standard, transport available', phone:'9876543215', rating:'4.8', badge:'Featured' },
];

const SAMPLE_NEWS = [
  { title:'చౌటుప్పల్ లో కొత్త రహదారి నిర్మాణం ప్రారంభం', tag:'Infrastructure', date:'25 May 2026', emoji:'🛣️' },
  { title:'మండల స్థాయి క్రీడా పోటీలు ఈ వారం', tag:'Sports', date:'24 May 2026', emoji:'🏆' },
  { title:'కొత్త బస్సు రూట్లు: చౌటుప్పల్ నుండి హైదరాబాద్', tag:'Transport', date:'23 May 2026', emoji:'🚌' },
  { title:'రైతుల కోసం ప్రత్యేక వ్యవసాయ రుణాలు', tag:'Agriculture', date:'22 May 2026', emoji:'🌾' },
  { title:'చౌటుప్పల్ లో IT పార్క్ ఏర్పాటు అవుతుందా?', tag:'Development', date:'21 May 2026', emoji:'💻' },
  { title:'పాఠశాల పిల్లలకు ఉచిత సైకిళ్ళు పంపిణీ', tag:'Education', date:'20 May 2026', emoji:'🚴' },
];

const SAMPLE_REALESTATE = [
  { name:'3BHK House — Choutuppal Town', category:'House for Sale', description:'Main road అడ్జాసెంట్, 1200sqft, 2 బాత్‌రూమ్‌లు, car parking', phone:'9876543220', badge:'Sale' },
  { name:'Commercial Shop — Bus Stand Area', category:'Shop for Rent', description:'100sqft, ground floor, busy market area, electricity included', phone:'9876543221', badge:'New' },
  { name:'Agricultural Land — 5 Acres', category:'Land for Sale', description:'NH-65 నుండి 2km దూరంలో, water available, HMDA approved', phone:'9876543222', badge:'Featured' },
  { name:'2BHK Apartment — New Layout', category:'Flat for Rent', description:'2nd floor, lift, security, 800sqft, near school & market', phone:'9876543223', badge:'New' },
];

const CATEGORIES = [
  {emoji:'🍱',name:'Tiffin'},{emoji:'💊',name:'Medicals'},{emoji:'✂️',name:'Salons'},
  {emoji:'🔧',name:'Plumbers'},{emoji:'🏠',name:'Real Estate'},{emoji:'📱',name:'Electronics'},
  {emoji:'🚗',name:'Automobiles'},{emoji:'📚',name:'Education'},{emoji:'🧵',name:'Tailors'},
  {emoji:'🔨',name:'Hardware'},{emoji:'⚙️',name:'Services'},{emoji:'➕',name:'More'},
];

const TESTIMONIALS = [
  {quote:'ఈ యాప్ ద్వారా నా బిజినెస్ కు కొత్త కస్టమర్లు వస్తున్నారు. సూపర్ యాప్!', name:'రమేష్', role:'Business Owner', initial:'ర'},
  {quote:'రియల్ ఎస్టేట్ ప్రాపర్టీల కోసం నేను రోజూ వాడుతున్నాను.', name:'సురేష్', role:'Real Estate Agent', initial:'స'},
  {quote:'ఊరిలో అన్ని షాపులు, సర్వీసెస్ ఒకేచోట దొరుకుతున్నాయి. చాలా ఉపయోగం!', name:'లక్ష్మి', role:'Homemaker', initial:'ల'},
  {quote:'నా క్లినిక్ కి రోజూ 5-6 కొత్త పేషంట్లు ఈ యాప్ ద్వారా వస్తున్నారు.', name:'డాక్టర్ రాజు', role:'Doctor', initial:'డ'},
  {quote:'టైలరింగ్ ఆర్డర్లు పెరిగాయి. ధన్యవాదాలు చౌటుప్పల్ 2.0!', name:'అనుష', role:'Tailor', initial:'అ'},
];

// ============================================================
//  CSV PARSER
// ============================================================
function parseCSV(text) {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g,'').toLowerCase().replace(/\s+/g,'_'));
  return lines.slice(1).map(line => {
    const vals = []; let cur = '', inQ = false;
    for (const ch of line) {
      if (ch==='"'){inQ=!inQ;continue}
      if (ch===','&&!inQ){vals.push(cur.trim());cur='';continue}
      cur+=ch;
    }
    vals.push(cur.trim());
    const obj={};
    headers.forEach((h,i)=>obj[h]=vals[i]||'');
    return obj;
  });
}

async function fetchSheet(url) {
  if (!url || url.startsWith('YOUR_')) return null;
  try {
    const r = await fetch(url);
    return parseCSV(await r.text());
  } catch(e) { return null; }
}

// ============================================================
//  RENDER — CATEGORIES
// ============================================================
function renderCategories() {
  document.getElementById('categoriesGrid').innerHTML = CATEGORIES.map(c=>`
    <div class="cat-item card fade-in" onclick="filterByCategory('${c.name}')">
      <span class="cat-emoji">${c.emoji}</span>
      <div class="cat-name">${c.name}</div>
    </div>`).join('');
  observeFadeIns();
}

// ============================================================
//  RENDER — BUSINESSES
// ============================================================
let allBusinesses = [];

function renderBusinesses(data) {
  allBusinesses = data;
  const sel = document.getElementById('catFilter');
  sel.innerHTML = '<option value="">All Categories</option>';
  [...new Set(data.map(b=>b.category||b.Category).filter(Boolean))].forEach(c=>{
    const o=document.createElement('option');o.value=c;o.textContent=c;sel.appendChild(o);
  });
  displayBusinesses(data);
}

function displayBusinesses(data) {
  const grid = document.getElementById('listingsGrid');
  if (!data.length) {
    grid.innerHTML='<div class="empty-state"><span>🔍</span>No businesses found</div>';return;
  }
  grid.innerHTML = data.map(b=>{
    const name=b.name||b.Name||'';
    const cat=b.category||b.Category||'';
    const desc=b.description||b.Description||'';
    const phone=b.phone||b.Phone||'';
    const rat=b.rating||b.Rating||'';
    const badge=(b.badge||b.Badge||'').trim();
    const badgeCls=badge.toLowerCase()==='featured'?'badge-featured':badge.toLowerCase()==='new'?'badge-new':'badge-sale';
    return `<div class="listing-card card fade-in">
      ${badge?`<span class="listing-badge ${badgeCls}">${badge}</span>`:''}
      <div class="listing-name">${name}</div>
      <div class="listing-cat">${cat}</div>
      <div class="listing-desc">${desc}</div>
      <div class="listing-meta">
        ${rat?`<span class="listing-rating">⭐ ${rat}</span>`:''}
        ${phone?`<a href="tel:${phone}" class="listing-phone">📞 ${phone}</a>`:''}
        ${phone?`<a class="btn-wa-small" href="https://wa.me/91${phone}?text=Hi, I found you on Choutuppal App!" target="_blank">💬 WhatsApp</a>`:''}
      </div>
    </div>`;
  }).join('');
  observeFadeIns();
}

function filterBusinesses() {
  const q = document.getElementById('searchInput').value.toLowerCase();
  const cat = document.getElementById('catFilter').value;
  displayBusinesses(allBusinesses.filter(b=>{
    const name=(b.name||b.Name||'').toLowerCase();
    const desc=(b.description||b.Description||'').toLowerCase();
    const bcat=b.category||b.Category||'';
    return (!q||name.includes(q)||desc.includes(q))&&(!cat||bcat===cat);
  }));
}

function filterByCategory(cat) {
  document.getElementById('catFilter').value = cat;
  filterBusinesses();
  document.getElementById('businesses').scrollIntoView({behavior:'smooth'});
}

// ============================================================
//  RENDER — NEWS
// ============================================================
function renderNews(data) {
  const grid = document.getElementById('newsGrid');
  if (!data.length){grid.innerHTML='<div class="empty-state"><span>📰</span>No news found</div>';return;}
  grid.innerHTML = data.map(n=>{
    const title=n.title||n.Title||'';
    const tag=n.tag||n.Tag||n.category||'News';
    const date=n.date||n.Date||'';
    const emoji=n.emoji||n.Emoji||'📰';
    return `<div class="news-card card fade-in">
      <div class="news-img-placeholder">${emoji}</div>
      <div class="news-body">
        <div class="news-tag">${tag}</div>
        <div class="news-title">${title}</div>
        <div class="news-date">📅 ${date}</div>
      </div>
    </div>`;
  }).join('');
  observeFadeIns();
}

// ============================================================
//  RENDER — REAL ESTATE
// ============================================================
function renderRealEstate(data) {
  const grid = document.getElementById('realEstateGrid');
  if (!data.length){grid.innerHTML='<div class="empty-state"><span>🏠</span>No properties found</div>';return;}
  grid.innerHTML = data.map(b=>{
    const name=b.name||b.Name||'';
    const cat=b.category||b.Category||'';
    const desc=b.description||b.Description||'';
    const phone=b.phone||b.Phone||'';
    const badge=(b.badge||b.Badge||'').trim();
    const badgeCls=badge.toLowerCase()==='featured'?'badge-featured':badge.toLowerCase()==='new'?'badge-new':'badge-sale';
    return `<div class="listing-card card fade-in">
      ${badge?`<span class="listing-badge ${badgeCls}">${badge}</span>`:''}
      <div class="listing-name">${name}</div>
      <div class="listing-cat">🏘️ ${cat}</div>
      <div class="listing-desc">${desc}</div>
      <div class="listing-meta">
        ${phone?`<a href="tel:${phone}" class="listing-phone">📞 ${phone}</a>`:''}
        ${phone?`<a class="btn-wa-small" href="https://wa.me/91${phone}?text=Hi, I saw this property on Choutuppal App!" target="_blank">💬 WhatsApp</a>`:''}
      </div>
    </div>`;
  }).join('');
  observeFadeIns();
}

// ============================================================
//  RENDER — TESTIMONIALS
// ============================================================
function renderTestimonials() {
  document.getElementById('testimonialsGrid').innerHTML = TESTIMONIALS.map(t=>`
    <div class="testi-card card fade-in">
      <div class="testi-quote">"${t.quote}"</div>
      <div class="testi-author">
        <div class="testi-avatar">${t.initial}</div>
        <div><div class="testi-name">${t.name}</div><div class="testi-role">${t.role}</div></div>
      </div>
    </div>`).join('');
  observeFadeIns();
}

// ============================================================
//  SPIN WHEEL
// ============================================================
const PRIZES = ['5 Coins','10 Coins','2 Coins','50 Coins','1 Coin','20 Coins','Try Again','5 Coins'];
const WHEEL_COLORS = ['#4169E1','#7c3aed','#0ea5e9','#10b981','#f59e0b','#ef4444','#6366f1','#4169E1'];
let spinning = false, currentAngle = 0;

function drawWheel(rotation=0) {
  const canvas = document.getElementById('wheelCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx=110, cy=110, r=104;
  const arc = (2*Math.PI)/PRIZES.length;
  ctx.clearRect(0,0,220,220);
  ctx.save();
  ctx.translate(cx,cy);
  ctx.rotate((rotation*Math.PI)/180);
  ctx.translate(-cx,-cy);
  PRIZES.forEach((p,i)=>{
    const start = i*arc - Math.PI/2;
    ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,start,start+arc);ctx.closePath();
    ctx.fillStyle=WHEEL_COLORS[i];ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,.2)';ctx.lineWidth=1.5;ctx.stroke();
    ctx.save();ctx.translate(cx,cy);ctx.rotate(start+arc/2);
    ctx.textAlign='right';ctx.fillStyle='rgba(255,255,255,.95)';
    ctx.font='bold 11px Inter,sans-serif';ctx.fillText(p,r-8,4);ctx.restore();
  });
  ctx.restore();
  // border
  ctx.beginPath();ctx.arc(cx,cy,r,0,2*Math.PI);
  ctx.strokeStyle='#4169E1';ctx.lineWidth=3;ctx.stroke();
  // center dot
  ctx.beginPath();ctx.arc(cx,cy,10,0,2*Math.PI);
  ctx.fillStyle='#fff';ctx.fill();
  // pointer triangle at top
  ctx.beginPath();ctx.moveTo(cx,cy-r-2);ctx.lineTo(cx-9,cy-r+14);ctx.lineTo(cx+9,cy-r+14);
  ctx.closePath();ctx.fillStyle='#fff';ctx.fill();
  ctx.strokeStyle='#4169E1';ctx.lineWidth=2;ctx.stroke();
}

function spinWheel() {
  if (spinning) return;
  const today = new Date().toDateString();
  if (localStorage.getItem('lastSpin_'+today)) {
    alert('ఈ రోజు Spin అయ్యింది! రేపు మళ్ళీ రండి 😊');
    return;
  }
  spinning = true;
  document.getElementById('spinBtn').disabled = true;
  const extraSpins = 1440 + Math.floor(Math.random()*360);
  const target = currentAngle + extraSpins;
  const duration = 4200;
  const startTime = performance.now();
  const startAngle = currentAngle;
  function animate(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed/duration, 1);
    const ease = 1 - Math.pow(1-progress, 4);
    currentAngle = startAngle + (target-startAngle)*ease;
    drawWheel(currentAngle);
    if (progress < 1) { requestAnimationFrame(animate); return; }
    spinning = false;
    const final = ((currentAngle%360)+360)%360;
    const ptr = (360-final+270)%360;
    const idx = Math.floor(ptr/(360/PRIZES.length))%PRIZES.length;
    localStorage.setItem('lastSpin_'+today,'1');
    setTimeout(()=>alert(`🎉 అభినందనలు! మీకు ${PRIZES[idx]} వచ్చింది!`),200);
    document.getElementById('spinBtn').disabled = false;
  }
  requestAnimationFrame(animate);
}

// ============================================================
//  THEME TOGGLE
// ============================================================
function toggleTheme() {
  const isLight = document.body.classList.contains('dark');
  document.body.classList.toggle('dark', !isLight);
  document.body.classList.toggle('light', isLight);
  document.getElementById('themeToggle').textContent = isLight ? '🌙' : '☀️';
  localStorage.setItem('theme', isLight ? 'dark' : 'light');
}

function loadTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.body.classList.remove('dark','light');
  document.body.classList.add(saved);
  document.getElementById('themeToggle').textContent = saved==='light' ? '☀️' : '🌙';
}

// ============================================================
//  MOBILE MENU
// ============================================================
document.getElementById('hamburger').addEventListener('click',()=>{
  document.getElementById('mobileMenu').classList.toggle('open');
});
function closeMobileMenu(){document.getElementById('mobileMenu').classList.remove('open');}

// ============================================================
//  BOTTOM NAV
// ============================================================
function setBottomActive(el) {
  document.querySelectorAll('.bottom-nav-item').forEach(a=>a.classList.remove('active'));
  el.classList.add('active');
}

// ============================================================
//  STICKY NAV
// ============================================================
window.addEventListener('scroll',()=>{
  const nav=document.getElementById('nav');
  nav.style.boxShadow=window.scrollY>40?'0 2px 24px rgba(0,0,0,.3)':'none';
});

// ============================================================
//  SCROLL FADE IN
// ============================================================
function observeFadeIns() {
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');obs.unobserve(e.target);}});
  },{threshold:0.08});
  document.querySelectorAll('.fade-in:not(.visible)').forEach(el=>obs.observe(el));
}

// ============================================================
//  INIT
// ============================================================
async function init() {
  loadTheme();
  renderCategories();
  renderTestimonials();
  drawWheel();

  const [bizData, newsData, reData] = await Promise.all([
    fetchSheet(SHEET_URLS.businesses),
    fetchSheet(SHEET_URLS.news),
    fetchSheet(SHEET_URLS.realestate),
  ]);

  renderBusinesses(bizData?.length ? bizData : SAMPLE_BUSINESSES);
  renderNews(newsData?.length ? newsData : SAMPLE_NEWS);
  renderRealEstate(reData?.length ? reData : SAMPLE_REALESTATE);
}

document.addEventListener('DOMContentLoaded', init);
