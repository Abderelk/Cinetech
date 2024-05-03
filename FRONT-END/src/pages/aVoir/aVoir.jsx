import React from "react";
import MesRubriques from "../../components/mesRubriques/mesRubriques";

import { URL } from "../../../constant/api";

const MesAVoir = () => {
  return (
    <MesRubriques
      title="Mes films à voir"
      urlRemove={URL.REMOVE_FROMRUBRIQUES}
      rubrique="aVoir"
    />
  );
};

export default MesAVoir;
