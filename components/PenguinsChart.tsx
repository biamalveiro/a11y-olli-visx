import { AxisBottom, AxisLeft } from "@visx/axis";
import { bottomTickLabelProps } from "@visx/axis/lib/axis/AxisBottom";
import { leftTickLabelProps } from "@visx/axis/lib/axis/AxisLeft";
import { GlyphCircle, GlyphSquare, GlyphTriangle } from "@visx/glyph";
import { Group } from "@visx/group";
import { scaleLinear, scaleOrdinal } from "@visx/scale";
import { Text } from "@visx/text";
import { extent } from "d3-array";
import React from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import data from "vega-datasets";
import tailwindConfig from "../tailwind.config";
import { Grid } from "@visx/grid";
import { TopLevelSpec } from "vega-lite";
import {
  Penguin,
  getBodyMass,
  getFlipperLength,
  getSpecies,
  penguinSpec,
} from "@/penguins";
import { useOlli } from "@/hooks/useOlli";
const { theme } = resolveConfig(tailwindConfig) as any;

const MARGIN = { top: 20, right: 20, bottom: 40, left: 60 };

export default function PenguinsChart({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const [dataset, setDataset] = React.useState<Penguin[]>([]);
  const boundedWidth = React.useMemo(
    () => width - MARGIN.left - MARGIN.right,
    [width]
  );
  const boundedHeight = React.useMemo(
    () => height - MARGIN.top - MARGIN.bottom,
    [height]
  );
  const [spec, setSpec] = React.useState<TopLevelSpec>();
  const olli = useOlli(spec);

  React.useEffect(() => {
    const fetchData = async () => {
      const penguins = await data["penguins.json"]();
      const pSpec = penguinSpec(penguins);
      setDataset(penguins);
      setSpec(pSpec);
    };
    fetchData();
  }, []);

  const scaleX = React.useMemo(() => {
    return scaleLinear({
      domain: extent(dataset, getFlipperLength) as [number, number],
      range: [0, boundedWidth],
      zero: false,
      nice: true,
    });
  }, [dataset, boundedWidth]);

  const scaleY = React.useMemo(() => {
    return scaleLinear({
      domain: extent(dataset, getBodyMass) as [number, number],
      range: [boundedHeight, 0],
      zero: false,
      nice: true,
    });
  }, [dataset, boundedHeight]);

  const scaleColor = React.useMemo(() => {
    return scaleOrdinal({
      domain: dataset.map(getSpecies),
      range: [theme.colors.sky, theme.colors.amber, theme.colors.rose],
    });
  }, [dataset]);

  const scaleShape = React.useMemo(() => {
    return scaleOrdinal({
      domain: dataset.map(getSpecies),
      range: [GlyphCircle, GlyphSquare, GlyphTriangle],
    });
  }, [dataset]);

  return (
    <>
      <svg
        width={width}
        height={height}
        aria-label="A scatterplot showing body mass and flipper lengths of penguins. A scatterplot with axes 'Flipper Length (mm)' and 'Body Mass (g)'"
      >
        <Text
          x={MARGIN.left}
          dx={-5}
          dy={8}
          y={MARGIN.top}
          textAnchor="end"
          width={MARGIN.left}
          fontSize={10}
          verticalAnchor="end"
          className="fill-slate-400"
          aria-hidden
        >
          Body Mass (g)
        </Text>
        <Text
          x={MARGIN.left + boundedWidth}
          dx={-5}
          y={MARGIN.top + boundedHeight}
          dy={34}
          textAnchor="end"
          fontSize={10}
          verticalAnchor="end"
          className="fill-slate-400"
          aria-hidden
        >
          Flipper Length (mm)
        </Text>
        <Grid
          top={MARGIN.top}
          left={MARGIN.left}
          xScale={scaleX}
          yScale={scaleY}
          width={boundedWidth}
          height={boundedHeight}
          stroke={theme.colors.slate[700]}
          numTicksRows={5}
          numTicksColumns={5}
        />
        <g aria-label="Y-axis titled 'Body Mass (g)' for a quantitative scale with values from '3000' to '6000'">
          <AxisLeft
            scale={scaleY}
            top={MARGIN.top}
            left={MARGIN.left}
            tickLabelProps={() => {
              return {
                ...leftTickLabelProps,
                textAnchor: "end",
                fontSize: 10,
                font: "var(--font-inter)",
                fill: theme.colors.slate[400],
                verticalAnchor: "middle",
              };
            }}
            axisLineClassName="stroke-slate-600"
            numTicks={5}
          />
        </g>
        <g aria-label="X-axis titled 'Flipper Length (mm)' for a quantitative scale with values from '170' to '230'">
          <AxisBottom
            scale={scaleX}
            top={height - MARGIN.bottom}
            left={MARGIN.left}
            tickLabelProps={() => ({
              ...bottomTickLabelProps,
              fontSize: 10,
              font: "var(--font-inter)",
              fill: theme.colors.slate[400],
              textAnchor: "middle",
            })}
            axisLineClassName="stroke-slate-600"
            numTicks={5}
          />
        </g>
        <Group top={MARGIN.top} left={MARGIN.left}>
          {dataset.map((d, i) => {
            if (!getBodyMass(d) || !getFlipperLength(d)) return null;
            const Shape = scaleShape(getSpecies(d));
            return (
              <Shape
                key={i}
                left={scaleX(getFlipperLength(d))}
                top={scaleY(getBodyMass(d))}
                size={width * height * 0.0002}
                stroke={scaleColor(getSpecies(d))[500]}
                fill={scaleColor(getSpecies(d))[700]}
                fillOpacity={0.5}
                aria-label={`A ${getSpecies(
                  d
                )} penguin with a body mass of ${getBodyMass(
                  d
                )} grams and a flipper length of ${getFlipperLength(
                  d
                )} millimeters`}
                className="transition-opacity duration-200 cursor-pointer opacity-60 hover:opacity-100"
              />
            );
          })}
        </Group>
      </svg>
      <div className="flex gap-4 mt-4">
        {scaleColor.domain().map((species, i) => {
          const Shape = scaleShape(species);
          return (
            <div key={i} className="flex items-center">
              <svg width={28} height={28} className="ml-4">
                <Shape
                  fill={scaleColor(species)[700]}
                  stroke={scaleColor(species)[500]}
                  size={70}
                  top={14}
                  left={14}
                />
              </svg>
              <span className="text-sm text-slate-400">{species}</span>
            </div>
          );
        })}
      </div>
      <div ref={olli} className="sr-only" />
    </>
  );
}
