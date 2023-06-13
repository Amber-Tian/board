import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'

Vue.use(Vuex)  
const state = {
  
 
} 

const mutations = {
  changeServer(state, value) {
    state.requestServer = value
  },
  changePort(state, value) {
    state.requestPort = value
  }
}

const store = new Vuex.Store({ 
  getters,
  state, 
  mutations
})

export default store
