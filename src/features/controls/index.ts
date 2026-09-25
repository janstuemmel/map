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
