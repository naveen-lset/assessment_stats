/* ===========================================================================
   Antz Health — prototype logic: data, SVG charts, screen router
   =========================================================================== */

/* ----------------------------------------------------------------- ICONS -- */
const I = {
  chevron: '<svg viewBox="0 0 8 14" fill="none"><path d="M1 1l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back:    '<svg viewBox="0 0 12 20" fill="none"><path d="M11 1L2 10l9 9" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  search:  '<svg viewBox="0 0 16 16" fill="none"><circle cx="7" cy="7" r="5.2" stroke="currentColor" stroke-width="1.6"/><path d="M11 11l3.5 3.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  plus:    '<svg viewBox="0 0 26 26" fill="none"><path d="M13 5v16M5 13h16" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>',
  x:       '<svg viewBox="0 0 16 16" fill="none"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
  cal:     '<svg viewBox="0 0 18 18" fill="none"><rect x="2" y="3.5" width="14" height="12.5" rx="2.5" stroke="currentColor" stroke-width="1.5"/><path d="M2 7h14M6 1.5v3M12 1.5v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  clock:   '<svg viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7" stroke="currentColor" stroke-width="1.5"/><path d="M9 5v4l3 2" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check:   '<svg viewBox="0 0 18 18" fill="none"><path d="M3 9.5l4 4 8-9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowUp: '<svg viewBox="0 0 12 12" fill="none"><path d="M6 10V2M6 2L2.5 5.5M6 2l3.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  arrowDn: '<svg viewBox="0 0 12 12" fill="none"><path d="M6 2v8M6 10l3.5-3.5M6 10L2.5 6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  pencil:  '<svg viewBox="0 0 20 20" fill="none"><path d="M13.5 3.5l3 3L7 16l-3.5.5L4 13l9.5-9.5z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  star:    '<svg viewBox="0 0 22 22" fill="none"><path d="M11 2l2.6 5.6 6.1.7-4.5 4.2 1.2 6L11 15.8 5.6 18.5l1.2-6L2.3 8.3l6.1-.7L11 2z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"/></svg>',
  heart:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20.3l-1.45-1.32C5.4 14.25 2 11.16 2 7.5 2 4.5 4.42 2.1 7.5 2.1c1.74 0 3.41.81 4.5 2.09 1.09-1.28 2.76-2.09 4.5-2.09C19.58 2.1 22 4.5 22 7.5c0 3.66-3.4 6.75-8.55 11.49L12 20.3z"/></svg>',
  paw:     '<svg viewBox="0 0 24 24" fill="currentColor"><ellipse cx="6.2" cy="11" rx="2" ry="2.6"/><ellipse cx="10.3" cy="7.6" rx="2" ry="2.7"/><ellipse cx="13.7" cy="7.6" rx="2" ry="2.7"/><ellipse cx="17.8" cy="11" rx="2" ry="2.6"/><path d="M12 12.2c2.5 0 4.6 1.8 5.3 3.9.5 1.6-.7 3.1-2.4 3.1-1 0-1.9-.4-2.9-.4s-1.9.4-2.9.4c-1.7 0-2.9-1.5-2.4-3.1.7-2.1 2.8-3.9 5.3-3.9z"/></svg>',
  grid:    '<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="3" width="7.5" height="7.5" rx="2.4"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="2.4"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="2.4"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2.4"/></svg>',
  doc:     '<svg viewBox="0 0 24 24" fill="none"><path d="M6 2.6h7L19 8.4V20a1.4 1.4 0 01-1.4 1.4H6.4A1.4 1.4 0 015 20V4a1.4 1.4 0 011.4-1.4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M13 2.6V8.4h6" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M8.5 13h7M8.5 16.5h5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>',
  scale:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18M7 21h10M5 7h14l-3.2-2M5 7l3.2-2M5 7l-2.6 5.5a3 3 0 005.2 0L5 7zM19 7l-2.6 5.5a3 3 0 005.2 0L19 7z"/></svg>',
  eye:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" stroke-linejoin="round"/><circle cx="12" cy="12" r="2.7"/></svg>',
  bolt:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M13.2 2.3 4.7 13.1c-.5.6-.1 1.5.7 1.5H10l-1.1 6.9c-.1.9 1 1.4 1.6.7l8.8-11c.5-.6.1-1.5-.7-1.5H14l1-6.4c.1-.9-1-1.4-1.6-.7z"/></svg>',
  leaf:    '<svg viewBox="0 0 24 24" fill="none"><path d="M20.5 3.5C10 3.5 4 9.5 4 18.5c0 .6.4 1 1 1s1-.4 1-1c0-3.4 1.6-6 4.3-7.7-1.6 1.9-2.6 4.1-2.6 6.7 6.8 0 13.8-4.5 13.8-14z" fill="currentColor"/><path d="M11 14c1.6-2.4 4-4.2 6.5-5" stroke="#ffffff" stroke-opacity=".55" stroke-width="1.4" stroke-linecap="round"/></svg>',
  brain:   '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 4.2A2.5 2.5 0 008.5 6.7c0 .15.01.3.04.45A3 3 0 005 10c0 1 .5 1.9 1.3 2.5A3 3 0 008 17.8c.2 0 .4 0 .6-.05A2.5 2.5 0 0011 19.8V4.2z" opacity=".55"/><path d="M13 4.2A2.5 2.5 0 0115.5 6.7c0 .15-.01.3-.04.45A3 3 0 0119 10c0 1-.5 1.9-1.3 2.5A3 3 0 0116 17.8c-.2 0-.4 0-.6-.05A2.5 2.5 0 0113 19.8V4.2z"/></svg>',
  ruler:   '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="10" rx="2.2" stroke="currentColor" stroke-width="1.7"/><path d="M7 7v3M11 7v4M15 7v3M19 7v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>',
  drop:    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.6c0 0 6.5 6.7 6.5 12a6.5 6.5 0 11-13 0C5.5 9.3 12 2.6 12 2.6z"/></svg>',
  alert:   '<svg viewBox="0 0 24 24" fill="none"><path d="M12 3.4 21.2 19a1.3 1.3 0 01-1.1 2H3.9A1.3 1.3 0 012.8 19L12 3.4z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M12 9.5v4.6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="17.2" r="1.05" fill="currentColor"/></svg>',
  photo:   '<svg viewBox="0 0 24 24" fill="none"><rect x="3" y="4.5" width="18" height="15" rx="3" stroke="currentColor" stroke-width="1.7"/><circle cx="8.5" cy="9.7" r="1.8" fill="currentColor"/><path d="M3.6 17.5 9 12.6l3.4 3 3.3-3.2 4.7 4.6" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>',
  stats:   '<svg viewBox="0 0 24 24" fill="none"><path d="M4 20h16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><rect x="5.5" y="11" width="3.2" height="6.5" rx="1.1" fill="currentColor"/><rect x="10.4" y="6.5" width="3.2" height="11" rx="1.1" fill="currentColor"/><rect x="15.3" y="13.5" width="3.2" height="4" rx="1.1" fill="currentColor"/></svg>',
};

