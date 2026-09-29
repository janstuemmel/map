import type {
	GeoJSONSource,
	IControl,
	LayerSpecification,
	Map as MapLibreMap,
	MapMouseEvent,
} from "maplibre-gl";
import {
	buildRoadGraph,
	type LngLat,
	type RoadGraph,
	shortestPath,
	snapToGraph,
} from "./roadDistanceGraph";

const SOURCE_ID = "world";
const SOURCE_LAYER = "roads";
const LINE_SOURCE_ID = "road-distance-line";
const POINTS_SOURCE_ID = "road-distance-points";
const ROUTE_COLOR = "#e6007e";

const ICON_SVG = `
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		<circle cx="5" cy="19" r="2" fill="currentColor" stroke="none"/>
		<circle cx="19" cy="5" r="2" fill="currentColor" stroke="none"/>
		<path d="M5 19 L19 5" stroke-dasharray="3 3"/>
	</svg>
`;

const lineOutlineLayer: LayerSpecification = {
	id: "road-distance-line-outline",
	type: "line",
	source: LINE_SOURCE_ID,
	layout: { "line-cap": "round", "line-join": "round" },
	paint: { "line-color": "#ffffff", "line-width": 6, "line-opacity": 0.85 },
};

const lineLayer: LayerSpecification = {
	id: "road-distance-line",
	type: "line",
	source: LINE_SOURCE_ID,
	layout: { "line-cap": "round", "line-join": "round" },
	paint: { "line-color": ROUTE_COLOR, "line-width": 3 },
};

const pointsLayer: LayerSpecification = {
	id: "road-distance-points",
	type: "circle",
	source: POINTS_SOURCE_ID,
	paint: {
		"circle-radius": 5,
		"circle-color": ["match", ["get", "role"], "start", "#2ecc71", ROUTE_COLOR],
		"circle-stroke-width": 2,
		"circle-stroke-color": "#ffffff",
	},
};

const labelLayer: LayerSpecification = {
	id: "road-distance-label",
	type: "symbol",
	source: POINTS_SOURCE_ID,
	layout: {
		"text-field": ["get", "label"],
		"text-font": ["noto_sans_regular"],
		"text-size": 12,
		"text-anchor": "top",
		"text-offset": [0, 0.8],
	},
	paint: {
		"text-color": "#3b3b3b",
		"text-halo-color": "rgba(255, 255, 255, 0.85)",
		"text-halo-width": 1.5,
	},
};

const emptyLineCollection =
	(): GeoJSON.FeatureCollection<GeoJSON.LineString> => ({
		type: "FeatureCollection",
		features: [],
	});

const emptyPointCollection = (): GeoJSON.FeatureCollection<GeoJSON.Point> => ({
	type: "FeatureCollection",
	features: [],
});

const pointFeature = (
	coordinate: LngLat,
	role: "start" | "end",
	label = "",
): GeoJSON.Feature<GeoJSON.Point> => ({
	type: "Feature",
	properties: { role, label },
	geometry: { type: "Point", coordinates: coordinate },
});

const lineFeature = (
	coordinates: LngLat[],
): GeoJSON.Feature<GeoJSON.LineString> => ({
	type: "Feature",
	properties: {},
	geometry: { type: "LineString", coordinates },
});

