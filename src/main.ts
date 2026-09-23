import { inlineSources, osm } from "@versatiles/style";
import { Map as MaplibreMap } from "maplibre-gl";
import { addSourceTerrain } from "./sources/terrain";
import { addSourceTracks } from "./sources/tracks";

const style = osm({
	theme: "toner",
	text: { language: "de" },
  urls: {
    base: 'https://tiles.versatiles.org'
  },
  layers: {
    // labels: false,
    land: false,
  },
});

const map = new MaplibreMap({
	container: "map",
	style: await inlineSources(style),
	center: [9.11, 33.11],
	zoom: 9,
	maxZoom: 14,
});

map.on('load', async () => {
  addSourceTerrain(map)
  addSourceTracks(map)
})

map.on('zoom', () => {
  console.log('zoom level:', map.getZoom())
})