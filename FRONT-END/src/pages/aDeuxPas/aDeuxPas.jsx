import React, { useEffect } from "react";
import MapComponent from "../../components/map/map.jsx";
import { useContext } from "react";
import { AuthContext } from "../../../context/AuthContext.jsx";
import { UserContext } from "../../../context/UserContext.jsx";

const ADeuxPas = () => {
  const { userLocation, checkAuthStatus } = useContext(AuthContext);
  const { festivals } = useContext(UserContext);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  return (
    <div className="px-14 py-2 min-h-screen">
      <h2 className="text-3xl font-bold border-b-2 border-red inline-block my-5">
        À deux pas de chez vous !
      </h2>
      <div className="h-96 overflow-hidden">
        <MapComponent
          className="h-fit"
          location={userLocation}
          festivals={festivals}
        />
      </div>
    </div>
  );
};

export default ADeuxPas;
