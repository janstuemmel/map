export type LngLat = [number, number];

const EARTH_RADIUS_KM = 6371.0088;
// Merges vertices shared between ways (and clipped at tile boundaries) into
// one graph node. ~1.1m at the equator - well under real-world road spacing.
const NODE_PRECISION = 1e5;

const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export const haversineKm = (a: LngLat, b: LngLat): number => {
	const dLat = toRadians(b[1] - a[1]);
	const dLng = toRadians(b[0] - a[0]);
	const lat1 = toRadians(a[1]);
	const lat2 = toRadians(b[1]);
	const sinDLat = Math.sin(dLat / 2);
	const sinDLng = Math.sin(dLng / 2);
	const h =
		sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
	return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(h)));
};

const nodeKey = (point: LngLat): string =>
	`${Math.round(point[0] * NODE_PRECISION)}:${Math.round(point[1] * NODE_PRECISION)}`;

// "forward"/"backward" mean only travelling a->b (resp. b->a) is allowed,
// matching the OSM `oneway` tag direction (the order the way's nodes were
// digitized in). "both" is a normal, undirected road.
type OnewayDirection = "forward" | "backward" | "both";

interface Segment {
	a: LngLat;
	b: LngLat;
	aKey: string;
	bKey: string;
	direction: OnewayDirection;
}

export interface RoadGraph {
	nodes: Map<string, LngLat>;
	adjacency: Map<string, Map<string, number>>;
	segments: Segment[];
}

interface RoadFeature {
	geometry: GeoJSON.Geometry | null | undefined;
	properties?: Record<string, unknown> | null;
}

const parseOneway = (value: unknown): OnewayDirection => {
	if (value === "yes" || value === "true" || value === "1") return "forward";
	if (value === "-1") return "backward";
	return "both";
};

const addEdge = (
	adjacency: Map<string, Map<string, number>>,
	fromKey: string,
	toKey: string,
	distanceKm: number,
) => {
	let edges = adjacency.get(fromKey);
	if (!edges) {
		edges = new Map();
		adjacency.set(fromKey, edges);
	}
	edges.set(toKey, distanceKm);
};

// Builds a routing graph out of every consecutive vertex pair in the given
// road geometries. Oneway ways (and each carriageway of a divided highway,
// which OSM models as two separate oneway ways) only get edges in their
// tagged direction, so a route can't travel down the wrong side of the road.
//
// Note: the current map.pmtiles export doesn't include the `oneway` tag yet
// (see scripts/create-pmtiles.sh's tippecanoe -y allowlist), so until that's
// regenerated every road here falls back to "both" - this only takes effect
// once oneway data actually reaches the tiles.
export const buildRoadGraph = (features: RoadFeature[]): RoadGraph => {
	const nodes = new Map<string, LngLat>();
	const adjacency = new Map<string, Map<string, number>>();
	const segments: Segment[] = [];

	const addLine = (
		coordinates: GeoJSON.Position[],
		direction: OnewayDirection,
	) => {
		for (let i = 0; i < coordinates.length - 1; i++) {
			const a = coordinates[i] as LngLat;
			const b = coordinates[i + 1] as LngLat;
			const aKey = nodeKey(a);
			const bKey = nodeKey(b);
			if (aKey === bKey) continue;
			nodes.set(aKey, a);
			nodes.set(bKey, b);
			const distanceKm = haversineKm(a, b);
			if (direction !== "backward") addEdge(adjacency, aKey, bKey, distanceKm);
			if (direction !== "forward") addEdge(adjacency, bKey, aKey, distanceKm);
			segments.push({ a, b, aKey, bKey, direction });
		}
	};

	for (const feature of features) {
		const geometry = feature.geometry;
		if (!geometry) continue;
		const direction = parseOneway(feature.properties?.oneway);
		if (geometry.type === "LineString")
			addLine(geometry.coordinates, direction);
		else if (geometry.type === "MultiLineString") {
			for (const line of geometry.coordinates) addLine(line, direction);
		}
	}

	return { nodes, adjacency, segments };
};

const nearestPointOnSegment = (point: LngLat, a: LngLat, b: LngLat): LngLat => {
	// Local equirectangular projection around `point` so segment math isn't
	// skewed by longitude degrees shrinking at higher latitudes.
	const lngScale = Math.cos(toRadians(point[1]));
	const ax = (a[0] - point[0]) * lngScale;
	const ay = a[1] - point[1];
	const bx = (b[0] - point[0]) * lngScale;
	const by = b[1] - point[1];
	const dx = bx - ax;
	const dy = by - ay;
	const lengthSq = dx * dx + dy * dy;
	const t =
		lengthSq === 0
			? 0
			: Math.min(1, Math.max(0, (-ax * dx - ay * dy) / lengthSq));
	return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
};