/* photo placeholder — clean, intentional image-thumbnail (real photos drop in later) */
function photoBox(name,{size=58,radius=16,emoji=''}={}){
  const h=Math.abs(hashStr(name)); const hue=150+(h%70);
  const ic=Math.round(size*0.46);
  const inner = emoji
    ? `<span style="font-size:${Math.round(size*0.52)}px;line-height:1;filter:drop-shadow(0 1px 1px rgba(0,0,0,.12))">${emoji}</span>`
    : `<svg viewBox="0 0 24 24" width="${ic}" height="${ic}" fill="none" style="opacity:.6">
      <rect x="3.5" y="5" width="17" height="14" rx="2.6" stroke="#5d6f69" stroke-width="1.5"/>
      <circle cx="8.6" cy="10" r="1.6" fill="#5d6f69"/>
      <path d="M4.2 17.5 9 13l3 2.6 3-2.8 4.8 4.7" stroke="#5d6f69" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
  return `<div class="photo" style="width:${size}px;height:${size}px;border-radius:${radius}px;
    background:linear-gradient(135deg,hsl(${hue} 24% 92%),hsl(${hue+18} 22% 84%));box-shadow:inset 0 0 0 1px rgba(0,0,0,.04)">
    ${inner}</div>`;
}

/* ------------------------------------------------------------- CATEGORIES -- */
const CATS = {
  physical:   { name:'Physical Health', color:'var(--physical)',   raw:'#FA6140', icon:I.heart, domain:3 },
  behaviour:  { name:'Behaviour',       color:'var(--behaviour)',  raw:'#8479F9', icon:I.bolt , domain:4 },
  environment:{ name:'Environment',     color:'var(--environment)',raw:'#00D6C9', icon:I.leaf , domain:2 },
  mental:     { name:'Mental Domain',   color:'var(--mental)',     raw:'#00AFD6', icon:I.brain, domain:5 },
  nutrition:  { name:'Nutrition',       color:'var(--nutrition)',  raw:'#37BD69', icon:I.drop , domain:1 },
};

/* --------------------------------------------------------------- HELPERS -- */
const days = ['Jun 2','Jun 5','Jun 8','Jun 11','Jun 14','Jun 17','Jun 20','Jun 23','Jun 26','Jun 29','Jul 2','Jul 5'];
function series(base, step, jitter, n){ const a=[]; for(let i=0;i<n;i++){ a.push(+(base+step*i+((i*37)%jitter)-jitter/2).toFixed(1)); } return a; }
function avg(a){ return a.reduce((x,y)=>x+y,0)/a.length; }

/* ----------------------------------------------------------------- DATA --- */
const METRICS = {
  weight:   { key:'weight',   name:'Weight',          cat:'physical', type:'line', unit:'kg',
              data: [186,187,185,188,190,189,191,193,192,195,196,198], labels:days },
  bodyscore:{ key:'bodyscore',name:'Body Condition',  cat:'physical', type:'bar', unit:'/9', max:9,
              data: [5,5,6,6,5,6,6,7,6,7,7,7], labels:days },
  eye:      { key:'eye',      name:'Eye Condition',    cat:'physical', type:'cat', unit:'',
              data: ['Good','Good','Fair','Good','Fair','Fair','Good','Good','Good','Good','Fair','Good'], labels:days,
              scale:{ Good:'#34C759', Fair:'#FF9500', Poor:'#FF375F' } },
  activity: { key:'activity', name:'Activity Level',   cat:'behaviour', type:'bar', unit:'/10', max:10,
              data: [6,7,5,8,7,6,8,9,7,8,9,8], labels:days },
  enrich:   { key:'enrich',   name:'Enrichment Response', cat:'behaviour', type:'line', unit:'%',
              data:[62,65,60,70,68,72,75,73,78,80,82,85], labels:days },
  food:     { key:'food',     name:'Food Intake',      cat:'nutrition', type:'line', unit:'kg',
              data:[8.2,8.0,7.6,8.4,8.1,7.9,8.3,8.6,8.2,8.5,8.7,8.4], labels:days },
  temp:     { key:'temp',     name:'Body Temperature', cat:'physical', type:'line', unit:'°C',
              data:[38.4,38.5,38.3,38.6,38.5,38.4,38.7,38.5,38.4,38.6,38.5,38.5], labels:days },
};

/* The collection — many animals. welfare = {nutrition,environment,physical,behaviour,mental} 0–100.
   `seen` = days since last assessment (drives "overdue"). */
const DEF_METRICS = ['weight','bodyscore','eye','activity','enrich','food','temp'];
const DEF_FAVS = ['weight','bodyscore','activity'];

/* SPECIES hold the taxonomy; individual animals live inside a species. */
const SPECIES = {
  lion:     { name:'Lion', latin:'Panthera leo', emoji:'🦁', taxon:{Class:'Mammalia',Order:'Carnivora',Family:'Felidae',Genus:'Panthera'} },
  gorilla:  { name:'Western Gorilla', latin:'Gorilla gorilla', emoji:'🦍', taxon:{Class:'Mammalia',Order:'Primates',Family:'Hominidae',Genus:'Gorilla'} },
  macaw:    { name:'Scarlet Macaw', latin:'Ara macao', emoji:'🦜', taxon:{Class:'Aves',Order:'Psittaciformes',Family:'Psittacidae',Genus:'Ara'} },
  penguin:  { name:'King Penguin', latin:'Aptenodytes patagonicus', emoji:'🐧', taxon:{Class:'Aves',Order:'Sphenisciformes',Family:'Spheniscidae',Genus:'Aptenodytes'} },
  flamingo: { name:'Greater Flamingo', latin:'Phoenicopterus roseus', emoji:'🦩', taxon:{Class:'Aves',Order:'Phoenicopteriformes',Family:'Phoenicopteridae',Genus:'Phoenicopterus'} },
  alligator:{ name:'American Alligator', latin:'Alligator mississippiensis', emoji:'🐊', taxon:{Class:'Reptilia',Order:'Crocodilia',Family:'Alligatoridae',Genus:'Alligator'} },
  python:   { name:'Reticulated Python', latin:'Malayopython reticulatus', emoji:'🐍', taxon:{Class:'Reptilia',Order:'Squamata',Family:'Pythonidae',Genus:'Malayopython'} },
  redpanda: { name:'Red Panda', latin:'Ailurus fulgens', emoji:'🐾', taxon:{Class:'Mammalia',Order:'Carnivora',Family:'Ailuridae',Genus:'Ailurus'} },
};
/* per-species meta for the Species page rows — date added, body-size class */
const SP_META = {
  lion:     { added:'Mar 2019', size:'Large'  },
  gorilla:  { added:'Jul 2016', size:'Large'  },
  macaw:    { added:'Jan 2022', size:'Small'  },
  penguin:  { added:'Sep 2020', size:'Medium' },
  flamingo: { added:'May 2018', size:'Medium' },
  alligator:{ added:'Nov 2017', size:'Large'  },
  python:   { added:'Feb 2021', size:'Medium' },
  redpanda: { added:'Aug 2023', size:'Small'  },
};
function spMeta(sp){ return SP_META[sp] || {added:'—', size:'—'}; }

/* individuals — multiple per species */
const COLLECTION = [
  { id:'lion-1', sp:'lion', name:'Simba', sex:'Male', stage:'Adult', age:'8y 2m', breed:'Breed 1', encl:'A11256', dna:'Spot', status:'In Transit', seen:1,
    favorites:['weight','bodyscore','activity'], metrics:['weight','bodyscore','eye','activity','enrich','food','temp'],
    welfare:{nutrition:88,environment:80,physical:84,behaviour:90,mental:76} },
  { id:'lion-2', sp:'lion', name:'Nala', sex:'Female', stage:'Adult', age:'7y', encl:'A11257', status:'Active', seen:2,
    welfare:{nutrition:90,environment:82,physical:88,behaviour:92,mental:84} },
  { id:'lion-3', sp:'lion', name:'Kovu', sex:'Male', stage:'Juvenile', age:'1y 6m', encl:'A11257', status:'Under Observation', seen:4,
    welfare:{nutrition:74,environment:70,physical:66,behaviour:62,mental:60} },
  { id:'gorilla-1', sp:'gorilla', name:'Koba', sex:'Male', stage:'Adult', age:'19y', encl:'P-07', status:'Active', seen:2,
    welfare:{nutrition:92,environment:90,physical:94,behaviour:96,mental:93} },
  { id:'gorilla-2', sp:'gorilla', name:'Mara', sex:'Female', stage:'Adult', age:'15y', encl:'P-07', status:'Active', seen:3,
    welfare:{nutrition:86,environment:84,physical:82,behaviour:80,mental:78} },
  { id:'macaw-1', sp:'macaw', name:'Rio', sex:'Male', stage:'Juvenile', age:'2y 4m', encl:'AV-12', status:'Active', seen:1,
    favorites:['weight','enrich','activity'], metrics:['weight','eye','activity','enrich','food'],
    welfare:{nutrition:90,environment:85,physical:82,behaviour:94,mental:88} },
  { id:'macaw-2', sp:'macaw', name:'Jewel', sex:'Female', stage:'Adult', age:'5y', encl:'AV-12', status:'Active', seen:6,
    favorites:['weight','enrich','activity'], metrics:['weight','eye','activity','enrich','food'],
    welfare:{nutrition:80,environment:78,physical:76,behaviour:82,mental:74} },
  { id:'penguin-1', sp:'penguin', name:'Pip', sex:'Female', stage:'Adult', age:'6y', encl:'AQ-03', status:'Active', seen:3,
    welfare:{nutrition:84,environment:88,physical:86,behaviour:82,mental:80} },
  { id:'flamingo-1', sp:'flamingo', name:'Rosa', sex:'Female', stage:'Adult', age:'11y', encl:'AV-04', status:'Active', seen:5,
    welfare:{nutrition:78,environment:80,physical:76,behaviour:74,mental:72} },
  { id:'alligator-1', sp:'alligator', name:'Snap', sex:'Female', stage:'Adult', age:'14y', encl:'R-204', status:'Active', seen:9,
    favorites:['weight','temp','bodyscore'], metrics:['weight','bodyscore','eye','temp','food'],
    welfare:{nutrition:72,environment:68,physical:78,behaviour:60,mental:64} },
  { id:'python-1', sp:'python', name:'Kaa', sex:'Male', stage:'Adult', age:'7y', encl:'R-118', status:'Active', seen:21,
    welfare:{nutrition:70,environment:66,physical:50,behaviour:58,mental:62} },
  { id:'redpanda-1', sp:'redpanda', name:'Maple', sex:'Female', stage:'Sub-adult', age:'3y', encl:'M-22', status:'Under Observation', seen:6,
    welfare:{nutrition:58,environment:60,physical:55,behaviour:48,mental:50} },
];
function enrich(a){ const s=SPECIES[a.sp];
  return {...a, species:s.name, latin:s.latin, emoji:s.emoji, taxon:s.taxon,
          breed:a.breed||'—', dna:a.dna||'—', metrics:a.metrics||DEF_METRICS, favorites:a.favorites||DEF_FAVS}; }
const ANIMALS = Object.fromEntries(COLLECTION.map(a=>[a.id,enrich(a)]));
function getAnimal(id){ return ANIMALS[id] || Object.values(ANIMALS)[0]; }
function speciesGroups(){ const g={}; Object.values(ANIMALS).forEach(a=>{(g[a.sp]=g[a.sp]||[]).push(a);}); return g; }

/* per-species shaping so charts differ by taxon */
function metricFor(animalId, key){
  const m = {...METRICS[key]};
  const sp = (ANIMALS[animalId]||{}).sp;
  if(sp==='alligator' && key==='weight'){ m.data = m.data.map(v=>+(v*1.4).toFixed(0)); }
  if(sp==='macaw' && key==='weight'){ m.unit='g'; m.data=[980,985,978,990,995,992,1001,1005,998,1010,1015,1020]; }
  if(sp==='alligator' && key==='temp'){ m.data = m.data.map(v=>+(v-9).toFixed(1)); }
  return m;
}

/* ---- time-range history (makes D/W/M/6M/Y actually work) ----------------- */
const HOURS=['6 AM','9 AM','12 PM','3 PM','6 PM','9 PM'];
function dateLabels(n,step){ const out=[],base=new Date('2026-06-08T12:00:00');
  for(let i=n-1;i>=0;i--){ const d=new Date(base); d.setDate(base.getDate()-i*step);
    out.push(d.toLocaleDateString('en-US',{month:'short',day:'numeric'})); } return out; }
function monthLabels(n){ const out=[],base=new Date('2026-06-08T12:00:00');
  for(let i=n-1;i>=0;i--){ const d=new Date(base); d.setMonth(base.getMonth()-i);
    out.push(d.toLocaleDateString('en-US',{month:'short'})); } return out; }
function rangeCfg(r){ return ({
  D:{n:6,labels:HOURS,unitWord:'today, hourly'},
  W:{n:7,labels:dateLabels(7,1),unitWord:'this week, daily'},
  M:{n:30,labels:dateLabels(30,1),unitWord:'30 days, daily'},
  '6M':{n:26,labels:dateLabels(26,7),unitWord:'6 months, weekly'},
  Y:{n:12,labels:monthLabels(12),unitWord:'12 months, monthly'},
}[r] || {n:12,labels:dateLabels(12,3),unitWord:''}); }

/* deterministic history for a metric over a range (stable across renders) */
function seriesFor(animalId,key,range){
  const m=metricFor(animalId,key); const cfg=rangeCfg(range); const n=cfg.n;
  const out={key, name:m.name, cat:m.cat, type:m.type, unit:m.unit, max:m.max, scale:m.scale, labels:cfg.labels, rangeWord:cfg.unitWord};
  const seed=Math.abs(hashStr(animalId+key+range));
  if(m.type==='cat'){
    const data=[];
    for(let i=0;i<n;i++){ const s=(seed+i*7)%10, recent=i/(n-1);
      data.push( s<1 && recent<0.45 ? 'Poor' : (s<4 && recent<0.7 ? 'Fair' : 'Good') ); }
    out.data=data; return out;
  }
  const base=m.data, end=base[base.length-1];
  const span=(Math.max(...base)-Math.min(...base))||Math.abs(end)*0.05||1;
  const amp=span*0.55;
  const trend = range==='Y'?span*1.7: range==='6M'?span*1.25: range==='M'?span*0.8: range==='W'?span*0.35: span*0.18;
  const intScale = m.unit==='/9'||m.unit==='/10'||m.max;
  const data=[];
  for(let i=0;i<n;i++){ const t=n>1?i/(n-1):1;
    const wave=Math.sin(i*0.8+(seed%6))*amp*0.5 + ((((seed+i*53)%7)-3)/3)*amp*0.35;
    let v=end - trend*(1-t) + wave;
    if(intScale) v=Math.round(Math.max(1,Math.min(m.max||10,v)));
    else v=+v.toFixed(m.unit==='°C'?1:(Math.abs(end)<60?1:0));
    data.push(v);
  }
  data[data.length-1]=end; // anchor "now" to the latest known value
  out.data=data; return out;
}

/* ============================================================ CHART ENGINE = */
/* smooth cubic curve through points (Catmull-Rom → bezier) */
function smoothPath(pts){
  if(pts.length<2) return pts.length?`M${pts[0][0]} ${pts[0][1]}`:'';
  let d=`M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for(let i=0;i<pts.length-1;i++){
    const p0=pts[i-1]||pts[i], p1=pts[i], p2=pts[i+1], p3=pts[i+2]||p2;
    const c1x=p1[0]+(p2[0]-p0[0])/6, c1y=p1[1]+(p2[1]-p0[1])/6;
    const c2x=p2[0]-(p3[0]-p1[0])/6, c2y=p2[1]-(p3[1]-p1[1])/6;
    d+=`C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}
/* animated draw-in for a line path (normalized via pathLength) */
function drawAnim(dur='0.9s'){ return `<animate attributeName="stroke-dashoffset" values="1;0" dur="${dur}" begin="0s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.2 1" keyTimes="0;1"/>`; }

function lineChart(data, color, {w=350,h=170,unit='',showAvg=true,labels=days}={}){
  const pad={l:8,r:8,t:16,b:22};
  const min=Math.min(...data), max=Math.max(...data);
  const span=(max-min)||1; const lo=min-span*0.25, hi=max+span*0.25; const rng=hi-lo;
  const iw=w-pad.l-pad.r, ih=h-pad.t-pad.b;
  const X=i=> pad.l + (i/(data.length-1))*iw;
  const Y=v=> pad.t + (1-(v-lo)/rng)*ih;
  const pts=data.map((v,i)=>[X(i),Y(v)]);
  const line=smoothPath(pts);
  const area=line+` L${(pad.l+iw).toFixed(1)} ${pad.t+ih} L${pad.l} ${pad.t+ih} Z`;
  const a=avg(data); const ay=Y(a);
  const last=pts[pts.length-1];
  const gid='g'+Math.abs(hashStr(color+data.join()));
  let grid=''; for(let g=0;g<=2;g++){ const y=pad.t+ih*g/2; grid+=`<line x1="${pad.l}" y1="${y.toFixed(1)}" x2="${pad.l+iw}" y2="${y.toFixed(1)}" stroke="var(--separator)" stroke-width="1"/>`; }
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">
    <defs><linearGradient id="${gid}" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${color}" stop-opacity=".26"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs>
    ${grid}
    ${showAvg?`<line x1="${pad.l}" y1="${ay}" x2="${pad.l+iw}" y2="${ay}" stroke="#C4C4C6" stroke-width="1" stroke-dasharray="3 4"/>
       <text x="${pad.l}" y="${ay-5}" font-size="10" fill="#8A8A8E">avg ${a.toFixed(1)}</text>`:''}
    <path d="${area}" fill="url(#${gid})" opacity="0"><animate attributeName="opacity" values="0;1" dur="0.6s" begin="0.25s" fill="freeze"/></path>
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1">${drawAnim()}</path>
    <circle cx="${last[0]}" cy="${last[1]}" r="0" fill="${color}" stroke="#fff" stroke-width="2.5"><animate attributeName="r" values="0;5" dur="0.3s" begin="0.8s" fill="freeze"/></circle>
    <text x="${X(0)}" y="${h-6}" font-size="10" fill="#8A8A8E">${labels[0]}</text>
    ${data.length>2?`<text x="${X((data.length-1)/2)}" y="${h-6}" font-size="10" fill="#8A8A8E" text-anchor="middle">${labels[Math.floor((labels.length-1)/2)]}</text>`:''}
    <text x="${X(data.length-1)}" y="${h-6}" font-size="10" fill="#8A8A8E" text-anchor="end">${labels[labels.length-1]}</text>
  </svg>`;
}

function barChart(data, color, {w=350,h=170,max=null,labels=days}={}){
  const pad={l:8,r:8,t:14,b:22};
  const top = max || Math.max(...data);
  const iw=w-pad.l-pad.r, ih=h-pad.t-pad.b;
  const bw = iw/data.length*0.56;
  const gap = iw/data.length;
  const base=pad.t+ih;
  let bars='';
  data.forEach((v,i)=>{
    const bh = (v/top)*ih;
    const x = pad.l + gap*i + (gap-bw)/2;
    const y = base - bh;
    const fade = i===data.length-1 ? 1 : .82;
    bars += `<rect x="${x.toFixed(1)}" y="${base.toFixed(1)}" width="${bw.toFixed(1)}" height="0" rx="${(bw/2.4).toFixed(1)}" fill="${color}" opacity="${fade}">
      <animate attributeName="height" values="0;${bh.toFixed(1)}" dur="0.5s" begin="${(i*0.04).toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.2 1" keyTimes="0;1"/>
      <animate attributeName="y" values="${base.toFixed(1)};${y.toFixed(1)}" dur="0.5s" begin="${(i*0.04).toFixed(2)}s" fill="freeze" calcMode="spline" keySplines="0.33 0 0.2 1" keyTimes="0;1"/></rect>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">
    ${bars}
    <text x="${pad.l}" y="${h-6}" font-size="10" fill="#8A8A8E">${labels[0]}</text>
    ${data.length>2?`<text x="${w/2}" y="${h-6}" font-size="10" fill="#8A8A8E" text-anchor="middle">${labels[Math.floor((labels.length-1)/2)]}</text>`:''}
    <text x="${w-pad.r}" y="${h-6}" font-size="10" fill="#8A8A8E" text-anchor="end">${labels[labels.length-1]}</text>
  </svg>`;
}

function catChart(data, scale, {w=350,h=150,labels=days}={}){
  const pad={l:8,r:8,t:18,b:22};
  const iw=w-pad.l-pad.r;
  const gap=iw/data.length, dotR=8;
  const levels=Object.keys(scale); // Good, Fair, Poor
  const rowY=lvl=> pad.t + (levels.indexOf(lvl))*((h-pad.t-pad.b)/(levels.length-1||1));
  let lvlTxt='', dots='';
  levels.forEach(lvl=>{
    lvlTxt+=`<text x="${pad.l}" y="${rowY(lvl)+4}" font-size="11" fill="${scale[lvl]}" font-weight="600">${lvl}</text>`;
  });
  const cx=i=> pad.l + 46 + (i/(data.length-1||1))*(iw-54);
  let path='';
  data.forEach((v,i)=>{ path += (i?'L':'M')+cx(i)+' '+rowY(v)+' '; });
  dots += `<path d="${path}" fill="none" stroke="#D8D8DC" stroke-width="2"/>`;
  data.forEach((v,i)=>{ dots += `<circle cx="${cx(i)}" cy="${rowY(v)}" r="${dotR}" fill="${scale[v]}" stroke="#fff" stroke-width="2"/>`; });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">${lvlTxt}${dots}
    <text x="${pad.l+46}" y="${h-6}" font-size="10" fill="#8A8A8E">${labels[0]}</text>
    <text x="${w-pad.r}" y="${h-6}" font-size="10" fill="#8A8A8E" text-anchor="end">${labels[labels.length-1]}</text></svg>`;
}

function sparkBars(data, color, {w=84,h=30}={}){
  const max=Math.max(...data)||1, n=data.length, gap=w/n, bw=gap*0.62;
  let b=''; data.forEach((v,i)=>{ const bh=Math.max(2,(v/max)*(h-2)), x=gap*i+(gap-bw)/2, y=h-bh;
    b+=`<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}" height="${bh.toFixed(1)}" rx="${(bw/2.5).toFixed(1)}" fill="${color}" opacity="${i===n-1?1:.45}"/>`; });
  return `<svg viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${b}</svg>`;
}
function sparkline(data, color, {w=90,h=30}={}){
  const min=Math.min(...data),max=Math.max(...data),rng=(max-min)||1;
  const pts=data.map((v,i)=>[ (i/(data.length-1))*w, h-2-((v-min)/rng)*(h-6) ]);
  const line=pts.map((p,i)=>(i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1)).join(' ');
  const last=pts[pts.length-1];
  return `<svg class="spark" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
    <path d="${line}" fill="none" stroke="${color}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
    <circle cx="${last[0]}" cy="${last[1]}" r="3" fill="${color}"/></svg>`;
}

function hashStr(s){ let h=0; for(let i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))|0;} return h; }

