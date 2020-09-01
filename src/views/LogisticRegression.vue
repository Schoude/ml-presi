<template lang="pug">
.logistic-regression
  .header
    h3 Prediction of a binary outcome
    img.lin-vs-log(src="../assets/lin-vs-log-reg.jpg")
  .content
    button(@click="trainModel") Train Model
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount } from "vue";
import {
  loadCSVData,
  createDatasets,
} from "../compositions/logisticRegression";

import { KeyableObject } from "../typings/basic.d";
import * as tf from "@tensorflow/tfjs";

export default defineComponent({
  name: "LogisticRegression",
  async setup() {
    const logModel = tf.sequential();
    onBeforeUnmount(() => {
      logModel.dispose();
    });
    const data = (await loadCSVData()) as KeyableObject;

    const [trainData, validationData] = createDatasets(
      data,
      // ["size", "rooms"],
      ["size"],
      "sold",
      0.1,
      32
    );

    /**
     * Utilizes Softmax Regression to adjust the weights as activation models.
     * Suitable for a logistic regression model.
     *
     * optimizer = tf.train.adam()
     * loss fn = 'binaryCrossentropy'
     */
    async function trainLogisticRegression(
      featureCount: number
      // trainData: any,
      // validationData: any
    ) {
      // add layers to model
      logModel.add(
        tf.layers.dense({
          // because of "oneHot" encoding
          units: 2,
          activation: "softmax",
          inputShape: [featureCount],
        })
      );

      // compile the mode
      logModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: "binaryCrossentropy",
        metrics: ["accuracy"],
      });
    }

    /**
     * Train the model with then training data and the validation data.
     */
    async function trainModel() {
      await logModel.fitDataset(trainData, {
        epochs: 10,
        validationData: validationData,
      });
      console.log("done training");
      console.log(tf.memory().numTensors);
    }

    await trainLogisticRegression(1);
    // logModel.summary();
    return { trainModel };
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