import React from "react";

import { TimeSeries } from "@cockroachlabs/ui-components";

import { 
  generateTimeSeries,
  QueryTimeSeriesResponse,
  AxisUnitType,
  convertuPlotOptions,
  convertuPlotData,
} from "../utils/timeseries";

export default {
  title: "TimeSeries",
  component: TimeSeries,
};


const response: QueryTimeSeriesResponse = {
  y_axis: {
    unit_type: AxisUnitType.COUNT,
    label: "Some Junk",
  },
  series: generateTimeSeries({ length: 10, minTime: 0, maxTime: 20 }),
};

const options = {
  height: 700,
  width: 1000,
  ...convertuPlotOptions(response),
};
const data = convertuPlotData(response);

export const Demo = () => (
  <section>
    <h1>TimeSeries Demo here</h1>
    <TimeSeries data={data} options={options} debug={true} />
  </section>
)
