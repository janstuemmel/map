import type {
	ExpressionSpecification,
	FillLayerSpecification,
	Map as MapLibreMap,
	SymbolLayerSpecification,
} from "maplibre-gl";
import { addLayer } from "../../common/util/addLayer";

interface CategoryStyle {
	category: string;
	fillColor?: string;
	fillOpacity?: number;
	labelColor: string;
}

const CATEGORY_STYLES: CategoryStyle[] = [
	{
		category: "erg",
		fillColor: "#eddcae",
		fillOpacity: 0.2,
		labelColor: "#8a6d1a",
	},
	{
		category: "plateu",
		labelColor: "#6b5843",
	},
	{
		category: "mountain_range",
		fillColor: "#cfc0ad",
		fillOpacity: 0.2,
		labelColor: "#4a3b2a",
	},
	{
		category: "national_park",
		fillColor: "#cfe6c4",
		fillOpacity: 0.35,
		labelColor: "#2f5e28",
	},
];

const categoryLayers: FillLayerSpecification[] = CATEGORY_STYLES.filter(
	({ fillColor }) => fillColor,
).map(({ category, fillColor, fillOpacity }) => ({
	id: `landfills-${category}-fill`,
	type: "fill",
	source: "landfills",
	filter: ["==", ["get", "category"], category],
	paint: {
		"fill-color": fillColor,
		"fill-opacity": fillOpacity,
	},
}));

const ringArea = (ring: GeoJSON.Position[]): number => {
	let area = 0;
	for (let i = 0; i < ring.length - 1; i++) {
		const [x0, y0] = ring[i];
		const [x1, y1] = ring[i + 1];
		area += x0 * y1 - x1 * y0;
	}
	return area / 2;
};

const ringCentroid = (ring: GeoJSON.Position[]): GeoJSON.Position => {
	const area = ringArea(ring);
	if (area === 0) return ring[0];
	let cx = 0;
	let cy = 0;
	for (let i = 0; i < ring.length - 1; i++) {
		const [x0, y0] = ring[i];
		const [x1, y1] = ring[i + 1];
		const cross = x0 * y1 - x1 * y0;
		cx += (x0 + x1) * cross;
		cy += (y0 + y1) * cross;
	}
	return [cx / (6 * area), cy / (6 * area)];
};

const outerRings = (
	geometry: GeoJSON.Polygon | GeoJSON.MultiPolygon,
): GeoJSON.Position[][] =>
	geometry.type === "Polygon"
		? [geometry.coordinates[0]]
		: geometry.coordinates.map((polygon) => polygon[0]);

// A polygon feature can span several map tiles, and MapLibre places one
// symbol per tile it appears in - so labelling the polygon directly can
// duplicate a single landfill's name across the screen. Labelling a single
// representative point per feature instead guarantees exactly one label.
const labelPosition = (feature: GeoJSON.Feature): GeoJSON.Position => {
	const override = feature.properties?.labelCoordinates as
		| GeoJSON.Position
		| undefined;
	if (override) return override;

	const rings = outerRings(
		feature.geometry as GeoJSON.Polygon | GeoJSON.MultiPolygon,
	);
	const largestRing = rings.reduce((a, b) =>
		Math.abs(ringArea(a)) >= Math.abs(ringArea(b)) ? a : b,
	);
	return ringCentroid(largestRing);
};

const labelLayer: SymbolLayerSpecification = {
	id: "landfills-label",
	type: "symbol",
	source: "landfills-labels",
	minzoom: 3,
	layout: {
		"text-field": "{name}",
		"text-font": ["noto_sans_regular"],
		"text-size": [
			"interpolate",
			["linear"],
			["zoom"],
			3,
			["*", 0.5, ["coalesce", ["get", "labelMinSize"], 8]],
			10,
			["*", 0.5, ["coalesce", ["get", "labelMaxSize"], 20]],
		] as unknown as ExpressionSpecification,
		"text-max-width": 8,
	},
	paint: {
		"text-color": [
			"match",
			["get", "category"],
			...CATEGORY_STYLES.flatMap(({ category, labelColor }) => [
				category,
				labelColor,
			]),
			"#3b3b3b",
		] as unknown as ExpressionSpecification,
		"text-halo-color": "rgba(255, 255, 255, 0.85)",
		"text-halo-width": 1.5,
		"text-halo-blur": 1,
	},
};

export const addLandfills = async (map: MapLibreMap) => {
	const url = `${window.location.origin}/map/data/landfills.geojson`;

	map.addSource("landfills", {
		type: "geojson",
		data: url,
	});
	addLayer(map, categoryLayers, "label-street-primary");

	const geojson: GeoJSON.FeatureCollection = await fetch(url).then((res) =>
		res.json(),
	);
	map.addSource("landfills-labels", {
		type: "geojson",
		data: {
			type: "FeatureCollection",
			features: geojson.features.map((feature) => ({
				type: "Feature",
				properties: feature.properties,
				geometry: {
					type: "Point",
					coordinates: labelPosition(feature),
				},
			})),
		},
	});
	addLayer(map, labelLayer);
};
