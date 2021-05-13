// Types

export enum AxisUnitType {
  UNSPECIFIED = 0,
  COUNT = 1,
  BYTES = 2,
  DURATION = 3,
  PERCENTAGE = 4,
};
export enum Resolution {
  UNSPECIFIED = 0,
  RESOLUTION_10S = 1,
  RESOLUTION_30M = 2,
};
export type ChartAxis = {
  unit_type: AxisUnitType;
  label: string;
};
export type TimeSeries = {
  label: string;
  time_millis: number[];
  values: number[];
};
export type QueryTimeSeriesResponse = {
  y_axis: ChartAxis;
  series: TimeSeries[];
  next_poll_start_millis?: number[];
  poll_resolution?: Resolution;
};

export type randomOptions = {
  min?: number,
  max?: number,
  floor?: boolean,
};
export type generateDatePointsOptions = {
  maxLength?: number,
  minNanos?: number,
  maxNanos?: number,
  minValue?: number,
  maxValue?: number,
};
export type timeSeriesOptions = {
  length?: number,
  minTime?: number,
  maxTime?: number,
  minValue?: number,
  maxValue?: number,
  randomTime?: boolean,
};
const timeSeriesDefaults = {
  labels: ['n1', 'n2', 'n3', 'n4', 'n5'],
  length: 25,
  minTime: 0,
  maxTime: 100,
  minValue: 0,
  maxValue: 50,
  randomTime: false,
};
const defaults = {
  randOpts: {
    min: 0,
    max: 100,
    floor: true,
  },
  genDataPoints: {
    maxLength: 1000,
    minNanos: 0,
    maxNanos: 1000000,
    minValue: 0,
    maxValue: 100,
  },
  timeseries: timeSeriesDefaults,
};

/**
 * 
 * @param opts - min (number), max (number), floor (boolean)
 * @returns random number
 */
export const rand = (opts?: randomOptions) => {
  const o = Object.assign(defaults.randOpts, opts);
  const rando = Math.random() * o.max;
  const num = o.min !== undefined && rando < o.min ? o.min : rando;
  return o.floor ? Math.floor(num) : num;
}  

// return an array of random length, given an optional max length
export const randArray = (maxLength = 100) => new Array(rand({ max: maxLength })).fill(null);

export const generateDataPoints = (options?: generateDatePointsOptions) => {
  const o = Object.assign(defaults.genDataPoints, options);
  const points = randArray(o.maxLength).map(point => ({
    timestamp_nanos: rand({ min: o.minNanos, max: o.maxNanos}),
    value: rand({ min: o.minValue, max: o.maxValue}),
  }));
  
  return points;
};

export const generateTimeSeries = (options?: timeSeriesOptions): TimeSeries[] => {
  const o = Object.assign(defaults.timeseries, options);
  const generateArray = (length: number, predicate: () => number) => new Array(length).fill(null).map(predicate);
  //const time_millis = new Array(30).fill(null).map(_ => rand({ min: o.minTime, max: o.maxTime }));
  const generateTimeMillis = (l: number) => generateArray(l, () => rand({ min: o.minTime, max: o.maxTime }));
  //const values = new Array(30).fill(null).map(_ => rand({ min: o.minValue, max: o.maxValue}));
  const generateValues = (l: number) => generateArray(l, () => rand({ min: o.minValue, max: o.maxValue}));
  
  return o.labels.map(label => ({
    label,
    time_millis: generateTimeMillis(o.length),
    values: generateValues(o.length),
  }));
};

const colors = ["blue", "gree", "aqua", "purple", "lawngreen", "lightcoral"];
const randomColor = () => colors[rand({ max: colors.length })];

export const convertuPlotOptions = (res: QueryTimeSeriesResponse) => {
  const scales = { x: { time: false }};
  const axes = [{ label: "X Axis"}, { label: "Y Axis" }];
  const series = res.series.map(s => ({
    show: true,
    label: s.label,
    spanGaps: true,
    stroke: randomColor(),
    points: {
      show: false,
    },
  }));
  
  return {
    scales,
    axes,
    series,
  };
};

export const convertuPlotData = ({ series }: QueryTimeSeriesResponse): uPlot.AlignedData => {
  const x = Array.from(new Set(series.flatMap(s => s.time_millis))).sort((a, b) => a - b);
  const y = series.map(
    s => x.map(
      (ts: number) => {
        // find the index of time value for the individual series among
        // the total list of time values
        const index = s.time_millis.indexOf(ts);
        // use that index to find the corresponding value,
        // otherwise return null
        return index < 0 ? null : s.values[index];
      }
    )
  );
  return [x, ...y];
}
