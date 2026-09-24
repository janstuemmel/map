import type { LayerSpecification, Map as MapLibreMap } from "maplibre-gl";
import { addLayer } from "../../common/util/addLayer";

const layers: LayerSpecification[] = [
	{
		id: "roads-major",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		// minzoom: 6,
		filter: ["in", ["get", "highway"], ["literal", ["motorway", "trunk"]]],
		paint: {
			"line-color": "#bda000",
			"line-width": ["interpolate", ["linear"], ["zoom"], 10, 1.2, 14, 2.5],
		},
	},
];

export const addRoads = (map: MapLibreMap) => {
	map.addSource("roads", {
		type: "vector",
		url: `pmtiles://${window.location.origin}/map/data/roads.pmtiles`,
	});

	addLayer(map, layers);
};
