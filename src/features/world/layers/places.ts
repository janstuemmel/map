import type {
	CircleLayerSpecification,
	SymbolLayerSpecification,
} from "maplibre-gl";

export const createCityLayer = (
	id: string,
	{
		filter,
		layout,
		paint,
		minzoom,
		dotRadius,
	}: Partial<SymbolLayerSpecification> & { dotRadius: number },
): (CircleLayerSpecification | SymbolLayerSpecification)[] => [
	{
		id: `${id}-dot`,
		type: "circle",
		"source-layer": "places",
		filter,
		paint: {
			"circle-radius": dotRadius,
			"circle-color": "#ffffff",
			"circle-stroke-color": "#4a4a4a",
			"circle-stroke-width": 1,
		},
		source: "world",
		minzoom,
	},
	{
		id,
		type: "symbol",
		"source-layer": "places",
		filter,
		layout: {
			"text-field": "{name:en}",
			"text-font": ["noto_sans_regular"],
			...layout,
		},
		source: "world",
		paint: {
			"text-color": "#383838",
			"text-translate": [0, -12],
			...paint,
		},
		minzoom,
	},
];

export const layersPlaces: (
	| CircleLayerSpecification
	| SymbolLayerSpecification
)[] = [
	{
		id: "label-street-primary",
		type: "symbol",
		"source-layer": "street_labels",
		filter: ["==", "kind", "primary"],
		layout: {
			"text-field": "{name}",
			"text-font": ["noto_sans_regular"],
			"symbol-placement": "line",
			"text-anchor": "center",
			"text-size": {
				type: "interval",
				stops: [
					[12, 10],
					[15, 13],
				],
			},
		},
		source: "world",
		paint: {
			"icon-color": "#3b3b3b",
			"text-color": "#3b3b3b",
			"text-halo-color": "rgba(255, 255, 255, 0.8)",
			"text-halo-width": 2,
			"text-halo-blur": 1,
		},
		minzoom: 8,
	},
	// ...createCityLayer("label-place-village", {
	// 	filter: ["==", "place", "village"],
	// 	minzoom: 5,
	// 	dotRadius: 2.5,
	// 	layout: { "text-size": 10 },
	// }),
	...createCityLayer("label-place-town", {
		filter: ["==", "place", "town"],
		minzoom: 8,
		dotRadius: 2.5,
		layout: { "text-size": 12 },
	}),
	...createCityLayer("label-place-city", {
		filter: ["==", "place", "city"],
		minzoom: 7,
		dotRadius: 3.5,
		layout: { "text-size": 14 },
	}),
	...createCityLayer("label-place-statecapital", {
		filter: [
			"all",
			["==", "place", "city"],
			["has", "capital"],
			["!=", "capital", "yes"],
		],
		minzoom: 6,
		dotRadius: 3.5,
		layout: { "text-size": 14 },
	}),
	...createCityLayer("label-place-capital", {
		filter: ["all", ["==", "place", "city"], ["==", "capital", "yes"]],
		minzoom: 4,
		dotRadius: 3.5,
		layout: { "text-size": 16 },
	}),
];