/* ---- Five-Domain Welfare Dial (the signature, welfare-science viz) -------- */
/* Per-animal domain scores 0–100, ordered Nutrition→Env→Health→Behaviour→Mental */
const WELFARE = Object.fromEntries(COLLECTION.map(a=>[a.id,a.welfare]));
const DOMAIN_ORDER = ['nutrition','environment','physical','behaviour','mental'];

/* ---- collection-level aggregates (the dashboard math) -------------------- */
function welfareIndex(w){ return Math.round(DOMAIN_ORDER.reduce((s,d)=>s+w[d],0)/5); }
function welfareLabel(v){ return v>=85?'Excellent': v>=70?'Good': v>=55?'Fair':'Watch'; }
function welfareColor(v){ return v>=85?'#37BD69': v>=70?'#00D6C9': v>=55?'#E4B819':'#FA6140'; }
function isAttention(a){ const idx=welfareIndex(a.welfare);
  return idx<70 || DOMAIN_ORDER.some(d=>a.welfare[d]<55) || a.seen>14; }
function attentionReason(a){
  const idx=welfareIndex(a.welfare);
  const low=DOMAIN_ORDER.find(d=>a.welfare[d]<55);
  if(a.seen>14) return `Assessment overdue · ${a.seen} days`;
  if(low) return `${CATS[low].name} low (${a.welfare[low]})`;
  if(idx<70) return `Welfare index ${idx} · ${welfareLabel(idx)}`;
  return '';
}
function collectionStats(){
  const all=Object.values(ANIMALS);   // enriched (carry emoji/species/taxon)
  const idxs=all.map(a=>welfareIndex(a.welfare));
  const avg=Math.round(idxs.reduce((s,v)=>s+v,0)/idxs.length);
  const dist={Excellent:0,Good:0,Fair:0,Watch:0};
  idxs.forEach(v=>dist[welfareLabel(v)]++);
  const domAvg={}; DOMAIN_ORDER.forEach(d=>domAvg[d]=Math.round(all.reduce((s,a)=>s+a.welfare[d],0)/all.length));
  const attention=all.filter(isAttention).sort((a,b)=>welfareIndex(a.welfare)-welfareIndex(b.welfare));
  return {count:all.length, avg, dist, domAvg, attention};
}
/* assessments logged per day, last 14 days (compliance/activity) */
const ACTIVITY_14 = [9,12,7,14,11,8,16,12,6,15,18,13,11,19];

function polar(cx,cy,r,deg){ const a=(deg-90)*Math.PI/180; return [cx+r*Math.cos(a), cy+r*Math.sin(a)]; }
function arcPath(cx,cy,r,a0,a1){
  const [x0,y0]=polar(cx,cy,r,a0), [x1,y1]=polar(cx,cy,r,a1);
  const large=(a1-a0)<=180?0:1;
  return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}
