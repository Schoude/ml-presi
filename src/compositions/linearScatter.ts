import * as d3 from 'd3';
import { D3Data } from '@/typings/d3';

let svg: any | null = null;
let xAxis: any | null = null;
let yAxis: any | null = null;
let d3Data: D3Data = []

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
  xAxis = d3.scaleLinear().domain([0, maxX]).range([0, width]);
  svg
    .append("g")
    .style("font-size", "12px")
    .style("font-family", "Epilogue, sans-serif")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xAxis));

  // Add Y axis
  const maxY = d3.max(d3Data, d => d.y) as number
  yAxis = d3.scaleLinear().domain([0, maxY]).range([height, 0]);
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
  svg
    .append("g")
    .selectAll("dot")
    .data(d3Data)
    .enter()
    .append("circle")
    .attr("class", "train-dots")
    .attr("cx", (d: { x: number; y: number }) => xAxis(d.x))
    .attr("cy", (d: { x: number; y: number }) => yAxis(d.y))
    .attr("r", 3);
}

export async function printPrediction(x: number, yHat: number) {
  if (document.querySelector('.predicted')) {
    document.querySelector('.predicted')!.remove();
  }

  svg
    .append("g")
    .append("circle")
    .attr("class", "predicted")
    .attr("cx", () => xAxis(x))
    .attr("cy", () => yAxis(yHat))
    .attr("r", 5)
    .style("fill", "#2ec72e");
}