import type { LayerSpecification, SourceSpecification } from "maplibre-gl";

export const layerBackground: LayerSpecification = {
	id: "background",
	type: "background",
	paint: {
		"background-color": "#f7f5f2",
	},
};

export const layerOcean: LayerSpecification = {
	id: "ocean",
	type: "fill",
	source: "world",
	"source-layer": "ocean",
	paint: {
		"fill-color": "#9cd7ff",
	},
};

export const sourceWorld: Record<string, SourceSpecification> = {
	world: {
		type: "vector",
		url: `pmtiles://${window.location.origin}/map/data/map.pmtiles`,
	},
};
