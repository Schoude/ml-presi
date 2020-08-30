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
    .attr("r", 3).on("mouseover", function (e: MouseEvent, d: { x: number; y: number }) {
      return tooltip
        .style("visibility", "visible")
        .style("top", e.clientY - 25 + "px")
        .style("left", e.clientX + 20 + "px")
        .html(`x = ${d.x}<br>y = ${d.y}`);
    })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });
}

export async function printPrediction(x: number, yHat: number) {
  if (document.querySelector('.prediction')) {
    document.querySelector('.prediction')!.remove();
  }
  if (document.querySelector('.predicted')) {
    document.querySelector('.predicted')!.remove();
  }

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip prediction")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

  svg
    .append("g")
    .append("circle")
    .attr("class", "predicted")
    .attr("cx", () => xAxis(x))
    .attr("cy", () => yAxis(yHat))
    .attr("r", 5)
    .style("fill", "#2ec72e").on("mouseover", (e: MouseEvent) => {
      return tooltip
        .style("visibility", "visible")
        .style("top", e.clientY - 25 + "px")
        .style("left", e.clientX + 20 + "px")
        .html(
          `x = ${x}<br>y' = ${yHat.toFixed(2)}`
        )
    })
    .on("mouseout", () => tooltip.style("visibility", "hidden"));
}

export function drawRegressionLine(y1Hat: number, y2Hat: number, weight: number, bias: number) {
  if (document.querySelector('.line')) {
    document.querySelector('.line')!.remove();
  }

  if (document.querySelector(".regression-line")) {
    document.querySelector(".regression-line")?.remove();
  }
  const x1 = 0;
  const x2 = 10;

  const tooltip = d3
    .select("body")
    .append("div")
    .attr("class", "tooltip line")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden");

  svg
    .append("line")
    .attr("x1", xAxis(x1))
    .attr("y1", yAxis(y1Hat))
    .attr("x2", xAxis(x2))
    .attr("y2", yAxis(y2Hat))
    .attr("stroke", "teal")
    .attr("stroke-width", 4)
    .attr("class", "regression-line").on("mouseover", (e: MouseEvent) => {
      return tooltip
        .style("visibility", "visible")
        .style("top", e.clientY - 25 + "px")
        .style("left", e.clientX + 20 + "px")
        .html(
          `y' = ${bias.toFixed(2)} + ${weight.toFixed(
            2
          )} · x`
        );
    })
    .on("mouseout", function () {
      return tooltip.style("visibility", "hidden");
    });
}