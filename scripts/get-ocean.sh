#!/bin/bash

dir=output/ocean
name=water-polygons-split-3857
bbox_africa=-14.37,10.433,36.507,48.42

mkdir -p $dir &&

[ -f $dir/$name.zip ] || wget -O $dir/$name.zip https://osmdata.openstreetmap.de/download/$name.zip &&

unzip -u $dir/$name.zip -d $dir &&

rm -f $dir/ocean.geojson &&

ogr2ogr -t_srs EPSG:4326 $dir/water_4326.shp $dir/$name/water_polygons.shp &&

ogr2ogr -f GeoJSON -clipsrc ${bbox_africa//,/ } $dir/ocean.geojson $dir/water_4326.shp &&

jq '.features[].properties.tippecanoe = {"minzoom": 0, "maxzoom": 8}' $dir/ocean.geojson > $dir/ocean.geojson.tmp
mv $dir/ocean.geojson.tmp $dir/ocean.geojson

du -h $dir/*
