const myModule = {
  namespaced: true,
  state: {
    value: 'my value'
  },
  getters: {
    value: (state: any) => {
      return state.value;
    }
  },
  mutations: {
    updateValue(state: any, payload: any) {
      state.value = payload;
    }
  },
  actions: {
    // updateValue({ commit }, payload) {
    //   commit('updateValue', payload);
    // }
  }
};

export { myModule }