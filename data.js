'use strict';

const analogData = {
  features: ['Terrain', 'Rocks & soil', 'Water', 'Temperature', 'Atmosphere'],
  targets: {
    moon: {
      name: 'Moon',
      source: ['NASA Science · Moon facts', 'https://science.nasa.gov/moon/facts/'],
      features: ['Impact craters, volcanic plains and lava-tube candidates', 'Basalt in the dark maria, with rocky and dusty regolith at the surface', 'Water ice in permanently shadowed craters', 'About −173 °C in darkness to 127 °C in full sunlight', 'An extremely thin exosphere']
    },
    mars: {
      name: 'Mars',
      source: ['NASA Science · Mars facts', 'https://science.nasa.gov/mars/facts/'],
      features: ['Rocky deserts, impact craters, channels and ancient lake basins', 'Iron-rich dust, volcanic rocks and sedimentary deposits', 'Ice and signs of ancient lakes. Liquid water cannot persist long at the surface.', 'About −153 °C to 20 °C at the surface', 'Thin, mostly carbon dioxide atmosphere']
    }
  },
  sites: [
    {
      name: 'Haruj Volcanic Field', place: 'Libya', latitude: 27.25, longitude: 17.50, target: 'moon', type: 'team', score: null,
      summary: 'A wide basalt field in central Libya offers rocky terrain for testing how a crew might cross and map a dark lunar volcanic plain.',
      features: ['Dark lava flows, volcanic cones and craters', 'Basaltic lava and rocky surfaces', 'Arid desert with terrestrial weathering', 'Hot desert setting', 'Earth atmosphere'],
      match: 'The dark basalt and rough surfaces resemble parts of the lunar maria.',
      difference: 'The local craters formed by volcanism. Wind and water alter the surface, which has no lunar impact regolith.',
      sources: [['Smithsonian Global Volcanism Program · Haruj', 'https://volcano.si.edu/volcano.cfm?vn=225007']]
    },
    {
      name: 'Harrat Ash Shaam', place: 'Syria, Jordan & Saudi Arabia', latitude: 33.10, longitude: 36.71, target: 'moon', type: 'team', score: null,
      summary: 'This large volcanic province is a candidate for practicing navigation and geologic mapping among basalt flows and cones.',
      features: ['Extensive lava fields and volcanic cones', 'Dark basalt flows and loose volcanic material', 'Dry surface with terrestrial erosion', 'Arid setting', 'Earth atmosphere'],
      match: 'Basaltic flows provide uneven terrain with a resemblance to volcanic landscapes on the Moon.',
      difference: 'Volcanic vents, an atmosphere and ongoing erosion shape this terrain. Impacts shape much of the lunar surface.',
      sources: [['Smithsonian Global Volcanism Program · Harrat Ash Shaam', 'https://volcano.si.edu/volcano.cfm?vn=231001']]
    },
    {
      name: 'Harrat Khaybar', place: 'Saudi Arabia', latitude: 25.00, longitude: 39.92, target: 'moon', type: 'team', score: null,
      summary: 'A volcanic field with dark flows and light-colored domes that could be used to practice distinguishing rock types during a traverse.',
      features: ['Lava flows, cones, craters and domes', 'Basalt and lighter silicic volcanic rocks', 'Dry landscape shaped by terrestrial weathering', 'Arid setting', 'Earth atmosphere'],
      match: 'The darker basalt flows resemble the basaltic terrain of lunar maria.',
      difference: 'The field also exposes light rhyolitic rocks. Its volcanic craters and surface weathering differ from much of the Moon.',
      sources: [['USGS · Geology of the Arabian Peninsula', 'https://pubs.usgs.gov/pp/0560a/report.pdf'], ['USGS · Silicic lava flows in western Saudi Arabia', 'https://pubs.usgs.gov/of/1983/0788/report.pdf']]
    },
    {
      name: 'Tso Kar Basin', place: 'Ladakh, India', latitude: 33.30, longitude: 78.01, target: 'mars', type: 'team', score: null,
      summary: 'A high-altitude saline lake basin where field teams can study the marks that shrinking lakes leave in sediment.',
      features: ['High-altitude lake basin and exposed shoreline sediments', 'Salts and lake-bed sediment', 'Liquid saline lake and wetlands', 'Cold, high-altitude setting', 'Terrestrial air at roughly 4,500 m elevation'],
      match: 'Salt-encrusted lake sediments and a cold, dry setting evoke some ancient Martian lake environments.',
      difference: 'Liquid lakes and wetlands persist today. The basin retains substantially more atmosphere than the Martian surface.',
      sources: [['Lunar and Planetary Science Conference · Spaceward Bound Ladakh field report', 'https://www.hou.usra.edu/meetings/lpsc2017/pdf/3026.pdf'], ['Jagiellonian University · Spaceward Bound 2025 field report', 'https://indico.fais.uj.edu.pl/event/45/contributions/302/']]
    },
    {
      name: 'Qaidam Basin', place: 'Qinghai, China', latitude: 38.51, longitude: 91.40, target: 'mars', type: 'team', score: null,
      summary: 'Dalangtan Playa represents the basin’s salt-rich surfaces, where wind and evaporation provide clues to the history of former lakes.',
      features: ['Salt flats, former lake beds and wind-sculpted landforms', 'Evaporites including chlorides and sulfates', 'Playa brines and evidence of former lakes', 'Dry highland desert', 'High-altitude terrestrial atmosphere'],
      match: 'Evaporite minerals and wind erosion make the western basin useful for interpreting similar landforms and deposits on Mars.',
      difference: 'Earth air, seasonal precipitation and brines influence the salts under conditions unlike modern Mars.',
      sources: [['Journal of Geophysical Research · Western Qaidam Basin', 'https://doi.org/10.1002/2017JE005293'], ['Astrobiology · Dalangtan Saline Playa', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6205091/']]
    },
    {
      name: 'Salar de Uyuni', place: 'Bolivia', latitude: -20.13, longitude: -67.49, target: 'mars', type: 'team', score: null,
      summary: 'This broad, high-altitude salt flat is a test site for studying how thin brine flows and evaporation leave visible patterns.',
      features: ['Broad flat playa with polygonal salt crust', 'Halite crust and layered evaporites', 'Seasonal surface flooding and saline brines', 'Seasonal high-altitude desert', 'High-altitude terrestrial atmosphere'],
      match: 'Evaporites, crust patterns and seasonal brines offer comparisons for interpreting certain Martian salt features.',
      difference: 'Seasonal liquid water can cover the surface. The behavior of water on modern Mars is constrained by far thinner air.',
      sources: [['Remote Sensing · UAV imaging of a Martian brine analogue', 'https://doi.org/10.3390/rs11182104']]
    },
    {
      name: 'Atacama Desert', place: 'Chile', latitude: -24.09, longitude: -69.93, target: 'mars', type: 'reference', score: null,
      summary: 'NASA uses the Atacama’s extremely dry soils to test how instruments search for evidence of life in Mars-like terrain. The pin marks the Yungay area.',
      features: ['Hyperarid desert and bare, rocky surfaces', 'Dry mineral soils and salt-bearing deposits', 'Very scarce precipitation in the hyperarid core', 'Dry desert with terrestrial temperature swings', 'Earth atmosphere'],
      match: 'Exceptional dryness makes it a useful field environment for studying how biosignatures might survive and be detected.',
      difference: 'The desert has an Earth atmosphere and microbial life. Low moisture here still occurs under terrestrial pressure.',
      sources: [['NASA · Planetary Analog Explorer', 'https://science.nasa.gov/solar-system/analog-explorer/'], ['Science · Yungay soils and the limits of life', 'https://doi.org/10.1126/science.1089143']]
    },
    {
      name: 'McMurdo Dry Valleys', place: 'Antarctica', latitude: -77.52, longitude: 161.70, target: 'mars', type: 'reference', score: null,
      summary: 'Wright Valley represents a cold polar desert where researchers compare channels and sediments with features on Mars.',
      features: ['Ice-free stretches of valley floor and water-cut channels', 'Cold-desert soils and weathered sediments', 'Localized streams, lakes and brines', 'Extremely cold, dry Antarctic setting', 'Earth atmosphere'],
      match: 'Cold, dry valleys and water-cut features offer a model for interpreting former surface water and weathering on Mars.',
      difference: 'Liquid water still flows or collects locally. Thin Martian air and surface conditions make that comparison limited.',
      sources: [['NASA Earth Observatory · Martian landscape, Antarctica', 'https://science.nasa.gov/earth/earth-observatory/martian-landscape-antarctica-4420/'], ['NASA Technical Reports Server · Dry Valley sediments', 'https://ntrs.nasa.gov/citations/20150002984']]
    },
    {
      name: 'Kīlauea', place: 'Hawaiʻi, United States', latitude: 19.42, longitude: -155.29, target: 'moon', type: 'reference', score: null,
      summary: 'The slopes of Kīlauea give field teams a place to test cameras, hand-held instruments and sampling routines on volcanic terrain.',
      features: ['Volcanic slopes, lava flows and a summit caldera', 'Fresh and weathered basalt', 'Terrestrial rain and water-related weathering', 'Terrestrial volcanic field in a tropical setting', 'Earth atmosphere and volcanic gases'],
      match: 'Basalt and lava landforms offer a way to rehearse field geology on terrain with lunar counterparts.',
      difference: 'An active volcano, rainfall and a biosphere shape Kīlauea. Lunar maria record ancient volcanic activity.',
      sources: [['NASA · Planetary Analog Explorer', 'https://science.nasa.gov/solar-system/analog-explorer/'], ['USGS · Kīlauea', 'https://www.usgs.gov/volcanoes/kilauea']]
    },
    {
      name: 'California Lava Caves', place: 'California, United States', latitude: 41.71, longitude: -121.50, target: 'moon', type: 'reference', score: null,
      summary: 'Lava Beds National Monument is an example of where scientists can practice finding, mapping and working inside volcanic caves.',
      features: ['Lava tubes, cave entrances and skylights', 'Basaltic lava flows around the caves', 'Terrestrial moisture and occasional cave ice', 'Sheltered caves with local temperature variation', 'Earth air inside the caves'],
      match: 'Lava tubes offer a model for investigating potential lunar cavities that could provide natural shelter.',
      difference: 'Terrestrial caves exchange air and moisture with the surface. Any lunar cave would have a very different environment.',
      sources: [['NASA · Planetary Analog Explorer', 'https://science.nasa.gov/solar-system/analog-explorer/'], ['National Park Service · Lava Beds caves', 'https://www.nps.gov/labe/planyourvisit/caving.htm']]
    }
  ]
};
