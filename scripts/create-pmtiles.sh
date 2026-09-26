#!/bin/bash

out=output
osmpbf=$out/osm.pbf/alg-ly-tn-combined.osm.pbf
osmfiltered=$out/osm.pbf/filtered
geojsons=$out/osm.pbf/geojsons

bbox_africa=-14.37,10.433,36.507,48.42
bbox_roads=0.831,24.531,17.904,37.429 # from eat algeria to west libya

# mkdir -p $osmfiltered && rm -rf $osmfiltered/* &&
# mkdir -p $geojsons && rm -rf $geojsons/* &&

# # FILTER

# osmium tags-filter $osmpbf a/boundary=administrative --overwrite -o $osmfiltered/boundaries.osm.pbf &&
# osmium tags-filter $osmpbf w/natural=water wr/waterway=river,stream --overwrite -o $osmfiltered/water.osm.pbf &&

# # places
# osmium extract --bbox=$bbox_roads $osmpbf --overwrite -o $osmfiltered/places-tmp.osm.pbf &&
# osmium tags-filter $osmfiltered/places-tmp.osm.pbf n/place=city,town,village n/capital --overwrite -o $osmfiltered/places.osm.pbf
# rm -f $osmfiltered/places-tmp.osm.pbf

# # roads
# osmium extract --bbox=$bbox_roads $osmpbf --overwrite -o $osmfiltered/roads-tmp.osm.pbf &&
# osmium tags-filter $osmfiltered/roads-tmp.osm.pbf w/highway --overwrite -o $osmfiltered/roads.osm.pbf &&
# rm -f $osmfiltered/roads-tmp.osm.pbf

# # to GEOJSON
# osmium export $osmfiltered/boundaries.osm.pbf -o $geojsons/boundaries.geojson &&
# osmium export $osmfiltered/places.osm.pbf -o $geojsons/places.geojson &&
# osmium export $osmfiltered/water.osm.pbf -o $geojsons/water.geojson &&
# osmium export $osmfiltered/roads.osm.pbf -o $geojsons/roads.geojson &&

# # assign explicit minzoom per place so tippecanoe's density-based thinning
# # doesn't drop capitals/cities in favor of denser village clusters
# jq '.features[] |= (
#   if .properties.place == "city" and .properties.capital == "yes" then .properties.tippecanoe = {"minzoom": 0}
#   elif .properties.place == "city" and (.properties.capital != null) then .properties.tippecanoe = {"minzoom": 3}
#   elif .properties.place == "city" then .properties.tippecanoe = {"minzoom": 5}
#   elif .properties.place == "town" then .properties.tippecanoe = {"minzoom": 7}
#   else .properties.tippecanoe = {"minzoom": 9}
#   end
# )' $geojsons/places.geojson > $geojsons/places.geojson.tmp &&
# mv $geojsons/places.geojson.tmp $geojsons/places.geojson &&


CMD=(
  -Z0 -z12
  --clip-bounding-box=$bbox_africa
  -L ocean:$out/ocean/ocean-simple.geojson
  -L roads:$geojsons/roads.geojson
  # -L boundaries:$geojsons/boundaries.geojson
  -L places:$geojsons/places.geojson
  # -L water:$geojsons/water.geojson
  -y highway -y name -y admin_level -y boundary -y place -y water -y natural
  --simplification=10
  --drop-densest-as-needed
  --calculate-feature-density
  --no-feature-limit
  --no-tile-size-limit
  --force 
)


tippecanoe -o $out/map.pmtiles "${CMD[@]}" &&

du -h $out/* &&

cp $out/map.pmtiles public/data
