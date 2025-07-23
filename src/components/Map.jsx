/*eslint-disable no-unused-vars */
/*eslint-disable react/prop-types */
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvent } from "react-leaflet";
import { useCities } from "../contexts/CitiesContext";
import "leaflet/dist/leaflet.css";
import "../index.css"
import { useMap } from "react-leaflet";
import { useGeolocation } from "../hooks/useGeolocation";
import { useMapEvents } from "react-leaflet";
import Button from "./Button";
import {useUrlPosition} from "../hooks/useUrlPosition";

function Map() {

  const {cities} = useCities();
  const [mapPosition, setMapPosition] = useState([40,0]);
  const [mapLat, mapLng ] = useUrlPosition();
  const { position: geolocationPosition , isLoading: isLoadingPosition, getPosition } = useGeolocation();

  useEffect(function(){
    if(mapLat && mapLng){
      setMapPosition([mapLat,mapLng]);
    }
  } ,[mapLat,mapLng] );

  useEffect(function() {
    if(geolocationPosition){
      setMapPosition([geolocationPosition.lat, geolocationPosition.lng]);
    }
  },[geolocationPosition]);
  return (
    <div className={styles.mapContainer}>
       <Button type="position" onClick={getPosition}> 
    {isLoadingPosition ? "Loading..." : "Get your position"}

    </Button>
    <MapContainer center={mapPosition} zoom={6} scrollWheelZoom={false} className={styles.map}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
    />
    {
      cities.map((city)=>(
        
      <Marker position={[city.position.lat, city.position.lng]} key={city.id}>
      <Popup>
      <span>{city.emoji}</span>  <span>{city.cityName} </span> <span>{city.country}</span>
      </Popup>

    </Marker>
      ))}
    <ChangeCenter position={mapPosition} />
  <DetectClick />
  </MapContainer>
    
    </div>
  );
}

function ChangeCenter({position}){
  const map= useMap();
  map.setView(position);
  return null;
}

function DetectClick(){
  const navigate = useNavigate();
  useMapEvents({click: (e) => navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)});

}

export default Map;
