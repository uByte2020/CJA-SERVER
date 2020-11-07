import DashboardLayout from '@/pages/Layout/DashboardLayout.vue';

import Dashboard from '@/pages/Dashboard.vue';
import UserProfile from '@/pages/UserProfile.vue';
import Solicitacao from '@/pages/Solicitacao.vue';
import Login from '@/pages/Login.vue';
import SignUp from '@/pages/SignUp.vue';
import Users from '@/pages/Users.vue';
import Simulacao from '@/pages/Simulacao.vue';
import SolicitacaoDetalhe from '@/pages/SolicitacaoDetalhe.vue';
import UserDetalhe from '@/pages/UserDetalhe.vue';

import store from './../store/store';

const routes = [
  {
    path: '/signup',
    name: 'signup',
    component: SignUp,
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      allowAnonymous: true,
    },
  },
  {
    path: '/',
    component: DashboardLayout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        beforeEnter(to, from, next) {
          if (store.getters['userStore/restrictTo'](0, 1)) {
            next();
          } else {
            next('solicitacoes');
          }
        },
      },
      {
        path: 'user',
        name: 'User Profile',
        component: UserProfile,
      },
      {
        path: 'users',
        name: 'users',
        component: Users,
        beforeEnter(to, from, next) {
          if (store.getters['userStore/restrictTo'](0, 1)) {
            next();
          } else {
            next('solicitacoes');
          }
        },
      },
      {
        path: 'users/:userId',
        name: 'users-detalhe',
        component: UserDetalhe,
        props: true,
        beforeEnter(to, from, next) {
          if (store.getters['userStore/restrictTo'](0)) {
            next();
          } else {
            next('solicitacoes');
          }
        },
      },
      {
        path: 'simular-seguro',
        name: 'Simular Seguro',
        component: Simulacao,
        beforeEnter(to, from, next) {
          if (store.getters['userStore/restrictTo'](2, 3)) {
            next();
          } else {
            next('solicitacoes');
          }
        },
      },
      {
        path: 'solicitacoes',
        name: 'Solicitações',
        component: Solicitacao,
      },
      {
        path: 'solicitacoes/:solicitacaoId',
        name: 'solicitacoes-detalhe',
        component: SolicitacaoDetalhe,
        props: true,
      },
    ],
  },
];

export default routes;
