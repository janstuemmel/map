import { addProtocol, Map as MaplibreMap, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { addControls } from "./features/controls";
import { persistMapView, restoreMapView } from "./features/mapView";
import { layerTerrarium, sourceAWSTerrarium } from "./features/terrarium";
import { layerBackground, layerOcean, sourceWorld } from "./features/world";
import { layersBoundaries } from "./features/world/layers/boundaries";
import { layersPlaces } from "./features/world/layers/places";
import { layersRoads } from "./features/world/layers/roads";

const protocol = new Protocol();
addProtocol("pmtiles", protocol.tile);
setWorkerUrl(workerUrl);

const map = new MaplibreMap({
	container: "map",
	maxBounds: [-14.37, 10.433, 36.507, 48.42],
	dragRotate: false,
	touchZoomRotate: false,
	style: {
		version: 8,
		glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
		sprite: [
			{
				id: "extras",
				url: "https://tiles.versatiles.org/assets/sprites/extras",
			},
		],
		layers: [
			layerBackground,
			layerTerrarium,
			...layersBoundaries,
			layerOcean,
			...layersRoads,
			...layersPlaces,
		],
		sources: {
			...sourceWorld,
			...sourceAWSTerrarium,
		},
	},
});

restoreMapView(map);
persistMapView(map);
addControls(map);

map.on("load", async () => {
	// addWorld(map);
	// addTerrain(map);
	// addLandfills(map);
	// addLandmarks(map);
});
