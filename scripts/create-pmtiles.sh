#!/bin/bash

out=output
osmpbf=$out/osm.pbf/combined.osm.pbf
osmfiltered=$out/osm.pbf/filtered
geojsons=$out/osm.pbf/geojsons

# mkdir -p $osmfiltered && rm -rf $osmfiltered/* &&
# mkdir -p $geojsons && rm -rf $geojsons/* &&

# osmium tags-filter $osmpbf a/boundary=administrative --overwrite -o $osmfiltered/boundaries.osm.pbf &&
# osmium tags-filter $osmpbf n/place=city,town,village --overwrite -o $osmfiltered/places.osm.pbf &&
# osmium tags-filter $osmpbf w/natural=water wr/waterway=river,stream --overwrite -o $osmfiltered/water.osm.pbf &&
# osmium tags-filter $osmpbf w/highway --overwrite -o $osmfiltered/roads.osm.pbf &&

# osmium export $osmfiltered/boundaries.osm.pbf -o $geojsons/boundaries.geojson &&
# osmium export $osmfiltered/places.osm.pbf -o $geojsons/places.geojson &&
# osmium export $osmfiltered/water.osm.pbf -o $geojsons/water.geojson &&
# osmium export $osmfiltered/roads.osm.pbf -o $geojsons/roads.geojson &&




tippecanoe -o $out/map.pmtiles \
  --clip-bounding-box=-14.37,10.433,36.507,48.42 \
  -Z0 -z12 \
  -L land:$out/land/land-simple.geojson \
  -L roads:$geojsons/roads.geojson \
  -L boundaries:$geojsons/boundaries.geojson \
  -L places:$geojsons/places.geojson \
  -L water:$geojsons/water.geojson \
  -y highway -y name \
  --simplification=20 \
  --drop-densest-as-needed \
  --no-feature-limit \
  --no-tile-size-limit \
  --force 

tree -L3 --du -h output/

