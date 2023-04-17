import { TopLevelSpec } from "vega-lite";

export type Penguin = {
  "Flipper Length (mm)": number;
  "Body Mass (g)": number;
  Species: string;
};

export const penguinSpec = (dataset: Penguin[]): TopLevelSpec => ({
  $schema: "https://vega.github.io/schema/vega-lite/v5.json",
  description:
    "A scatterplot showing body mass and flipper lengths of penguins.",
  data: {
    values: dataset,
  },
  mark: "point",
  encoding: {
    x: {
      field: "Flipper Length (mm)",
      type: "quantitative",
      scale: { zero: false },
    },
    y: {
      field: "Body Mass (g)",
      type: "quantitative",
      scale: { zero: false },
    },
    color: { field: "Species", type: "nominal" },
    shape: { field: "Species", type: "nominal" },
  },
});

export const getFlipperLength = (d: Penguin) => d["Flipper Length (mm)"];
export const getBodyMass = (d: Penguin) => d["Body Mass (g)"];
export const getSpecies = (d: Penguin) => d["Species"];
