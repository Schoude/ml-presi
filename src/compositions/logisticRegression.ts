import * as Papa from "papaparse";
import * as tf from "@tensorflow/tfjs";

/**
 * Helper function that asynchronously returns the csv data in a formated manner.
 */
export async function loadCSVData(): Promise<{ [key: string]: any }> {
  return new Promise((resolve) => {
    let csvUrl = 'https://mlforshowandtell.tk/csv/unit-data-dummy.csv';
    if (process.env.NODE_ENV == 'development') {
      csvUrl = "http://localhost:8081/csv/unit-data-dummy.csv" as string;
    }

    Papa.parse(csvUrl, {
      download: true,
      dynamicTyping: true,
      header: true,
      complete: ({ data }: { data: string[] }) => {
        resolve(data)
      },
    });
  })
}

/**
 * Returns a oneHot encoded array.
 * value = 0 ->[1, 0] -> COLD
 * value = 1 ->[0, 1] -> HOT
 */
function oneHot(value: any, valueCount: number): number[] {
  return Array.from(tf.oneHot([value], valueCount).dataSync())
}

/**
 * Creates shuffled training dataset and a validation dataset as a TensorContainer with xs and ys.
 * xs: shape[32, 2] -> 32 = batchSize; 2 = number of features
 * ys: shape[32, 2] -> 32 = batchSize; 2 = binary oneHot coding
 */
export function createDatasets(data: { [key: string]: any }[], features: string[], label: string, testSize: number, batchSize: number) {

  /**
   * Creates an array for each row with the features provided
   {
    size: 91,
    rooms: 5,
    price: 450000,
    }
    gets turned into [91, 5, 450000]
   */
  const feturesValues: any[][] = data.map(row => features.map(feature => row[feature] == null ? 0 : row[feature]));
  console.log('feturesValues', feturesValues);

  const labelValues = data.map(row => {
    const labelOutcome = row[label] == null ? 0 : row[label];

    // process binary coded label
    let returnValue: number[] = [];
    tf.tidy(() => {
      returnValue = oneHot(labelOutcome, 2);
    })
    return returnValue
  });

  // split data for test dataset
  const splitIndex = Math.round(((1 - testSize) * data.length));

  // create the datasets using tf.data helpers
  const tfDataSets = tf.data.zip({ xs: tf.data.array(feturesValues), ys: tf.data.array(labelValues) }).shuffle(data.length, "42069");

  /**
   * [0] => training dataset
   * [1] => validation dataset
   */
  return [
    tfDataSets.take(splitIndex).batch(batchSize),
    tfDataSets.skip(splitIndex + 1).batch(batchSize)
  ]
}