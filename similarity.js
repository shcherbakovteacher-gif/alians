'use strict';

const researchProfiles = {
  astrobiology: { name: 'Astrobiology', weights: [15, 5, 5, 15, 25, 25, 5, 5] },
  geology: { name: 'Geology', weights: [10, 5, 10, 5, 15, 40, 10, 5] },
  atmosphere: { name: 'Atmosphere', weights: [25, 30, 5, 10, 15, 5, 5, 5] },
  isru: { name: 'ISRU · resource use', weights: [15, 10, 5, 5, 30, 20, 10, 5] }
};

const climatePeriod = '2001–2025';
const earthdataCollection = 'https://search.earthdata.nasa.gov/search/granules?p=C1276812859-GES_DISC';
const planetaryFacts = 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/';
const pdsLro = 'https://pds-geosciences.wustl.edu/missions/lro/';
const pdsMeda = 'https://pds.nasa.gov/ds-view/pds/viewBundle.jsp?identifier=urn%3Anasa%3Apds%3Amars2020_meda';

// Annual T2M (°C) and PS (kPa) values from NASA POWER's 2001–2025 MERRA-2 climatology.
// Feature sets encode what the linked site evidence documents for this comparison.
const earthProfiles = {
  haruj: { temperature: 21.28, pressure: 93.38, water: [], geology: ['basalt', 'volcanic'], dust: ['fines', 'debris'] },
  ash: { temperature: 17.82, pressure: 91.58, water: [], geology: ['basalt', 'volcanic'], dust: ['debris'] },
  khaybar: { temperature: 22.95, pressure: 86.97, water: [], geology: ['basalt', 'volcanic', 'silicic'], dust: ['debris'] },
  tsokar: { temperature: -6.09, pressure: 54.77, water: ['liquid', 'brine'], geology: ['evaporites', 'sediments'], dust: ['fines', 'crust'] },
  qaidam: { temperature: 3.20, pressure: 70.58, water: ['brine'], geology: ['evaporites', 'sediments', 'wind'], dust: ['fines', 'crust'] },
  uyuni: { temperature: 7.48, pressure: 65.44, water: ['liquid', 'brine'], geology: ['evaporites', 'sediments'], dust: ['crust'] },
  atacama: { temperature: 17.07, pressure: 87.50, water: [], geology: ['evaporites', 'sediments'], dust: ['fines', 'debris'] },
  mcmurdo: { temperature: -27.23, pressure: 85.12, water: ['liquid', 'brine', 'ice'], geology: ['sediments', 'channels'], dust: ['fines', 'debris'] },
  kilauea: { temperature: 21.30, pressure: 96.38, water: [], geology: ['basalt', 'volcanic', 'tubes'], dust: ['debris'] },
  california: { temperature: 8.83, pressure: 85.56, water: ['ice'], geology: ['basalt', 'volcanic', 'tubes'], dust: ['debris'] }
};

