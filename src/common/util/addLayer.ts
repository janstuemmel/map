import type { LayerSpecification, Map as MaplibreMap } from "maplibre-gl";

export const addLayer = (
	map: MaplibreMap,
	layer: LayerSpecification | LayerSpecification[],
) => {
	if (Array.isArray(layer)) {
		layer.forEach((l) => {
			map.addLayer(l);
		});
	} else {
		map.addLayer(layer);
	}
};
