import status from '../../utils/statusEnum';
import API_URL from './../../utils/apiURL';

const userStore = {
  namespaced: true,
  state: () => ({
    simulacaoViagem: [],
  }),
  mutations: {
    setSimulacaoViagem: (state, simulacaoViagem) => {
      state.simulacaoViagem = simulacaoViagem;
    },
  },
  actions: {
    simularSeguroViagem: async (context, seguro) => {
      const result = await axios.post(`${API_URL.BASE_URL}/seguros/viagens/simular`, seguro);
      if (result.data.status === status.SUCCESS) context.commit('setSimulacaoViagem', result.data.data.precos);
    },
    solicitarSeguroViagem: async (context, seguroViagem) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`${API_URL.BASE_URL}/seguros/viagens`, seguroViagem)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            const err = error.response.data;
            context.commit('setResponse', { status: err.status, message: err.message }, { root: true });
            reject(err);
          });
      });
    },
  },
  getters: {
    getSimulacaoViagem: (state) => {
      return state.simulacaoViagem;
    },
  },
};

export default userStore;
