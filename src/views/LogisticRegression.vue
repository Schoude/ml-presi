<template lang="pug">
.logistic-regression
  h1 TODO
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
    const [trainDs, validationDs] = createDatasets(
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

</style>