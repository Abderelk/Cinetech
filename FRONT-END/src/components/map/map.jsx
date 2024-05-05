import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function MapComponent({ location, festivals }) {
  const center = [location.latitude, location.longitude];
  console.log(festivals);

  return (
    <>
      {location.latitude !== undefined && location.longitude !== undefined ? (
        <MapContainer center={center} zoom={12} className="h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={center}>
            <Popup>
              Votre position actuelle <br />
            </Popup>
          </Marker>
          {festivals.map((festival, index) => (
            <Marker
              key={index}
              position={[festival.geocodage_xy.lat, festival.geocodage_xy.lon]}
            >
              <Popup>
                Nom du festival : {festival.nom_du_festival} <br />
                {festival.address}
              </Popup>
            </Marker>
          ))}
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
