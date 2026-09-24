import type {
	CircleLayerSpecification,
	SymbolLayerSpecification,
} from "maplibre-gl";

const createCityLayer = (
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
		"source-layer": "place_labels",
		filter,
		paint: {
			"circle-radius": dotRadius,
			"circle-color": "#ffffff",
			"circle-stroke-color": "#4a4a4a",
			"circle-stroke-width": 1,
		},
		source: "versatiles",
		minzoom,
	},
	{
		id,
		type: "symbol",
		"source-layer": "place_labels",
		filter,
		layout: {
			"text-field": "{name_en}",
			"text-font": ["noto_sans_regular"],
			...layout,
		},
		source: "versatiles",
		paint: {
			"text-color": "#383838",
			"text-translate": [0, -12],
			...paint,
		},
		minzoom,
	},
];

export const labels: (CircleLayerSpecification | SymbolLayerSpecification)[] = [
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
		source: "versatiles",
		paint: {
			"icon-color": "#3b3b3b",
			"text-color": "#3b3b3b",
			"text-halo-color": "rgba(255, 255, 255, 0.8)",
			"text-halo-width": 2,
			"text-halo-blur": 1,
		},
		minzoom: 12,
	},
	{
		id: "label-boundary-country-large",
		type: "symbol",
		"source-layer": "boundary_labels",
		filter: ["in", "admin_level", 2, "2"],
		layout: {
			"text-field": ["format", ["upcase", ["get", "name_de"]]],
			"text-font": ["noto_sans_regular"],
			"text-anchor": "top",
			"text-padding": 0,
			"text-optional": true,
			"text-size": {
				type: "interval",
				stops: [
					[2, 10],
					[5, 15],
					[8, 18],
				],
			},
		},
		source: "versatiles",
		paint: {
			"text-color": "#3b3b3b",
			"text-halo-color": "rgba(255, 255, 255, 0.8)",
			"text-halo-width": 2,
			"text-halo-blur": 1,
		},
		minzoom: 2,
	},
	...createCityLayer("label-place-village", {
		filter: ["==", "kind", "village"],
		minzoom: 10,
		dotRadius: 2.5,
		layout: { "text-size": 10 },
	}),
	...createCityLayer("label-place-town", {
		filter: ["==", "kind", "town"],
		minzoom: 7,
		dotRadius: 2.5,
		layout: { "text-size": 12 },
	}),
	...createCityLayer("label-place-city", {
		filter: ["==", "kind", "city"],
		minzoom: 6,
		dotRadius: 3.5,
		layout: { "text-size": 14 },
	}),
	...createCityLayer("label-place-statecapital", {
		filter: ["==", "kind", "state_capital"],
		minzoom: 5,
		dotRadius: 3.5,
		layout: { "text-size": 14 },
	}),
	...createCityLayer("label-place-capital", {
		filter: ["==", "kind", "capital"],
		minzoom: 4,
		dotRadius: 3.5,
		layout: { "text-size": 16 },
	}),
];
