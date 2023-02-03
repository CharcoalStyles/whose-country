import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { LeafletMouseEvent, Map } from "leaflet";
import { useEffect, useRef, useState } from "react";
import { firstNationsLocations } from "../firstNationsLocations";
import "./Map.css";
import bbox from "@turf/bbox";

type LeafletMapProps = {
  visible: boolean;
  onPoint: () => void;
};

const LeafletMap = ({ visible, onPoint }: LeafletMapProps) => {
  const [geojsonFocus, setGeojsonFocus] = useState<
    GeoJSON.Feature | GeoJSON.FeatureCollection | undefined
  >();
  const [bounds, setBounds] = useState<[[number, number], [number, number]]>([
    [0, 0],
    [0, 0],
  ]);

  useEffect(() => {
    if (visible) {
      setGeojsonFocus(firstNationsLocations);
    }
  }, [visible]);

  const map = useRef<Map>();

  const onClick = (e: LeafletMouseEvent) => {
    console.log({ e });
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
    if (thisMap && geojsonFocus) {
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
      bounds={bounds}
      zoom={6}
      ref={(mapRef) => {
        map.current = mapRef ? mapRef : undefined;
      }}
    >
      <TileLayer
        url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={firstNationsLocations} />
    </MapContainer>
  );
};

export default LeafletMap;
