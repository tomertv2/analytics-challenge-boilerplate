import React, { useCallback, useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { Event, GeoLocation } from "../../models/event";
import axios from "axios";

const containerStyle: {
  width: string;
  height: string;
} = {
  width: "800px",
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

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const { data: eventsLocations } = await axios.get(`http://localhost:3001/events/all`);
      console.log(eventsLocations.map((e: Event) => e.geolocation));
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
    <div>
      <LoadScript googleMapsApiKey="AIzaSyD6fexKCtUQ5zLj2TEaOkf_EQstH0qLu-k">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={0}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {locationsData.map((location: GeoLocation) => (
            <Marker position={location.location} />
          ))}
        </GoogleMap>
      </LoadScript>
    </div>
  );
}
