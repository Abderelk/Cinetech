import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent({ location }) {
  const center = [location.latitude, location.longitude];

  return (
    <>
      {location.latitude !== undefined && location.longitude !== undefined ? (
        <MapContainer center={center} zoom={11} className="h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>
              Votre position actuelle <br /> l'évènement lui même.
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <h1>
          La carte est en train de charger. Merci de bien vouloir patienter...
          <br></br>(Si vous n'avez pas accepté le partage de votre position,
          veuillez le faire puis recharger la page.)
        </h1>
      )}
    </>
  );
}

export default MapComponent;
