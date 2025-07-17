import { createStore, Store } from 'vuex'
import { User } from '../types'

// 定義 state 類型
interface State {
  isAuthenticated: boolean;
  user: User;
}

// 定義 mutations types
const types = {
  SET_AUTHENTICATED: "SET_AUTHENTICATED",
  SET_USER: "SET_USER"
};

const state: State = {
  isAuthenticated: false,
  user: {} as User
};

const getters = {
  isAuthenticated: (state: State) => state.isAuthenticated,
  user: (state: State) => state.user
};

const mutations = {
  [types.SET_AUTHENTICATED](state: State, isAuthenticated: boolean) {
    if (isAuthenticated) 
      state.isAuthenticated = isAuthenticated;
    else 
      state.isAuthenticated = false;
  },

  [types.SET_USER](state: State, user: User) {
    if (user) 
      state.user = user;
    else 
      state.user = {} as User
  }
};

const actions = {
  setAuthenticated: ({ commit }: { commit: any }, isAuthenticated: boolean) => {
    commit(types.SET_AUTHENTICATED, isAuthenticated);
  },
  setUser: ({ commit }: { commit: any }, user: User) => {
    commit(types.SET_USER, user);
  },
  clearCurrentState: ({ commit }: { commit: any }) => {
    commit(types.SET_AUTHENTICATED, false);
    commit(types.SET_USER, {} as User);
  }
};

export default createStore<State>({
  state,
  getters,
  mutations,
  actions,
  modules: {
  }
})

export type RootState = State; 