function welfareDial(scores, {size=150, light=false}={}){
  const cx=size/2, cy=size/2, r=size/2-13, sw=14, gap=10, seg=360/5;
  const trackCol = light?'rgba(20,60,45,.07)':'rgba(255,255,255,.12)';
  const bigCol = light?'#16242A':'#fff';
  const labCol = light?'#7C8B8C':'#9fc3c0';
  let track='', fill='';
  DOMAIN_ORDER.forEach((dom,i)=>{
    const a0=i*seg+gap/2, a1=i*seg+seg-gap/2;
    track += `<path d="${arcPath(cx,cy,r,a0,a1)}" stroke="${trackCol}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
    const s=Math.max(0,Math.min(100,scores[dom]))/100;
    const aEnd=a0+(a1-a0)*s;
    fill += `<path d="${arcPath(cx,cy,r,a0,aEnd)}" stroke="${CATS[dom].raw}" stroke-width="${sw}" fill="none" stroke-linecap="round"/>`;
  });
  const overall=Math.round(DOMAIN_ORDER.reduce((s,d)=>s+scores[d],0)/5);
  const label = welfareLabel(overall);
  return `<svg class="dial" viewBox="0 0 ${size} ${size}">
    ${track}${fill}
    <text x="${cx}" y="${cy-2}" text-anchor="middle" class="dial-center-big" fill="${bigCol}">${overall}</text>
    <text x="${cx}" y="${cy+15}" text-anchor="middle" class="dial-center-lab" fill="${labCol}">${label}</text>
  </svg>`;
}

/* mini progress ring for metric cards (ref 1) */
function ringMini(frac, color, {size=62, label='', fs=14}={}){
  const cx=size/2, cy=size/2, r=size/2-6, sw=7;
  const C=2*Math.PI*r; const off=C*(1-Math.max(0.02,Math.min(1,frac)));
  return `<svg class="ringmini" width="${size}" height="${size}" style="width:${size}px;height:${size}px;flex:0 0 auto" viewBox="0 0 ${size} ${size}">
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}22" stroke-width="${sw}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round"
      stroke-dasharray="${C.toFixed(1)}" stroke-dashoffset="${off.toFixed(1)}" transform="rotate(-90 ${cx} ${cy})"/>
    ${label?`<text x="${cx}" y="${cy+fs*0.35}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="${color}">${label}</text>`:''}
  </svg>`;
}

/* lollipop bar chart (ref 1 "Daily Score") — rounded stems + circle caps */
function lollipopChart(data, {w=350,h=170,max=null,labels=days,colorFn=null,baseColor='#17A186'}={}){
  const pad={l:8,r:8,t:16,b:24}; const top=max||Math.max(...data)*1.1;
  const iw=w-pad.l-pad.r, ih=h-pad.t-pad.b; const n=data.length; const gap=iw/n;
  const base=pad.t+ih;
  let stems='';
  data.forEach((v,i)=>{
    const x=pad.l+gap*i+gap/2; const y=base-(v/top)*ih;
    const col=colorFn?colorFn(v,i):baseColor;
    stems+=`<line x1="${x.toFixed(1)}" y1="${base}" x2="${x.toFixed(1)}" y2="${(y+7).toFixed(1)}" stroke="${col}" stroke-width="6" stroke-linecap="round" opacity=".5"/>
      <circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="6.5" fill="${col}"/>`;
  });
  return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="display:block">
    ${[0.33,0.66,1].map(g=>`<line x1="${pad.l}" y1="${(base-g*ih).toFixed(1)}" x2="${pad.l+iw}" y2="${(base-g*ih).toFixed(1)}" stroke="#EAEFEC" stroke-width="1" stroke-dasharray="2 5"/>`).join('')}
    ${stems}
    <text x="${pad.l}" y="${h-6}" font-size="10" fill="#9aa8a4">${labels[0]}</text>
    <text x="${w-pad.r}" y="${h-6}" font-size="10" fill="#9aa8a4" text-anchor="end">${labels[labels.length-1]}</text>
  </svg>`;
}

/* ============================================================== STATE ====== */
let STATE = { animal:'lion-1', tab:'dashboard', range:'M', homeRange:'W', asmtRange:'W' };

/* generic interactive filter: set a STATE key + re-render the current screen */
function setFilter(key,val){ STATE[key]=val; render(); }

/* compact in-card segmented filter (Week / Month / Year etc.) */
function segMini(stateKey, opts, cur){
  return `<div class="seg-mini">${opts.map(o=>{
    const v=typeof o==='string'?o:o.v, lab=typeof o==='string'?o:o.lab;
    return `<button class="${v===cur?'on':''}" onclick="setFilter('${stateKey}','${v}')">${lab}</button>`;
  }).join('')}</div>`;
}

/* assessment-activity series per range (Week → 7 daily bars, Month → weekly, Year → monthly) */
function activityFor(range){
  if(range==='M') return { data:[38,44,29,52,41,47,33,49], labels:['W1','W2','W3','W4','W5','W6','W7','W8'],
    total:333, prev:298, unit:'8 weeks' };
  if(range==='Y') return { data:[210,245,198,276,233,261,224,298,254,288,312,341], labels:monthLabels(12),
    total:3140, prev:2760, unit:'12 months' };
  // Week (default) — last 7 days
  return { data:ACTIVITY_14.slice(7), labels:dateLabels(7,1),
    total:ACTIVITY_14.slice(7).reduce((x,y)=>x+y,0), prev:ACTIVITY_14.slice(0,7).reduce((x,y)=>x+y,0), unit:'this week' };
}
const stack = [];           // nav history of {render fn key, params}
let current = null;

/* ============================================================== ROUTER ===== */
const VP = () => document.getElementById('viewport');

function go(key, params={}, replace=false){
  if(current && !replace) stack.push(current);
  current = {key, params};
  render();
}
function back(){
  if(stack.length){ current = stack.pop(); render(); }
}
function switchTab(tab){
  STATE.tab = tab;
  stack.length = 0;
  if(tab==='dashboard') current={key:'dashboard',params:{}};
  if(tab==='species')   current={key:'species',params:{}};
  if(tab==='setup')     current={key:'setup',params:{}};
  if(tab==='modules')   current={key:'modules',params:{}};
  render();
}

function render(){
  const {key,params} = current;
  VP().innerHTML = SCREENS[key](params);
  document.getElementById('statusbar').className='statusbar'; // light theme → dark status text
}

/* ---- small reusable bits -------------------------------------------------- */
function navbar({title='',back:b=true,dark=false,actions=''}={}){
  return `<div class="nav ${dark?'dark':''}">
    ${b?`<div class="back" onclick="back()">${I.back}<span>Back</span></div>`:'<div class="spacer"></div>'}
    <div class="nav-title">${title}</div>
    <div class="nav-actions">${actions}</div>
  </div>`;
}
function trendBadge(data){
  const d = data[data.length-1]-data[0];
  if(Math.abs(d) < (Math.max(...data)*0.01)) return `<span class="tile-trend trend-flat">— stable</span>`;
  const up=d>0;
  return `<span class="tile-trend ${up?'trend-up':'trend-down'}">${up?I.arrowUp:I.arrowDn}${up?'+':''}${d.toFixed(1)}</span>`;
}
function latestStr(m){
  const v=m.data[m.data.length-1];
  if(m.type==='cat') return v;
  return v+(m.unit?' '+m.unit.replace('/',' / '):'');
}

/* ============================================================== SCREENS ==== */
const SCREENS = {};

/* ---------- COLLECTION DASHBOARD (multi-animal home) ----------------------- */
const DIST_COLORS = { Excellent:'#37BD69', Good:'#00D6C9', Fair:'#E4B819', Watch:'#FA6140' };
function distBar(dist,total){
  const seg=Object.entries(dist).filter(([k,v])=>v>0)
    .map(([k,v])=>`<span style="width:${(v/total*100).toFixed(1)}%;background:${DIST_COLORS[k]}"></span>`).join('');
  const legend=Object.entries(dist).map(([k,v])=>`<div class="dl"><i style="background:${DIST_COLORS[k]}"></i>${k} <b>${v}</b></div>`).join('');
  return `<div class="distbar">${seg}</div><div class="dist-legend">${legend}</div>`;
}
function domBars(domAvg){
  const lowest=DOMAIN_ORDER.reduce((a,b)=>domAvg[a]<=domAvg[b]?a:b);
  const rows=DOMAIN_ORDER.map(d=>{const c=CATS[d];return `<div class="dom-row">
    <span class="dr-name" style="${d===lowest?'font-weight:700;color:'+c.raw:''}">${c.name}</span>
    <span class="dr-track"><span class="dr-fill" style="width:${domAvg[d]}%;background:${c.raw}"></span></span>
    <span class="dr-val" style="color:${c.raw}">${domAvg[d]}</span></div>`;}).join('');
  return {rows, lowest};
}

const RECENT_FEED = [
  {animal:'Simba', id:'lion-1', metric:'weight', text:'Weight 198 kg', time:'12m'},
  {animal:'Maple', id:'redpanda-1', metric:'activity', text:'Activity Level 4 / 10', time:'1h'},
  {animal:'Koba', id:'gorilla-1', metric:'eye', text:'Eye Condition Good', time:'2h'},
  {animal:'Pip', id:'penguin-1', metric:'food', text:'Food Intake 1.2 kg', time:'3h'},
  {animal:'Snap', id:'alligator-1', metric:'bodyscore', text:'Body Condition 6 / 9', time:'5h'},
];

/* branded headers — the Antz dark-teal band, our identity (not Apple's) */
function tabHeader(title, sub, {insights=false}={}){
  const t = insights ? `${title} <span class="muted2">Insights</span><span class="spark">✦</span>` : title;
  return `<div class="tabhdr"><div class="tabhdr-row">
    <div><div class="th-title">${t}</div><div class="th-sub">${sub}</div></div>
    <div class="th-avatar">RB</div></div></div>`;
}
function appHeader(title, {sub='',back=false,action=''}={}){
  return `<div class="apphdr"><div class="apphdr-bar">
    ${back?`<span class="hdr-back" onclick="back()">${I.back}</span>`:'<span style="width:30px"></span>'}
    <span class="hdr-mid">${title}</span>
    <span class="hdr-act">${action||'<span style="width:30px"></span>'}</span>
  </div>${sub?`<div class="apphdr-sub">${sub}</div>`:''}</div>`;
}

function collectionWelfareCard(s){
  const lowest=DOMAIN_ORDER.reduce((a,b)=>s.domAvg[a]<=s.domAvg[b]?a:b);
  const legend=DOMAIN_ORDER.map(d=>{const c=CATS[d];return `<div class="wl-row">
    <span class="wl-dot" style="background:${c.raw}"></span><span class="wl-name">${c.name}</span>
    <span class="wl-score" style="color:${c.raw}">${s.domAvg[d]}</span></div>`;}).join('');
  return `<div class="welfare-lite">
    <div class="welfare-top"><span class="w-title">Collection Welfare · Five Domains</span><span class="w-when">${s.count} animals</span></div>
    <div class="welfare-body">${welfareDial(s.domAvg,{light:true})}<div class="welfare-legend">${legend}</div></div>
    <div class="welfare-foot"><span class="wf-dot"></span><span><b>${CATS[lowest].name}</b> is the weakest domain (avg ${s.domAvg[lowest]}) — focus husbandry & enrichment here.</span></div>
  </div>`;
}

SCREENS.dashboard = () => {
  const s=collectionStats();
  const logged7=ACTIVITY_14.slice(7).reduce((x,y)=>x+y,0);
  const delta=logged7-ACTIVITY_14.slice(0,7).reduce((x,y)=>x+y,0);

  return `<div class="screen active"><div class="scroll">
    ${tabHeader('Dashboard', `${s.count} animals · ${Object.keys(SPECIES).length} species`, {insights:true})}

    ${collectionWelfareCard(s)}

    <div class="tile-grid">
      <div class="stile" onclick="switchTab('species')">
        <div class="st-ico" style="background:rgba(23,161,134,.12);color:var(--antz)">${I.paw}</div>
        <div class="st-num">${s.count}</div><div class="st-lab">${Object.keys(SPECIES).length} species</div></div>
      <div class="stile" onclick="document.querySelector('#attn').scrollIntoView({behavior:'smooth'})">
        <div class="st-ico" style="background:rgba(199,107,74,.14);color:#C76B4A">${I.alert}</div>
        <div class="st-num" style="color:#C76B4A">${s.attention.length}</div><div class="st-lab">need attention</div></div>
      <div class="stile">
        <div class="st-spark">${sparkBars(ACTIVITY_14.slice(7),'#17A186')}</div>
        <div class="st-num">${logged7}</div><div class="st-lab trend-up">${I.arrowUp}+${delta} · 7d</div></div>
    </div>

    <div class="section-head"><h2 id="attn">Needs Attention</h2><span class="muted" style="font-size:15px">${s.attention.length}</span></div>
    <div class="list">
      ${s.attention.map(a=>{const idx=welfareIndex(a.welfare);const col=welfareColor(idx);return `
        <div class="attn-row" onclick="openAnimal('${a.id}')">
          <span class="a-bar" style="background:${col}"></span>
          <div class="a-emoji" style="background:${col}26">${a.emoji}</div>
          <div class="a-body"><div class="a-name">${a.name} <span class="a-species">${a.species}</span></div>
            <div class="a-reason" style="color:${col}">${attentionReason(a)}</div></div>
          <span class="idx-pill" style="background:${col}">${idx}</span>
          <span class="chev" style="color:var(--label-tertiary);margin-left:6px">${I.chevron}</span>
        </div>`;}).join('')}
    </div>

    <div class="section-head"><h2>Welfare Tiers</h2><span class="muted" style="font-size:14px">${s.count} animals</span></div>
    <div class="card card-pad">${distBar(s.dist,s.count)}</div>

    <div class="section-head"><h2>Assessment Activity</h2><span class="muted" style="font-size:14px">last 14 days</span></div>
    <div class="chart-wrap" style="padding:16px 12px 10px">
      ${lollipopChart(ACTIVITY_14,{labels:dateLabels(14,1),colorFn:(v)=>v>=15?'#2FAE73':(v<8?'#C9A227':'#17A186')})}
      <div style="display:flex;gap:18px;padding:8px 6px 2px;border-top:1px solid var(--separator);margin-top:6px">
        <div><div style="font-size:13px;color:var(--label-secondary)">Busiest day</div><div style="font-size:19px;font-weight:800">${Math.max(...ACTIVITY_14)} <small style="font-size:12px;color:var(--label-secondary);font-weight:600">logs</small></div></div>
        <div><div style="font-size:13px;color:var(--label-secondary)">Daily average</div><div style="font-size:19px;font-weight:800">${Math.round(ACTIVITY_14.reduce((x,y)=>x+y,0)/14)} <small style="font-size:12px;color:var(--label-secondary);font-weight:600">logs</small></div></div>
      </div>
    </div>

    <div class="section-head"><h2>Recent Activity</h2><span class="show-all" onclick="switchTab('species')">All</span></div>
    <div class="list">
      ${RECENT_FEED.map(f=>{const c=CATS[METRICS[f.metric].cat];return `
        <div class="feed-row" onclick="openAnimal('${f.id}')">
          <span class="f-ico" style="background:${c.raw}">${c.icon}</span>
          <div class="f-main"><b>${f.animal}</b> · ${f.text}</div>
          <span class="f-time">${f.time}</span></div>`;}).join('')}
    </div>
  </div></div>`;
};

/* ---------- SUMMARY (Apple Health style, scoped to one animal) ------------- */
SCREENS.summary = () => {
  const a = getAnimal(STATE.animal);
  const idx = welfareIndex(a.welfare);
  // per-animal assessment stats by range (Week / Month / Year)
  const R = ({W:{count:6,types:4,word:'this week'},M:{count:24,types:6,word:'this month'},Y:{count:288,types:7,word:'this year'}})[STATE.asmtRange]||{count:6,types:4,word:'this week'};

  // assessment TYPES for this animal (Weight, Body Condition, …)
  const typeRows = a.metrics.map(k=>{
    const m=metricFor(a.id,k); const c=CATS[m.cat]; const last=m.data[m.data.length-1];
    const val = m.type==='cat' ? last : `${last}${m.unit?' '+m.unit:''}`;
    return `<div class="atype-row" onclick="go('metric',{key:'${k}'})">
      <span class="at-ico" style="background:${c.raw}1f;color:${c.raw}">${c.icon}</span>
      <div class="at-body"><div class="at-name">${m.name}</div><div class="at-cat">${c.name}</div></div>
      <span class="at-val">${val}</span><span class="chev" style="color:var(--label-tertiary);margin-left:8px">${I.chevron}</span>
    </div>`;}).join('');

  // recent assessment log (most recent entries across types)
  const logRows = a.metrics.slice(0,5).map((k,i)=>{
    const m=metricFor(a.id,k); const c=CATS[m.cat]; const last=m.data[m.data.length-1];
    const when=['Today','Today','Yesterday','2 days ago','3 days ago'][i]||`${i} days ago`;
    const val = m.type==='cat' ? last : `${last}${m.unit?' '+m.unit:''}`;
    return `<div class="log-row" onclick="go('metric',{key:'${k}'})">
      <span class="lg-dot" style="background:${c.raw}"></span>
      <div class="lg-body"><div class="lg-t">${m.name} · <b>${val}</b></div><div class="lg-when">${when} · ${a.encl}</div></div>
      <span class="chev" style="color:var(--label-tertiary)">${I.chevron}</span></div>`;}).join('');

  return `
  <div class="screen active"><div class="scroll">
    ${appHeader(a.name, {back:true, sub:`${a.species} · ${a.sex} · ${a.encl}`,
      action:`<span class="hdr-ico" onclick="go('profile')" style="font-size:18px">${a.emoji}</span>`})}

    <div class="asmt-hero">
      ${photoBox(a.name,{size:60,radius:16,emoji:a.emoji})}
      <div class="ah-id"><div class="ah-name">${a.name}</div><div class="ah-sub">${a.stage} · ${a.age}</div></div>
      ${ringMini(idx/100, welfareColor(idx), {size:58, label:String(idx), fs:17})}
    </div>

    <div class="hcard" style="margin:0 16px 14px">
      <div class="hcard-head"><div class="hc-t">Assessment Stats <small>${R.word}</small></div></div>
      ${segMini('asmtRange',[{v:'W',lab:'Week'},{v:'M',lab:'Month'},{v:'Y',lab:'Year'}],STATE.asmtRange)}
      <div class="risk-count" style="margin-top:6px">
        <div class="rc-cell"><div class="rc-n">${R.count}</div><div class="rc-l">Assessments</div></div>
        <div class="rc-cell"><div class="rc-n">${R.types}</div><div class="rc-l">Types</div></div>
        <div class="rc-cell"><div class="rc-n" style="color:${welfareColor(idx)}">${idx}</div><div class="rc-l">Welfare</div></div>
      </div>
    </div>

    <button class="btn-fill" onclick="openLogAssessment('${a.id}')">${I.plus}<span style="margin-left:6px">Log New Assessment</span></button>

    <div class="section-head"><h2>Assessment Types</h2><span class="muted" style="font-size:14px">${a.metrics.length}</span></div>
    <div class="atype-list">${typeRows}</div>

    <div class="section-head"><h2>Recent Assessment Log</h2><span class="show-all" onclick="go('alldata')">All</span></div>
    <div class="log-list">${logRows}</div>
  </div></div>`;
};

function welfareCard(a){
  const s=WELFARE[a.id];
  const lowest=DOMAIN_ORDER.reduce((x,y)=>s[x]<=s[y]?x:y);
  const legend=DOMAIN_ORDER.map(dom=>{
    const c=CATS[dom];
    return `<div class="wl-row" onclick="go('alldata')">
      <span class="wl-dot" style="background:${c.raw}"></span>
      <span class="wl-name">${c.name}</span>
      <span class="wl-score" style="color:${c.raw}">${s[dom]}</span></div>`;
  }).join('');
  return `<div class="welfare-lite">
    <div class="welfare-top"><span class="w-title">Welfare Index · Five Domains</span><span class="w-when">Updated today</span></div>
    <div class="welfare-body">
      ${welfareDial(s,{light:true})}
      <div class="welfare-legend">${legend}</div>
    </div>
    <div class="welfare-foot"><span class="wf-dot"></span><span>Lowest domain: <b>${CATS[lowest].name}</b> (${s[lowest]}). Tap a metric below to review.</span></div>
  </div>`;
}

/* day selector row (ref 1) */
function dayselRow(){
  const base=new Date('2026-06-08T12:00:00'); let out='';
  for(let i=6;i>=0;i--){ const d=new Date(base); d.setDate(base.getDate()-i);
    out+=`<div class="d ${i===0?'on':(i<2?'':'off')}"><span class="dn">${d.toLocaleDateString('en-US',{weekday:'short'})}</span><span class="dd">${d.getDate()}</span></div>`; }
  return `<div class="daysel">${out}</div>`;
}

/* metric card with ring (ref 1 Sleep/Fitness card) */
function mcardFor(animalId,m){
  const c=CATS[m.cat];
  const series=metricFor(animalId,m.key); const data=series.data;
  if(m.type==='cat'){
    const last=data[data.length-1];
    const good=data.filter(v=>v==='Good').length;
    return `<div class="mcard" onclick="go('metric',{key:'${m.key}'})">
      <div class="mcard-top"><span class="mc-ico" style="color:${c.color}">${c.icon}</span>
        <span class="mc-name" style="color:${c.color}">${m.name}</span>
        <span class="mc-link">Details ${I.chevron}</span></div>
      <div class="mcard-body"><div class="mcard-stats">
        <div class="mc-stat"><div class="mcs-lab" style="color:${c.color}">Latest</div><div class="mcs-val" style="color:${m.scale[last]}">${last}</div></div>
        <div class="mc-stat"><div class="mcs-lab muted">Good</div><div class="mcs-val">${good}<small>/${data.length}</small></div></div>
      </div>${ringMini(good/data.length,c.raw,{label:''})}</div></div>`;
  }
  const last=data[data.length-1], av=avg(data), mn=Math.min(...data), mx=Math.max(...data), d=last-data[0];
  const frac = m.max? last/m.max : (mx>mn?(last-mn)/(mx-mn):0.7);
  return `<div class="mcard" onclick="go('metric',{key:'${m.key}'})">
    <div class="mcard-top"><span class="mc-ico" style="color:${c.color}">${c.icon}</span>
      <span class="mc-name" style="color:${c.color}">${m.name}</span>
      <span class="mc-link">Details ${I.chevron}</span></div>
    <div class="mcard-body">
      <div class="mcard-stats">
        <div class="mc-stat"><div class="mcs-lab" style="color:${c.color}">Latest</div><div class="mcs-val">${last}<small> ${m.unit}</small></div></div>
        <div class="mc-stat"><div class="mcs-lab muted">Average</div><div class="mcs-val">${av.toFixed(1)}<small> ${m.unit}</small></div></div>
        <div class="mc-stat"><div class="mcs-lab muted">Trend</div><div class="mcs-val"><span class="tchip ${d>=0?'trend-up':'trend-down'}">${d>=0?I.arrowUp:I.arrowDn}${Math.abs(d).toFixed(Math.abs(d)%1?1:0)}</span></div></div>
      </div>
      ${ringMini(frac,c.raw,{label: String(last)})}
    </div>
  </div>`;
}

function tileFor(animalId, m){
  const c=CATS[m.cat];
  const time = '5:21 PM';
  return `<div class="tile" onclick="go('metric',{key:'${m.key}'})">
    <div class="tile-head">
      <span class="t-ico" style="color:${c.color}">${c.icon}</span>
      <span class="t-name" style="color:${c.color}">${m.name}</span>
      <span class="t-time">Today ${time}</span>
    </div>
    <div class="tile-row">
      <div class="tile-val"><b>${m.data[m.data.length-1]}</b><span class="unit">${m.unit}</span></div>
      ${sparkline(m.data, c.raw)}
      ${trendBadge(m.data)}
    </div>
  </div>`;
}

function buildHighlights(a){
  const w=metricFor(a.id,'weight');
  const wd=w.data[w.data.length-1]-w.data[0];
  const cards=[];
  cards.push(highlightCard('weight','Weight is trending up',
    `${a.name}'s weight rose ${wd>0?'+':''}${wd.toFixed(0)} ${w.unit} over the last 30 days — steady, healthy gain.`));
  if(a.metrics.includes('activity')){
    cards.push(highlightCard('activity','Activity above baseline',
      `Average activity level this week is 8.1/10, the highest recorded month-to-date.`));
  }
  if(a.metrics.includes('eye')){
    cards.push(highlightCard('eye','Eye condition mostly Good',
      `9 of the last 12 checks logged "Good". 3 "Fair" readings clustered mid-June — worth a vet glance.`));
  }
  return `<div style="padding:0">${cards.join('')}</div>`;
}
function highlightCard(metricKey, title, body){
  const m=METRICS[metricKey]; const c=CATS[m.cat];
  return `<div class="card card-pad trend-card" onclick="go('metric',{key:'${metricKey}'})">
    <span class="tc-ico" style="background:${c.color}">${c.icon}</span>
    <div><div class="tc-title">${title}</div><div class="tc-body">${body}</div></div>
  </div>`;
}

/* ---------- METRIC DETAIL -------------------------------------------------- */
SCREENS.metric = ({key}) => {
  const a=getAnimal(STATE.animal);
  const m=seriesFor(a.id,key,STATE.range); const c=CATS[m.cat];
  let chart, latest, statRow;
  if(m.type==='cat'){
    chart = catChart(m.data, m.scale, {labels:m.labels});
    const counts={}; m.data.forEach(v=>counts[v]=(counts[v]||0)+1);
    latest=`<div class="ms-big"><b>${m.data[m.data.length-1]}</b></div><div class="ms-range">Latest · ${m.labels[m.labels.length-1]}</div>`;
    statRow=Object.keys(m.scale).map(k=>`<div class="stat-cell"><div class="sc-label">${k}</div><div class="sc-val" style="color:${m.scale[k]}">${counts[k]||0}<small> logs</small></div></div>`).join('');
  } else {
    chart = m.type==='bar' ? barChart(m.data,c.raw,{max:m.max,labels:m.labels}) : lineChart(m.data,c.raw,{unit:m.unit,labels:m.labels});
    const mn=Math.min(...m.data),mx=Math.max(...m.data),av=avg(m.data);
    latest=`<div class="ms-big"><b>${m.data[m.data.length-1]}</b><span class="unit"> ${m.unit}</span></div><div class="ms-range">Range ${mn}–${mx} ${m.unit}</div>`;
    statRow=`<div class="stat-cell"><div class="sc-label">Average</div><div class="sc-val">${av.toFixed(1)}<small> ${m.unit}</small></div></div>
      <div class="stat-cell"><div class="sc-label">Minimum</div><div class="sc-val">${mn}<small> ${m.unit}</small></div></div>
      <div class="stat-cell"><div class="sc-label">Maximum</div><div class="sc-val">${mx}<small> ${m.unit}</small></div></div>`;
  }
  const ranges=['D','W','M','6M','Y'];
  return `<div class="screen active metric-screen">
    <div class="metric-top">
      ${appHeader('', {back:true, action:`<span class="hdr-ico" onclick="openAddEntry('${key}')">${I.plus}</span>`})}
      <div class="metric-animal" onclick="go('aaAnimal',{animalId:'${a.id}'})">
        ${photoBox(a.name,{size:48,radius:14})}
        <div class="ma-id"><div class="ma-name">${a.name}</div>
          <div class="ma-sub">${a.species} · ${a.sex} · ${a.stage} · ${a.encl}</div></div>
        <span class="chev" style="color:var(--label-tertiary)">${I.chevron}</span>
      </div>
      <div class="metric-title">
        <span class="mt-ico" style="color:${c.color}">${c.icon}</span>
        <span class="mt-name">${m.name}</span><span class="mt-cat">· ${c.name}</span>
      </div>
    </div>
    <div class="scroll" style="padding-top:6px">
      <div class="metric-stat">
        <div class="ms-label">Latest · showing ${m.rangeWord}</div>
        ${latest}
      </div>
      <div class="range-seg">
        ${ranges.map(r=>`<button class="${r===STATE.range?'on':''}" onclick="setRange('${r}','${key}')">${r}</button>`).join('')}
      </div>
      <div class="chart-wrap">${chart}</div>
      <div class="stat-grid">${statRow}</div>
      <div class="section-head"><h2>Recent Entries</h2></div>
      <div class="list">${recentEntries(m)}</div>
    </div>
    <div class="metric-foot">
      <button class="btn-tint" style="margin:0;width:100%" onclick="openAddEntry('${key}')">${I.plus}<span style="margin-left:2px">Add ${m.name}</span></button>
    </div>
  </div>`;
};
function setRange(r,key){ STATE.range=r; render(); }
function recentEntries(m){
  const rows=[];
  for(let i=m.data.length-1;i>=Math.max(0,m.data.length-5);i--){
    const v=m.type==='cat'?m.data[i]:m.data[i]+' '+m.unit;
    const color = m.type==='cat'? m.scale[m.data[i]] : 'var(--label)';
    rows.push(`<div class="row no-indent">
      <div class="r-body"><div class="r-title" style="color:${color}">${v}</div><div class="r-sub">${m.labels[i]} · 5:${10+i} PM</div></div>
      <div class="r-trail"><span class="chev">${I.chevron}</span></div></div>`);
  }
  return rows.join('');
}

/* ---------- ALL DATA (per-animal full metric list) ------------------------- */
SCREENS.alldata = () => {
  const a=getAnimal(STATE.animal);
  const byCat={};
  a.metrics.forEach(k=>{ const m=metricFor(a.id,k); (byCat[m.cat]=byCat[m.cat]||[]).push(m); });
  let body='';
  Object.keys(byCat).forEach(cat=>{
    const c=CATS[cat];
    body+=`<div class="section-head"><h2 style="font-size:18px;color:${c.color}">${c.name}</h2></div><div class="list">`;
    byCat[cat].forEach(m=>{
      body+=`<div class="row" onclick="go('metric',{key:'${m.key}'})">
        <div class="r-icon" style="background:${c.color}">${c.icon}</div>
        <div class="r-body"><div class="r-title">${m.name}</div><div class="r-sub">${m.data.length} entries · latest ${latestStr(m)}</div></div>
        <div class="r-trail"><span class="chev">${I.chevron}</span></div></div>`;
    });
    body+='</div>';
  });
  return `<div class="screen active"><div class="scroll">
    ${navbar({title:'Health Data'})}
    <div class="large-title" style="padding-top:0">All Health Data<div class="lt-sub">${a.emoji} ${a.name}</div></div>
    <div class="search">${I.search}<span>Search metrics</span></div>
    ${body}
    <button class="btn-tint" onclick="go('newtype')">${I.plus}<span>New Assessment Type</span></button>
  </div></div>`;
};

/* ---------- ANIMAL PROFILE / TAXONOMY -------------------------------------- */
SCREENS.profile = () => {
  const a=getAnimal(STATE.animal);
  const meta=[['Sex',a.sex],['Life Stage',a.stage],['Age',a.age],['Enclosure',a.encl],['Breed',a.breed],['DNA',a.dna]];
  return `<div class="screen active"><div class="scroll">
    ${navbar({title:'Profile', actions:`<div class="icon-btn">${I.star}</div><div class="icon-btn">${I.grid}</div>`})}
    <div class="profile-hero">
      <div class="ph-top">
        <div class="ph-photo">${a.emoji}</div>
        <div><div class="ph-name">${a.name}</div><div class="ph-latin">${a.latin}</div>
          <div style="margin-top:6px"><span class="badge ${a.status==='Active'?'active':''}">${a.status}</span></div></div>
      </div>
      <div class="ph-meta">${meta.map(([k,v])=>`<div><div class="m-k">${k}</div><div class="m-v">${v}</div></div>`).join('')}</div>
    </div>

    <div class="section-head"><h2>Taxonomy</h2></div>
    <div class="list">
      ${Object.entries(a.taxon).map(([k,v])=>`<div class="row no-indent"><div class="r-body"><div class="r-sub">${k}</div><div class="r-title">${v}</div></div></div>`).join('')}
    </div>

    <button class="btn-fill" onclick="back()">View Health Dashboard</button>
  </div></div>`;
};

/* ---------- SPECIES (tab) → then individual animals ------------------------ */
SCREENS.species = () => {
  const groups=speciesGroups();
  const entries=Object.entries(groups).map(([sp,inds])=>{
    const idx=Math.round(inds.reduce((x,a)=>x+welfareIndex(a.welfare),0)/inds.length);
    const need=inds.filter(isAttention).length;
    return {sp,inds,idx,need};
  }).sort((a,b)=> (b.need-a.need) || (a.idx-b.idx));   // attention first, then weakest
  const totalNeed=entries.reduce((n,e)=>n+e.need,0);
  return `<div class="screen active"><div class="scroll">
    ${tabHeader('Species', `${entries.length} species · ${Object.keys(ANIMALS).length} animals${totalNeed?` · ${totalNeed} need attention`:''}`)}
    <div class="search" style="margin-top:8px">${I.search}<span>Search species, animals, enclosures</span></div>
    ${entries.map(e=>speciesCard(e)).join('')}
  </div></div>`;
};
function openSpecies(sp){ go('speciesDetail',{sp}); }

const TIER_ORDER=['Excellent','Good','Fair','Watch'];
function speciesCard({sp,inds,idx,need}){
  const s=SPECIES[sp]; const m=spMeta(sp);
  const dist={Excellent:0,Good:0,Fair:0,Watch:0};
  inds.forEach(a=>dist[welfareLabel(welfareIndex(a.welfare))]++);
  const segs=TIER_ORDER.filter(k=>dist[k]>0).map(k=>`<span style="flex:${dist[k]};background:${DIST_COLORS[k]}"></span>`).join('');
  const fields=[['Date',m.added],['Size',m.size],['Section',s.taxon.Class]];
  return `<div class="spcard" onclick="openSpecies('${sp}')">
    <div class="spcard-top">
      ${photoBox(s.name,{size:60,radius:16,emoji:s.emoji})}
      <div class="sp-id">
        <div class="sp-name">${s.name}</div>
        <div class="sp-latin">${s.latin}</div>
        <div class="sp-class">${inds.length} animal${inds.length>1?'s':''} · ${s.taxon.Order}</div>
      </div>
      ${ringMini(idx/100, welfareColor(idx), {size:58, label:String(idx), fs:17})}
    </div>
    <div class="sp-fields">${fields.map(([k,v])=>`
      <div class="spf"><div class="spf-k">${k}</div><div class="spf-v">${v}</div></div>`).join('')}</div>
    <div class="sp-tierbar">${segs}</div>
    <div class="sp-meta">
      <span class="sp-count">${inds.length} animal${inds.length>1?'s':''}</span>
      ${need
        ? `<span class="sp-warn">${I.alert} ${need} need attention</span>`
        : `<span class="sp-ok">${I.check} all stable</span>`}
    </div>
  </div>`;
}

SCREENS.speciesDetail = ({sp}) => {
  const s=SPECIES[sp]; const m=spMeta(sp); const inds=Object.values(ANIMALS).filter(a=>a.sp===sp);
  const idx=Math.round(inds.reduce((x,a)=>x+welfareIndex(a.welfare),0)/inds.length);
  const need=inds.filter(isAttention).length;
  return `<div class="screen active"><div class="scroll">
    ${appHeader(s.name, {back:true, sub:s.latin})}
    <div class="sp-hero">
      ${photoBox(s.name,{size:64,radius:18,emoji:s.emoji})}
      <div class="sp-hero-id">
        <div class="sp-hero-name">${s.name}</div>
        <div class="sp-hero-sub">${s.taxon.Class} · ${s.taxon.Order} · ${m.size}</div>
        <div class="sp-hero-tags"><span class="sph-tag">${inds.length} animal${inds.length>1?'s':''}</span>
          ${need?`<span class="sph-tag warn">${need} need attention</span>`:`<span class="sph-tag ok">all stable</span>`}</div>
      </div>
      ${ringMini(idx/100, welfareColor(idx), {size:56, label:String(idx), fs:16})}
    </div>
    <div class="section-head"><h2>Animals</h2><span class="muted" style="font-size:15px">${inds.length}</span></div>
    ${inds.map(a=>{const ai=welfareIndex(a.welfare); const col=welfareColor(ai); const over=a.seen>14;return `
      <div class="acard" onclick="openAnimal('${a.id}')">
        ${photoBox(a.name,{size:48,radius:13,emoji:s.emoji})}
        <div class="ac-body"><div class="ac-name">${a.name}</div>
          <div class="ac-sub">${a.sex} · ${a.stage} · ${a.age} · ${a.encl}</div>
          <div class="ac-seen" style="${over?'color:#C76B4A;font-weight:700':''}">${over?I.alert+' ':''}Last assessed ${a.seen}d ago</div></div>
        <span class="idx-pill" style="background:${col}">${ai}</span>
        <span class="chev" style="color:var(--label-tertiary);margin-left:8px">${I.chevron}</span>
      </div>`;}).join('')}
  </div></div>`;
};
function openAnimal(id){ STATE.animal=id; go('summary'); }

/* ====================== SETUP / ADMIN SIDE ================================= */

/* ---------- SETUP HOME (Types / Templates) --------------------------------- */
let setupTab='types';
SCREENS.setup = () => {
  return `<div class="screen active"><div class="scroll">
    ${tabHeader('Assessments', 'Library & templates')}

    <div class="hero-stats" style="margin-top:8px">
      <div class="hero-stat"><div class="hs-num">94</div><div class="hs-lab">Assessment Types</div></div>
      <div class="hero-stat"><div class="hs-num">36</div><div class="hs-lab">Templates</div></div>
    </div>

    <div class="tabs" style="margin-bottom:14px">
      <div class="tab ${setupTab==='types'?'on':''}" onclick="setSetupTab('types')">Types</div>
      <div class="tab ${setupTab==='templates'?'on':''}" onclick="setSetupTab('templates')">Templates</div>
    </div>
    ${setupTab==='types'? setupTypes() : setupTemplates()}
  </div>
  <button class="fab" onclick="${setupTab==='types'?"go('newtype')":"go('newtemplate')"}">${I.plus}</button>
  </div>`;
};
function setSetupTab(t){ setupTab=t; render(); }

const CAT_TYPE_COUNTS = { physical:52, behaviour:12, environment:6, mental:10, nutrition:13 };
function setupTypes(){
  return `<div class="search">${I.search}<span>Search assessment types</span></div>
    <div class="list">
      ${Object.entries(CATS).map(([k,c])=>`
        <div class="row" onclick="go('category',{cat:'${k}'})">
          <div class="r-icon" style="background:${c.color}">${c.icon}</div>
          <div class="r-body"><div class="r-title">${c.name}</div></div>
          <div class="r-trail"><span>${CAT_TYPE_COUNTS[k]}</span><span class="chev">${I.chevron}</span></div>
        </div>`).join('')}
    </div>`;
}

const TEMPLATES = [
  {name:'Macaw birds', types:6, taxon:62, cats:['physical','behaviour','nutrition','environment','mental']},
  {name:'Alligator', types:5, taxon:2, cats:['physical','behaviour','nutrition']},
  {name:'Mammals', types:4, taxon:1, cats:['physical','nutrition']},
  {name:'Fishes template', types:7, taxon:1, cats:['physical','environment']},
  {name:'Big cats', types:8, taxon:3, cats:['physical','behaviour','mental','nutrition']},
];
function setupTemplates(){
  return `<div class="search">${I.search}<span>Search templates</span></div>
    <div class="list">
      ${TEMPLATES.map((t,i)=>`
        <div class="row" onclick="go('template',{i:${i}})">
          <div class="r-icon" style="background:var(--antz)">${I.doc}</div>
          <div class="r-body"><div class="r-title">${t.name}</div><div class="r-sub">${t.types} types · ${t.taxon} taxa</div></div>
          <div class="r-trail"><span class="chev">${I.chevron}</span></div>
        </div>`).join('')}
    </div>`;
}

/* ---------- CATEGORY (types within a category) ----------------------------- */
const SAMPLE_TYPES = {
  physical:[['Eye Condition',9],['Posture',11],['Weight',7],['Body Condition',10],['Eye condition scale',3],['Body score',10],['Length',4],['Temperature',3]],
  behaviour:[['Activity Level',6],['Enrichment Response',5],['Aggression',2],['Social Interaction',4]],
  environment:[['Enclosure Cleanliness',3],['Temperature Zone',2],['Humidity',1]],
  mental:[['Stress Indicators',5],['Stereotypic Behaviour',3],['Curiosity',2]],
  nutrition:[['Food Intake',8],['Water Intake',4],['Diet Adherence',3],['Supplement Log',2]],
};
SCREENS.category = ({cat}) => {
  const c=CATS[cat];
  return `<div class="screen active"><div class="scroll">
    ${navbar({title:''})}
    <div class="large-title" style="padding-top:0">
      <span class="t-ico" style="color:${c.color};display:inline-flex;width:26px;height:26px;vertical-align:-4px">${c.icon}</span>
      ${c.name}<div class="lt-sub">${CAT_TYPE_COUNTS[cat]} assessment types</div>
    </div>
    <div class="search">${I.search}<span>Search</span></div>
    <div class="list">
      ${(SAMPLE_TYPES[cat]||[]).map(([n,t])=>`
        <div class="row no-indent" onclick="go('typedetail',{name:'${n}',cat:'${cat}',templates:${t}})">
          <div class="r-body"><div class="r-title">${n}</div><div class="r-sub">Used in ${t} templates</div></div>
          <div class="r-trail"><span class="chev">${I.chevron}</span></div></div>`).join('')}
    </div>
    <button class="btn-tint" onclick="go('newtype',{cat:'${cat}'})">${I.plus}<span>New ${c.name} Type</span></button>
  </div></div>`;
};

/* ---------- TYPE DETAIL ---------------------------------------------------- */
SCREENS.typedetail = ({name,cat,templates}) => {
  const c=CATS[cat];
  return `<div class="screen active"><div class="scroll">
    ${navbar({title:'Assessment Type', actions:`<div class="icon-btn">${I.pencil}</div>`})}
    <div class="large-title" style="padding-top:0">
      <span class="badge active">Active</span>
      <div style="margin-top:8px">${name}</div>
    </div>
    <div class="form-group" style="margin-top:8px">
      <div class="field">
        <div class="f-row"><div class="f-k">Category</div><div class="f-v" style="color:${c.color};font-weight:600">${c.name}</div></div>
        <div class="f-row"><div class="f-k">Response</div><div class="f-v">Numeric value</div></div>
        <div class="f-row"><div class="f-k">Unit</div><div class="f-v">kg</div></div>
        <div class="f-row"><div class="f-k">Description</div><div class="f-v">Standard ${name.toLowerCase()} measurement.</div></div>
      </div>
    </div>
    <div class="list">
      <div class="row no-indent"><div class="r-icon" style="background:var(--antz)">${I.doc}</div>
        <div class="r-body"><div class="r-title">Used in Templates</div></div>
        <div class="r-trail"><span>${templates}</span><span class="chev">${I.chevron}</span></div></div>
    </div>
  </div></div>`;
};

/* ---------- NEW ASSESSMENT TYPE (form) ------------------------------------- */
let newType={cat:null,active:true};
SCREENS.newtype = ({cat}={}) => {
  if(cat) newType.cat=cat;
  const c = newType.cat?CATS[newType.cat]:null;
  return `<div class="screen active"><div class="scroll">
    <div class="nav"><div class="back" onclick="back()">${I.x}<span style="margin-left:4px">Cancel</span></div>
      <div class="nav-title">New Type</div>
      <div class="nav-actions"><div class="icon-btn" style="font-weight:600" onclick="back()">Save</div></div></div>

    <div class="form-group" style="margin-top:8px">
      <div class="form-label">Category</div>
      <div class="field"><div class="f-row" onclick="openCatPicker()">
        <div class="f-v ${c?'':'ph'}" style="${c?`color:${c.color};font-weight:600`:''}">${c?c.name:'Select category'}</div>
        <span class="chev">${I.chevron}</span></div></div>
    </div>
    <div class="form-group">
      <div class="form-label">Details</div>
      <div class="field">
        <div class="f-row"><div class="f-v ph">Assessment name</div></div>
        <div class="f-row"><div class="f-v ph">Description</div></div>
      </div>
    </div>
    <div class="form-group">
      <div class="form-label">Response</div>
      <div class="field">
        <div class="f-row"><div class="f-k">Type</div><div class="f-v">Numeric value</div><span class="chev">${I.chevron}</span></div>
        <div class="f-row"><div class="f-k">Unit</div><div class="f-v ph">e.g. kg, °C</div></div>
      </div>
    </div>
    <div class="form-group">
      <div class="field"><div class="f-row"><div class="f-v">Mark as Active</div><div class="toggle"></div></div></div>
      <div class="note">Active types are available for selection in templates and animal assessments.</div>
    </div>
  </div></div>`;
};

/* ---------- TEMPLATE DETAIL ------------------------------------------------ */
SCREENS.template = ({i}) => {
  const t=TEMPLATES[i];
  return `<div class="screen active"><div class="scroll">
    ${navbar({title:'Template', actions:`<div class="icon-btn">${I.pencil}</div>`})}
    <div class="large-title" style="padding-top:0">${t.name}</div>
    <div class="hero-stats">
      <div class="hero-stat"><div class="hs-num">${t.types}</div><div class="hs-lab">Types</div></div>
      <div class="hero-stat"><div class="hs-num">${t.taxon}</div><div class="hs-lab">Taxa</div></div>
    </div>
    <div class="section-head"><h2>Assessment Types</h2></div>
    <div class="list">
      ${t.cats.map(cat=>{const c=CATS[cat];return `<div class="row" onclick="go('category',{cat:'${cat}'})">
        <div class="r-icon" style="background:${c.color}">${c.icon}</div>
        <div class="r-body"><div class="r-title">${c.name}</div></div>
        <div class="r-trail"><span class="chev">${I.chevron}</span></div></div>`;}).join('')}
    </div>
    <div class="section-head"><h2>Applies to Taxa</h2></div>
    <div class="list">
      <div class="row no-indent"><div class="r-body"><div class="r-title">Mammalia → Carnivora</div><div class="r-sub">Felidae · Panthera</div></div></div>
    </div>
  </div></div>`;
};

/* ---------- NEW TEMPLATE BUILDER ------------------------------------------- */
let tmplTab='info'; let tmplTypes=[];
SCREENS.newtemplate = () => {
  return `<div class="screen active"><div class="scroll">
    <div class="nav"><div class="back" onclick="back()">${I.x}<span style="margin-left:4px">Cancel</span></div>
      <div class="nav-title">New Template</div>
      <div class="nav-actions"><div class="icon-btn" style="color:var(--antz)">${I.check}</div></div></div>
    <div class="large-title" style="padding-top:0">Untitled</div>

    <div class="hero-stats">
      <div class="hero-stat" onclick="setTmplTab('info')" style="cursor:pointer;${tmplTab==='info'?'outline:2px solid var(--antz)':''}"><div class="hs-num" style="font-size:20px">ⓘ</div><div class="hs-lab">Info</div></div>
      <div class="hero-stat" onclick="setTmplTab('types')" style="cursor:pointer;${tmplTab==='types'?'outline:2px solid var(--antz)':''}"><div class="hs-num">${tmplTypes.length}</div><div class="hs-lab">Types</div></div>
      <div class="hero-stat" onclick="setTmplTab('species')" style="cursor:pointer;${tmplTab==='species'?'outline:2px solid var(--antz)':''}"><div class="hs-num">0</div><div class="hs-lab">Species</div></div>
    </div>

    ${tmplTab==='info'? `
      <div class="form-group"><div class="form-label">Template name</div>
        <div class="field"><div class="f-row"><div class="f-v ph">Enter a name</div></div></div></div>
      <div class="form-group"><div class="form-label">Description</div>
        <div class="field"><div class="f-row" style="min-height:90px;align-items:flex-start"><div class="f-v ph">Enter description</div></div></div></div>
      ` : tmplTab==='types'? `
      <button class="btn-tint" onclick="openTypePicker()">${I.plus}<span>Add Assessment Type</span></button>
      ${tmplTypes.length? `<div class="list">${tmplTypes.map(k=>{const c=CATS[k];return `<div class="row"><div class="r-icon" style="background:${c.color}">${c.icon}</div><div class="r-body"><div class="r-title">${c.name}</div></div><div class="r-trail"><span class="chev">${I.chevron}</span></div></div>`;}).join('')}</div>`
        : emptyState('🦥','No types yet','Tap “Add Assessment Type” to start building.')}
      ` : `
      <button class="btn-tint" onclick="openTaxonPicker()">${I.plus}<span>Add Taxon</span></button>
      ${emptyState('🦥','No species yet','Add the taxa this template applies to.')}
      `}
  </div></div>`;
};
function setTmplTab(t){ tmplTab=t; render(); }
function emptyState(emoji,title,sub){
  return `<div class="empty"><div class="e-emoji">${emoji}</div><div class="e-title">${title}</div><div class="e-sub">${sub}</div></div>`;
}

/* ============================================================== SHEETS ===== */
const scrim = () => document.getElementById('sheet-scrim');
function openSheet(html){ scrim().innerHTML=`<div class="sheet">${html}</div>`; scrim().classList.add('open'); }
function closeSheet(){ scrim().classList.remove('open'); scrim().innerHTML=''; }
scrimClickInit();
function scrimClickInit(){ document.addEventListener('click',e=>{ if(e.target===scrim()) closeSheet(); }); }

function openAnimalSwitch(){
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div class="sh-title">Choose Animal</div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="pill-list">${Object.values(ANIMALS).map(a=>`
      <div class="pill-opt ${a.id===STATE.animal?'sel':''}" onclick="pickAnimal('${a.id}')">
        <span style="font-size:22px">${a.emoji}</span>
        <div><div style="font-weight:600">${a.name}</div><div class="sh-sub">${a.latin}</div></div>
        <span class="chk">${I.check}</span></div>`).join('')}</div>`);
}
function pickAnimal(id){ STATE.animal=id; closeSheet(); current={key:'summary',params:{}}; render(); }

/* assessments are logged on the animal page → pick a type, then enter a value */
function openLogAssessment(animalId){
  const a=getAnimal(animalId);
  const byCat={}; a.metrics.forEach(k=>{const m=METRICS[k]; (byCat[m.cat]=byCat[m.cat]||[]).push(m);});
  let body='';
  Object.keys(byCat).forEach(cat=>{ const c=CATS[cat];
    body+=`<div class="form-label" style="padding:8px 4px 4px;color:${c.raw}">${c.name}</div>`;
    byCat[cat].forEach(m=>{ body+=`<div class="pill-opt" onclick="openAddEntry('${m.key}')">
      <span class="dot" style="background:${c.raw}"></span><span style="font-weight:600">${m.name}</span>
      <span class="chev" style="margin-left:auto;color:var(--label-tertiary)">${I.chevron}</span></div>`; });
  });
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title">Log Assessment</div><div class="sh-sub">${a.emoji} ${a.name}</div></div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="pill-list">${body}</div>`);
}

