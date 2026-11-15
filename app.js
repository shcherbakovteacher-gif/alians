'use strict';

const map = document.querySelector('#map');
const world = map.querySelector('.map-world');
const pins = map.querySelector('.pins');
const siteList = document.querySelector('#site-list');
const siteCount = document.querySelector('#site-count');
const filter = document.querySelector('#planet-filter');
const zoomIn = document.querySelector('#zoom-in');
const zoomOut = document.querySelector('#zoom-out');
const panel = document.querySelector('#comparison');
const closePanel = document.querySelector('#close-comparison');

const view = { width: 0, height: 0, fit: 0, zoom: 1, x: 0, y: 0 };
const maxZoom = 8;
const pointers = new Map();

function element(tag, content, className) {
  const node = document.createElement(tag);
  if (content) node.textContent = content;
  if (className) node.className = className;
  return node;
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function coordinate(value, positive, negative) {
  return `${Math.abs(value).toFixed(2)}° ${value >= 0 ? positive : negative}`;
}

function showComparison(site) {
  const target = analogData.targets[site.target];
  const label = site.type === 'team' ? 'Team candidate' : 'NASA reference';
  setText('comparison-type', `${target.name} analog · ${label}`);
  setText('comparison-name', site.name);
  setText('comparison-location', `${site.place} · ${coordinate(site.latitude, 'N', 'S')}, ${coordinate(site.longitude, 'E', 'W')}`);
  setText('comparison-summary', site.summary);
  setText('comparison-target', target.name);
  setText('comparison-score', site.score === null ? 'No percentage published in the cited sources' : `${site.score.value}% · ${site.score.context}`);

  document.querySelector('#comparison-features').replaceChildren(...analogData.features.map((feature, index) => {
    const row = element('tr');
    const heading = element('th', feature);
    heading.scope = 'row';
    row.append(heading, element('td', site.features[index]), element('td', target.features[index]));
    return row;
  }));

  const notes = [['Shared features', site.match], ['Important differences', site.difference]];
  document.querySelector('#comparison-notes').replaceChildren(...notes.map(([heading, copy]) => {
    const section = element('section');
    section.append(element('h3', heading), element('p', copy));
    return section;
  }));

  const sources = [...site.sources, target.source];
  if (site.score) sources.push(site.score.source);
  document.querySelector('#comparison-sources').replaceChildren(...sources.map(([labelText, url]) => {
    const item = element('li');
    const link = element('a', `${labelText} ↗`, 'text-link');
    link.href = url;
    item.append(link);
    return item;
  }));
  panel.showModal();
  panel.scrollTop = 0;
  closePanel.focus({ preventScroll: true });
}

closePanel.addEventListener('click', () => panel.close());
panel.addEventListener('click', event => {
  if (event.target === panel) panel.close();
});

function createMarkerImage(site) {
  const image = element('img');
  image.src = `assets/marker-${site.target}-${site.type}.png`;
  image.alt = '';
  image.draggable = false;
  return image;
}

const locations = analogData.sites.map(site => {
  const target = analogData.targets[site.target].name;
  const pin = element('button', null, 'pin');
  pin.type = 'button';
  pin.setAttribute('aria-label', `${site.name}, ${target} analog`);
  pin.append(createMarkerImage(site), element('span', site.name));
  pin.addEventListener('click', () => showComparison(site));
  const leader = element('i', null, 'leader');
  leader.setAttribute('aria-hidden', 'true');
  pins.append(leader, pin);

  const item = element('li');
  const choice = element('button', null, 'site-choice');
  choice.type = 'button';
  choice.dataset.target = site.target;
  const details = element('span');
  details.append(element('strong', site.name), element('small', site.place));
  choice.append(createMarkerImage(site), details, element('span', target, 'technical'));
  choice.addEventListener('click', () => showComparison(site));
  item.append(choice);
  siteList.append(item);
  return { site, pin, leader, item };
});

function clamp(value, low, high) {
  return Math.max(low, Math.min(high, value));
}

function boundAxis(origin, area, mapSize) {
  return mapSize <= area ? (area - mapSize) / 2 : clamp(origin, area - mapSize, 0);
}

function paint() {
  const width = view.fit * view.zoom;
  const height = width / 2;
  view.x = boundAxis(view.x, view.width, width);
  view.y = boundAxis(view.y, view.height, height);
  world.style.transform = `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`;
  zoomIn.disabled = view.zoom >= maxZoom;
  zoomOut.disabled = view.zoom <= 1;

  const compact = view.width <= 450;
  const spacing = compact ? 35 : 42;
  const occupied = [];
  const offsets = [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1], [-2, 0], [2, 0]];
  for (const { site, pin, leader } of locations) {
    const x = view.x + width * (site.longitude + 180) / 360;
    const y = view.y + height * (90 - site.latitude) / 180;
    pin.hidden = (filter.value !== 'both' && filter.value !== site.target) || x < 0 || y < 0 || x > view.width || y > view.height;
    leader.hidden = true;
    if (pin.hidden) continue;

    // A short leader line keeps close pins individually selectable at world scale.
    const candidates = offsets.map(([dx, dy]) => [clamp(x + dx * spacing, 18, view.width - 18), clamp(y + dy * spacing, 45, view.height - 5)]);
    const [left, top] = candidates.find(([px, py]) => occupied.every(([ox, oy]) => Math.abs(ox - px) >= spacing || Math.abs(oy - py) >= spacing)) ?? candidates[0];
    occupied.push([left, top]);
    pin.style.left = `${left}px`;
    pin.style.top = `${top}px`;
    const length = Math.hypot(left - x, top - y);
    if (length > 2) {
      leader.hidden = false;
      leader.style.left = `${x}px`;
      leader.style.top = `${y}px`;
      leader.style.width = `${length}px`;
      leader.style.transform = `rotate(${Math.atan2(top - y, left - x)}rad)`;
    }
  }
}

