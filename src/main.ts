import { inlineSources, osm } from "@versatiles/style";
import { Map as MaplibreMap, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { persistMapView, restoreMapView } from "./features/mapView";
import { addTerrain } from "./features/terrarium";
import { addTracks } from "./features/tracks";
import { addVersatiles } from "./features/versatiles";

setWorkerUrl(workerUrl);

const style = osm({
	theme: "toner",
	text: { language: "de" },
	urls: {
		base: "https://tiles.versatiles.org",
	},
});

console.log(await inlineSources(style));

const map = new MaplibreMap({
	container: "map",
	style: {
		version: 8,
		glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
		layers: [],
		sources: {},
	},
});

restoreMapView(map);
persistMapView(map);

map.on("load", async () => {
	addVersatiles(map);
	addTerrain(map);
	addTracks(map);
});

map.on("zoom", () => {
	console.log("zoom level:", map.getZoom());
});