export interface SnapResult {
	nodeId: string;
	point: LngLat;
	distanceKm: number;
}

// Finds the closest point on the whole road network to `click`, then grafts
// it into the graph as a new node wired to both ends of the segment it fell
// on - so a route can start or end exactly there rather than at a vertex.
export const snapToGraph = (
	graph: RoadGraph,
	click: LngLat,
): SnapResult | undefined => {
	let nearestSegment: Segment | undefined;
	let nearestPoint: LngLat | undefined;
	let nearestDistanceKm = Number.POSITIVE_INFINITY;

	for (const segment of graph.segments) {
		const candidate = nearestPointOnSegment(click, segment.a, segment.b);
		const distanceKm = haversineKm(click, candidate);
		if (distanceKm < nearestDistanceKm) {
			nearestDistanceKm = distanceKm;
			nearestPoint = candidate;
			nearestSegment = segment;
		}
	}

	if (!nearestSegment || !nearestPoint) return undefined;

	const nodeId = `snap:${graph.nodes.size}`;
	graph.nodes.set(nodeId, nearestPoint);
	const distToA = haversineKm(nearestPoint, nearestSegment.a);
	const distToB = haversineKm(nearestPoint, nearestSegment.b);
	// Keep the split point consistent with the segment's own direction: a
	// forward-only segment only allows a->node->b, never the reverse.
	if (nearestSegment.direction !== "backward") {
		addEdge(graph.adjacency, nearestSegment.aKey, nodeId, distToA);
		addEdge(graph.adjacency, nodeId, nearestSegment.bKey, distToB);
	}
	if (nearestSegment.direction !== "forward") {
		addEdge(graph.adjacency, nearestSegment.bKey, nodeId, distToB);
		addEdge(graph.adjacency, nodeId, nearestSegment.aKey, distToA);
	}

	return { nodeId, point: nearestPoint, distanceKm: nearestDistanceKm };
};

export interface RouteResult {
	distanceKm: number;
	coordinates: LngLat[];
}

class MinHeap {
	private items: [number, string][] = [];

	get size() {
		return this.items.length;
	}

	push(item: [number, string]) {
		this.items.push(item);
		let i = this.items.length - 1;
		while (i > 0) {
			const parent = (i - 1) >> 1;
			if (this.items[parent][0] <= this.items[i][0]) break;
			[this.items[parent], this.items[i]] = [this.items[i], this.items[parent]];
			i = parent;
		}
	}

	pop(): [number, string] | undefined {
		const top = this.items[0];
		const last = this.items.pop();
		if (last !== undefined && this.items.length > 0) {
			this.items[0] = last;
			let i = 0;
			for (;;) {
				const left = i * 2 + 1;
				const right = i * 2 + 2;
				let smallest = i;
				if (
					left < this.items.length &&
					this.items[left][0] < this.items[smallest][0]
				)
					smallest = left;
				if (
					right < this.items.length &&
					this.items[right][0] < this.items[smallest][0]
				)
					smallest = right;
				if (smallest === i) break;
				[this.items[smallest], this.items[i]] = [
					this.items[i],
					this.items[smallest],
				];
				i = smallest;
			}
		}
		return top;
	}
}

// Dijkstra's shortest path, weighted by the haversine length of each edge.
export const shortestPath = (
	graph: RoadGraph,
	startId: string,
	endId: string,
): RouteResult | undefined => {
	if (startId === endId) {
		const point = graph.nodes.get(startId);
		return point ? { distanceKm: 0, coordinates: [point] } : undefined;
	}

	const distances = new Map<string, number>([[startId, 0]]);
	const previous = new Map<string, string>();
	const visited = new Set<string>();
	const queue = new MinHeap();
	queue.push([0, startId]);

	while (queue.size > 0) {
		const next = queue.pop();
		if (!next) break;
		const [distance, id] = next;
		if (visited.has(id)) continue;
		visited.add(id);
		if (id === endId) break;

		for (const [neighborId, weight] of graph.adjacency.get(id) ?? []) {
			if (visited.has(neighborId)) continue;
			const candidate = distance + weight;
			if (candidate < (distances.get(neighborId) ?? Number.POSITIVE_INFINITY)) {
				distances.set(neighborId, candidate);
				previous.set(neighborId, id);
				queue.push([candidate, neighborId]);
			}
		}
	}

	const totalDistanceKm = distances.get(endId);
	if (totalDistanceKm === undefined) return undefined;

	const coordinates: LngLat[] = [];
	let currentId: string | undefined = endId;
	while (currentId !== undefined) {
		const point = graph.nodes.get(currentId);
		if (point) coordinates.unshift(point);
		currentId = currentId === startId ? undefined : previous.get(currentId);
	}

	return { distanceKm: totalDistanceKm, coordinates };
};