function changeZoom(zoom, x = view.width / 2, y = view.height / 2) {
  const next = clamp(zoom, 1, maxZoom);
  const multiplier = next / view.zoom;
  view.x = x - (x - view.x) * multiplier;
  view.y = y - (y - view.y) * multiplier;
  view.zoom = next;
  paint();
}

function pan(dx, dy) {
  view.x += dx;
  view.y += dy;
  paint();
}

function resize() {
  const { clientWidth: width, clientHeight: height } = map;
  if (!width || !height) return;
  const fit = Math.min(width, height * 2);
  const ratio = view.fit ? fit / view.fit : 1;
  view.x = width / 2 - (view.width / 2 - view.x) * ratio;
  view.y = height / 2 - (view.height / 2 - view.y) * ratio;
  Object.assign(view, { width, height, fit });
  world.style.width = `${fit}px`;
  world.style.height = `${fit / 2}px`;
  paint();
}

function applyFilter() {
  let count = 0;
  for (const { site, item } of locations) {
    item.hidden = filter.value !== 'both' && filter.value !== site.target;
    if (!item.hidden) count += 1;
  }
  siteCount.textContent = `${count} sites shown`;
  paint();
}

filter.addEventListener('change', applyFilter);
zoomIn.addEventListener('click', () => changeZoom(view.zoom * 1.5));
zoomOut.addEventListener('click', () => changeZoom(view.zoom / 1.5));
document.querySelector('#reset-view').addEventListener('click', () => changeZoom(1));

map.addEventListener('keydown', event => {
  if (event.target !== map) return;
  const direction = { ArrowLeft: [60, 0], ArrowRight: [-60, 0], ArrowUp: [0, 60], ArrowDown: [0, -60] }[event.key];
  if (direction) pan(...direction);
  else if (event.key === '+' || event.key === '=') changeZoom(view.zoom * 1.5);
  else if (event.key === '-') changeZoom(view.zoom / 1.5);
  else if (event.key === 'Home') changeZoom(1);
  else return;
  event.preventDefault();
});

const localPoint = event => {
  const { left, top } = map.getBoundingClientRect();
  return { x: event.clientX - left, y: event.clientY - top };
};

map.addEventListener('wheel', event => {
  if (document.activeElement !== map && !event.ctrlKey) return;
  event.preventDefault();
  const position = localPoint(event);
  changeZoom(view.zoom * (event.deltaY < 0 ? 1.14 : 1 / 1.14), position.x, position.y);
}, { passive: false });

map.addEventListener('pointerdown', event => {
  if (event.button !== 0 || event.target.closest('button') || pointers.size >= 2) return;
  pointers.set(event.pointerId, localPoint(event));
  map.setPointerCapture(event.pointerId);
  map.classList.add('is-dragging');
});

map.addEventListener('pointermove', event => {
  const previous = pointers.get(event.pointerId);
  if (!previous) return;
  const next = localPoint(event);
  const other = [...pointers].find(([id]) => id !== event.pointerId)?.[1];
  pointers.set(event.pointerId, next);
  if (other) {
    const before = Math.hypot(previous.x - other.x, previous.y - other.y);
    const after = Math.hypot(next.x - other.x, next.y - other.y);
    if (before > 0) changeZoom(view.zoom * after / before, (previous.x + other.x) / 2, (previous.y + other.y) / 2);
    pan((next.x - previous.x) / 2, (next.y - previous.y) / 2);
  } else {
    pan(next.x - previous.x, next.y - previous.y);
  }
});

for (const eventName of ['pointerup', 'pointercancel', 'lostpointercapture']) {
  map.addEventListener(eventName, event => {
    pointers.delete(event.pointerId);
    if (!pointers.size) map.classList.remove('is-dragging');
  });
}

document.querySelector('.start').addEventListener('click', () => document.querySelector('#map-title').focus({ preventScroll: true }));
resize();
applyFilter();
new ResizeObserver(resize).observe(map);
