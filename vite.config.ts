import { defineConfig } from "vite";

export default defineConfig({
	build: {
		outDir: "docs",
		emptyOutDir: true,
	},
	base: "map/",
	optimizeDeps: {
		exclude: ["maplibre-gl"],
	},
	ssr: {
		noExternal: ["maplibre-gl"],
	},
});
