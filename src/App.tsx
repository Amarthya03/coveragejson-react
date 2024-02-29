import { useEffect } from "react";
import L from "leaflet";

import * as CovJSON from "covjson-reader";
import * as LC from "leaflet-coverage";

import multipolygon from "./data/multipoygon.json";

function App() {
  useEffect(() => {
    const map = L.map("map").setView([18.52138147025615, 73.85539152532453], 7);
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 18,
    }).addTo(map);

    let layers = L.control.layers(null, null, { collapsed: false }).addTo(map);

    let layer;

    CovJSON.read(multipolygon)
      .then((cov) => {
        layer = LC.dataLayer(cov, { parameter: "temperature" })
          .on("afterAdd", () => {
            LC.legend(layer).addTo(map);
            map.fitBounds(layer.getBounds());
          })
          .addTo(map);
        layers.addOverlay(layer, "Temperature");
      })
      .catch((e) => {
        console.log(e);
      });

    return () => {
      map.off();
      map.remove();
    };
  });

  return (
    <div
      style={{
        width: "95vw",
        height: "95vh",
      }}
      id="map"
    ></div>
  );
}

export default App;
