<template lang="pug">
.linear-regression
  h3 GOAL: Fit a line that has the <i>minimal distance</i> between every given point in a <a href="https://learningstatisticswithr.com/book/lsr_files/figure-html/regression1a-1.png" target="_blank" rel="noopener noreferrer">scatter plot</a>.
  .content
    .definitions
      dl.definition-card
        dt
          h4 Regression line equation (in ML-Style)
        dd y = b + w · x
      dl.definition-card
        dt
          h4 Defninitions
        dd y = label (output for the input)
        dd b = bias (y-intercept)
        dd w = weight (slope)
        dd x = feature (input variable)
    #viz-linreg
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import useHelloWorld from "@/compositions/helloWorld";
import * as d3 from "d3";

export default defineComponent({
  name: "LinearRegression",
  components: {},
  setup() {
    let mySvg: any;
    const rangeX: number[] = [0, 7];
    const rangeY: number[] = [0, 140000];
    const xTrain: number[] = [1, 2, 3, 4, 5, 6, 7];
    const yTrain: number[] = [
      20000,
      40000,
      60000,
      80000,
      100000,
      120000,
      140000,
    ];
    let d3Data: { x: number; y: number }[] = [];
    let x: any;
    let y: any;

    const { myCFunctionString } = useHelloWorld("TEST PARAM");

    /**
     * Init the scatterplot with the axis for the given ranges.
     */
    function initScatter(domQuery: string, rangeX: number[], rangeY: number[]) {
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
      x = d3.scaleLinear().domain(rangeX).range([0, width]);
      svg
        .append("g")
        .style("font-size", "12px")
        .style("font-family", "Epilogue, sans-serif")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      y = d3.scaleLinear().domain(rangeY).range([height, 0]);
      svg
        .append("g")
        .style("font-size", "12px")
        .style("font-family", "Epilogue, sans-serif")
        .call(d3.axisLeft(y));

      return svg;
    }

    /**
     * Setup two array for x and y values to form one object.
     */
    function setUpD3Data(xData: number[], yData: number[]) {
      if (d3Data.length > 0) {
        d3Data = [];
      }

      for (let i = 0; i < xData.length; i++) {
        d3Data.push({ x: xData[i], y: yData[i] });
      }
    }

    /**
     * Plot the date to the svg.
     */
    function plotData(data: { x: number; y: number }[]) {
      mySvg
        .append("g")
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", "train-dots")
        .attr("cx", (d: { x: number; y: number }) => x(d.x))
        .attr("cy", (d: { x: number; y: number }) => y(d.y))
        .attr("r", 3);
    }

    onMounted(() => {
      mySvg = initScatter("#viz-linreg", rangeX, rangeY);
      setUpD3Data(xTrain, yTrain);
      plotData(d3Data);
    });

    return { myCFunctionString };
  },
});
</script>

<style lang="sass" scoped>
h3
  text-align: center

a
  text-decoration: underline
  color: white

  &:visited
    color: white

.content
  display: flex
  justify-content: space-around
  margin-top: 50px

dd:not(:last-child)
  margin-bottom: 4px
</style>