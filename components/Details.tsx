import { OlliVisSpec, olli } from "olli";
import React from "react";
import { penguinSpec } from "@/penguins";
import { ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/solid";
// @ts-ignore
import { VegaLiteAdapter } from "olli-adapters";
import { View, Warn, parse } from "vega";
import data from "vega-datasets";
import { compile, TopLevelSpec } from "vega-lite";
import { useOlli } from "@/hooks/useOlli";

export default function Details() {
  const [showTree, setShowTree] = React.useState(false);
  const [showVega, setShowVega] = React.useState(false);

  const [spec, setSpec] = React.useState<TopLevelSpec>();
  const [dataset, setDataset] = React.useState<any[]>([]);

  const vegaRef = React.useRef<HTMLDivElement>(null);
  const olliRef = useOlli(spec);

  React.useEffect(() => {
    const fetchData = async () => {
      const penguins = await data["penguins.json"]();
      setDataset(penguins);
      setSpec(penguinSpec(penguins));
    };

    fetchData();
  }, []);

  React.useEffect(() => {
    if (!olliRef.current || !vegaRef.current || !spec) return;
    const vegaSpec = compile(spec).spec;
    const runtime = parse(vegaSpec);

    new View(runtime)
      .logLevel(Warn)
      .initialize(vegaRef.current)
      .renderer("svg")
      .hover()
      .run();
  }, [dataset, spec]);

  return (
    <div className="flex flex-col gap-4 mt-8">
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
        ref={olliRef}
        className={` prose ${showTree ? "visible" : "hidden"}`}
      />
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
    </div>
  );
}
