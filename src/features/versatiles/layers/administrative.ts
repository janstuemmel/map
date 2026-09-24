import type { LayerSpecification } from "maplibre-gl";

export const administrative: LayerSpecification[] = [
	// {
	// 	id: "boundary-state",
	// 	type: "line",
	// 	"source-layer": "boundaries",
	// 	filter: [
	// 		"all",
	// 		["==", "admin_level", 4],
	// 		["!=", "maritime", true],
	// 		["!=", "disputed", true],
	// 		["!=", "coastline", true],
	// 	],
	// 	source: "versatiles",
	// 	paint: {
	// 		"line-color": "#d0d0d0",
	// 		"line-width": {
	// 			type: "interval",
	// 			stops: [
	// 				[7, 0],
	// 				[8, 1],
	// 				[10, 2],
	// 			],
	// 		},
	// 	},
	// 	layout: {
	// 		"line-cap": "round",
	// 		"line-join": "round",
	// 	},
	// },

	{
		id: "boundary-country-outline",
		type: "line",
		"source-layer": "boundaries",
		filter: [
			"all",
			["==", "admin_level", 2],
			["!=", "maritime", true],
			["!=", "disputed", true],
			["!=", "coastline", true],
		],
		source: "versatiles",
		paint: {
			"line-color": "#d2b8e8",
			"line-width": {
				type: "interval",
				stops: [
					[2, 0],
					[3, 7],
					[10, 10],
				],
			},
		},
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
	},
	{
		id: "boundary-country",
		type: "line",
		"source-layer": "boundaries",
		filter: [
			"all",
			["==", "admin_level", 2],
			["!=", "maritime", true],
			["!=", "disputed", true],
			["!=", "coastline", true],
		],
		source: "versatiles",
		paint: {
			"line-color": "#393b3e",
			"line-width": {
				type: "interval",
				stops: [
					[2, 0],
					[3, 1],
					[10, 2],
				],
			},
			"line-dasharray": [3, 3, 0.1, 3],
		},
		layout: {
			"line-cap": "round",
			"line-join": "round",
		},
	},
];
