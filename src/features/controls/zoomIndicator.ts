import type { IControl, MapLibreMap } from "maplibre-gl";

export class ZoomIndicatorControl implements IControl {
	private container?: HTMLDivElement;
	private map?: MapLibreMap;

	private update = () => {
		if (this.container && this.map) {
			this.container.textContent = this.map.getZoom().toFixed(1);
		}
	};

	onAdd(map: MapLibreMap) {
		this.map = map;
		this.container = document.createElement("div");
		this.container.className =
			"maplibregl-ctrl maplibregl-ctrl-group zoom-indicator";
		this.update();
		map.on("zoom", this.update);
		return this.container;
	}

	onRemove() {
		this.map?.off("zoom", this.update);
		this.container?.remove();
		this.map = undefined;
		this.container = undefined;
	}
}
