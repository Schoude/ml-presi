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
      hr
      .model-params
        div y': {{ yHatDisplay }}
        div weight: {{ weightDisplay }}
        div bias: {{ biasDisplay }}
        .actions
          button Fit line (1x)
          button Fit line (100x)
        div(v-show="lossDisplay != null") loss (error): {{ lossDisplay }}
    LinearScatter(
      @data-changed="onDataChanged",
      :weight="weight",
      :bias="bias",
      :y1Hat="y1Hat"
      :y2Hat="y2Hat"
    )
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

import LinearScatter from "@/components/plots/LinearScatter.vue";
import { D3Data } from "@/typings/d3";

export default defineComponent({
  name: "LinearRegression",
  components: { LinearScatter },
  setup() {
    const yHat = ref(0);
    const yHatDisplay = ref(0);
    const y1Hat = ref(0);
    const y2Hat = ref(0);
    const weight = ref(0);
    const weightDisplay = ref(0);
    const bias = ref(0);
    const biasDisplay = ref(0);
    const lossDisplay = ref(null);
    let d3Data: D3Data = [];

    function onDataChanged(data: D3Data) {
      d3Data = data;
      console.log(d3Data);
    }

    return {
      yHatDisplay,
      weightDisplay,
      biasDisplay,
      lossDisplay,
      onDataChanged,
      weight,
      bias,
      yHat,
      y1Hat,
      y2Hat
    };
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

.definitions
  width: 33%

dd:not(:last-child)
  margin-bottom: 4px

.definitions
  div
    margin-top: 8px

.model-params
  .actions
    margin-top: 8px
    display: flex
    justify-content: space-between

    button
      width: 45%
</style>