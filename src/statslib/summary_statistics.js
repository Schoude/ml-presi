export const summaryStatistics = {
  /**
   * The count of the given variable.
   * @param {Array} variableData
   * @returns {Number}
   */
  count(variableData) {
    return variableData.length;
  },
  /**
   * @param {Array} variableData
   * @returns {Number}
   */
  max(variableData) {
    return Math.max.apply(null, variableData);
  },
  /**
   * @param {Array} variableData
   * @returns {Number}
   */
  min(variableData) {
    return Math.min.apply(null, variableData);
  },
};
