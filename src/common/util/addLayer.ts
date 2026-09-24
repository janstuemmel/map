import type { LayerSpecification, Map as MaplibreMap } from "maplibre-gl";

export const addLayer = (
	map: MaplibreMap,
	layer: LayerSpecification | LayerSpecification[],
	beforeId?: string,
) => {
	if (Array.isArray(layer)) {
		layer.forEach((l) => {
			map.addLayer(l, beforeId);
		});
	} else {
		map.addLayer(layer, beforeId);
	}
};
