import { createStore } from 'vuex'

export default createStore({
  state: {
    tasks: [] // tasks as an array in vuex state as a while
  },
  getters: {

  },
  mutations: {
    update_tasks($state, $tasks) { // mutation to update the tasks with incoming new array
      $state.tasks = $tasks;
    }
  },
  actions: {
    update_all_tasks({ commit }, $tasks) { // action to call on mutation to update the tasks array
      commit('update_tasks', $tasks);
    }
  },
  modules: {

  }
})