function openAddEntry(key){
  const m=METRICS[key]; const c=CATS[m.cat];
  const valField = m.type==='cat'
    ? `<div class="entry-field">Select rating · Good / Fair / Poor</div>`
    : `<div class="entry-2"><div class="entry-field">Enter value</div><div class="entry-field">${m.unit||'unit'}</div></div>`;
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div><div class="sh-title" style="color:${c.color}">${m.name}</div><div class="sh-sub">${c.name}</div></div>
      <div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="entry-2"><div class="entry-field">${I.cal}<span>8 Jun 2026</span></div><div class="entry-field">${I.clock}<span>5:30 PM</span></div></div>
    ${valField}
    <div class="entry-field" style="min-height:56px;align-items:flex-start">Add notes if any…</div>
    <div class="note" style="padding:2px 18px 8px">Submitted assessments go to the review queue for approval.</div>
    <div class="sheet-actions"><button class="cancel" onclick="closeSheet()">Cancel</button><button class="confirm" onclick="closeSheet()">Submit for Review</button></div>`);
}

function openCatPicker(){
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div class="sh-title">Select Category</div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="pill-list">${Object.entries(CATS).map(([k,c])=>`
      <div class="pill-opt" onclick="pickCat('${k}')"><span class="dot" style="background:${c.color}"></span>
        <span style="font-weight:600">${c.name}</span><span class="chk">${I.check}</span></div>`).join('')}</div>`);
}
function pickCat(k){ newType.cat=k; closeSheet(); render(); }

