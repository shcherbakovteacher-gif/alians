'use strict';

// The basemap and both imagery services use the same equirectangular grid.
function createSatelliteLayer(container) {
  const tilePixels = 256;
  const maxLevel = 13;
  const antarcticLevel = 12;
  const tiles = new Map();
  let scheduled = 0;
  let loadTimer = 0;
  let viewport;

  function availableLevel(view) {
    const centerLatitude = 90 - 360 * (view.height / 2 - view.y) / (view.fit * view.zoom);
    return centerLatitude < -56 ? antarcticLevel : maxLevel;
  }

  function tileSource(level, column, row) {
    const span = 180 / 2 ** level;
    const west = -180 + column * span;
    const north = 90 - row * span;
    if (north <= -56) {
      const box = [west, north - span, west + span, north].join(',');
      return `https://nimbus.cr.usgs.gov/arcgis/rest/services/Antarctica/USGS_EROS_Antarctica_LANDSAT/MapServer/export?bbox=${box}&bboxSR=4326&imageSR=4326&size=256,256&layers=show:62,63,64,65,66,67&format=png32&transparent=true&f=image`;
    }
    if (north - span < 84) return `https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless/default/WGS84/${level}/${row}/${column}.jpg`;
    return null;
  }

  function getTile(level, column, row) {
    const key = `${level}/${column}/${row}`;
    if (tiles.has(key)) return tiles.get(key);
    const source = tileSource(level, column, row);
    if (!source) return null;
    const image = document.createElement('img');
    image.alt = '';
    image.draggable = false;
    image.decoding = 'async';
    image.style.zIndex = level;
    image.hidden = true;
    const tile = { image, column, row, level, loaded: false, touched: performance.now() };
    tiles.set(key, tile);
    image.addEventListener('load', () => { tile.loaded = true; schedule(); });
    image.addEventListener('error', () => {
      if (tiles.get(key) === tile) tiles.delete(key);
      image.remove();
    });
    image.src = source;
    container.append(image);
    return tile;
  }

  function levelFor(worldWidth) {
    const requiredPixels = worldWidth * Math.min(devicePixelRatio || 1, 2);
    return requiredPixels <= 4096 ? 0 : Math.min(availableLevel(viewport), Math.ceil(Math.log2(requiredPixels / (2 * tilePixels))));
  }

  function loadVisibleTiles() {
    const { x, y, width, height, fit, zoom } = viewport;
    const worldWidth = fit * zoom;
    const level = levelFor(worldWidth);
    const tileSize = worldWidth / (2 * 2 ** level);
    const needed = new Set();
    if (level) {
      const minColumn = Math.max(0, Math.floor(-x / tileSize));
      const maxColumn = Math.min(2 ** (level + 1) - 1, Math.ceil((width - x) / tileSize) - 1);
      const minRow = Math.max(0, Math.floor(-y / tileSize));
      const maxRow = Math.min(2 ** level - 1, Math.ceil((height - y) / tileSize) - 1);
      for (let row = minRow; row <= maxRow; row += 1) {
        for (let column = minColumn; column <= maxColumn; column += 1) {
          needed.add(`${level}/${column}/${row}`);
          getTile(level, column, row);
        }
      }
    }
    for (const [key, tile] of tiles) {
      if (tile.loaded || needed.has(key)) continue;
      tile.image.removeAttribute('src');
      tile.image.remove();
      tiles.delete(key);
    }
  }

  function render() {
    scheduled = 0;
    const { x, y, width, height, fit, zoom } = viewport;
    const worldWidth = fit * zoom;
    const level = levelFor(worldWidth);
    const now = performance.now();
    for (const tile of tiles.values()) {
      const size = worldWidth / (2 * 2 ** tile.level);
      const left = Math.round(x + tile.column * size);
      const top = Math.round(y + tile.row * size);
      const right = Math.round(x + (tile.column + 1) * size);
      const bottom = Math.round(y + (tile.row + 1) * size);
      const visible = tile.level <= level && right > 0 && bottom > 0 && left < width && top < height;
      tile.image.hidden = !visible || !tile.loaded;
      if (!visible) continue;
      tile.touched = now;
      Object.assign(tile.image.style, { left: `${left}px`, top: `${top}px`, width: `${right - left}px`, height: `${bottom - top}px` });
    }
    if (tiles.size > 160) {
      const stale = [...tiles].filter(([, tile]) => tile.touched !== now).sort((a, b) => a[1].touched - b[1].touched);
      for (const [key, tile] of stale.slice(0, tiles.size - 160)) {
        tile.image.remove();
        tiles.delete(key);
      }
    }
  }

  function schedule(view) {
    if (view) {
      viewport = view;
      clearTimeout(loadTimer);
      loadTimer = setTimeout(loadVisibleTiles, 125);
    }
    if (!scheduled) scheduled = requestAnimationFrame(render);
  }

  // Never enlarge the most detailed imagery beyond its native resolution.
  return { schedule, maxWidth: 2 * tilePixels * 2 ** maxLevel, antarcticMaxWidth: 2 * tilePixels * 2 ** antarcticLevel };
}
