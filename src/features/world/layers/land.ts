import type { ExpressionSpecification, LayerSpecification } from "maplibre-gl";

const category: ExpressionSpecification = [
	"coalesce",
	["get", "landuse"],
	["get", "natural"],
	["get", "attraction"],
];

export const layersLand: LayerSpecification[] = [
	{
		id: "land-farmland",
		type: "fill",
		source: "world",
		"source-layer": "land",
		filter: ["in", category, ["literal", ["farmland"]]],
		minzoom: 10,
		paint: {
			"fill-color": "#e6e8c8",
			"fill-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0, 12, 0.6],
		},
	},
];
