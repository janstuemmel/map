#!/bin/bash

mkdir -p output/ocean

wget https://osmdata.openstreetmap.de/download/water-polygons-split-3857.zip
unzip output/ocean/water-polygons-split-3857.zip -d output/ocean

ogr2ogr -f GeoJSON output/ocean/ocean.geojson output/ocean/water-polygons-split-3857/water_polygons.shp

