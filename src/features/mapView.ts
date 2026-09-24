import type { Map as MapLibreMap } from "maplibre-gl";

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

export const restoreMapView = (map: MapLibreMap) => {
	const view = loadView();
	if (!view) return;
	map.jumpTo(view);
};

export const persistMapView = (map: MapLibreMap) => {
	map.on("moveend", () => saveView(map));
};
