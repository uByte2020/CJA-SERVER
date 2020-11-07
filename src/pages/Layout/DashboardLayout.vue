<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">
    <notifications></notifications>

    <side-bar
      :sidebar-item-color="sidebarBackground"
      :sidebar-background-image="sidebarBackgroundImage"
    >
      <mobile-menu slot="content"></mobile-menu>
      <sidebar-link to="/dashboard" v-show="restrictTo(0, 1)">
        <md-icon>dashboard</md-icon>
        <p>Dashboard</p>
      </sidebar-link>
      <sidebar-link to="/solicitacoes">
        <md-icon>notifications</md-icon>
        <p>Solicitações</p>
      </sidebar-link>
      <sidebar-link to="/simular-seguro" v-show="restrictTo(2, 3)">
        <md-icon>bubble_chart</md-icon>
        <p>Simulacao</p>
      </sidebar-link>
      <sidebar-link to="/users" v-show="restrictTo(0)">
        <md-icon>group</md-icon>
        <p>Utilizadores</p>
      </sidebar-link>
      <sidebar-link to="/user">
        <md-icon>person</md-icon>
        <p>Perfil</p>
      </sidebar-link>
    </side-bar>

    <div class="main-panel">
      <top-navbar></top-navbar>
      <dashboard-content></dashboard-content>
      <content-footer v-if="!$route.meta.hideFooter"></content-footer>
    </div>
  </div>
</template>

<script>
import TopNavbar from './TopNavbar.vue';
import ContentFooter from './ContentFooter.vue';
import DashboardContent from './Content.vue';
import MobileMenu from '@/pages/Layout/MobileMenu.vue';
import FixedPlugin from './Extra/FixedPlugin.vue';

export default {
  components: {
    TopNavbar,
    DashboardContent,
    ContentFooter,
    MobileMenu,
  },
  data() {
    return {
      sidebarBackground: 'green',
      sidebarBackgroundImage: require('@/assets/img/sidebar-2.jpg'),
    };
  },
  mounted() {
    const loader = this.$loading.show({
      color: '#4caf50',
      opacity: 0.3,
    });
    (async () => {
      await this.fetchSolicitacoes();
      if (this.restrictTo(0, 1)) await this.fetchUsers();
      await this.fetchSeguradoras();
      await this.fetchModalidades();
      await this.fetchPlanos();
      loader.hide();
    })();
  },
  methods: {
    async fetchSolicitacoes() {
      try {
        await this.$store.dispatch('solicitacaoStore/getSolicitacoes');
      } catch (err) {
        this.notifyVue(status.DANGER, err.message);
      }
    },
    async fetchUsers() {
      try {
        await this.$store.dispatch('userStore/getUsers');
      } catch (err) {
        this.notifyVue(status.DANGER, err.message);
      }
    },
    async fetchSeguradoras() {
      try {
        await this.$store.dispatch('getSeguradoras');
      } catch (err) {
        this.notifyVue(status.WARNING, err.message);
      }
    },
    async fetchModalidades() {
      try {
        await this.$store.dispatch('getModalidades');
      } catch (err) {
        this.notifyVue(status.WARNING, err.message);
      }
    },
    async fetchPlanos() {
      try {
        await this.$store.dispatch('getPlanos');
      } catch (err) {
        this.notifyVue(status.WARNING, err.message);
      }
    },
  },
  computed: {
    restrictTo() {
      return this.$store.getters['userStore/restrictTo'];
    },
  },
};
</script>
