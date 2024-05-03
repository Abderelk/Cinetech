import React from "react";
import MesRubriques from "../../components/mesRubriques/mesRubriques";

import { URL } from "../../../constant/api";

const MesFavoris = () => {
  return (
    <MesRubriques
      title="Mes films favoris"
      urlGet={URL.GET_FAVORIS}
      urlRemove={URL.REMOVE_FROMRUBRIQUES}
      rubrique="favoris"
    />
  );
};

export default MesFavoris;
