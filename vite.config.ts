import { defineConfig } from "vite";

export default defineConfig({
	build: {
		outDir: "docs",
		emptyOutDir: false,
	},
	base: "map/",
	optimizeDeps: {
		exclude: ["maplibre-gl"],
	},
	ssr: {
		noExternal: ["maplibre-gl"],
	},
});
