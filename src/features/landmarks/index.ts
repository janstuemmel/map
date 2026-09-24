import type { Map as MapLibreMap, SymbolLayerSpecification } from "maplibre-gl";
import { addLayer } from "../../common/util/addLayer";

const TRIANGLE_ICON = "landmark-triangle";
const TRIANGLE_SIZE = 12;
const TRIANGLE_FILL = "#8a6d1a";
const TRIANGLE_STROKE = "#4a3b2a";
const TRIANGLE_STROKE_WIDTH = 1.5;

const createTriangleIcon = (size: number): ImageData => {
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("Could not create canvas 2d context");

	const inset = TRIANGLE_STROKE_WIDTH;
	ctx.beginPath();
	ctx.moveTo(size / 2, inset);
	ctx.lineTo(size - inset, size - inset);
	ctx.lineTo(inset, size - inset);
	ctx.closePath();

	ctx.fillStyle = TRIANGLE_FILL;
	ctx.fill();
	ctx.strokeStyle = TRIANGLE_STROKE;
	ctx.lineWidth = TRIANGLE_STROKE_WIDTH;
	ctx.lineJoin = "round";
	ctx.stroke();

	return ctx.getImageData(0, 0, size, size);
};

const layer: SymbolLayerSpecification = {
	id: "landmarks",
	type: "symbol",
	source: "landmarks",
	minzoom: 6,
	layout: {
		"icon-image": TRIANGLE_ICON,
		"icon-allow-overlap": true,
		"text-field": "{name}",
		"text-font": ["noto_sans_regular"],
		"text-size": 12,
		"text-anchor": "top",
		"text-offset": [0, 0.6],
		"text-max-width": 8,
	},
	paint: {
		"text-color": "#6b5843",
		"text-halo-color": "rgba(255, 255, 255, 0.85)",
		"text-halo-width": 1.5,
		"text-halo-blur": 1,
	},
};

export const addLandmarks = (map: MapLibreMap) => {
	if (!map.hasImage(TRIANGLE_ICON)) {
		map.addImage(TRIANGLE_ICON, createTriangleIcon(TRIANGLE_SIZE));
	}

	map.addSource("landmarks", {
		type: "geojson",
		data: `${window.location.origin}/map/data/landmarks.geojson`,
	});

	addLayer(map, layer);
};
