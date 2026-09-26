import type { LayerSpecification, SourceSpecification } from "maplibre-gl";

export const sourceAWSTerrarium: Record<string, SourceSpecification> = {
	awsTerrarium: {
		type: "raster-dem",
		tiles: [
			"https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
		],
		encoding: "terrarium",
		tileSize: 256,
		attribution:
			'© <a href="https://www.mapzen.com/rights">Mapzen</a> and <a href="https://www.mapzen.com/rights/#services-and-data-sources">others</a>',
	},
};

export const layerTerrarium: LayerSpecification = {
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
};
