// Leonida Trophy Guide — tracker for all 55 GTA VI trophies.
// Static, offline, standard browser APIs only. Progress lives in localStorage;
// export/import moves it as a JSON file. ?shot=cover|roadmap|missables|collectibles
// stages a demo view for screenshots: it seeds demo progress in memory only and
// never writes it to localStorage.
const KEY = 'leonida-trophy-guide.v1';
const params = new URLSearchParams(location.search);
const shot = params.get('shot');
const demo = shot !== null;

const doc = await (await fetch('data/trophies.json')).json();
const roadmap = await (await fetch('data/roadmap.json')).json();
const trophies = doc.trophies;
const byId = new Map(trophies.map((t) => [t.id, t]));
const sources = new Map(doc.sources.map((s) => [s.key, s]));

const DEMO_EARNED = [2, 3, 8, 15, 16, 19, 20, 21, 25, 31, 35, 42];
let earned = new Set(demo ? DEMO_EARNED : JSON.parse(localStorage.getItem(KEY) ?? '[]').filter((id) => byId.has(id)));
let counts = demo ? {} : JSON.parse(localStorage.getItem(KEY + '.counts') ?? '{}');
let spoiler = (localStorage.getItem(KEY + '.spoiler') ?? '0') === '1';
let kind = 'all';
let grade = 'all';
let status = 'all';
let sort = 'roadmap';
let query = '';
let selected = 28;
let tab = 'guide';

const $ = (id) => document.getElementById(id);
const GRADE_ORDER = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
const KIND_LABELS = { all: 'All 55', story: 'Story', missable: 'Missable', collectibles: 'Collectibles', activities: 'Activities', online: 'Online' };

function save() {
  if (demo) return;
  localStorage.setItem(KEY, JSON.stringify([...earned]));
  localStorage.setItem(KEY + '.counts', JSON.stringify(counts));
  localStorage.setItem(KEY + '.spoiler', spoiler ? '1' : '0');
}

function isHiddenStory(t) {
  return t.hidden && t.kinds.includes('story');
}
function isSpoilered(t) {
  return spoiler && isHiddenStory(t) && !earned.has(t.id);
}
function kindCount(k) {
  if (k === 'all') return trophies.length;
  if (k === 'missable') return trophies.filter((t) => t.missable).length;
  if (k === 'online') return 0;
  return trophies.filter((t) => t.kinds.includes(k)).length;
}
function countLabel(t) {
  if (t.count === null || t.count === undefined) return null;
  if (t.id === 28) return '18 spots';
  if (t.id === 52) return '$250,000';
  if (t.id === 53) return '$100,000';
  if (t.id === 48) return '500 actions';
  return `${t.count} needed`;
}
function countTarget(t) {
  if (t.id === 52) return 250000;
  if (t.id === 53) return 100000;
  if (t.id === 48) return 500;
  return t.count;
}
function badge(cls, text) {
  const s = document.createElement('span');
  s.className = `badge ${cls}`;
  s.textContent = text;
  return s;
}
function gradeBadge(t) {
  return badge(`b-${t.grade}`, t.grade);
}
function stageOf(t) {
  return roadmap.phases[t.stage - 1];
}

function renderProgress() {
  const total = trophies.length;
  const n = earned.size;
  $('progress-count').textContent = `${n}/${total}`;
  $('progress-pct').textContent = `${Math.round((n / total) * 100)}% to platinum`;
  $('progress-fill').style.width = `${(n / total) * 100}%`;
  $('grade-counts').innerHTML = ['platinum', 'gold', 'silver', 'bronze']
    .map((g) => {
      const have = trophies.filter((t) => t.grade === g && earned.has(t.id)).length;
      const all = trophies.filter((t) => t.grade === g).length;
      return `<b>${have}/${all}</b> ${g[0].toUpperCase() + g.slice(1)}`;
    })
    .join(' · ');
  const unconfirmed = trophies.filter((t) => t.unconfirmed).length;
  $('stats-line').textContent = `Guides: 55/55 cited · 1 possibly missable · ${unconfirmed} triggers not yet known · 0 online trophies`;
}

