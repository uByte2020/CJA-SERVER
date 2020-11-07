import status from './../../utils/statusEnum';
import API_URL from './../../utils/apiURL';
import constantes from './../../utils/constantes';

const userStore = {
  namespaced: true,
  state: () => ({
    isAuth: false,
    user: null,
    users: [],
  }),
  mutations: {
    setUser: (state, user) => {
      state.user = user;
    },
    setUsers: (state, users) => {
      state.users = users;
    },
    setIsAuth: (state, isAuth) => {
      state.isAuth = isAuth;
    },
  },
  actions: {
    login: (context, credencial) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`${API_URL.BASE_URL}/users/login`, credencial)
          .then((response) => {
            context.commit('setUser', response.data.data.user);
            context.commit('setIsAuth', true);
            context.commit('setResponse', { status: response.data.status }, { root: true });
            try {
              resolve(response.data);
            } catch (err) {
              reject(err);
            }
          })
          .catch((error) => {
            try {
              const err = error.response.data;
              reject(err);
            } catch (err) {
              reject(error);
            }
          });
      });
    },
    logout: (context) => {
      return new Promise((resolve, reject) => {
        axios
          .get(`${API_URL.BASE_URL}/users/logout`)
          .then((response) => {
            context.commit('setUser', null);
            context.commit('setUsers', []);
            context.commit('setIsAuth', false);
            commit('solicitacaoStore/freeModule', null, { root: true });
            commit('freeStore', null, { root: true });
            context.commit('setResponse', { status: response.data.status }, { root: true });
            resolve(response.data);
          })
          .catch((error) => {
            context.commit('setResponse', { status: 'error', message: 'Loggout Error' }, { root: true });
            reject(error);
          });
      });
    },
    signup: (context, user) => {
      return new Promise((resolve, reject) => {
        axios
          .post(`${API_URL.BASE_URL}/users/signup`, user)
          .then((response) => {
            context.commit('setUser', response.data.data.user);
            context.commit('setIsAuth', true);
            context.commit('setResponse', { status: response.data.status }, { root: true });
            resolve(response.data);
          })
          .catch((error) => {
            const err = error.response.data;
            context.commit('setResponse', { status: err.status, message: err.message }, { root: true });
            reject(err);
          });
      });
    },
    isLogged: (context) => {
      return new Promise((resolve, reject) => {
        axios
          .get(`${API_URL.BASE_URL}/users/isLogged`)
          .then((response) => {
            context.commit('setUser', response.data.data.user);
            context.commit('setIsAuth', true);
            try {
              resolve(response.data);
            } catch (err) {
              reject(err);
            }
          })
          .catch((error) => {
            try {
              const err = error.response.data;
              reject(err);
            } catch (err) {
              reject(error);
            }
          });
      });
    },
    getUsers: (context) => {
      if (context.state.user.role.perfilCode <= 1)
        return new Promise((resolve, reject) => {
          axios
            .get(`${API_URL.BASE_URL}/users`)
            .then((response) => {
              context.commit('setUsers', response.data.data.docs);
              context.commit('setResponse', { status: response.data.status }, { root: true });
              resolve(response.data);
            })
            .catch((error) => {
              const err = error.response.data;
              context.commit('setResponse', { status: err.status, message: err.message }, { root: true });
              reject(err);
            });
        });
    },
    updateMe: (context, user) => {
      return new Promise((resolve, reject) => {
        axios
          .patch(`${API_URL.BASE_URL}/users/updateMe`, user)
          .then((response) => {
            context.commit('setUser', response.data.data.user);
            context.commit('setIsAuth', true);
            context.commit('setResponse', { status: response.data.status }, { root: true });
            resolve(response.data);
          })
          .catch((error) => {
            const err = error.response.data;
            context.commit('setResponse', { status: err.status, message: err.message }, { root: true });
            reject(err);
          });
      });
    },
    updateUser: (context, user) => {
      return new Promise((resolve, reject) => {
        axios
          .patch(`${API_URL.BASE_URL}/users/${user._id}`, user)
          .then((response) => {
            context.commit('setResponse', { status: response.data.status }, { root: true });
            resolve(response.data);
          })
          .catch((error) => {
            const err = error.response.data;
            context.commit('setResponse', { status: err.status, message: err.message }, { root: true });
            reject(err);
          });
      });
    },
    changeBloqState: (context, user) => {},
    getUserById: (context, userId) => {
      if (context.state.user.role.perfilCode <= 1)
        return new Promise((resolve, reject) => {
          axios
            .get(`${API_URL.BASE_URL}/users/${userId}`)
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
    getUser: (state) => {
      return state.user;
    },
    getProfilePhoto: (state) => {
      const photo = state.user && state.user.photo ?
      state.user.photo : constantes.K_USER_PHOTO;
      return `${API_URL.DOMAIN}/img/users/${photo}`;
    },
    getUserImgUrl: (state) => {
      return `${API_URL.DOMAIN}/img/users/`;
    },
    getIsAuth: (state) => {
      return state.isAuth;
    },
    getUsers: (state) => {
      return state.users.filter((user) => user.role.perfilCode !== 0);
    },
    getMediadores: (state) => {
      return state.users.filter((user) => user.role.perfilCode === 1);
    },
    getClientes: (state) => {
      return state.users.filter((user) => user.role.perfilCode >= 2);
    },
    countClientes: (state) => {
      return state.users.filter((user) => user.role.perfilCode >= 2).length;
    },
    getUserAuthPerfilCode: (state) => {
      return state.user.role.perfilCode;
    },
    restrictTo: (state) => (...role) => {
      return state.user && state.user.role && role.includes(state.user.role.perfilCode);
    },
  },
};

export default userStore;
