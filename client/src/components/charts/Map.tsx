import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker, MarkerClusterer } from "@react-google-maps/api";
import { Event, GeoLocation } from "models";
import axios from "axios";
import TileDiv from "components/styles/TileDiv";

const containerStyle: {
  width: string;
  height: string;
} = {
  width: "850px",
  height: "500px",
};

interface point {
  lat: number;
  lng: number;
}

export default function Map() {
  const [map, setMap] = useState<GoogleMap | null>(null);
  const [locationsData, setLocationsData] = useState<GeoLocation[]>([]);

  const center: point = {
    lat: 0,
    lng: -180,
  };

  const options: { imagePath: string } = {
    imagePath:
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
  };

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const { data: eventsLocations } = await axios.get(`http://localhost:3001/events/all`);
      setLocationsData(eventsLocations.map((e: Event) => e.geolocation));
    };
    fetchData();
  }, []);

  const onLoad = useCallback(function callback(map) {
    // @ts-ignore
    const bounds: GoogleMap = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  return (
    <TileDiv>
      <h1>Events on map</h1>
      <LoadScript googleMapsApiKey="AIzaSyD6fexKCtUQ5zLj2TEaOkf_EQstH0qLu-k">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={0}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          <MarkerClusterer options={options}>
            {(clusterer) =>
              locationsData.map((location: GeoLocation, i: number) => (
                <Marker key={i} position={location.location} clusterer={clusterer} />
              ))
            }
          </MarkerClusterer>
        </GoogleMap>
      </LoadScript>
    </TileDiv>
  );
}