function renderStageStrip() {
  const strip = $('stage-strip');
  strip.replaceChildren();
  for (const ph of roadmap.phases) {
    const inStage = trophies.filter((t) => t.stage === ph.n);
    const done = inStage.filter((t) => earned.has(t.id)).length;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'stage-chip';
    const label = document.createElement('span');
    label.textContent = `S${ph.n} ${done}/${inStage.length}`;
    const bar = document.createElement('span');
    bar.className = 'mini-bar';
    const fill = document.createElement('span');
    fill.style.width = `${(done / inStage.length) * 100}%`;
    bar.append(fill);
    b.append(label, bar);
    b.title = `Stage ${ph.n} — ${ph.title} (${ph.hours})`;
    b.addEventListener('click', () => {
      tab = 'roadmap';
      render();
      document.getElementById(`phase-${ph.n}`)?.scrollIntoView({ block: 'start' });
    });
    strip.append(b);
  }
}

function renderFilters() {
  const box = $('kind-filters');
  box.replaceChildren();
  for (const k of ['all', 'story', 'missable', 'collectibles', 'activities', 'online']) {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = `chip${kind === k ? ' active' : ''}`;
    b.textContent = `${KIND_LABELS[k]} ${kindCount(k)}`;
    b.addEventListener('click', () => { kind = k; render(); });
    box.append(b);
  }
}

function visibleTrophies() {
  let list = trophies.filter((t) => {
    if (kind === 'missable') return !!t.missable;
    if (kind === 'online') return false;
    if (kind !== 'all' && !t.kinds.includes(kind)) return false;
    if (grade !== 'all' && t.grade !== grade) return false;
    if (status === 'earned' && !earned.has(t.id)) return false;
    if (status === 'missing' && earned.has(t.id)) return false;
    if (query) {
      const hay = `${t.name} ${t.description} ${t.mission ?? ''} ${t.guide}`.toLowerCase();
      if (!hay.includes(query.toLowerCase())) return false;
    }
    return true;
  });
  if (sort === 'name') list = [...list].sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === 'grade') list = [...list].sort((a, b) => GRADE_ORDER[a.grade] - GRADE_ORDER[b.grade] || a.stage - b.stage || a.id - b.id);
  else list = [...list].sort((a, b) => a.stage - b.stage || a.id - b.id);
  return list;
}

function rowFor(t) {
  const li = document.createElement('li');
  li.className = `row${earned.has(t.id) ? ' earned' : ''}${selected === t.id ? ' selected' : ''}`;
  const box = document.createElement('input');
  box.type = 'checkbox';
  box.checked = earned.has(t.id);
  box.setAttribute('aria-label', `Mark ${t.name} earned`);
  box.addEventListener('change', (e) => {
    e.stopPropagation();
    toggleEarned(t.id);
  });
  li.append(box);
  const mid = document.createElement('div');
  const name = document.createElement('div');
  name.className = 'row-name';
  name.textContent = isSpoilered(t) ? 'Hidden story trophy' : t.name;
  const desc = document.createElement('div');
  desc.className = 'row-desc';
  desc.textContent = isSpoilered(t) ? 'Earn this story trophy to reveal its name and description.' : t.description;
  mid.append(name, desc);
  const tags = document.createElement('div');
  tags.className = 'row-tags';
  tags.append(gradeBadge(t));
  if (t.kinds.includes('story')) tags.append(badge('b-story', 'Story'));
  if (t.kinds.includes('collectibles')) tags.append(badge('b-collect', 'Collectible'));
  if (t.kinds.includes('activities')) tags.append(badge('b-act', 'Activity'));
  if (t.missable) tags.append(badge('b-miss', 'Missable'));
  if (t.hidden) tags.append(badge('b-hidden', 'Hidden'));
  const c = countLabel(t);
  if (c) tags.append(badge('b-count', c));
  tags.append(badge('b-phase', `Stage ${t.stage}`));
  tags.append(badge('b-src', t.sources.join(' · ')));
  mid.append(tags);
  li.append(mid);
  const right = document.createElement('div');
  right.className = 'row-grade';
  right.textContent = t.grade;
  if (t.chapter) {
    const ch = document.createElement('span');
    ch.className = 'chapter';
    ch.textContent = `Chapter ${t.chapter}`;
    right.append(ch);
  }
  li.append(right);
  li.addEventListener('click', (e) => {
    if (e.target !== box) { selected = t.id; render(); }
  });
  return li;
}

