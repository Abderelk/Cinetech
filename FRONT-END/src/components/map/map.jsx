import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Importer les images des marqueurs
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Charger les images des marqueurs de manière dynamique
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapComponent({ location, festivals, setSelectedFestival }) {
  const center = [location.latitude, location.longitude];

  return (
    <>
      {location.latitude !== undefined && location.longitude !== undefined ? (
        <MapContainer center={center} zoom={11} className="h-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {festivals.length > 0 &&
            festivals.map((festival, index) => (
              <Marker
                key={index}
                position={[
                  festival.geocodage_xy.lat,
                  festival.geocodage_xy.lon,
                ]}
              >
                <Popup>
                  Nom du festival : {festival.nom_du_festival} <br></br>
                  Lieu : {festival.libelle_epci_collage_en_valeur}
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
