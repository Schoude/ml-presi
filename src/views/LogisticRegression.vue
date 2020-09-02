<template lang="pug">
.logistic-regression
  .header
    h3 Prediction of a binary outcome: is a unit <u>sold</u> or not based on the <u>number of rooms</u>?
    img.lin-vs-log(src="../assets/lin-vs-log-reg.jpg")
  .content
    button(@click="trainModel", :disabled="isTraining") Train Model
    .viz(v-if="isTraining || hasTrained")
      h5 Accuracy
      .acc-cont(ref="accCont")
      h5 Loss
      .loss-cont(ref="lossCont")
    .outcome(v-show="hasTrained")
      h4 Predicted outcomes
      dl
        dt 2 rooms unit
        dd not sold: ~{{ twoRooms.notSold }}%
        dd sold: ~{{ twoRooms.sold }}%
        dt 4 rooms unit
        dd not sold: ~{{ fourRooms.notSold }}%
        dd sold: ~{{ fourRooms.sold }}%
      p.disclaimer NOTE: The Dataset used is heavily modified so that (almost) all 4 and 5 rooms units are sold. 😅
    .confusion-matrix(v-show="hasTrained")
      h4 Confusion matrix of predictions and labels
      .matrix-container(ref="conMatrix")
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, ref, reactive } from "vue";
import {
  loadCSVData,
  createDatasets,
} from "../compositions/logisticRegression";

import { KeyableObject } from "../typings/basic.d";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";
import { argMax } from "@tensorflow/tfjs";

export default defineComponent({
  name: "LogisticRegression",
  async setup() {
    const lossCont = ref(HTMLElement);
    const accCont = ref(HTMLElement);
    const conMatrix = ref(HTMLElement);
    const isTraining = ref(false);
    const hasTrained = ref(false);
    const twoRooms = reactive({ sold: 0, notSold: 0 });
    const fourRooms = reactive({ sold: 0, notSold: 0 });
    const logModel = tf.sequential();
    onBeforeUnmount(() => {
      logModel.dispose();
    });
    const data = (await loadCSVData()) as KeyableObject;

    const features = ["rooms"];

    const [trainData, validationData, xTest, yTest] = createDatasets(
      data,
      features,
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
    async function trainLogisticRegression(featureCount: number) {
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
        optimizer: tf.train.adam(0.05),
        loss: "binaryCrossentropy",
        metrics: ["accuracy"],
      });
    }

    /**
     * Train the model with then training data and the validation data.
     */
    async function trainModel() {
      isTraining.value = true;
      const trainLogs: any[] = [];

      await logModel.fitDataset(trainData, {
        epochs: 150,
        validationData: validationData,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            trainLogs.push(logs);
            tfvis.show.history(lossCont.value, trainLogs, ["loss", "val_loss"]);
            tfvis.show.history(accCont.value, trainLogs, ["acc", "val_acc"]);
          },
        },
      });
      console.log("done training");
      console.log(tf.memory().numTensors);

      // models on full test datasets
      // returns the outcome with the higher probability (between outcomes 0 and 1)
      const preds = (logModel.predict(xTest) as any).argMax(-1);
      const labels = yTest.argMax(-1);

      // confucion matrix to compare how many predicted results match with the corresponding label
      const confusionMatrix = await tfvis.metrics.confusionMatrix(
        labels,
        preds
      );

      tfvis.render.confusionMatrix(conMatrix.value, {
        values: confusionMatrix,
        tickLabels: ["not sold", "sold"],
      });

      tf.tidy(() => {
        // prediction for a sigle value
        const pred1 = logModel.predict(tf.tensor([2])) as any;
        const pred2 = logModel.predict(tf.tensor([4])) as any;

        twoRooms.notSold = Math.round(pred1.dataSync()[0] * 100);
        twoRooms.sold = Math.round(pred1.dataSync()[1] * 100);

        fourRooms.notSold = Math.round(pred2.dataSync()[0] * 100);
        fourRooms.sold = Math.round(pred2.dataSync()[1] * 100);
      });
      hasTrained.value = true;
    }

    await trainLogisticRegression(features.length);
    logModel.summary();

    return {
      trainModel,
      accCont,
      lossCont,
      conMatrix,
      isTraining,
      hasTrained,
      twoRooms,
      fourRooms,
    };
  },
});
</script>

<style lang="sass" scoped>
.logistic-regression
  min-height: 100vh
  margin-bottom: 80px

.header
  display: flex
  flex-direction: column
  align-items: center
  position: relative

.lin-vs-log
  position: absolute
  top: 70px
  width: 150px
  transition: transform 0.3s ease, width 0.3s ease

  &:hover
    width: 1000px
    transform: translateY(5px)
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.5)

.content
  margin-top: 50px

.disclaimer
  font-size: 12px
  color: #ff8d8d
  padding: 6px 8px
  background-color: #333333

.matrix-container
  max-width: 50%
</style>