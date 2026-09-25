import { inlineSources, osm } from "@versatiles/style";
import { addProtocol, Map as MaplibreMap, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { addLayer } from "./common/util/addLayer";
import { addControls } from "./features/controls";
import { addLandfills } from "./features/landfills";
import { addLandmarks } from "./features/landmarks";
import { persistMapView, restoreMapView } from "./features/mapView";
import { addRoads } from "./features/roads";
import { addTerrain } from "./features/terrarium";
import { addVersatiles } from "./features/versatiles";
import { administrative } from "./features/versatiles/layers/administrative";

const protocol = new Protocol();
addProtocol("pmtiles", protocol.tile);
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

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

addControls(map);

map.on("load", async () => {
	addVersatiles(map);
	addLandfills(map);
	addLandmarks(map);
	addRoads(map);
	addTerrain(map);
	addLayer(map, administrative);
});

map.on("zoom", () => console.log("zoom level:", map.getZoom()));
