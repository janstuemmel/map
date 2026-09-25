import type { LayerSpecification, Map as MapLibreMap } from "maplibre-gl";
import { addLayer } from "../../common/util/addLayer";

const layers: LayerSpecification[] = [
	{
		id: "land-fill",
		type: "fill",
		source: "world",
		"source-layer": "land",
		paint: {
			"fill-color": "#8f5f17",
		},
	},
];

export const addWorld = (map: MapLibreMap) => {
	map.addSource("world", {
		type: "vector",
		url: `pmtiles://${window.location.origin}/map/data/map.pmtiles`,
	});

	addLayer(map, layers);
};
