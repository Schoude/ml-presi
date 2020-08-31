import * as d3 from 'd3';
import * as Papa from "papaparse";
import { D3Data } from '@/typings/d3';

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
    Papa.parse("http://localhost:8081/csv/unit-data-dummy.csv", {
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
    .attr("class", "lin-svg")
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