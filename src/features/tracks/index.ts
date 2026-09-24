import type { Map as MapLibreMap } from "maplibre-gl";

export const addTracks = (map: MapLibreMap) => {
	map.addSource("tracks-ly", {
		type: "geojson",
		data: `/map/data/paths-ly.geojson`,
	});

	map.addLayer({
		id: "tracks-ly",
		source: "tracks-ly",
		type: "line",
		minzoom: 10,
		layout: { visibility: "visible" },
		paint: {
			"line-color": "#998200",
			"line-width": ["interpolate", ["linear"], ["zoom"], 10, 1.2, 14, 2.5],
			"line-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0.3, 14, 1],
			"line-dasharray": [2, 1.5],
		},
	});

	map.addSource("tracks-tn", {
		type: "geojson",
		data: `/map/data/paths-tn.geojson`,
	});

	map.addLayer({
		id: "tracks-tn",
		source: "tracks-tn",
		type: "line",
		minzoom: 10,
		layout: { visibility: "visible" },
		paint: {
			"line-color": "#333333",
			"line-width": ["interpolate", ["linear"], ["zoom"], 13, 0.5, 14, 2.5],
			"line-opacity": ["interpolate", ["linear"], ["zoom"], 10, 0.2, 14, 1],
			"line-dasharray": [2, 1.5],
		},
	});
};
