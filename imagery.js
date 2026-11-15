'use strict';

const ccBy = 'https://creativecommons.org/licenses/by/';
const ccBySa = 'https://creativecommons.org/licenses/by-sa/';
const commons = 'https://commons.wikimedia.org/wiki/File:';

function sentinelImage(site, description) {
  return {
    file: `${site}-satellite`, kind: 'Satellite image', description,
    author: 'Sentinel-2 cloudless by EOX IT Services GmbH (contains modified Copernicus Sentinel data 2016)',
    source: 'https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml',
    license: 'CC BY 4.0', licenseUrl: `${ccBy}4.0/`
  };
}

const siteImagery = {
  haruj: [
    sentinelImage('haruj', 'Dark lava fields amid the sands of central Libya.'),
    {
      file: 'haruj-photo', kind: 'Orbital photograph', description: 'Haruj lava flows seen by the Space Shuttle Challenger crew in 1984.',
      author: 'NASA, STS41C-32-1146', source: 'https://volcano.si.edu/gallery/ShowImage.cfm?photo=GVP-08960', license: 'Public domain'
    }
  ],
  ash: [
    sentinelImage('ash', 'Basaltic lava fields near the Syria–Jordan border.'),
    {
      file: 'ash-photo', kind: 'Ground photograph', description: 'Basalt pavement in the Black Desert of eastern Jordan.',
      author: 'Joe Roe', source: `${commons}Basalt_pavement_in_the_Black_Desert,_eastern_Jordan.jpg`,
      license: 'CC BY-SA 4.0', licenseUrl: `${ccBySa}4.0/`
    }
  ],
  khaybar: [
    sentinelImage('khaybar', 'The pale domes and dark basalt flows around Jabal Abyad.'),
    {
      file: 'khaybar-photo', kind: 'Ground photograph', description: 'Volcanic domes in central Harrat Khaybar, cropped from Figure 10c.',
      author: 'Károly Németh', source: 'https://link.springer.com/article/10.1007/s12371-026-01445-w#Fig10',
      license: 'CC BY 4.0', licenseUrl: `${ccBy}4.0/`
    }
  ],
  tsokar: [
    sentinelImage('tsokar', 'Tso Kar and the surrounding high-altitude basin in Ladakh.'),
    {
      file: 'tsokar-photo', kind: 'Ground photograph', description: 'Tso Kar and the mountains above the saline lake.',
      author: 'Elroy Serrao', source: `${commons}Himalayas_-_Tso_Kar_(9368483417).jpg`,
      license: 'CC BY-SA 2.0', licenseUrl: `${ccBySa}2.0/`
    }
  ],
  qaidam: [
    sentinelImage('qaidam', 'Dalangtan Playa on the northwestern edge of the Qaidam Basin.'),
    {
      file: 'qaidam-photo', kind: 'Ground photograph', description: 'Salt crust at sampling site S-3, cropped from Figure 1a.',
      author: 'Ting Huang and colleagues', source: 'https://doi.org/10.1371/journal.pone.0200949.g001',
      license: 'CC BY 4.0', licenseUrl: `${ccBy}4.0/`
    }
  ],
  uyuni: [
    sentinelImage('uyuni', 'The white salt crust of Salar de Uyuni and its surrounding terrain.'),
    {
      file: 'uyuni-photo', kind: 'Ground photograph', description: 'Polygonal patterns in the salt crust at Salar de Uyuni.',
      author: 'Pedro Szekely', source: `${commons}Hexagons,_Salar_de_Uyuni,_Bolivia_(2086104060).jpg`,
      license: 'CC BY 2.0', licenseUrl: `${ccBy}2.0/`
    }
  ],
  atacama: [
    sentinelImage('atacama', 'The hyperarid Atacama around Yungay and the coastal ranges.'),
    {
      file: 'atacama-photo', kind: 'Ground photograph', description: 'Landscape in Chile’s Atacama Desert.',
      author: 'Diego Delso', source: `${commons}Paisaje_en_el_desierto_de_Atacama,_Chile,_2016-02-06,_DD_16.JPG`,
      license: 'CC BY-SA 4.0', licenseUrl: `${ccBySa}4.0/`
    }
  ],
  mcmurdo: [
    {
      file: 'mcmurdo-satellite', kind: 'Satellite image', description: 'Landsat 7 view of the McMurdo Dry Valleys and the surrounding ice.',
      author: 'NASA / USGS', source: `${commons}Landsat7_dry_valley_lrg.jpg`, license: 'Public domain'
    },
    {
      file: 'mcmurdo-photo', kind: 'Ground photograph', description: 'Wright Valley looking toward Lake Vanda from Bull Pass.',
      author: 'David Saul', source: `${commons}Wright_Valley_From_Bull_Pass.jpg`, license: 'Public domain'
    }
  ],
  kilauea: [
    sentinelImage('kilauea', 'Kīlauea’s summit caldera and part of its East Rift Zone.'),
    {
      file: 'kilauea-photo', kind: 'Ground photograph', description: 'A glowing lava exit tube on Kīlauea’s southern flank.',
      author: 'Jeffrey Judd / USGS', source: 'https://www.usgs.gov/media/images/kilauea-lava-flow-1', license: 'Public domain'
    }
  ],
  california: [
    sentinelImage('california', 'The volcanic landscape above the caves at Lava Beds National Monument.'),
    {
      file: 'california-photo', kind: 'Ground photograph', description: 'Inside a lava tube at Lava Beds National Monument.',
      author: 'National Park Service', source: `${commons}Inside_a_Lava_Tube_(ae4b0a7b-7121-4f23-9c86-f9ef4141c375).jpg`, license: 'Public domain'
    }
  ]
};
