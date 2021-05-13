import React, { useRef, useEffect } from "react";
import uPlot from "uPlot";

import "uplot/dist/uPlot.min.css";

export type TimeSeriesProps = {
  options: uPlot.Options;
  data: uPlot.AlignedData;
  debug?: boolean;
};

export const TimeSeries = (props: TimeSeriesProps) => {
  const { options, data, debug = false } = props;
  const chartRef = useRef<uPlot | null>(null);
  const targetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chartRef.current = new uPlot(
      options,
      data,
      targetRef.current as HTMLDivElement,
    );
  }, [options, data]);

  return (
    <div>
      <div ref={targetRef}></div>
      {debug && (
        <code>
          <pre>
            {JSON.stringify(options, null, 2)}
            {JSON.stringify(data, null, 2)}
          </pre>
        </code>
      )}
    </div>
  );
};
