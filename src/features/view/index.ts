import RulerControl from "@mapbox-controls/ruler";
import "@mapbox-controls/ruler/src/index.css";
import type { MapLibreMap } from "maplibre-gl";
import { NavigationControl } from "maplibre-gl";
import "./zoomIndicator.css";
import { ZoomIndicatorControl } from "./zoomIndicator";

export const addControls = (map: MapLibreMap) => {
	map.addControl(
		new NavigationControl({ showCompass: false, showZoom: true }),
		"top-right",
	);
	map.addControl(new ZoomIndicatorControl(), "top-right");
	const ruler = new RulerControl();
	map.addControl(ruler, "top-right");
	// @mapbox-controls/ruler only sets mapbox-gl's control classes, so its
	// container inherits pointer-events: none from maplibre-gl's control
	// positioning wrapper and the button becomes unclickable.
	ruler.container.classList.add("maplibregl-ctrl", "maplibregl-ctrl-group");
};

const STORAGE_KEY = "map-view";

interface StoredView {
	center: [number, number];
	zoom: number;
	bearing: number;
	pitch: number;
}

const loadView = (): StoredView | undefined => {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		if (!raw) return undefined;
		return JSON.parse(raw) as StoredView;
	} catch {
		return undefined;
	}
};

const saveView = (map: MapLibreMap) => {
	const { lng, lat } = map.getCenter();
	const view: StoredView = {
		center: [lng, lat],
		zoom: map.getZoom(),
		bearing: map.getBearing(),
		pitch: map.getPitch(),
	};
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(view));
	} catch {
		// ignore storage errors (e.g. private browsing, quota exceeded)
	}
};

const restoreMapView = (map: MapLibreMap) => {
	const view = loadView();
	if (!view) return;
	map.jumpTo(view);
};

export const addPersistMapView = (map: MapLibreMap) => {
	restoreMapView(map);
	map.on("moveend", () => saveView(map));
};
