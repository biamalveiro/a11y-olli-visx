import ParentSize from "@visx/responsive/lib/components/ParentSizeModern";
import dynamic from "next/dynamic";

const Details = dynamic(() => import("@/components/Details"), { ssr: false });
const PenguinsChart = dynamic(() => import("@/components/PenguinsChart"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <div className="flex w-full min-h-screen justify-items-stretch">
        <div className=" basis-1/2 bg-slate-200">
          <div className="w-5/6 px-4 py-8 ml-auto lg:px-8 lg:py-12">
            <h1 className="mb-8 text-3xl font-medium text-slate-900 font-display">
              Olli Experiment
            </h1>
            <div className="prose-sm prose prose-slate">
              <span
                aria-label="a scientist"
                role="img"
                className="inline text-base me-2"
              >
                👩🏽‍🔬
              </span>
              <h4 className="inline">Experiment</h4>
              <p>
                This is a proof of concept for using{" "}
                <a href="https://github.com/mitvis/olli" target="_blank">
                  Olli
                </a>{" "}
                to generate an accessible text structure for a chart. The
                rendering of the chart is completely independent of the usage of
                Olli, in this case, we build the chart with{" "}
                <a href="https://airbnb.io/visx" target="_blank">
                  visx
                </a>
                .
              </p>
            </div>

            <Details />
          </div>
        </div>
        <div className="basis-1/2 bg-slate-800">
          <div className="w-5/6 px-4 py-8 my-[12vh] mr-auto lg:px-8 lg:py-12 text-slate-100">
            <h2 className="mb-4 text-2xl font-medium font-display">
              🐧 Penguins
            </h2>
            <div className=" w-full h-[60vh]">
              <ParentSize>
                {({ width, height }) => (
                  <PenguinsChart width={width} height={height} />
                )}
              </ParentSize>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
