#!/bin/bash

dir=output/land
name=land-polygons-split-3857

mkdir -p $dir

# wget -O output/land/$name.zip https://osmdata.openstreetmap.de/download/$name.zip
# unzip output/land/$name.zip -d output/land

rm $dir/land.geojson

ogr2ogr -t_srs EPSG:4326 $dir/$name/land_4326.shp $dir/$name/land_polygons.shp

ogr2ogr -f GeoJSON -clipsrc -14.37 10.433 36.507 48.42 $dir/land.geojson $dir/$name/land_4326.shp

ogr2ogr -f GeoJSON -simplify 0.001 $dir/land-simple.geojson $dir/land.geojson

jq '.features[].properties.tippecanoe = {"minzoom": 0, "maxzoom": 8}' $dir/land-simple.geojson > $dir/land-simple.geojson.tmp
mv $dir/land-simple.geojson.tmp $dir/land-simple.geojson

du -h $dir/*