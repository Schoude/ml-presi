<template lang="pug">
.linear-regression
  h3 GOAL: Fit a line that has the <i>minimal distance</i> to every given point in a <a href="https://learningstatisticswithr.com/book/lsr_files/figure-html/regression1a-1.png" target="_blank" rel="noopener noreferrer">scatter plot</a>.
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
        input(type="number", v-model.number="inputValue")
        .actions.actions-model
          button(@click="optimize") Train Model (1x)
          button(@click="optimizeMulti") Train Model (100x)
        .actions.actions-plot
          button.plot-action(@click="onPrintPredictionClick") Plot Prediction
          button.plot-action(@click="onDrawRegressionLineClick") Plot Regression Line
        div(v-show="lossDisplay != null") loss (error): {{ lossDisplay }}
    LinearScatter(@data-array-changed="onDataArrayChanged")
  hr
  button(@click="loadFullModel = true", v-if="!loadFullModel") Load full model
  Suspense(v-if="loadFullModel")
    template(#default)
      LinRegFullModel
    template(#fallback)
      h3 Fetching data...
</template>

<script lang="ts">
import * as tf from "@tensorflow/tfjs";
import { defineComponent, ref } from "vue";
import LinearScatter from "@/components/plots/LinearScatter.vue";
import LinRegFullModel from "@/components/LinRegFullModel.vue";
import {
  printPrediction,
  drawRegressionLine,
} from "@/compositions/linearScatter";

export default defineComponent({
  name: "LinearRegression",
  components: { LinearScatter, LinRegFullModel },
  setup() {
    const loadFullModel = ref(false);

    const yHatDisplay = ref(0);
    let weight = tf.variable(tf.scalar(Math.random()));
    const weightDisplay = ref(0);
    let bias = tf.variable(tf.scalar(Math.random()));
    const biasDisplay = ref(0);
    const lossDisplay = ref(null);
    let trainX: number[] = [];
    let trainY: number[] = [];
    const inputValue = ref(0);
    const learningRate = 0.035;
    const optimizer = tf.train.sgd(learningRate);

    tf.setBackend("webgl");

    async function resetRegressionParams() {
      weight.dispose();
      bias.dispose();
      weight = tf.variable(tf.scalar(Math.random()));
      bias = tf.variable(tf.scalar(Math.random()));
      const b = await bias.data();
      const w = await weight.data();
      biasDisplay.value = b[0];
      weightDisplay.value = w[0];
      yHatDisplay.value = 0;
    }

    async function onDataArrayChanged(payload: {
      xTrain: number[];
      yTrain: number[];
    }) {
      trainX = payload.xTrain;
      trainY = payload.yTrain;
      tf.tidy(() => {
        resetRegressionParams();
      });
    }

    function predict(x: any) {
      return tf.tidy(() => weight.mul(x).add(bias));
    }

    function loss(predictions: any, actualValues: any) {
      const error = predictions.sub(actualValues).square().mean();
      return error;
    }

    function train(trainX: number[], trainY: number[]) {
      optimizer.minimize(() => {
        const predsYs = predict(tf.tensor1d(trainX));
        const stepLoss = loss(predsYs, tf.tensor1d(trainY));
        lossDisplay.value = stepLoss.dataSync()[0];
        return stepLoss;
      });
    }

    async function predictValue(xValue: number) {
      let data: any;
      tf.tidy(() => {
        const y = weight.mul(xValue).add(bias);
        data = y.dataSync();
      });
      return data[0];
    }

    async function optimize() {
      await train(trainX, trainY);
      const b = await bias.data();
      const w = await weight.data();
      yHatDisplay.value = await predictValue(inputValue.value);
      biasDisplay.value = b[0];
      weightDisplay.value = w[0];
      printPrediction(inputValue.value, yHatDisplay.value);
    }

    function optimizeMulti() {
      for (let i = 0; i < 100; i++) {
        optimize();
      }
    }

    async function onPrintPredictionClick() {
      yHatDisplay.value = await predictValue(inputValue.value);
      printPrediction(inputValue.value, yHatDisplay.value);
    }

    async function onDrawRegressionLineClick() {
      const y1Hat = await predictValue(0);
      const y2Hat = await predictValue(10);
      drawRegressionLine(y1Hat, y2Hat, weightDisplay.value, biasDisplay.value);
    }

    return {
      loadFullModel,
      yHatDisplay,
      weightDisplay,
      biasDisplay,
      lossDisplay,
      onDataArrayChanged,
      inputValue,
      optimize,
      optimizeMulti,
      onPrintPredictionClick,
      onDrawRegressionLineClick,
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
    margin-top: 20px

.model-params
  .actions
    margin-top: 8px
    display: flex
    justify-content: space-between

    &-model
      margin-bottom: 24px

    button
      width: 45%
</style>