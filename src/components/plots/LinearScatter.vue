<template lang="pug">
.linear-scatter
  .actions
    button(:disabled="selectedDataset === 1", @click="selectDataSet(1)") Perfect Line
    button(:disabled="selectedDataset === 2", @click="selectDataSet(2)") Scattered Points
  #viz-linreg
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
  setup() {
    const selectedDataset = ref(1);
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

      const { svg: mySvg, xAxis: x, yAxis: y } = initScatter(
        "#viz-linreg",
        rangeX,
        rangeY
      );
      const d3Data = setUpD3Data(xTrain, yTrain);
      plotData(d3Data, mySvg, x, y);
      correlationValue.value = sLib.correlation(xTrain, yTrain);
    }

    onMounted(() => {
      selectDataSet(selectedDataset.value);
    });

    return { selectedDataset, selectDataSet, correlationValue };
  },
});
</script>

<style lang="sass" scoped>
.linear-scatter
  display: flex
  flex-direction: column

#viz-linreg
  margin: 36px 0

.actions
  button
    &:first-child
      margin-right: 12px

    &:disabled
      opacity: 0.4
      cursor: not-allowed
.correlation

</style>