function renderList() {
  const list = visibleTrophies();
  const rows = $('rows');
  rows.replaceChildren();
  const empty = $('empty');
  if (kind === 'online') {
    empty.hidden = false;
    empty.textContent = 'This list has no online trophies: all 55 are offline, single-player, per PowerPyx. Nothing to filter here — the filter exists so you can check.';
  } else if (list.length === 0) {
    empty.hidden = false;
    empty.textContent = 'No trophies match these filters. Clear the search or pick another kind.';
  } else {
    empty.hidden = true;
  }
  $('showing').textContent = `Showing ${list.length} of ${trophies.length} · ${earned.size} earned`;
  let lastStage = null;
  for (const t of list) {
    if (sort === 'roadmap' && t.stage !== lastStage) {
      lastStage = t.stage;
      const ph = stageOf(t);
      const inStage = trophies.filter((x) => x.stage === t.stage);
      const done = inStage.filter((x) => earned.has(x.id)).length;
      const h = document.createElement('li');
      h.className = 'stage-head';
      const title = document.createElement('strong');
      title.textContent = `Stage ${ph.n} — ${ph.title}`;
      const meta = document.createElement('span');
      meta.textContent = `${done}/${inStage.length} earned · ${ph.hours}`;
      h.append(title, meta);
      rows.append(h);
    }
    rows.append(rowFor(t));
  }
}

function sourceRef(key) {
  const s = sources.get(key);
  const a = document.createElement('a');
  a.textContent = `[${key}]`;
  a.title = s.name;
  if (s.url) { a.href = s.url; a.target = '_blank'; a.rel = 'noopener'; }
  else a.href = '#view-about';
  return a;
}

function renderDetail() {
  const t = byId.get(selected) ?? trophies[0];
  const d = $('detail');
  d.replaceChildren();
  const h = document.createElement('h2');
  h.textContent = isSpoilered(t) ? 'Hidden story trophy' : t.name;
  d.append(h);
  const tags = document.createElement('div');
  tags.className = 'row-tags';
  tags.append(gradeBadge(t));
  if (t.kinds.includes('story')) tags.append(badge('b-story', 'Story'));
  if (t.kinds.includes('collectibles')) tags.append(badge('b-collect', 'Collectible'));
  if (t.kinds.includes('activities')) tags.append(badge('b-act', 'Activity'));
  if (t.missable) tags.append(badge('b-miss', 'Possibly missable'));
  if (t.hidden) tags.append(badge('b-hidden', 'Hidden on PS5'));
  const c = countLabel(t);
  if (c) tags.append(badge('b-count', c));
  tags.append(badge('b-phase', `Stage ${t.stage}`));
  d.append(tags);
  const k1 = document.createElement('p');
  k1.className = 'kicker';
  k1.textContent = 'Official description';
  const off = document.createElement('p');
  off.className = 'official';
  off.textContent = isSpoilered(t) ? 'Hidden until earned.' : `“${t.description}” — as PlayStation publishes it.`;
  d.append(k1, off);
  if (isSpoilered(t)) {
    const p = document.createElement('p');
    p.className = 'guide-text';
    p.textContent = 'Spoiler-free mode is on: this story trophy stays hidden until you earn it. Tick it off when it pops and the guide opens.';
    d.append(p);
  } else {
    const k2 = document.createElement('p');
    k2.className = 'kicker';
    k2.textContent = 'Guide — in our own words';
    const g = document.createElement('p');
    g.className = 'guide-text';
    g.textContent = t.guide;
    d.append(k2, g);
    if (t.count !== null && t.count !== undefined) {
      const target = countTarget(t);
      const have = Math.min(counts[t.id] ?? 0, target);
      const counter = document.createElement('div');
      counter.className = 'counter';
      const minus = document.createElement('button');
      minus.type = 'button';
      minus.textContent = '−';
      minus.setAttribute('aria-label', 'Count one less');
      minus.addEventListener('click', () => { counts[t.id] = Math.max(0, (counts[t.id] ?? 0) - 1); save(); render(); });
      const val = document.createElement('strong');
      const unit = t.id === 28 ? ' spots' : (t.id === 52 || t.id === 53) ? '' : '';
      const money = (t.id === 52 || t.id === 53) ? '$' : '';
      val.textContent = `${money}${have.toLocaleString('en-US')} / ${money}${target.toLocaleString('en-US')}${unit}`;
      const plus = document.createElement('button');
      plus.type = 'button';
      plus.textContent = '+';
      plus.setAttribute('aria-label', 'Count one more');
      plus.addEventListener('click', () => { counts[t.id] = Math.min(target, (counts[t.id] ?? 0) + 1); save(); render(); });
      const hint = document.createElement('span');
      hint.className = 'counter-hint';
      hint.textContent = 'Your count — saved in this browser';
      counter.append(minus, val, plus, hint);
      d.append(counter);
    }
    const miss = document.createElement('p');
    miss.className = 'note' + (t.missable ? ' warn' : '');
    miss.textContent = t.missable
      ? 'Missable? Yes — possibly. This is the only trophy in the list flagged as possibly missable. Do Lucia’s Chapter 1 balcony meditation first, then meditate at the other spots in free-roam.'
      : 'Missable? No. This trophy cannot be missed — finish what it asks for and it pops, in free-roam after the story if not before.';
    d.append(miss);
    const road = document.createElement('p');
    road.className = 'note';
    const ph = stageOf(t);
    road.textContent = `Roadmap: Stage ${t.stage} — ${ph.title} (${ph.hours}).`;
    d.append(road);
    if (t.unconfirmed) {
      const u = document.createElement('p');
      u.className = 'note warn';
      u.textContent = 'Unconfirmed: no guide has pinned down this trophy’s exact trigger yet. The guide above is the plain reading of its official description — check the sources again after launch.';
      d.append(u);
    }
    const k3 = document.createElement('p');
    k3.className = 'kicker';
    k3.textContent = 'Sources — where each fact comes from';
    const refs = document.createElement('div');
    refs.className = 'src-refs';
    for (const key of t.sources) refs.append(sourceRef(key));
    d.append(k3, refs);
    const list = document.createElement('ol');
    list.className = 'src-list';
    for (const key of t.sources) {
      const li = document.createElement('li');
      const s = sources.get(key);
      li.textContent = `[${key}] ${s.name} — retrieved 19 November 2026.`;
      list.append(li);
    }
    d.append(list);
  }
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = `mark-earned${earned.has(t.id) ? ' earned' : ''}`;
  btn.textContent = earned.has(t.id) ? '✓ Earned — unmark' : 'Mark earned';
  btn.addEventListener('click', () => toggleEarned(t.id));
  d.append(btn);
}

