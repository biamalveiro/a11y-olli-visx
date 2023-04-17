import { OlliVisSpec, olli } from "olli";
import React from "react";
import { penguinSpec } from "@/penguins";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
// @ts-ignore
import { VegaLiteAdapter } from "olli-adapters";
import { View, Warn, parse } from "vega";
import data from "vega-datasets";
import { compile } from "vega-lite";

export default function Details() {
  const olliRef = React.useRef<HTMLDivElement>(null);
  const vegaRef = React.useRef<HTMLDivElement>(null);
  const [dataset, setDataset] = React.useState<any[]>([]);
  const [showTree, setShowTree] = React.useState(false);
  const [showVega, setShowVega] = React.useState(false);

  React.useEffect(() => {
    const fetchData = async () => {
      const penguins = await data["penguins.json"]();
      setDataset(penguins);
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    if (!olliRef.current || !vegaRef.current) return;
    const spec = penguinSpec(dataset);
    const vegaSpec = compile(spec).spec;
    const runtime = parse(vegaSpec);

    new View(runtime)
      .logLevel(Warn)
      .initialize(vegaRef.current)
      .renderer("svg")
      .hover()
      .run();

    VegaLiteAdapter(spec).then((olliVisSpec: OlliVisSpec) => {
      const olliRender = olli(olliVisSpec);
      olliRef.current?.replaceChildren(olliRender);
    });
  }, [dataset]);

  return (
    <div className="flex flex-col gap-4 mt-8">
      <button
        onClick={() => setShowVega((s) => !s)}
        className="flex items-center gap-2 underline text-slate-800 hover:text-slate-700"
      >
        {showVega ? (
          <ChevronUpIcon aria-hidden className="w-5 h-5" />
        ) : (
          <ChevronDownIcon aria-hidden className="w-5 h-5" />
        )}
        Vega Chart
      </button>
      <div
        id="vega-container"
        ref={vegaRef}
        className={` ${showVega ? "visible" : "hidden"}`}
      />
      <button
        onClick={() => setShowTree((s) => !s)}
        className="flex items-center gap-2 underline text-slate-800 hover:text-slate-700"
      >
        {showTree ? (
          <ChevronUpIcon aria-hidden className="w-5 h-5" />
        ) : (
          <ChevronDownIcon aria-hidden className="w-5 h-5" />
        )}
        Olli Tree
      </button>
      <div
        id="olli-container"
        ref={olliRef}
        className={` prose ${showTree ? "visible" : "hidden"}`}
      />
    </div>
  );
}
