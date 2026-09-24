import type { LayerSpecification } from "maplibre-gl";

export const waterOcean: LayerSpecification = {
	id: "water-ocean",
	type: "fill",
	"source-layer": "ocean",
	source: "versatiles",
	paint: {
		"fill-color": "#a4d1f4",
	},
};

export const waterRiver: LayerSpecification = {
	id: "water-river",
	type: "line",
	"source-layer": "water_lines",
	filter: [
		"all",
		["in", "kind", "river"],
		["!=", "tunnel", true],
		["!=", "bridge", true],
	],
	source: "versatiles",
	paint: {
		"line-color": "#7fb8e8",
		"line-width": {
			type: "interval",
			stops: [
				[9, 0],
				[10, 1],
				[15, 3],
				[17, 4],
				[18, 5],
				[20, 15],
			],
		},
		"line-dasharray": [10, 5],
	},
	layout: {
		"line-cap": "butt",
		"line-join": "round",
	},
};
