import type { LayerSpecification, Map as MapLibreMap } from "maplibre-gl";
import { addLayer } from "../../common/util/addLayer";

const layers: LayerSpecification[] = [
	{
		id: "roads-tracks-outline",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 8,
		filter: [
			"in",
			["get", "highway"],
			["literal", ["track", "bridleway", "path"]],
		],
		paint: {
			"line-color": [
				"interpolate",
				["linear"],
				["zoom"],
				8,
				"#eef1e8",
				12,
				"#f7f5f2",
			],
			"line-width": ["interpolate", ["linear"], ["zoom"], 6, 2, 14, 8],
		},
	},
	{
		id: "roads-tracks",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 8,
		filter: [
			"in",
			["get", "highway"],
			["literal", ["track", "bridleway", "path"]],
		],
		paint: {
			"line-color": [
				"interpolate",
				["linear"],
				["zoom"],
				8,
				"#e7ebe2",
				12,
				"#b4b4b4",
			],
			"line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.5, 14, 4],
			"line-dasharray": [3, 1],
		},
	},

	{
		id: "roads-street-tertiary",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 7,
		filter: ["in", ["get", "highway"], ["literal", ["tertiary"]]],
		paint: {
			"line-color": [
				"interpolate",
				["linear"],
				["zoom"],
				8,
				"#e7ebe2",
				11,
				"#b4b4b4",
			],
			"line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.5, 14, 6],
		},
	},

	{
		id: "roads-secondary",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 6,
		filter: ["in", ["get", "highway"], ["literal", ["secondary"]]],
		paint: {
			"line-color": [
				"interpolate",
				["linear"],
				["zoom"],
				7,
				"#e7ebe2",
				10,
				"#b4b4b4",
			],
			"line-width": ["interpolate", ["linear"], ["zoom"], 6, 2, 14, 4],
		},
	},

	{
		id: "roads-primary-outline",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 5,
		filter: ["in", ["get", "highway"], ["literal", ["primary"]]],
		paint: {
			"line-color": [
				"interpolate",
				["linear"],
				["zoom"],
				6,
				"#e3e7de",
				9,
				"#8c8c8c",
			],
			"line-width": ["interpolate", ["linear"], ["zoom"], 6, 3.5, 14, 5.5],
		},
		layout: {
			"line-join": "round",
			"line-cap": "round",
		},
	},
	{
		id: "roads-primary",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 5,
		filter: ["in", ["get", "highway"], ["literal", ["primary"]]],
		paint: {
			"line-color": [
				"interpolate",
				["linear"],
				["zoom"],
				6,
				"#e7ebe2",
				9,
				"#b4b4b4",
			],
			"line-width": ["interpolate", ["linear"], ["zoom"], 6, 2, 14, 4],
		},
		layout: {
			"line-join": "round",
			"line-cap": "round",
		},
	},

	{
		id: "roads-trunk-outline",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 4,
		filter: ["in", ["get", "highway"], ["literal", ["trunk"]]],
		paint: {
			"line-color": [
				"interpolate",
				["linear"],
				["zoom"],
				5,
				"#e3e4d3",
				8,
				"#8a6d1a",
			],
			"line-width": ["interpolate", ["linear"], ["zoom"], 5, 3, 14, 6],
		},
		layout: {
			"line-join": "round",
			"line-cap": "round",
		},
	},
	{
		id: "roads-trunk",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 4,
		filter: ["in", ["get", "highway"], ["literal", ["trunk"]]],
		paint: {
			"line-color": [
				"interpolate",
				["linear"],
				["zoom"],
				5,
				"#eff1d6",
				8,
				"#fff23c",
			],
			"line-width": ["interpolate", ["linear"], ["zoom"], 5, 1.5, 14, 5],
		},
		layout: {
			"line-join": "round",
			"line-cap": "round",
		},
	},

	{
		id: "roads-motorway-outline",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 4,
		filter: ["in", ["get", "highway"], ["literal", ["motorway"]]],
		paint: {
			"line-color": [
				"interpolate",
				["linear"],
				["zoom"],
				5,
				"#e2dbd2",
				8,
				"#7a1616",
			],
			"line-width": ["interpolate", ["linear"], ["zoom"], 5, 4, 14, 8.5],
		},
		layout: {
			"line-join": "round",
			"line-cap": "round",
		},
	},
	{
		id: "roads-motorway",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 4,
		filter: ["in", ["get", "highway"], ["literal", ["motorway"]]],
		paint: {
			"line-color": [
				"interpolate",
				["linear"],
				["zoom"],
				5,
				"#edded4",
				8,
				"#e8362a",
			],
			"line-width": ["interpolate", ["linear"], ["zoom"], 5, 2, 14, 6.5],
		},
		layout: {
			"line-join": "round",
			"line-cap": "round",
		},
	},
];

export const addRoads = (map: MapLibreMap) => {
	map.addSource("roads", {
		type: "vector",
		url: `pmtiles://${window.location.origin}/map/data/roads.pmtiles`,
	});

	addLayer(map, layers, "label-street-primary");
};