const planetaryProfiles = {
  moon: {
    temperature: -20, pressure: 3e-13, gravity: 1.62, shielding: [0, 0], day: 708.7,
    water: ['ice'], geology: ['basalt', 'volcanic', 'tubes'], dust: ['fines', 'debris', 'impact'],
    observation: 'LRO’s Diviner instrument maps lunar surface temperatures. LRO observations also identify cold regions near the poles that can retain surface ice.',
    archive: ['LRO data in NASA PDS', pdsLro],
    sources: [
      ['NASA · Moon reference gravity, pressure and solar day', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html'],
      ['NASA PDS · Lunar Reconnaissance Orbiter archive', pdsLro],
      ['NASA PDS · LRO Diviner surface-temperature maps', 'https://pds.nasa.gov/ds-view/pds/viewDataset.jsp?dsid=LRO-L-DLRE-5-GCP-V1.0'],
      ['NASA LRO · Lunar polar ice', 'https://science.nasa.gov/solar-system/moon/nasas-lro-lunar-ice-deposits-are-widespread/'],
      ['NASA LRO · Lunar pits and possible caves', 'https://www.nasa.gov/solar-system/nasas-lro-finds-lunar-pits-harbor-comfortable-temperatures/'],
      ['NASA · Moon composition', 'https://science.nasa.gov/moon/composition/'],
      ['NASA · Lunar radiation and CRaTER', 'https://science.nasa.gov/wp-content/uploads/2024/01/crater-litho-2023feb.pdf']
    ]
  },
  mars: {
    temperature: -65, pressure: 0.636, gravity: 3.71, shielding: [0.5, 0.5], day: 24.6597,
    water: ['ice'], geology: ['basalt', 'evaporites', 'sediments', 'wind', 'channels'], dust: ['fines', 'debris'],
    observation: 'Perseverance’s MEDA archive includes calibrated temperature and pressure measurements at Jezero Crater. The score uses planetary reference values for these criteria.',
    archive: ['Perseverance MEDA in NASA PDS', pdsMeda],
    sources: [
      ['NASA · Mars reference gravity, pressure and solar day', 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html'],
      ['NASA PDS · Perseverance MEDA environmental measurements', pdsMeda],
      ['NASA · Curiosity RAD surface radiation measurements', 'https://science.nasa.gov/resource/radiation-measurements-on-mars/'],
      ['NASA · Gale Crater sediments and geology', 'https://science.nasa.gov/resource/a-guide-to-gale-crater/'],
      ['NASA · Minerals and windblown sediments in Gale Crater', 'https://ntrs.nasa.gov/citations/20205001822'],
      ['NASA · Water-carved channels and deposits at Jezero', 'https://science.nasa.gov/resource/perseverance-explores-the-jezero-crater-delta/']
    ]
  }
};

const featureNames = {
  liquid: 'surface liquid water', brine: 'saline water or brine', ice: 'water ice',
  basalt: 'basalt', volcanic: 'volcanic flows or landforms', tubes: 'lava tubes or candidate entrances',
  silicic: 'silica-rich volcanic domes', evaporites: 'evaporite salts', sediments: 'sedimentary deposits',
  wind: 'wind-shaped landforms', channels: 'water-cut channels',
  fines: 'loose fine particles', debris: 'rocky debris', crust: 'salt crust', impact: 'impact-generated regolith'
};

const shieldingNames = { 0: 'negligible', 0.5: 'partial', 1: 'strong' };
const earthConstants = { gravity: 9.81, shielding: [1, 1], day: 24 };

function scalarMatch(left, right) {
  const scale = Math.max(Math.abs(left), Math.abs(right));
  return scale === 0 ? 100 : 100 * (1 - Math.abs(left - right) / scale);
}

function featureMatch(earth, target) {
  const union = new Set([...earth, ...target]);
  const shared = earth.filter(feature => target.includes(feature)).length;
  return union.size === 0 ? 100 : 100 * shared / union.size;
}

function listFeatures(features) {
  return features.map(feature => featureNames[feature]).join(', ') || 'none recorded in the site sources';
}

function comparisonMetrics(site) {
  const earth = earthProfiles[site.id];
  const target = planetaryProfiles[site.target];
  const radiation = target.shielding.reduce((sum, shield, index) => sum + 50 * (1 - Math.abs(earthConstants.shielding[index] - shield)), 0);
  return [
    ['Temperature', `${earth.temperature.toFixed(2)} °C (air) / ${target.temperature} °C (surface mean)`, scalarMatch(earth.temperature + 273.15, target.temperature + 273.15)],
    ['Atmospheric pressure', `${earth.pressure.toFixed(2)} kPa / ${site.target === 'moon' ? '3 × 10⁻¹³ kPa (lunar night)' : '0.636 kPa'}`, scalarMatch(earth.pressure, target.pressure)],
    ['Gravity', `${earthConstants.gravity} / ${target.gravity} m/s²`, scalarMatch(earthConstants.gravity, target.gravity)],
    ['Radiation (UV + cosmic)', `Shielding proxy · Earth ${earthConstants.shielding.map(value => shieldingNames[value]).join(' + ')} / target ${target.shielding.map(value => shieldingNames[value]).join(' + ')}`, radiation],
    ['Water / ice', `Earth: ${listFeatures(earth.water)} · Target: ${listFeatures(target.water)}`, featureMatch(earth.water, target.water)],
    ['Geology / minerals / regolith', `Earth: ${listFeatures(earth.geology)} · Target: ${listFeatures(target.geology)}`, featureMatch(earth.geology, target.geology)],
    ['Dust and soil', `Earth: ${listFeatures(earth.dust)} · Target: ${listFeatures(target.dust)}`, featureMatch(earth.dust, target.dust)],
    ['Day length / illumination', `Solar day · ${earthConstants.day} / ${target.day.toFixed(2)} h`, scalarMatch(earthConstants.day, target.day)]
  ];
}

function calculateSimilarity(site, profileId) {
  const { weights } = researchProfiles[profileId];
  const criteria = comparisonMetrics(site).map(([name, evidence, local], index) => {
    const weight = weights[index];
    return { name, evidence, local, weight, contribution: local * weight / 100 };
  });
  return { criteria, overall: criteria.reduce((sum, criterion) => sum + criterion.contribution, 0) };
}

function powerSource(site) {
  const params = new URLSearchParams({ parameters: 'T2M,PS', community: 'AG', latitude: site.latitude, longitude: site.longitude, format: 'JSON' });
  return `https://power.larc.nasa.gov/api/temporal/climatology/point?${params}`;
}

function worldviewSource(site) {
  const params = new URLSearchParams({
    v: [site.longitude - 1.8, site.latitude - 1, site.longitude + 1.8, site.latitude + 1].map(value => value.toFixed(2)).join(','),
    l: 'MODIS_Terra_CorrectedReflectance_TrueColor', t: '2025-01-15-T00:00:00Z'
  });
  return `https://worldview.earthdata.nasa.gov/index.html?${params}`;
}
