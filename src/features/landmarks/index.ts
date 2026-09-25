import type { Map as MapLibreMap, SymbolLayerSpecification } from "maplibre-gl";
import { addLayer } from "../../common/util/addLayer";

const layer: SymbolLayerSpecification = {
	id: "landmarks",
	type: "symbol",
	source: "landmarks",
	minzoom: 6,
	layout: {
		"icon-image": "extras:shape-triangle",
		"icon-size": 0.4,
		"icon-allow-overlap": true,
		"text-field": "{name}",
		"text-font": ["noto_sans_regular"],
		"text-size": 12,
		"text-anchor": "top",
		"text-offset": [0, 0.6],
		"text-max-width": 8,
	},
	paint: {
		"icon-color": "#8a6d1a",
		"text-color": "#6b5843",
		"text-halo-color": "rgba(255, 255, 255, 0.85)",
		"text-halo-width": 1.5,
		"text-halo-blur": 1,
	},
};

export const addLandmarks = (map: MapLibreMap) => {
	map.addSource("landmarks", {
		type: "geojson",
		data: `${window.location.origin}/map/data/landmarks.geojson`,
	});

	addLayer(map, layer);
};
