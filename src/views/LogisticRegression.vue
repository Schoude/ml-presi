<template lang="pug">
.logistic-regression
  .header
    h3 Prediction of a binary outcome
    img.lin-vs-log(src="../assets/lin-vs-log-reg.jpg")
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  loadCSVData,
  createDatasets,
} from "../compositions/logisticRegression";

import { KeyableObject } from "../typings/basic.d";

export default defineComponent({
  name: "LogisticRegression",
  async setup() {
    const data = (await loadCSVData()) as KeyableObject;
    console.log("raw data", data);
    const [trainData, validationDatal] = createDatasets(
      data,
      ["size", "rooms"],
      "sold",
      0.1,
      32
    );

    // log datasets
    // const trainVals = trainDs.take(10);
    // // xs: shape[32, 2] -> 32 = batchSize; 2 = number of features
    // // ys: shape[32, 2] -> 32 = batchSize; 2 = binary oneHot coding
    // trainVals.forEachAsync((v) => console.log(v));
  },
});
</script>

<style lang="sass" scoped>
.logistic-regression
  min-height: 100vh

.header
  display: flex
  flex-direction: column
  align-items: center

.lin-vs-log
  width: 150px
  transition: transform 0.3s ease, width 0.3s ease

  &:hover
    width: 700px
    transform: translateY(30px)
</style>