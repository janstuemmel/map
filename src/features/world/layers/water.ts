import type { ExpressionSpecification, LayerSpecification } from "maplibre-gl";

const isPatternedLake: ExpressionSpecification = [
	"any",
	["==", ["get", "salt"], "yes"],
	["==", ["get", "intermittent"], "yes"],
];

export const layersWaterLabel: LayerSpecification[] = [
	{
		id: "water-lake-label",
		type: "symbol",
		source: "world",
		"source-layer": "water",
		filter: [
			"all",
			["==", ["geometry-type"], "Polygon"],
			[
				"any",
				["all", ["==", ["get", "water"], "lake"]],
				["==", ["get", "name:de"], "Um el Maa"],
			],
		],
		minzoom: 9,
		layout: {
			"text-field": [
				"coalesce",
				["get", "name:de"],
				["get", "name:en"],
				["get", "name"],
			],
			"text-font": ["noto_sans_regular"],
			"text-size": 11,
		},
		paint: {
			"text-color": "#3b6f91",
			"text-halo-color": "rgba(255, 255, 255, 0.8)",
			"text-halo-width": 1.5,
			"text-halo-blur": 1,
		},
	},
	{
		id: "waterways-river-label",
		type: "symbol",
		source: "world",
		"source-layer": "water",
		filter: ["==", ["get", "waterway"], "river"],
		minzoom: 11,
		layout: {
			"text-field": [
				"coalesce",
				["get", "name:de"],
				["get", "name:en"],
				["get", "name"],
			],
			"text-font": ["noto_sans_regular"],
			"symbol-placement": "line",
			"text-size": 11,
		},
		paint: {
			"text-color": "#3b6f91",
			"text-halo-color": "rgba(255, 255, 255, 0.8)",
			"text-halo-width": 1.5,
			"text-halo-blur": 1,
		},
	},
];

export const layersWater: LayerSpecification[] = [
	{
		id: "water-lake",
		type: "fill",
		source: "world",
		"source-layer": "water",
		filter: [
			"any",
			["all", ["==", ["get", "water"], "lake"], ["!", isPatternedLake]],
			["==", ["get", "name:de"], "Um el Maa"],
		],
		minzoom: 5,
		paint: {
			"fill-color": "#beddf3",
			"fill-opacity": ["interpolate", ["linear"], ["zoom"], 6, 0, 8, 1],
		},
	},
	{
		id: "water-salt-lake",
		type: "fill",
		source: "world",
		"source-layer": "water",
		filter: ["all", ["==", ["get", "water"], "lake"], isPatternedLake],
		minzoom: 5,
		paint: {
			"fill-color": [
				"interpolate",
				["linear"],
				["zoom"],
				6,
				"#c9dbdc",
				12,
				"#c3e0e2",
			],
		},
	},
	{
		id: "waterways-river",
		type: "line",
		source: "world",
		"source-layer": "water",
		filter: ["==", ["get", "waterway"], "river"],
		minzoom: 10,
		paint: {
			"line-color": [
				"interpolate",
				["linear"],
				["zoom"],
				7,
				"#9cd7ff",
				14,
				"#6ba3d4",
			],
			"line-width": ["interpolate", ["linear"], ["zoom"], 7, 0.5, 14, 2],
			"line-opacity": ["interpolate", ["linear"], ["zoom"], 7, 0, 12, 1],
			"line-dasharray": [6, 3],
		},
	},
];
