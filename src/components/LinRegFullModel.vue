<template lang="pug">
.lin-reg-full-model
  .model
    h3 Model Data goes here
  .plot
    #my-lin-regfull-model
    span.correlation(v-show="correlationValue") Pairwise correlation between x and y: {{ correlationValue }} (n = {{ n }})
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import {
  getData,
  setUpD3Data,
  initScatter,
  plotData,
} from "../compositions/linearRegressionFullModel";
import StatsLib from "@/statslib/index";

export default defineComponent({
  name: "LinRegFullModel",
  async setup() {
    const sLib = new StatsLib();
    const correlationValue = ref(0);
    const n = ref(0);

    onMounted(async () => {
      initScatter("#my-lin-regfull-model");
      plotData();
    });
    const { size, price } = await getData();
    setUpD3Data(size, price);
    n.value = size.length;
    correlationValue.value = sLib.correlation(size, price);

    return { correlationValue, n };
  },
});
</script>

<style lang="sass" scoped>
.lin-reg-full-model
  display: flex
  margin-bottom: 50px
  
  .model
    flex: 1 0 50%

#my-lin-regfull-model
  margin: 30px 0
</style>