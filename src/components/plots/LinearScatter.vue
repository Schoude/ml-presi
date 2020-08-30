<template lang="pug">
.linear-scatter
  .actions
    button(:disabled="selectedDataset === 1", @click="selectDataSet(1)") Perfect Line
    button(:disabled="selectedDataset === 2", @click="selectDataSet(2)") Scattered Points
  #viz-linreg
  button(@click="drawRegressionLine") drawRegressionLine
  span.correlation(v-show="correlationValue") Pairwise correlation between x and y: {{ correlationValue }}
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import {
  setUpD3Data,
  initScatter,
  plotData,
} from "@/compositions/linearScatter";
import StatsLib from "@/statslib/index";

export default defineComponent({
  name: "LinearScatter",
  props: {
    weight: {
      type: Number,
    },
    bias: {
      type: Number,
    },
    y1Hat: {
      type: Number,
    },
    y2Hat: {
      type: Number,
    },
  },
  setup(props, context) {
    const selectedDataset = ref(1);
    let svgData: any;
    const rangeX: number[] = [0, 7];
    const rangeY: number[] = [0, 140000];
    let xTrain: number[] = [];
    let yTrain: number[] = [];
    const sLib = new StatsLib();
    const correlationValue = ref(0);

    function selectDataSet(dataSetId: number) {
      if (document.querySelector("svg")) {
        document.querySelector("svg")?.remove();
      }

      if (dataSetId === 1) {
        xTrain = [1, 2, 3, 4, 5, 6, 7];
        yTrain = [20000, 40000, 60000, 80000, 100000, 120000, 140000];
        selectedDataset.value = dataSetId;
      } else if (dataSetId === 2) {
        xTrain = [1, 2.5, 3.7, 4.2, 5.3, 6.9, 8];
        yTrain = [10000, 85000, 108000, 55000, 94000, 99000, 140000];
        selectedDataset.value = dataSetId;
      }

      svgData = initScatter("#viz-linreg", rangeX, rangeY);
      const d3Data = setUpD3Data(xTrain, yTrain);
      console.log(d3Data);
      plotData(d3Data, svgData.svg, svgData.xAxis, svgData.yAxis);
      correlationValue.value = sLib.correlation(xTrain, yTrain);
      context.emit("data-changed", d3Data);
    }

    function drawRegressionLine() {
      if (document.querySelector(".regression-line")) {
        document.querySelector(".regression-line")?.remove();
      }
      const x1 = 0;
      const x2 = 10;

      svgData.svg
        .append("line")
        .attr("x1", svgData.xAxis(x1))
        .attr("y1", svgData.yAxis(props.y1Hat))
        .attr("x2", svgData.xAxis(x2))
        .attr("y2", svgData.yAxis(props.y2Hat))
        .attr("stroke", "teal")
        .attr("stroke-width", 4)
        .attr("class", "regression-line");
    }

    onMounted(() => {
      selectDataSet(selectedDataset.value);
    });

    return {
      selectedDataset,
      selectDataSet,
      correlationValue,
      drawRegressionLine,
    };
  },
});
</script>

<style lang="sass" scoped>
.linear-scatter
  display: flex
  flex-direction: column

#viz-linreg
  margin: 30px 0

.actions
  button
    &:first-child
      margin-right: 12px

    &:disabled
      opacity: 0.4
      cursor: not-allowed

.correlation
  margin-top: 30px
</style>