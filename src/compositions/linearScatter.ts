import * as d3 from 'd3';
import { D3Data } from '@/typings/d3';

/**
 * Setup two array for x and y values to form one object.
*/
export function setUpD3Data(xData: number[], yData: number[]): D3Data {
  const d3Data: D3Data = [];

  for (let i = 0; i < xData.length; i++) {
    d3Data.push({ x: xData[i], y: yData[i] });
  }
  return d3Data;
}

/**
     * Init the scatterplot with the axis for the given ranges.
     */
export function initScatter(domQuery: string, rangeX: number[], rangeY: number[]) {
  const margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  const svg = d3
    .select(domQuery)
    .append("svg")
    .attr("class", "lin-svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  // Add X axis
  const xAxis = d3.scaleLinear().domain(rangeX).range([0, width]);
  svg
    .append("g")
    .style("font-size", "12px")
    .style("font-family", "Epilogue, sans-serif")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xAxis));

  // Add Y axis
  const yAxis = d3.scaleLinear().domain(rangeY).range([height, 0]);
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
export function plotData(data: D3Data, d3Selection: any, xScale: any, yScale: any) {
  d3Selection
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("class", "train-dots")
    .attr("cx", (d: { x: number; y: number }) => xScale(d.x))
    .attr("cy", (d: { x: number; y: number }) => yScale(d.y))
    .attr("r", 3);
}