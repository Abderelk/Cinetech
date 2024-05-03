import React from "react";
import MesRubriques from "../../components/mesRubriques/mesRubriques";
import { URL } from "../../../constant/api";

const MesaVoir = () => {
  return (
    <MesRubriques
      title="Mes films déjà vus"
      urlGet={URL.GET_VUES}
      urlRemove={URL.REMOVE_FROMRUBRIQUES}
      rubrique="dejaVu"
    />
  );
};

export default MesaVoir;
