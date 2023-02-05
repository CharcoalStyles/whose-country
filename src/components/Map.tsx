import { MapContainer, TileLayer, GeoJSON, Popup } from "react-leaflet";
import { LeafletMouseEvent, Map } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { firstNationsLocations } from "../firstNationsLocations";
import "./Map.css";
import { point } from "@turf/helpers";
import bbox from "@turf/bbox";
import booleanPointInPolygon from "@turf/boolean-point-in-polygon";

type LeafletMapProps = {
  visible: boolean;
  onPoint: () => void;
};

const LeafletMap = ({ visible, onPoint }: LeafletMapProps) => {
  const [geojsonFocus, setGeojsonFocus] = useState<
    GeoJSON.FeatureCollection | undefined
  >();
  const [minZoom, setMinZoom] = useState<number>(0);
  const [locatedPoint, setLocatedPoint] = useState<{
    lat: number;
    lng: number;
  }>();

  useEffect(() => {
    if (visible) {
      setGeojsonFocus(firstNationsLocations);
      const thisMap = map.current;
      if (thisMap) {
        setTimeout(() => {
          setMinZoom(thisMap.getZoom());
        }, 1);
      }
    }
  }, [visible]);

  const map = useRef<Map>();

  const onClick = ({ latlng }: LeafletMouseEvent) => {
    const selectedFeatures = firstNationsLocations.features.filter(
      (feature) => {
        const polygon = feature.geometry as GeoJSON.Polygon;
        const p = point([latlng.lng, latlng.lat]);
        return booleanPointInPolygon(p, polygon);
      }
    );
    setGeojsonFocus({
      type: "FeatureCollection",
      features: selectedFeatures,
    });
    setLocatedPoint(
      selectedFeatures.length > 0
        ? { lat: latlng.lat, lng: latlng.lng }
        : undefined
    );
  };

  useEffect(() => {
    setTimeout(() => {
      const thisMap = map.current;
      if (thisMap) {
        thisMap.invalidateSize();
        thisMap.off("click");
        onClick && thisMap.on("click", onClick);
        const bb = bbox(firstNationsLocations);
        thisMap.setMaxBounds([
          [bb[1] - 2, bb[0] - 2],
          [bb[3] + 2, bb[2] + 2],
        ]);
      }
    }, 1);
  }, [map]);

  useEffect(() => {
    const thisMap = map.current;
    if (thisMap && geojsonFocus && geojsonFocus.features.length > 0) {
      thisMap.invalidateSize();
      const bb = bbox(geojsonFocus);
      thisMap.fitBounds(
        [
          [bb[1], bb[0]],
          [bb[3], bb[2]],
        ],
        { padding: [20, 20] }
      );
    }
  }, [map, geojsonFocus]);

  return (
    <MapContainer
      className="map"
      maxZoom={12}
      minZoom={minZoom}
      ref={(mapRef) => {
        map.current = mapRef ? mapRef : undefined;
      }}
    >
      <TileLayer
        // url="https://a.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png"
        url="https://services.ga.gov.au/gis/rest/services/World_Bathymetry_Imagery/MapServer/tile/{z}/{y}/{x}?blankTile=false"
        attribution='Basemap: &copy; <a href="https://www.ga.gov.au/">Commonwealth of Australia (Geoscience Australia) 2016</a>'
        maxZoom={12}
      />

      <GeoJSON
        data={firstNationsLocations}
        style={(feature) => {
          if (
            geojsonFocus &&
            geojsonFocus.features.length !==
              firstNationsLocations.features.length
          ) {
            const p = geojsonFocus.features.find((f) => {
              return f.properties?.ID === feature?.properties?.ID;
            });
            if (p) {
              return {
                color: "#0f0",
                weight: 3,
                opacity: 1,
                fillColor: "#000",
                fillOpacity: 0.5,
              };
            }
          }
          return {
            color: "#000",
            weight: 2,
            opacity: 1,
            fillColor: "#000",
            fillOpacity: 0,
          };
        }}
      />
      {locatedPoint && (
        <Popup position={[locatedPoint.lat, locatedPoint.lng]}>
          <div>
            <h3>Located Point</h3>
            <p>Lat: {locatedPoint.lat}</p>
            <p>Lng: {locatedPoint.lng}</p>
            <ul>
              {geojsonFocus?.features.map((feature) => {
                return (
                  <li key={feature.properties?.id}>
                    {feature.properties?.Name}
                  </li>
                );
              })}
            </ul>
          </div>
        </Popup>
      )}
    </MapContainer>
  );
};

export default LeafletMap;
