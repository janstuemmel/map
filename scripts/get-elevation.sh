#!/bin/bash

out=output
bbox_africa=-14.37,10.433,36.507,48.42
bbox=0.831,24.531,17.904,37.429 # from eat algeria to west libya

versatiles convert \
  --bbox=$bbox \
  --bbox-border=1 \
  https://download.versatiles.org/elevation.versatiles \
  $out/elevation.pmtiles
