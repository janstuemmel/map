# map

## Software

* osmium (aur)
* tippecanoe (aur)
* gdal (ogr2ogr)

## Debug

* [Openstreetmap](https://www.openstreetmap.org/) Debug objects using right click
* [Overpass turbo](https://overpass-turbo.eu/) Show osm overpass objects using overpass queries
* [Shortbread docs](https://shortbread-tiles.org/schema/1.1/)

### Overpass queries

Show offroad tracks

```
[out:json][timeout:25];
(
  way["highway"~"^(track|bridleway|path)$"]({{bbox}});
);
out geom;
```