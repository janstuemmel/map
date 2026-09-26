#!/bin/bash
set -e

out=output
osmpbf=$out/osm.pbf/alg-ly-tn-combined.osm.pbf
osmfiltered=$out/osm.pbf/filtered
geojsons=$out/osm.pbf/geojsons
mkdir -p $osmfiltered
mkdir -p $geojsons

bbox_africa=-14.37,10.433,36.507,48.42
bbox_roads=0.831,24.531,17.904,37.429 # from eat algeria to west libya

# # ocean: whole world ocean ~3.5 MB
# echo; echo Build ocean
# tippecanoe -Z0 -z10 --clip-bounding-box=$bbox_africa -o $out/ocean.pmtiles -L ocean:$out/ocean/ocean-simple.geojson -y natural --simplification=10 --force &&
# echo 

# # boundaries
# echo; echo Build boundaries
# osmium tags-filter $osmpbf a/boundary=administrative --overwrite -o $osmfiltered/boundaries.osm.pbf &&
# osmium export $osmfiltered/boundaries.osm.pbf --overwrite -o $geojsons/boundaries.geojson &&

# # roads
# echo; echo Build roads
# osmium extract --bbox=$bbox_roads $osmpbf --overwrite -o $osmfiltered/roads-tmp.osm.tmp.pbf &&
# osmium tags-filter $osmfiltered/roads-tmp.osm.tmp.pbf w/highway=track,path,bridleway,unclassified,motorway,trunk,primary,secondary,tertiary --overwrite -o $osmfiltered/roads.osm.pbf &&
# osmium export $osmfiltered/roads.osm.pbf --overwrite -o $geojsons/roads.tmp.geojson &&
# rm -f $osmfiltered/roads-tmp.osm.tmp.pbf &&
# ogr2ogr -simplify 0.001 $geojsons/roads.geojson $geojsons/roads.tmp.geojson
# rm -f $geojsons/roads.tmp.geojson &&

# places
osmium extract --bbox=$bbox_roads $osmpbf --overwrite -o $osmfiltered/places-tmp.osm.pbf &&
osmium tags-filter $osmfiltered/places-tmp.osm.pbf n/place=city,town n/capital --overwrite -o $osmfiltered/places.osm.pbf &&
rm -f $osmfiltered/places-tmp.osm.pbf &&
osmium export $osmfiltered/places.osm.pbf --overwrite -o $geojsons/places.geojson &&

tippecanoe -Z0 -z10 \
  --clip-bounding-box=$bbox_africa \
  -o $out/map.pmtiles \
  -L ocean:$out/ocean/ocean-detailed.geojson \
  -L roads:$geojsons/roads.geojson \
  -L boundaries:$geojsons/boundaries.geojson \
  -L places:$geojsons/places.geojson \
  -y highway -y name -y name:en -y name:de -y admin_level -y boundary -y place -y water -y natural -y capital \
  --simplification=20 \
  --drop-rate=1 \
  --drop-densest-as-needed \
  --calculate-feature-density \
  --no-feature-limit \
  --no-tile-size-limit \
  --force &&
echo


du -h $out/*

cp $out/map.pmtiles public/data
