#!/bin/bash

dir=output/ocean
name=ne_10m_ocean

mkdir -p $dir &&

wget -O $dir/$name.zip https://naciscdn.org/naturalearth/10m/physical/$name.zip &&
 
unzip -u $dir/$name.zip -d $dir &&

rm -f $dir/ocean.geojson &&

ogr2ogr -f GeoJSON $dir/ocean-simple.geojson $dir/$name.shp &&

jq '.features[].properties.tippecanoe = {"minzoom": 0, "maxzoom": 14}' $dir/ocean-simple.geojson > $dir/ocean-simple.geojson.tmp
mv $dir/ocean-simple.geojson.tmp $dir/ocean-simple.geojson

du -h $dir/*