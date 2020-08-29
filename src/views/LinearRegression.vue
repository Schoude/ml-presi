<template lang="pug">
.linear-regression
  h3 GOAL: Fit a line that has the <i>minimal distance</i> between every given point in a <a href="https://learningstatisticswithr.com/book/lsr_files/figure-html/regression1a-1.png" target="_blank" rel="noopener noreferrer">scatter plot</a>.
  .content
    .definitions
      dl.definition-card
        dt
          h4 Regression line equation (in ML-Style)
        dd y = b + w*x
      dl.definition-card
        dt
          h4 Defninitions
        dd y = label (output for the input)
        dd b = bias (y-intercept)
        dd w = weight (slope)
        dd x = feature (input variable)
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "LinearRegression",
  components: {},
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

dd:not(:last-child)
  margin-bottom: 4px
</style>