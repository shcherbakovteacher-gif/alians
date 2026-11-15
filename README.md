# Alians

Alians is an English-language Space Apps project exploring ten terrestrial analogs for lunar and Martian fieldwork. The map starts with all sites, with filters for the Moon and Mars. Use a marker or the list below the map to open the comparison and its sources.

[Open Alians](https://shcherbakovteacher-gif.github.io/alians/)

## Run locally

Open `index.html` in a modern browser. The site is static and uses local assets. On GitHub Pages, the publishing source is the `main` branch at `/`.

## Data and imagery

- `data.js` contains representative coordinates, comparisons and the sources for each location. An overall percentage is shown when a cited study supplies a comparable figure. The current sources describe individual features qualitatively.
- The world overview and Earth globe use NASA Earth Observatory [Blue Marble imagery](https://science.nasa.gov/earth/earth-observatory/the-blue-marble-true-color-global-imagery-at-1km-resolution/). The basemap is bundled from the [three-globe image mirror](https://github.com/vasturiano/three-globe/tree/master/example/img). High-resolution tiles load on demand from [EOX's Sentinel-2 cloudless 2016 service](https://tiles.maps.eox.at/wmts/1.0.0/WMTSCapabilities.xml) and the USGS [Landsat Image Mosaic of Antarctica](https://lima.usgs.gov/).
- Each comparison has two local images. `imagery.js` records their authors, original sources, and licenses. The gallery images were optimized for the web, and the field photos from research figures are labeled where cropped. Image licenses apply to the corresponding image files.
- Planet details and marker artwork come from the images supplied by Alians. The team pins preserve the stars. The two reference pins use the supplied planet images with a diamond badge.
- Challenge page: [Identify Earth Locations that Analog the Permanent Moon Base Locations and Mars](https://www.spaceappschallenge.org/2026/challenges/permanent-moon-base-locations-and-mars/).
