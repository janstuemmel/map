import { inlineSources, osm } from "@versatiles/style";
import { addProtocol, Map as MaplibreMap, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { addControls } from "./features/controls";
import { addLandfills } from "./features/landfills";
import { addLandmarks } from "./features/landmarks";
import { addWorld } from "./features/map";
import { persistMapView, restoreMapView } from "./features/mapView";
import { addTerrain } from "./features/terrarium";

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
	// maxBounds: [-14.37, 10.433, 36.507, 48.42],
	style: {
		version: 8,
		glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
		sprite: [
			{
				id: "extras",
				url: "https://tiles.versatiles.org/assets/sprites/extras",
			},
		],
		layers: [],
		sources: {},
	},
});

map.dragRotate.disable();
map.touchZoomRotate.disableRotation();

restoreMapView(map);
persistMapView(map);
addControls(map);

map.on("load", async () => {
	addWorld(map);
	addTerrain(map);
	addLandfills(map);
	addLandmarks(map);
});
