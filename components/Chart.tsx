import { Datum, arrange, desc, pivotLonger, tidy } from "@tidyjs/tidy";
import { AxisLeft } from "@visx/axis";
import { leftTickLabelProps } from "@visx/axis/lib/axis/AxisLeft";
import { Group } from "@visx/group";
import { PatternLines, PatternWaves } from "@visx/pattern";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Bar, BarGroupHorizontal, Line } from "@visx/shape";
import { Text } from "@visx/text";
import { max } from "d3-array";
import React, { useMemo } from "react";
import resolveConfig from "tailwindcss/resolveConfig";
import { chartData as dataset, features } from "../assets/data";
import tailwindConfig from "../tailwind.config";

const { theme } = resolveConfig(tailwindConfig) as any;

const chartData = dataset.filter((d) => d.status !== null);
const status = chartData.map((d: Datum) => d.status);
const featuresDomain = tidy(
  [chartData[0]],
  pivotLonger({ cols: features, namesTo: "feature", valuesTo: "value" }),
  arrange([desc("value")])
).map((d) => d.feature);

const statusScale = scaleBand({
  domain: status,
  padding: 0.2,
});

const featureScale = scaleBand({
  domain: featuresDomain,
  padding: 0.1,
});

const lengthScale = scaleLinear<number>({
  domain: [
    0,
    // @ts-ignore
    max(features.map((f) => max(chartData, (d: Datum) => d[f] as number))),
  ],
});

const statusColorScale = scaleOrdinal({
  domain: status,
  range: [
    theme.colors.teal[500],
    theme.colors.rose[500],
    theme.colors.amber[500],
  ],
});

const featureColorScale = scaleOrdinal({
  domain: featuresDomain as unknown as string[],
  range: [
    theme.colors.blue[300],
    theme.colors.orange[300],
    theme.colors.teal[300],
    theme.colors.pink[300],
    theme.colors.lime[300],
    theme.colors.purple[300],
  ],
});

const MARGIN = { top: 40, right: 0, bottom: 40, left: 100 };

export default function Chart({
  width,
  height,
}: {
  width: number;
  height: number;
}) {
  const boundedHeight = useMemo(
    () => height - MARGIN.top - MARGIN.bottom,
    [height]
  );
  const boundedWidth = useMemo(
    () => width - MARGIN.left - MARGIN.right,
    [width]
  );

  statusScale.rangeRound([0, boundedHeight]);
  featureScale.rangeRound([0, statusScale.bandwidth()]);
  lengthScale.rangeRound([0, boundedWidth]);

  return (
    <svg width={width} height={height}>
      {featuresDomain.map((f, i) => {
        const Pattern = Patterns[i];
        return <Pattern key={i} id={f} color={featureColorScale(f)} />;
      })}
      <Group top={MARGIN.top} left={MARGIN.left}>
        <BarGroupHorizontal
          data={chartData}
          keys={features as unknown as string[]}
          width={boundedWidth}
          y0={(d) => d.status}
          y0Scale={statusScale}
          y1Scale={featureScale}
          xScale={lengthScale}
          color={featureColorScale}
        >
          {(barGroups) => {
            console.log(barGroups);
            return barGroups.map((barGroup) => (
              <Group
                key={`bar-group-${barGroup.index}-${barGroup.y0}`}
                top={barGroup.y0}
              >
                <AxisLeft
                  scale={featureScale}
                  top={0}
                  left={0}
                  hideAxisLine
                  tickLabelProps={(v) => {
                    return {
                      ...leftTickLabelProps,
                      textAnchor: "end",
                      fontSize: 10,
                      font: "var(--font-inter)",
                      fill: featureColorScale(v),
                    };
                  }}
                />
                <Line
                  x1={0}
                  x2={boundedWidth}
                  y1={-4}
                  y2={-4}
                  className=" stroke-slate-500"
                />
                <Text
                  x={boundedWidth}
                  textAnchor="end"
                  className="text-sm fill-slate-500"
                  verticalAnchor="end"
                  dy={-8}
                >
                  {statusScale.domain()[barGroup.index]}
                </Text>
                {barGroup.bars.map((bar) => (
                  <Group key={`bar-${barGroup.index}-${bar.index}-${bar.key}`}>
                    <Bar
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      opacity={1}
                      fill={`url(#${features[bar.index]})`}
                    />
                    <Bar
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      opacity={0.4}
                      fill={featureColorScale(features[bar.index])}
                    />
                  </Group>
                ))}
              </Group>
            ));
          }}
        </BarGroupHorizontal>
      </Group>
    </svg>
  );
}

const Patterns: React.FC<{ id: string; color: string }>[] = [
  ({ id, color }) => (
    <PatternLines
      id={id}
      height={4}
      width={4}
      stroke={color}
      strokeWidth={1.5}
      orientation={["diagonalRightToLeft"]}
    />
  ),
  ({ id, color }) => (
    <PatternLines
      id={id}
      height={4}
      width={4}
      stroke={color}
      strokeWidth={1.5}
    />
  ),
  ({ id, color }) => (
    <PatternLines
      id={id}
      height={4}
      width={4}
      stroke={color}
      strokeWidth={1}
      orientation={["vertical", "horizontal"]}
    />
  ),
  ({ id, color }) => (
    <PatternWaves
      id={id}
      height={5}
      width={5}
      fill="transparent"
      stroke={color}
      strokeWidth={1}
    />
  ),

  ({ id, color }) => (
    <PatternLines
      id={id}
      height={5}
      width={5}
      stroke={color}
      strokeWidth={0.5}
      orientation={["diagonal"]}
    />
  ),
  ({ id, color }) => (
    <PatternLines
      id={id}
      height={4}
      width={4}
      stroke={color}
      strokeWidth={1.5}
      orientation={["horizontal"]}
    />
  ),
];
