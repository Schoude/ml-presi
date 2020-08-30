<template lang="pug">
.linear-scatter
  #viz-linreg
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import {
  setUpD3Data,
  initScatter,
  plotData,
} from "@/compositions/linearScatter";
export default defineComponent({
  name: "LinearScatter",
  setup() {
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

    onMounted(() => {
      const { svg: mySvg, xAxis: x, yAxis: y } = initScatter(
        "#viz-linreg",
        rangeX,
        rangeY
      );
      const d3Data = setUpD3Data(xTrain, yTrain);
      plotData(d3Data, mySvg, x, y);
    });
  },
});
</script>

<style lang="sass" scoped>
.linear-scatter
</style>