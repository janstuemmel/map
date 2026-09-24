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
			"line-color": "#f7f5f2",
			"line-width": ["interpolate", ["linear"], ["zoom"], 6, 2, 14, 4],
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
			"line-color": "#b4b4b4",
			"line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.5, 14, 2],
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
			"line-color": "#b4b4b4",
			"line-width": ["interpolate", ["linear"], ["zoom"], 6, 0.5, 14, 2],
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
			"line-color": "#b4b4b4",
			"line-width": ["interpolate", ["linear"], ["zoom"], 6, 2, 14, 4],
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
			"line-color": "#b4b4b4",
			"line-width": ["interpolate", ["linear"], ["zoom"], 6, 2, 14, 4],
		},
	},

	{
		id: "roads-major-outline",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 5,
		filter: ["in", ["get", "highway"], ["literal", ["motorway", "trunk"]]],
		paint: {
			"line-color": "#8a6d1a",
			"line-width": ["interpolate", ["linear"], ["zoom"], 5, 2.6, 14, 4],
		},
	},
	{
		id: "roads-major",
		type: "line",
		source: "roads",
		"source-layer": "roads",
		minzoom: 5,
		filter: ["in", ["get", "highway"], ["literal", ["motorway", "trunk"]]],
		paint: {
			"line-color": "#fff23c",
			"line-width": ["interpolate", ["linear"], ["zoom"], 5, 2, 14, 3],
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
