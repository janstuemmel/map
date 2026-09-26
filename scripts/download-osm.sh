#!/bin/bash
set -e

out=output
dir=$out/osm

mkdir -p $dir

countries=(tunisia libya algeria)

for country in "${countries[@]}"; do
  wget -O $dir/geofabrik.$country.pbf https://download.geofabrik.de/africa/$country-latest.osm.pbf
done

files=()
for country in "${countries[@]}"; do
  files+=("$dir/geofabrik.$country.pbf")
done

osmium merge "${files[@]}" -o $dir/geofabrik.merged.pbf --overwrite

du -h $dir/*
