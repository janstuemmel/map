#!/bin/bash

out=output
dir=$out/ocean
geojson=$out/geojson
name=water-polygons-split-3857
bbox_africa=-14.37,10.433,36.507,48.42

mkdir -p $dir &&

[ -f $dir/$name.zip ] || wget -O $dir/$name.zip https://osmdata.openstreetmap.de/download/$name.zip &&

unzip -u $dir/$name.zip "$name/water_polygons.*" -d $dir &&

rm -f $dir/ocean.geojson &&

ogr2ogr -t_srs EPSG:4326 $dir/water_4326.shp $dir/$name/water_polygons.shp &&

ogr2ogr -f GeoJSON -clipsrc ${bbox_africa//,/ } $dir/ocean.geojson $dir/water_4326.shp &&

jq '.features[].properties.tippecanoe = {"minzoom": 0, "maxzoom": 10}' $dir/ocean.geojson > $dir/ocean.tmp.geojson
mv $dir/ocean.tmp.geojson $geojson/ocean.geojson

du -h $dir/*
