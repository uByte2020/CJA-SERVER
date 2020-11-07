import status from './../../utils/statusEnum';
import DocsType from './../../utils/docsType';
import API_URL from './../../utils/apiURL';

const userStore = {
  namespaced: true,
  state: () => ({
    solicitacoes: [],
    solicitacao: {},
  }),
  mutations: {
    setSolicitacoes: (state, solicitacoes) => {
      state.solicitacoes = solicitacoes;
    },
    setSolicitacao: (state, solicitacao) => {
      state.solicitacao = solicitacao;
    },
    freeModule: (state, empty) => {
      state.solicitacao = {};
      state.solicitacoes = [];
    },
  },
  actions: {
    setSolicitacao: (context, solicitacao) => {
      context.commit('setSolicitacao', solicitacao);
    },
    getSolicitacoes: async (context) => {
      let userPerfilCode = context.rootState.userStore.user.role.perfilCode;
      let mySolicitacoes = '';
      if (userPerfilCode >= 2) mySolicitacoes = '/mySolicitacoes';
      const result = await axios.get(`${API_URL.BASE_URL}/solicitacoes/${mySolicitacoes}`);
      if (result.data.status === status.SUCCESS) context.commit('setSolicitacoes', result.data.data.docs);
    },
    cancelarSolicitacao: (context, solicitacao) => {
      return new Promise((resolve, reject) => {
        axios
          .patch(`${API_URL.BASE_URL}/solicitacoes/cancelar/${solicitacao._id}`, solicitacao)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            const err = error.response.data;
            reject(err);
          });
      });
    },
    getSolicitacoesById: async (context, solicitacaoId) => {
      return new Promise((resolve, reject) => {
        axios
          .get(`${API_URL.BASE_URL}/solicitacoes/${solicitacaoId}`)
          .then((response) => {
            resolve(response.data);
          })
          .catch((error) => {
            const err = error.response.data;
            reject(err);
          });
      });
    },
  },
  getters: {
    getSolicitacoes: (state) => {
      const solicitacoes = [...state.solicitacoes.filter((el) =>
          el.cliente && el.estado && el.seguro && [1, 2, 3].includes(el.estado.estadoCode)
         )];
      return solicitacoes.sort(function(a, b) {
        if (a.estado.estadoCode === 2) {
          return -1;
        }
        if (b.estado.estadoCode === 2) {
          return 1;
        }
        return a.estado.estadoCode - b.estado.estadoCode;
      });
    },
    countSolicitacoesPendentes: (state) => {
      return state.solicitacoes.filter((el) => el.estado.estadoCode === 2).length;
    },
    countSolicitacoesAtendidas: (state) => {
      return state.solicitacoes.filter((el) => el.estado.estadoCode === 1).length;
    },
    countSolicitacoesCaducadas: (state) => {
      return state.solicitacoes.filter((el) => el.estado.estadoCode === 3).length;
    },
    getSolicitacao: (state) => {
      return state.solicitacao;
    },
    getFileURL: (state) => (docType) => {
      switch (docType) {
        case DocsType.APOLICE:
          return `${API_URL.DOMAIN}/files/seguros/apolice/`;
        case DocsType.COMPROVATIVO:
          return `${API_URL.DOMAIN}/files/seguros/comprovativos/`;
        case DocsType.DOCIDENTICICACAO:
          return `${API_URL.DOMAIN}/files/seguros/docIdentificacaos/`;
        case DocsType.SIMULACAO:
          return `${API_URL.DOMAIN}/files/seguros/simulacao/`;
      }
    },
  },
};

export default userStore;