function openTypePicker(){
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div class="sh-title">Add Assessment Types</div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="pill-list">${Object.entries(CATS).map(([k,c])=>`
      <div class="pill-opt ${tmplTypes.includes(k)?'sel':''}" onclick="toggleTmplType('${k}')"><span class="dot" style="background:${c.color}"></span>
        <span style="font-weight:600">${c.name}</span><span class="sh-sub" style="margin-left:6px">${CAT_TYPE_COUNTS[k]} types</span><span class="chk">${I.check}</span></div>`).join('')}</div>
    <div class="sheet-actions"><button class="confirm" onclick="closeSheet();render()">Done · ${tmplTypes.length} selected</button></div>`);
}
function toggleTmplType(k){ const i=tmplTypes.indexOf(k); if(i<0)tmplTypes.push(k); else tmplTypes.splice(i,1); openTypePicker(); }

function openTaxonPicker(){
  openSheet(`<div class="sheet-grab"></div>
    <div class="sheet-head"><div class="sh-title">Choose Taxon</div><div class="sh-x" onclick="closeSheet()">${I.x}</div></div>
    <div class="pill-list">
      <div class="form-label">Class</div><div class="pill-opt sel"><span style="font-weight:600">Amphibia</span><span class="chk">${I.check}</span></div>
      <div class="form-label">Order</div><div class="pill-opt sel"><span style="font-weight:600">Caudata</span><span class="chk">${I.check}</span></div>
      <div class="form-label">Family</div><div class="pill-opt"><span class="ph" style="color:var(--label-tertiary)">Select family</span></div>
    </div>
    <div class="sheet-actions"><button class="cancel" onclick="closeSheet()">Cancel</button><button class="confirm" onclick="closeSheet()">Apply</button></div>`);
}

/* ---------- bottom tab bar render ------------------------------------------ */
function renderTabbar(){
  const tabs=[['dashboard','Dashboard',I.grid],['species','Species',I.paw],['modules','Modules',I.scale],['setup','Setup',I.doc]];
  document.getElementById('tabbar').innerHTML = tabs.map(([k,l,ic])=>`
    <div class="tb ${STATE.tab===k?'on':''}" onclick="switchTab('${k}')">${ic}<span>${l}</span></div>`).join('');
}
const _origSwitch=switchTab;
switchTab=function(t){ _origSwitch(t); renderTabbar(); };

/* ============================================================== INIT ======= */
window.addEventListener('DOMContentLoaded',()=>{
  // optional deep-link for previewing: #screen[:tab]  e.g. #metric:weight, #setup-templates
  const h=location.hash.replace('#','');
  if(h){
    if(h.startsWith('metric:')){ current={key:'metric',params:{key:h.split(':')[1]}}; STATE.tab='species'; }
    else if(h.startsWith('animal:')){ STATE.animal=h.split(':')[1]; current={key:'summary',params:{}}; STATE.tab='species'; }
    else if(h.startsWith('species:')){ current={key:'speciesDetail',params:{sp:h.split(':')[1]}}; STATE.tab='species'; }
    else if(h.startsWith('aaanimal:')){ current={key:'aaAnimal',params:{animalId:h.split(':')[1]}}; }
    else if(h.startsWith('aaspecies:')){ current={key:'aaSpecies',params:{sp:h.split(':')[1]}}; }
    else if(h.startsWith('amstats:')){ current={key:'amStats',params:{animalId:h.split(':')[1]}}; }
    else if(h.startsWith('amanimal:')){ current={key:'amAnimal',params:{animalId:h.split(':')[1]}}; }
    else if(h==='setup-templates'){ setupTab='templates'; current={key:'setup',params:{}}; STATE.tab='setup'; }
    else if(h.startsWith('category:')){ current={key:'category',params:{cat:h.split(':')[1]}}; STATE.tab='setup'; }
    else if(SCREENS[h]){ current={key:h,params:{}}; if(h==='setup')STATE.tab='setup'; if(h==='species')STATE.tab='species'; if(h==='dashboard')STATE.tab='dashboard'; }
    else current={key:'dashboard',params:{}};
  } else current={key:'dashboard',params:{}};
  renderTabbar();
  render();
  // preview sheets via deep-link, e.g. #add:weight  or  #catpicker
  if(h.startsWith('add:')) openAddEntry(h.split(':')[1]);
  else if(h==='catpicker') openCatPicker();
  else if(h==='taxon') openTaxonPicker();
});
