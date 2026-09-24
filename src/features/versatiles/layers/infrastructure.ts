import type { LayerSpecification } from "maplibre-gl";

export const streetTrack: LayerSpecification = {
	id: "street-track",
	type: "line",
	"source-layer": "streets",
	filter: [
		"all",
		["==", "kind", "track"],
		["!=", "bridge", true],
		["!=", "tunnel", true],
	],
	source: "versatiles",
	paint: {
		"line-color": "#8ba5c1",
		"line-width": {
			type: "interval",
			stops: [
				[10, 2],
				[16, 3],
				[18, 16],
				[19, 44],
				[20, 88],
			],
		},
		"line-dasharray": [2, 4],
	},
	layout: {
		"line-join": "round",
		"line-cap": "round",
	},
};

export const streetTertiary: LayerSpecification = {
	id: "street-tertiary",
	type: "line",
	"source-layer": "streets",
	filter: [
		"all",
		["!=", "bridge", true],
		["!=", "tunnel", true],
		["in", "kind", "tertiary"],
		["!=", "link", true],
	],
	source: "versatiles",
	paint: {
		"line-color": "#8ba5c1",
		"line-width": {
			type: "interval",
			stops: [
				[8, 0],
				[9, 1],
				[14, 3],
				[16, 5],
				[18, 22],
				[19, 50],
				[20, 100],
			],
		},
		"line-opacity": {
			type: "interval",
			stops: [
				[8, 0],
				[9, 1],
			],
		},
	},
	layout: {
		"line-join": "round",
		"line-cap": "round",
	},
};

export const streetSecondary: LayerSpecification = {
	id: "street-secondary",
	type: "line",
	"source-layer": "streets",
	filter: [
		"all",
		["!=", "bridge", true],
		["!=", "tunnel", true],
		["in", "kind", "secondary"],
		["!=", "link", true],
	],
	source: "versatiles",
	paint: {
		"line-color": "#8ba5c1",
		"line-width": {
			type: "interval",
			stops: [
				[8, 0],
				[9, 1],
				[14, 4],
				[16, 6],
				[18, 28],
				[19, 64],
				[20, 130],
			],
		},
		"line-opacity": {
			type: "interval",
			stops: [
				[8, 0],
				[9, 1],
			],
		},
	},
	layout: {
		"line-join": "round",
		"line-cap": "round",
	},
};

export const streetTrunk: LayerSpecification = {
	id: "street-trunk",
	type: "line",
	"source-layer": "streets",
	filter: [
		"all",
		["!=", "bridge", true],
		["!=", "tunnel", true],
		["in", "kind", "trunk", "primary"],
		["!=", "link", true],
	],
	source: "versatiles",
	paint: {
		"line-color": "#8ba5c1",
		"line-width": {
			type: "interval",
			stops: [
				[6, 0],
				[9, 1],
				[10, 2],
				[14, 4],
				[16, 8],
				[18, 32],
				[19, 70],
				[20, 140],
			],
		},
		"line-opacity": {
			type: "interval",
			stops: [
				[5, 1],
				[9, 1],
			],
		},
	},
	layout: {
		"line-join": "round",
		"line-cap": "round",
	},
};

export const streetMotorway: LayerSpecification = {
	id: "street-motorway",
	type: "line",
	"source-layer": "streets",
	filter: [
		"all",
		["!=", "bridge", true],
		["!=", "tunnel", true],
		["in", "kind", "motorway"],
		["!=", "link", true],
	],
	source: "versatiles",
	paint: {
		"line-color": "#8ba5c1",
		"line-width": {
			type: "interval",
			stops: [
				[5, 2],
				[9, 3],
				[10, 4],
				[14, 4],
				[16, 12],
				[18, 36],
				[19, 80],
				[20, 160],
			],
		},
		"line-opacity": {
			type: "interval",
			stops: [
				[4, 0],
				[5, 0.1],
				[6, 1],
			],
		},
	},
	layout: {
		"line-join": "round",
		"line-cap": "round",
	},
};
