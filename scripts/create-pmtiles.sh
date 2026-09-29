#!/bin/bash
set -e

out=output
osm=$out/osm
osmFile=$osm/geofabrik.merged.pbf
geojson=$out/geojson

mkdir -p $osm $geojson

bbox_africa=-14.37,10.433,36.507,48.42
bbox_roads=0.831,24.531,17.904,37.429 # from eat algeria to west libya

# # boundaries
# echo; echo Build boundaries
# osmium tags-filter $osmFile a/boundary=administrative --overwrite -o $osm/boundaries.pbf &&
# osmium export $osm/boundaries.pbf --overwrite -o $geojson/boundaries.geojson &&

# # roads
# echo; echo Build roads
# osmium extract --bbox=$bbox_roads $osmFile --overwrite -o $osm/roads.tmp.pbf &&
# osmium tags-filter $osm/roads.tmp.pbf w/highway=track,path,bridleway,unclassified,motorway,trunk,primary,secondary,tertiary --overwrite -o $osm/roads.pbf &&
# osmium export $osm/roads.pbf --overwrite -o $geojson/roads.geojson &&
# rm -f $osm/roads.tmp.pbf &&

# # places
# echo; echo Build places
# osmium extract --bbox=$bbox_roads $osmFile --overwrite -o $osm/places.tmp.pbf &&
# osmium tags-filter $osm/places.tmp.pbf n/place=city,town n/capital --overwrite -o $osm/places.pbf &&
# rm -f $osm/places.tmp.pbf &&
# osmium export $osm/places.pbf --overwrite -o $geojson/places.geojson &&

# # land
# echo; echo Build land
# osmium tags-filter $osmFile a/landuse=forest,farmland,residential,commercial,industrial a/natural=wood,scrub,grassland,sand,wetland --overwrite -o $osm/land.pbf &&
# osmium export $osm/land.pbf --overwrite -o $geojson/land.geojson &&

# # water
# echo; echo Build water
# osmium tags-filter $osmFile w/waterway=river,stream,canal,drain,ditch a/natural=water,water --overwrite -o $osm/water.pbf &&
# osmium export $osm/water.pbf --overwrite -o $geojson/water.geojson &&

# # poi
echo; echo Build poi
osmium tags-filter $osmFile n/historic=archaeological_site,fort,ruins n/natural=rock,peak,spring,cave_entrance n/attraction=nature n/tourism=attraction,viewpoint,camp_site,wilderness_hut n/amenity=drinking_water,fuel,water_point n/man_made=water_well n/barrier=border_control --overwrite -o $osm/poi.pbf &&
osmium export $osm/poi.pbf --overwrite -o $geojson/poi.geojson &&

echo; echo Create tiles
tippecanoe -Z0 -z10 \
  --clip-bounding-box=$bbox_africa \
  -e $out/tiles \
  -L ocean:$geojson/ocean.geojson \
  -L water:$geojson/water.geojson \
  -L land:$geojson/land.geojson \
  -L roads:$geojson/roads.geojson \
  -L boundaries:$geojson/boundaries.geojson \
  -L places:$geojson/places.geojson \
  -L poi:$geojson/poi.geojson \
  -y highway -y oneway -y name -y name:en -y name:de -y admin_level -y boundary -y place -y water -y salt -y intermittent -y natural -y waterway -y capital -y landuse -y historic -y archaeological_site -y attraction -y tourism -y amenity -y man_made -y barrier \
  --simplification=10 \
  --drop-rate=1 \
  --drop-densest-as-needed \
  --calculate-feature-density \
  --no-feature-limit \
  --no-tile-size-limit \
  --force

echo; echo; du -hd 0 $out/*

# .png extension so GitHub's raw CDN serves it with range request support (pmtiles doesn't)
cp $out/map.pmtiles public/data/map.pmtiles.png
