<template>
  <form>
    <md-card class="md-card md-elevation-24">
      <md-card-header :data-background-color="dataBackgroundColor" class="text-center">
        <h4 class="title">CJA - Mediação de Seguros</h4>
        <p class="category">Entrar</p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Email</label>
              <md-input v-model="email" type="email"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Password</label>
              <md-input v-model="password" type="password"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <p>
              Não tem uma conta?
              <router-link to="/signup">Registra-se já!</router-link>
            </p>
          </div>
          <div class="md-layout-item md-size-100 text-center">
            <md-button class="md-raised md-success" @click="login">Entrar</md-button>
          </div>
        </div>
      </md-card-content>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </md-card>
  </form>
</template>
<script>
import { mapActions } from 'vuex';
import status from './../../utils/statusEnum';
export default {
  name: 'login-form',
  props: {
    dataBackgroundColor: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      email: '',
      password: '',
      sending: false,
    };
  },
  methods: {
    async login() {
      this.sending = true;
      try {
        let response = await this.$store.dispatch('userStore/login', { email: this.email, password: this.password });
      } catch (err) {
        this.notifyVue(status.DANGER, err.message);
      }
      this.sending = false;
      const isAuth = this.$store.getters['userStore/getIsAuth'];
      if (isAuth) this.$router.push({ path: '/' });
    },
    notifyVue(status, message) {
      this.$notify({
        message: message,
        icon: 'add_alert',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: status,
      });
    },
  },
};
</script>
<style>
.md-card {
  -webkit-box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.16);
  -moz-box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.16);
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.16);
}
</style>