function toggleEarned(id) {
  if (earned.has(id)) earned.delete(id);
  else earned.add(id);
  save();
  render();
}

function renderRoadmap() {
  const box = $('phases');
  box.replaceChildren();
  for (const ph of roadmap.phases) {
    const card = document.createElement('div');
    card.className = 'phase';
    card.id = `phase-${ph.n}`;
    const head = document.createElement('div');
    head.className = 'phase-head';
    const h = document.createElement('h3');
    h.textContent = `Stage ${ph.n} — ${ph.title}`;
    const meta = document.createElement('span');
    meta.className = 'phase-meta';
    const inStage = trophies.filter((t) => t.stage === ph.n);
    const done = inStage.filter((t) => earned.has(t.id)).length;
    meta.textContent = `${done}/${inStage.length} earned · ${ph.hours}`;
    head.append(h, meta);
    card.append(head);
    const bar = document.createElement('div');
    bar.className = 'bar stage-bar';
    const fill = document.createElement('span');
    fill.style.width = `${(done / inStage.length) * 100}%`;
    bar.append(fill);
    card.append(bar);
    const ol = document.createElement('ol');
    for (const step of ph.steps) {
      const li = document.createElement('li');
      li.textContent = step;
      ol.append(li);
    }
    card.append(ol);
    const chips = document.createElement('div');
    chips.className = 'phase-trophies';
    for (const t of inStage) {
      const c = document.createElement('button');
      c.type = 'button';
      c.className = `pt${earned.has(t.id) ? ' done' : ''}`;
      c.textContent = `${earned.has(t.id) ? '✓ ' : ''}${isSpoilered(t) ? 'Hidden story trophy' : t.name}`;
      c.addEventListener('click', () => { selected = t.id; tab = 'guide'; render(); });
      chips.append(c);
    }
    card.append(chips);
    box.append(card);
  }
}

