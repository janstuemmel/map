osmium tags-filter output/tn-alg-ly.osm.pbf \
  w/highway=track,path,bridleway,unclassified,motorway,trunk,primary,secondary,tertiary \
  --overwrite \
  -o output/roads.osm.pbf &&

osmium export output/roads.osm.pbf --overwrite -o output/roads.geojson &&

mkdir -p public/data &&

rm -f public/data/roads.pmtiles &&

tippecanoe -o public/data/roads.pmtiles \
  -l roads \
  -Z0 -z12 \
  -y highway -y name \
  --simplification=20 \
  --drop-densest-as-needed \
  --no-feature-limit \
  --no-tile-size-limit \
  output/roads.geojson

du -h public/data/*