const formatDistanceKm = (km: number): string =>
	km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(2)} km`;

type PickState = "idle" | "picking-start" | "picking-end" | "result";

export class RoadDistanceControl implements IControl {
	private map?: MapLibreMap;
	private container?: HTMLDivElement;
	private button?: HTMLButtonElement;
	private layersReady = false;
	private state: PickState = "idle";
	private graph?: RoadGraph;
	private start?: { nodeId: string; point: LngLat };

	onAdd(map: MapLibreMap) {
		this.map = map;
		this.container = document.createElement("div");
		this.container.className =
			"maplibregl-ctrl maplibregl-ctrl-group road-distance-ctrl";

		this.button = document.createElement("button");
		this.button.type = "button";
		this.button.title = "Measure distance along roads";
		this.button.innerHTML = ICON_SVG;
		this.button.addEventListener("click", this.handleButtonClick);
		this.container.appendChild(this.button);

		return this.container;
	}

	onRemove() {
		this.deactivate();
		const map = this.map;
		if (map && this.layersReady) {
			for (const id of [
				labelLayer.id,
				pointsLayer.id,
				lineLayer.id,
				lineOutlineLayer.id,
			]) {
				if (map.getLayer(id)) map.removeLayer(id);
			}
			for (const id of [LINE_SOURCE_ID, POINTS_SOURCE_ID]) {
				if (map.getSource(id)) map.removeSource(id);
			}
		}
		this.container?.remove();
		this.map = undefined;
		this.container = undefined;
		this.button = undefined;
	}

	private ensureLayers() {
		const map = this.map;
		if (!map || this.layersReady) return;
		map.addSource(LINE_SOURCE_ID, {
			type: "geojson",
			data: emptyLineCollection(),
		});
		map.addSource(POINTS_SOURCE_ID, {
			type: "geojson",
			data: emptyPointCollection(),
		});
		map.addLayer(lineOutlineLayer);
		map.addLayer(lineLayer);
		map.addLayer(pointsLayer);
		map.addLayer(labelLayer);
		this.layersReady = true;
	}

	private setResultData(
		line: GeoJSON.FeatureCollection<GeoJSON.LineString>,
		points: GeoJSON.FeatureCollection<GeoJSON.Point>,
	) {
		const map = this.map;
		if (!map) return;
		(map.getSource(LINE_SOURCE_ID) as GeoJSONSource | undefined)?.setData(line);
		(map.getSource(POINTS_SOURCE_ID) as GeoJSONSource | undefined)?.setData(
			points,
		);
	}

	private handleButtonClick = () => {
		if (this.state === "idle") {
			this.activate();
		} else if (this.state === "result") {
			this.deactivate();
			this.activate();
		} else {
			this.deactivate();
		}
	};

	private activate() {
		const map = this.map;
		if (!map) return;
		this.ensureLayers();

		const features = map.querySourceFeatures(SOURCE_ID, {
			sourceLayer: SOURCE_LAYER,
		});
		const graph = buildRoadGraph(features);
		if (graph.segments.length === 0) return;

		this.graph = graph;
		this.start = undefined;
		this.state = "picking-start";
		this.setResultData(emptyLineCollection(), emptyPointCollection());
		map.getCanvas().style.cursor = "crosshair";
		map.on("click", this.handleMapClick);
		document.addEventListener("keydown", this.handleKeyDown);
		this.button?.classList.add("-active");
	}

	private deactivate() {
		const map = this.map;
		this.state = "idle";
		this.graph = undefined;
		this.start = undefined;
		if (map) {
			map.getCanvas().style.cursor = "";
			map.off("click", this.handleMapClick);
		}
		document.removeEventListener("keydown", this.handleKeyDown);
		this.setResultData(emptyLineCollection(), emptyPointCollection());
		this.button?.classList.remove("-active");
	}

	private handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Escape") this.deactivate();
	};

	private handleMapClick = (event: MapMouseEvent) => {
		const map = this.map;
		const graph = this.graph;
		if (!map || !graph) return;

		const click: LngLat = [event.lngLat.lng, event.lngLat.lat];
		const snap = snapToGraph(graph, click);
		if (!snap) {
			return;
		}

		if (this.state === "picking-start") {
			this.start = { nodeId: snap.nodeId, point: snap.point };
			this.setResultData(emptyLineCollection(), {
				type: "FeatureCollection",
				features: [pointFeature(snap.point, "start")],
			});
			this.state = "picking-end";
			return;
		}

		if (this.state === "picking-end" && this.start) {
			const route = shortestPath(graph, this.start.nodeId, snap.nodeId);
			const endLabel = route
				? formatDistanceKm(route.distanceKm)
				: "No road route found";
			this.setResultData(
				route && route.coordinates.length > 1
					? {
							type: "FeatureCollection",
							features: [lineFeature(route.coordinates)],
						}
					: emptyLineCollection(),
				{
					type: "FeatureCollection",
					features: [
						pointFeature(this.start.point, "start"),
						pointFeature(snap.point, "end", endLabel),
					],
				},
			);
			map.getCanvas().style.cursor = "";
			map.off("click", this.handleMapClick);
			document.removeEventListener("keydown", this.handleKeyDown);
			this.state = "result";
		}
	};
}
