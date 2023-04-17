import data from "./barrierefreies-reisen.json";
import {
  pivotLonger,
  select,
  groupBy,
  tidy,
  totalIf,
  summarize,
  summarizeAt,
  count,
  sum,
  when,
  mutate,
} from "@tidyjs/tidy";

const toBoolean = (value: string | null) =>
  value ? value === "True" : undefined;

export const dataset = data.map((d) => ({
  name: d.stationsbezeichnung ?? "",
  didok: d.didok,
  visibility: d.visibility ? +d.visibility : undefined,
  last_edited: new Date(d.bearbeitet_am),
  mobilift: toBoolean(d.mobilift),
  folding_ramp: toBoolean(d.faltrampe),
  barrier_free_station: toBoolean(d.barrierefreier_bahnhof),
  sector: d.sektor_en ?? undefined,
  meeting_point: d.treffpunkt_en ?? undefined,
  pre_registration_deadline: d.voranmeldefrist_en ?? undefined,
  stair_free: toBoolean(d.treppenfrei),
  ramp: toBoolean(d.rampe),
  ramp_exception: d.ausnahme_zu_rampe_und_treppe_en ?? undefined,
  lift_platform: toBoolean(d.lift_zu_perron),
  lift_location: d.standort_zu_lift_en ?? undefined,
  tactile_safety_lines: toBoolean(d.taktile_sicherheitslinien),
  induction_amplifier: toBoolean(d.induktionsverstaerker),
  wheelchair: toBoolean(d.sbb_rollstuhl),
  wheelchair_ticket: toBoolean(d.rollstuhl_billet),
  wheelchair_wc: toBoolean(d.rollstuhl_wc),
  eurokey_wc: toBoolean(d.eurokey_wc),
  information: d.zusaetzliche_informationen_en ?? undefined,
  current: d.aktuell_en ?? undefined,
  forecast: d.prognose ? +d.prognose : undefined,
  status: d.status_bahnhof,
})) as Datum[];

export const features = [
  "mobilift",
  "folding_ramp",
  "stair_free",
  "ramp",
  // "lift_platform",
  "tactile_safety_lines",
  //  "induction_amplifier",
  "wheelchair",
  // "wheelchair_ticket",
  // "wheelchair_wc",
  //"eurokey_wc",
] as const;

type Feature = typeof features[number];

export const featureData = tidy(
  dataset,
  pivotLonger({
    cols: features,
    namesTo: "feature",
    valuesTo: "value",
  })
);

export const chartData = tidy(
  dataset,
  when(true, [
    mutate(
      features.reduce(
        (a, v) => ({
          ...a,
          [v]: (d: any) => (d[v] ? 1 : 0),
        }),
        {}
      )
    ),
    groupBy(
      "status",
      //@ts-ignore
      summarize(features.reduce((a, v) => ({ ...a, [v]: sum(v) }), {}))
    ),
  ])
);

export type FeatureDatum = Datum & { feature: Feature; value: boolean };

export type Datum = {
  name: string;
  didok: string;
  visibility?: number;
  last_edited: Date;
  mobilift: boolean;
  folding_ramp: boolean;
  barrier_free_station: boolean;
  sector?: string;
  meeting_point?: string;
  pre_registration_deadline?: string;
  stair_free: boolean;
  ramp: boolean;
  ramp_exception?: string;
  lift_platform?: string;
  lift_location?: string;
  tactile_safety_lines: boolean;
  induction_amplifier: boolean;
  wheelchair: boolean;
  wheelchair_ticket: boolean;
  wheelchair_wc: boolean;
  eurokey_wc: boolean;
  information?: string;
  current?: string;
  forecast?: string;
  status: string;
};
