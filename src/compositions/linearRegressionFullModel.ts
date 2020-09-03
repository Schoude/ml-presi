import * as d3 from 'd3';
import * as Papa from "papaparse";
import * as tf from "@tensorflow/tfjs";
import { D3Data } from '@/typings/d3';
import { Rank } from '@tensorflow/tfjs';
import { KeyableObject } from '@/typings/basic';

interface FullModelData {
  size: number[];
  price: number[];
  rooms: number[];
  sold: number[];
}

let svg: any | null = null;
let xAxis: any | null = null;
let yAxis: any | null = null;
let d3Data: D3Data = []

/**
 * Helper function that asynchronously returns the csv data in a formated manner.
 */
async function loadCSVData(): Promise<{ [key: string]: any }> {
  let headers: string[] = [];
  const returnObject: { [key: string]: any } = {};
  return new Promise((resolve) => {
    let csvUrl = 'https://mlforshowandtell.tk/csv/unit-data-dummy.csv';
    if (process.env.NODE_ENV == 'development') {
      csvUrl = "http://localhost:8081/csv/unit-data-dummy.csv" as string;
    }

    Papa.parse(csvUrl, {
      download: true,
      dynamicTyping: true,
      complete: ({ data }: { data: string[] }) => {
        headers = data.splice(0, 1).flatMap((entry) => entry)
        headers.forEach(header => {
          returnObject[header] = [];
        })
        data.forEach((row) => {
          for (let i = 0; i < row.length; i++) {
            returnObject[headers[i]].push(row[i]);
          }
        });
        resolve(returnObject)
      },
    });
  })
}

/**
 * Returns size and price data. (for now)
 */
export async function getData() {
  const data = await loadCSVData() as FullModelData;
  const { size, price } = data;
  return { size, price }
}

/**
 * Helper function that asynchronously returns the csv data.
 * Each row is an object with the headers as the keys and the values as the values.
 */
export async function loadCSVDataFromUrl(csvUrl: string): Promise<object[]> {
  return new Promise((resolve) => {
    Papa.parse(csvUrl, {
      download: true,
      dynamicTyping: true,
      header: true,
      complete: ({ data }: { data: object[] }) => {
        resolve(data)
      },
    });
  })
}

function oneHot(value: any, valueCount: number): number[] {
  return Array.from(tf.oneHot([value], valueCount).dataSync())
}

/**
 * Normalizes the values of Tensor with a simple min-max normalization to values between 0 and 1.
 * Is more like a rescaling rather than a standardization (i.e. z-transformation).
 */
export function normalizeMinMax(tensor: tf.Tensor<Rank>) {
  return tf.div(
    tf.sub(tensor, tf.min(tensor)),
    tf.sub(tf.max(tensor), tf.min(tensor)),
  )
}


const CATEGORY_COUNT: { [key: string]: any } = {
  sold: 2
};

export function createDatasetsLinearRegression(data: { [key: string]: any }[], features: string[], label: string, testSize: number, categoricalFeatures?: Set<any>) {
  const feturesValues: string | number[][] = data.map(row => features.flatMap(feature => {
    if (categoricalFeatures?.has(feature)) {
      return oneHot(!row[feature] ? 0 : row[feature], CATEGORY_COUNT[feature])
    }
    return !row[feature] ? 0 : row[feature];
  }));

  const feturesValuesTensors = normalizeMinMax(tf.tensor2d(feturesValues));
  const labelValuesTensors = tf.tensor(data.map(row => !row[label] ? 0 : row[label]))

  const splitIndex = Math.round(((1 - testSize) * data.length));

  const [xTrain, xTest] = tf.split(feturesValuesTensors, [splitIndex, data.length - splitIndex]);
  const [yTrain, yTest] = tf.split(labelValuesTensors, [splitIndex, data.length - splitIndex]);

  return [xTrain, xTest, yTrain, yTest];
}

/**
 * Setup two array for x and y values to form one object.
*/
export function setUpD3Data(xData: number[], yData: number[]) {
  d3Data = [];

  for (let i = 0; i < xData.length; i++) {
    d3Data.push({ x: xData[i], y: yData[i] });
  }
}

/**
 * Init the scatterplot with the axis for the given ranges.
 */
export function initScatter(domQuery: string) {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  svg = d3
    .select(domQuery)
    .append("svg")
    .attr("class", "lin-full-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  const maxX = d3.max(d3Data, d => d.x) as number;
  xAxis = d3.scaleLinear().domain([40, maxX]).range([0, width]);
  svg
    .append("g")
    .style("font-size", "12px")
    .style("font-family", "Epilogue, sans-serif")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xAxis));

  const maxY = d3.max(d3Data, d => d.y) as number
  yAxis = d3.scaleLinear().domain([250000, maxY]).range([height, 0]);
  svg
    .append("g")
    .style("font-size", "12px")
    .style("font-family", "Epilogue, sans-serif")
    .call(d3.axisLeft(yAxis));

  return { svg, xAxis, yAxis };
}

/**
* Plot the date to the svg.
*/
export function plotData() {
  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

  svg
    .append("g")
    .selectAll("dot")
    .data(d3Data)
    .enter()
    .append("circle")
    .attr("class", "train-dots")
    .attr("cx", (d: { x: number; y: number }) => xAxis(d.x))
    .attr("cy", (d: { x: number; y: number }) => yAxis(d.y))
    .attr("r", 3)
    .on("mouseover", function (e: MouseEvent, d: { x: number; y: number }) {
      return tooltip
        .style("visibility", "visible")
        .style("top", e.clientY + window.scrollY - 25 + "px")
        .style("left", e.clientX - 120 + "px")
        .html(`x = ${d.x}<br>y = ${d.y}`);
    })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });
}

export async function printPrediction(x: number, yHat: number) {
  if (document.querySelector('.prediction-full')) {
    document.querySelector('.prediction-full')!.remove();
  }
  if (document.querySelector('.predicted-full')) {
    document.querySelector('.predicted-full')!.remove();
  }

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip prediction-full")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

  svg
    .append("g")
    .append("circle")
    .attr("class", "predicted-full")
    .attr("cx", () => xAxis(x))
    .attr("cy", () => yAxis(yHat))
    .attr("r", 5)
    .style("fill", "#2ec72e").on("mouseover", (e: MouseEvent) => {
      return tooltip
        .style("visibility", "visible")
        .style("top", e.clientY + window.scrollY - 25 + "px")
        .style("left", e.clientX - 130 + "px")
        .html(
          `x = ${x}<br>y' = ${yHat.toFixed(2)}`
        )
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));
}

export function drawRegressionLine(x1: number, x2: number, y1Hat: number, y2Hat: number) {
  if (document.querySelector(".regression-line-full")) {
    document.querySelector(".regression-line-full")?.remove();
  }

  svg
    .append("line")
    .attr("x1", xAxis(x1))
    .attr("y1", yAxis(y1Hat))
    .attr("x2", xAxis(x2))
    .attr("y2", yAxis(y2Hat))
    .attr("stroke", "teal")
    .attr("stroke-width", 3)
    .attr("class", "regression-line-full")
    .lower();
}