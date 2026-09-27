import { addProtocol, Map as MaplibreMap, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import "maplibre-gl/dist/maplibre-gl.css";
import { Protocol } from "pmtiles";
import { addLandfills } from "./features/landfills";
import { layersLandmarks, sourceLandmarks } from "./features/landmarks";
import { layerTerrarium, sourceAWSTerrarium } from "./features/terrarium";
import { addControls, addPersistMapView } from "./features/view";
import { layerBackground, layerOcean, sourceWorld } from "./features/world";
import { layersBoundaries } from "./features/world/layers/boundaries";
import { layersLand } from "./features/world/layers/land";
import { layersPlaces } from "./features/world/layers/places";
import { layersPoi } from "./features/world/layers/poi";
import { layersRoads } from "./features/world/layers/roads";
import { layersWater, layersWaterLabel } from "./features/world/layers/water";

const protocol = new Protocol();
addProtocol("pmtiles", protocol.tile);
setWorkerUrl(workerUrl);

const map = new MaplibreMap({
	container: "map",
	maxBounds: [-14.37, 10.433, 36.507, 48.42],
	dragRotate: false,
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
			...layersWater,
			...layersLand,
			...layersRoads,
			...layersBoundaries,
			layerOcean,
			...layersPlaces,
			...layersPoi,
			...layersWaterLabel,
			...layersLandmarks,
		],
		sources: {
			...sourceWorld,
			...sourceAWSTerrarium,
			...sourceLandmarks,
		},
	},
});

map.touchZoomRotate.disableRotation();
map.touchPitch.disable();

addPersistMapView(map);
addControls(map);

map.on("load", () => {
	addLandfills(map);
});
