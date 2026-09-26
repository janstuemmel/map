#!/bin/bash
set -e

out=output
osm=$out/osm
osmFile=$osm/geofabrik.merged.pbf
geojson=$out/geojson

mkdir -p $osm $geojson

bbox_africa=-14.37,10.433,36.507,48.42
bbox_roads=0.831,24.531,17.904,37.429 # from eat algeria to west libya

# boundaries
echo; echo Build boundaries
osmium tags-filter $osmFile a/boundary=administrative --overwrite -o $osm/boundaries.pbf &&
osmium export $osm/boundaries.pbf --overwrite -o $geojson/boundaries.geojson &&

# roads
echo; echo Build roads
osmium extract --bbox=$bbox_roads $osmFile --overwrite -o $osm/roads.tmp.pbf &&
osmium tags-filter $osm/roads.tmp.pbf w/highway=track,path,bridleway,unclassified,motorway,trunk,primary,secondary,tertiary --overwrite -o $osm/roads.pbf &&
osmium export $osm/roads.pbf --overwrite -o $geojson/roads.tmp.geojson &&
rm -f $osm/roads.tmp.pbf &&
ogr2ogr -simplify 0.001 $geojson/roads.geojson $geojson/roads.tmp.geojson
rm -f $geojson/roads.tmp.geojson &&

# places
echo; echo Build places
osmium extract --bbox=$bbox_roads $osmFile --overwrite -o $osm/places.tmp.pbf &&
osmium tags-filter $osm/places.tmp.pbf n/place=city,town n/capital --overwrite -o $osm/places.pbf &&
rm -f $osm/places.tmp.pbf &&
osmium export $osm/places.pbf --overwrite -o $geojson/places.geojson &&

echo; echo Create tiles
tippecanoe -Z0 -z10 \
  --clip-bounding-box=$bbox_africa \
  -o $out/map.pmtiles \
  -L ocean:$geojson/ocean.geojson \
  -L roads:$geojson/roads.geojson \
  -L boundaries:$geojson/boundaries.geojson \
  -L places:$geojson/places.geojson \
  -y highway -y name -y name:en -y name:de -y admin_level -y boundary -y place -y water -y natural -y capital \
  --simplification=10 \
  --drop-rate=1 \
  --drop-densest-as-needed \
  --calculate-feature-density \
  --no-feature-limit \
  --no-tile-size-limit \
  --force

echo; echo; du -h $out/*

# .png extension so GitHub's raw CDN serves it with range request support (pmtiles doesn't)
cp $out/map.pmtiles public/data/map.png
