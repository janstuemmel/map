import type { LayerSpecification, Map as MapLibreMap } from "maplibre-gl";
import { addLayer } from "../../common/util/addLayer";
import { boundaries } from "./layers/boundaries";
import { places } from "./layers/places";
import { roads } from "./layers/roads";

const layers: LayerSpecification[] = [
	{
		id: "background",
		type: "background",
		paint: {
			"background-color": "#f7f5f2",
		},
	},
	...roads,
	...boundaries,
	{
		id: "ocean",
		type: "fill",
		source: "world",
		"source-layer": "ocean",
		paint: {
			"fill-color": "#9cd7ff",
		},
	},
	...places,
];

export const addWorld = (map: MapLibreMap) => {
	map.addSource("world", {
		type: "vector",
		url: `pmtiles://${window.location.origin}/map/data/map.pmtiles`,
	});

	addLayer(map, layers);
};
