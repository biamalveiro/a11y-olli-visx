import { olli, OlliVisSpec } from "olli";
// @ts-ignore
import { VegaLiteAdapter } from "olli-adapters";
import React from "react";
import { TopLevelSpec } from "vega-lite";

export const useOlli = (spec?: TopLevelSpec) => {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (spec) {
      VegaLiteAdapter(spec).then((olliVisSpec: OlliVisSpec) => {
        const olliRender = olli(olliVisSpec);
        console.log(olliVisSpec);
        if (ref.current) {
          ref.current?.replaceChildren(olliRender);
        }
      });
    }
  }, [spec]);

  return ref;
};
