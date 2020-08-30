import { summaryStatistics } from './summary_statistics';

export default class Statslib {
  constructor() {
    return 0;
  }

  /**
   * Methods for general statistical summaries.
   */
  summary = summaryStatistics;

  /**
   *  Calculates the mean for a numeric variable;
   * @param {Array} variableData
   * @returns {Number}
   */
  mean(variableData) {
    return variableData.reduce((a, b) => a + b) / variableData.length;
  }

  geoMean(variableData) {
    return Number(
      Math.pow(
        variableData.reduce((a, b) => a * b),
        1 / variableData.length
      ).toFixed(8)
    );
  }

  /**
   * Returns the range for the given data of a numeric variable.
   *
   * @param {Array} variableData
   * @returns {Number}
   */
  range(variableData) {
    const minValue = Math.min.apply(null, variableData);
    const maxValue = Math.max.apply(null, variableData);
    return Number((maxValue - minValue).toFixed(8));
  }

  /**
   * Calculates the mean absolute deviation of a numeric variable.
   * Assuming that the data is given from a sample.
   *
   * @param {Array} variableData
   * @returns {Number}
   */
  meanAbsoluteDeviation(variableData) {
    const n = variableData.length;
    let sum = 0;
    variableData.forEach((entry) => {
      sum += Math.abs(entry - this.mean(variableData));
    });

    return Number((sum / n).toFixed(8));
  }

  /**
   * Calculates the variance of a numeric variable for sample of data.
   * n = n - 1
   * Also know aus σ² (sigma²).
   *
   * @param {*} variableData
   * @returns {Number}
   */
  variance(variableData) {
    const n = variableData.length - 1;
    let sum = 0;
    variableData.forEach((entry) => {
      sum += Math.pow(entry - this.mean(variableData), 2);
    });

    return Number((sum / n).toFixed(8));
  }

  /**
   * Calculates the variance of a numeric variable.
   * Also know aus σ² (sigma²).
   *
   * @param {*} variableData
   * @returns {Number}
   */
  varianceNoSample(variableData) {
    const n = variableData.length;
    let sum = 0;
    variableData.forEach((entry) => {
      sum += Math.pow(entry - this.mean(variableData), 2);
    });

    return Number((sum / n).toFixed(8));
  }

  /**
   * Calculates the standard deviation of a sample of a numeric variable.
   * n = n - 1
   * Also know aus σ (sigma).
   *
   * @param {Array} variableData
   * @returns {Number}
   */
  standardDeviation(variableData) {
    return Number(Math.sqrt(this.variance(variableData)).toFixed(8));
  }

  /**
   * Calculates the standard deviation a numeric variable.
   * Also know aus σ (sigma).
   *
   * @param {Array} variableData
   * @returns {Number}
   */
  standardDeviationNoSample(variableData) {
    return Number(Math.sqrt(this.varianceNoSample(variableData)).toFixed(8));
  }

  /**
   * Calculates the Covariance of a variable pair.
   * This is needed for calculating the correlation coefficient.
   *
   * @param {Array} xData
   * @param {Array} yData
   * @returns {Number}
   */
  covariance(xData, yData) {
    const meanX = this.mean(xData);
    const meanY = this.mean(yData);
    let sum = 0;
    for (let i = 0; i < xData.length; i++) {
      const stdXi = xData[i] - meanX;
      const stdYi = yData[i] - meanY;
      sum += stdXi * stdYi;
    }
    return sum;
  }

  /**
   * Calculates the pair wise correlation coefficient for a variable pair.
   *
   * @param {Array} xData
   * @param {Array} yData
   * @returns {Number}
   */
  correlation(xData, yData) {
    let sumX = 0;
    let sumY = 0;

    xData.forEach((entry) => {
      sumX += Math.pow(entry - this.mean(xData), 2);
    });

    yData.forEach((entry) => {
      sumY += Math.pow(entry - this.mean(yData), 2);
    });

    return Number(
      (this.covariance(xData, yData) / Math.sqrt(sumX * sumY)).toFixed(4)
    );
  }
}
