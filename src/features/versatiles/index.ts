import type { MapLibreMap } from "maplibre-gl";
import { addLayer } from "../../common/util/addLayer";
import { administrative } from "./layers/administrative";
import { labels } from "./layers/labels";
import { waterOcean, waterRiver } from "./layers/water";

export const addVersatiles = (map: MapLibreMap) => {
	map.addSource("versatiles", {
		type: "vector",
		tiles: ["https://tiles.versatiles.org/tiles/osm/{z}/{x}/{y}"],
	});

	map.addLayer({
		id: "background",
		type: "background",
		paint: {
			"background-color": "#edf1e7",
		},
	});

	map.addLayer(waterOcean);
	map.addLayer(waterRiver);
	addLayer(map, administrative);
	addLayer(map, labels);
};