function renderMissables() {
  const box = $('missable-list');
  box.replaceChildren();
  const watch = [
    ...trophies.filter((t) => t.missable),
    ...trophies.filter((t) => t.unconfirmed),
  ];
  for (const t of watch) {
    const card = document.createElement('div');
    card.className = 'phase miss-card';
    const head = document.createElement('div');
    head.className = 'phase-head';
    const h = document.createElement('h3');
    h.textContent = isSpoilered(t) ? 'Hidden story trophy' : t.name;
    const meta = document.createElement('span');
    meta.className = 'phase-meta';
    meta.textContent = t.missable ? 'Possibly missable' : '? Trigger not yet known';
    head.append(h, meta);
    card.append(head);
    const tags = document.createElement('div');
    tags.className = 'row-tags';
    tags.append(gradeBadge(t));
    tags.append(badge('b-phase', `Stage ${t.stage}`));
    for (const key of t.sources) tags.append(badge('b-src', key));
    card.append(tags);
    const g = document.createElement('p');
    g.className = 'guide-text';
    g.style.marginTop = '8px';
    g.textContent = isSpoilered(t)
      ? 'Spoiler-free mode is on: earn this story trophy to reveal its guide.'
      : t.guide;
    card.append(g);
    const open = document.createElement('button');
    open.type = 'button';
    open.textContent = 'Open the full guide';
    open.addEventListener('click', () => { selected = t.id; tab = 'guide'; render(); });
    card.append(open);
    box.append(card);
  }
}

function renderSources() {
  const list = $('source-list');
  list.replaceChildren();
  for (const s of doc.sources) {
    const li = document.createElement('li');
    if (s.url) {
      const a = document.createElement('a');
      a.href = s.url;
      a.target = '_blank';
      a.rel = 'noopener';
      a.textContent = s.name;
      li.append(a);
    } else {
      li.textContent = s.name;
    }
    li.append(document.createTextNode(' — retrieved 19 November 2026.'));
    list.append(li);
  }
}

function renderTabs() {
  for (const [key, t] of [['guide', 'guide'], ['roadmap', 'roadmap'], ['missables', 'missables'], ['about', 'about']]) {
    $(`tab-${key}`).classList.toggle('active', tab === t);
    $(`view-${key}`).hidden = tab !== t;
  }
}

function render() {
  renderProgress();
  renderStageStrip();
  renderFilters();
  renderList();
  renderDetail();
  renderRoadmap();
  renderMissables();
  renderTabs();
}

$('tab-guide').addEventListener('click', () => { tab = 'guide'; render(); });
$('tab-roadmap').addEventListener('click', () => { tab = 'roadmap'; render(); });
$('tab-missables').addEventListener('click', () => { tab = 'missables'; render(); });
$('tab-about').addEventListener('click', () => { tab = 'about'; render(); });
$('search').addEventListener('input', (e) => { query = e.target.value; renderList(); });
$('grade-filter').addEventListener('change', (e) => { grade = e.target.value; renderList(); });
$('status-filter').addEventListener('change', (e) => { status = e.target.value; renderList(); });
$('sort-filter').addEventListener('change', (e) => { sort = e.target.value; renderList(); });
$('spoiler').addEventListener('change', (e) => { spoiler = e.target.checked; save(); render(); });
$('export').addEventListener('click', () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify({ game: 'Grand Theft Auto VI', earned: [...earned], counts }, null, 2)], { type: 'application/json' }));
  a.download = 'leonida-trophy-progress.json';
  a.click();
});
$('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const ids = Array.isArray(data) ? data : data.earned;
    earned = new Set(ids.filter((id) => byId.has(id)));
    if (data.counts) counts = data.counts;
    save();
    render();
  } catch { /* ignore a bad file */ }
});
$('reset').addEventListener('click', () => {
  if (demo) return;
  earned = new Set();
  counts = {};
  save();
  render();
});

$('spoiler').checked = spoiler;
if (shot === 'roadmap') tab = 'roadmap';
if (shot === 'missables') tab = 'missables';
if (shot === 'cover') { spoiler = true; $('spoiler').checked = true; }
if (shot === 'missable') { kind = 'missable'; spoiler = true; $('spoiler').checked = true; }
if (shot === 'collectibles') { kind = 'collectibles'; selected = 31; }
renderSources();
render();
window.__shotReady = true;
