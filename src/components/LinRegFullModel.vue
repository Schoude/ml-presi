<template lang="pug">
.lin-reg-full-model
  .model
    h3 Trainable Model for <b>roomsize -> price</b> data
    .actions
      button(
        @click="onFitModelClick"
        :disabled="modelTrained || isTraining"
      ) Train Model
      input(
        min="40"
        type="number" placeholder="Enter m²"
        v-if="modelTrained"
        v-model.number="inputValue"
      )
      button.plot-action(
        @click="onPlotPredictionClick"
        v-if="modelTrained"
      ) Plot Prediction
      span(v-if="predictedValue !== 0" ) Predicted: {{ predictedValue.toFixed(2) }} €
    .viz(v-if="isTraining")
      h5 Loss
      .loss-cont(ref="lossCont")
      h5 Accuracy
      .acc-cont(ref="accCont")
  .plot
    #my-lin-regfull-model
    span.correlation(v-show="correlationValue") Pairwise correlation between x and y: {{ correlationValue }} (n = {{ n }})
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onBeforeUnmount,
} from "vue";
import {
  getData,
  setUpD3Data,
  initScatter,
  plotData,
  printPrediction,
  drawRegressionLine
} from "../compositions/linearRegressionFullModel";
import StatsLib from "@/statslib/index";
import * as tf from "@tensorflow/tfjs";
import * as tfvis from "@tensorflow/tfjs-vis";

export default defineComponent({
  name: "LinRegFullModel",
  async setup() {
    // DOM $refs
    const lossCont = ref(HTMLElement);
    const accCont = ref(HTMLElement);

    // For TensorFlow
    let linearModel: tf.Sequential | null = null;
    let xsTrain: tf.Tensor<tf.Rank> | null = null;
    let ys: tf.Tensor<tf.Rank> | null = null;
    const learningRate = 0.01;
    const optimizer = tf.train.adam(learningRate);
    onMounted(async () => {
      initScatter("#my-lin-regfull-model");
      plotData();
    });
    onBeforeUnmount(() => {
      linearModel!.dispose();
      xsTrain!.dispose();
      ys!.dispose();
      optimizer.dispose();
    });
    const sLib = new StatsLib();
    const { size, price } = await getData();
    const correlationValue = ref(0);
    const n = ref(0);
    const isTraining = ref(false);
    const modelTrained = ref(false);
    const inputValue = ref(40);
    const predictedValue = ref(0)

    // For TensorFlow
    linearModel = tf.sequential();
    xsTrain = tf.tensor(size, [size.length, 1]);
    ys = tf.tensor(price, [price.length, 1]);

    setUpD3Data(size, price);
    n.value = size.length;
    correlationValue.value = sLib.correlation(size, price);

    // Model Setup
    linearModel.add(
      tf.layers.dense({
        units: 1,
        inputShape: [1],
        activation: "linear",
      })
    );

    linearModel.add(tf.layers.dense({ units: 250, activation: "linear" }));
    linearModel.add(tf.layers.dense({ units: 1, activation: "linear" }));

    linearModel.compile({
      optimizer,
      loss: "meanSquaredError",
      metrics: [tf.metrics.meanAbsoluteError],
    });

    function linearPrediction(val: number): number {
      const output = linearModel!.predict(tf.tensor2d([val], [1, 1])) as tf.Tensor<tf.Rank>;

      const predictedValue = Array.from(output.dataSync())[0];
      output.dispose();
      console.log(tf.memory().numTensors);
      return predictedValue;
    }

    async function fitModel(
      xsTrain: tf.Tensor<tf.Rank>,
      ys: tf.Tensor<tf.Rank>
    ) {
      const trainLogs: any[] = [];
      await linearModel!.fit(xsTrain, ys, {
        epochs: 100,
        shuffle: true,
        batchSize: 32,
        validationSplit: 0.1,
        callbacks: {
          onEpochEnd: async (epoch, logs) => {
            trainLogs.push({
              rmse: Math.sqrt(logs!.loss),
              "val_rmse": Math.sqrt(logs!.val_loss),
              mae: logs!["meanAbsoluteError"],
              "val_mae": logs!["val_meanAbsoluteError"],
            });

            tfvis.show.history(lossCont.value, trainLogs, ["rmse", "val_rmse"]);
            tfvis.show.history(accCont.value, trainLogs, ["mae", "val_mae"]);
          },
        },
      });

      tf.tidy(() => {
        const y1hat = linearPrediction(40)
        const y2hat = linearPrediction(170)
        drawRegressionLine(40, 170, y1hat, y2hat);
      })
    }

     async function onFitModelClick() {
       isTraining.value = true;
      console.log(tf.memory().numTensors);
      await fitModel(xsTrain!, ys!);
      modelTrained.value = true;
      console.log(tf.memory().numTensors);
    }

    function onPlotPredictionClick() {
      tf.tidy(() => {
        predictedValue.value = linearPrediction(inputValue.value);
        printPrediction(inputValue.value, predictedValue.value);
      });
    }

    return { correlationValue, n, lossCont, accCont, onFitModelClick, isTraining, modelTrained, inputValue, onPlotPredictionClick, predictedValue};
  },
});
</script>

<style lang="sass" scoped>
.lin-reg-full-model
  display: flex
  margin-bottom: 50px
  
.model
  flex: 1 0 auto

.plot
  margin-left: 30px

.actions
  button:disabled
    opacity: 0.4
    cursor: not-allowed

  input
    margin: 0 24px 0 24px

  .plot-action
    margin-right: 24px

#my-lin-regfull-model
  margin: 30px 0
</style>