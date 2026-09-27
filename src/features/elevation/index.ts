import mlcontour from "maplibre-contour";
import type { LayerSpecification, SourceSpecification } from "maplibre-gl";

export const terrariumTileUrl =
	"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png";
export const terrariumMaxzoom = 14;

const demSource = new mlcontour.DemSource({
	url: terrariumTileUrl,
	encoding: "terrarium",
	maxzoom: terrariumMaxzoom,
	worker: true,
});

export function setupContours(
	maplibre: Parameters<typeof demSource.setupMaplibre>[0],
) {
	demSource.setupMaplibre(maplibre);
}

export const sourceElevation: Record<string, SourceSpecification> = {
	awsTerrarium: {
		type: "raster-dem",
		tiles: [terrariumTileUrl],
		encoding: "terrarium",
		tileSize: 256,
		maxzoom: terrariumMaxzoom,
		attribution:
			'© <a href="https://www.mapzen.com/rights">Mapzen</a> and <a href="https://www.mapzen.com/rights/#services-and-data-sources">others</a>',
	},
	contours: {
		type: "vector",
		tiles: [
			demSource.contourProtocolUrl({
				thresholds: {
					9: [200, 1000],
					11: [100, 500],
					13: [50, 250],
					15: [20, 100],
				},
				elevationKey: "ele",
				levelKey: "level",
				contourLayer: "contours",
			}),
		],
		maxzoom: terrariumMaxzoom,
	},
};

export const layersElevation: LayerSpecification[] = [
	{
		id: "hills",
		source: "awsTerrarium",
		type: "hillshade",
		layout: { visibility: "visible" },
		paint: {
			"hillshade-exaggeration": 1,
			"hillshade-accent-color": "hsla(0, 0%, 0%, 0.2)",
			"hillshade-highlight-color": "hsla(100, 100%, 100%, 0.2)",
			"hillshade-shadow-color": "hsla(0, 0%, 0%, 0.2)",
		},
	},
	{
		id: "contour-lines",
		type: "line",
		source: "contours",
		"source-layer": "contours",
		minzoom: 9,
		paint: {
			"line-color": "#8a6a4a",
			"line-opacity": 0.4,
			"line-width": ["match", ["get", "level"], 1, 1, 0.5],
		},
	},
	{
		id: "contour-labels",
		type: "symbol",
		source: "contours",
		"source-layer": "contours",
		minzoom: 11,
		filter: [">", ["get", "level"], 0],
		layout: {
			"symbol-placement": "line",
			"text-field": ["concat", ["number-format", ["get", "ele"], {}], " m"],
			"text-font": ["noto_sans_regular"],
			"text-size": 10,
		},
		paint: {
			"text-color": "#6b5843",
			"text-halo-color": "rgba(255, 255, 255, 0.85)",
			"text-halo-width": 1,
		},
	},
];
