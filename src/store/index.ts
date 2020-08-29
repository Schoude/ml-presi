import { createStore } from 'vuex'
import { myModule } from './module/test.module'



export default createStore({
  state: {
    myState: 'hello'
  },
  mutations: {
  },
  actions: {
  },
  getters: {
    getMyState(state) {
      return state.myState
    }
  },
  modules: {
    myModule
  }
})