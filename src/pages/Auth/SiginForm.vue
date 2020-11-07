<template>
  <form novalidate class="md-layout" @submit.prevent="validateUser" style="overflow-y: hidden;">
    <md-card class="md-card">
      <md-card-header :data-background-color="dataBackgroundColor" class="text-center">
        <h4 class="title">CJA - Mediação de Seguros</h4>
        <p class="category">Registrar-se!</p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout-item md-small-size-100">
          <md-field :class="getValidationClass('name')">
            <label for="first-name">Name</label>
            <md-input
              name="first-name"
              id="first-name"
              autocomplete="given-name"
              v-model="form.name"
              :disabled="sending"
            />
            <span class="md-error" v-if="!$v.form.name.required">The first name is required</span>
            <span class="md-error" v-else-if="!$v.form.name.minlength">Invalid first name</span>
          </md-field>
        </div>
        <div class="md-layout-item md-small-size-100">
          <md-field :class="getValidationClass('role')">
            <label for="role">Perfil</label>
            <md-select name="role" id="role" v-model="form.role" md-dense :disabled="sending">
              <md-option></md-option>
              <md-option v-for="perfil in perfils" :key="perfil._id" :value="perfil.perfilCode">
                {{
                perfil.perfil
                }}
              </md-option>
            </md-select>
            <span class="md-error" v-if="!$v.form.role.required">The Perfil is required</span>
          </md-field>
        </div>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('email')">
              <label for="email">Email</label>
              <md-input
                type="email"
                name="email"
                id="email"
                autocomplete="email"
                v-model="form.email"
                :disabled="sending"
              />
              <span class="md-error" v-if="!$v.form.email.required">The email is required</span>
              <span class="md-error" v-else-if="!$v.form.email.email">Invalid email</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100">
            <md-field :class="getValidationClass('telemovel')">
              <label for="first-name">Telemovel</label>
              <md-input
                name="telemovel"
                id="telemovel"
                autocomplete="given-name"
                v-model="form.telemovel"
                :disabled="sending"
              />
              <span class="md-error" v-if="!$v.form.telemovel.required">The telemovel is required</span>
              <span class="md-error" v-else-if="!$v.form.telemovel.isValid">Invalid telemovel</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('password')">
              <label>Password</label>
              <md-input v-model="form.password" type="password"></md-input>
              <span class="md-error" v-if="!$v.form.password.required">The first name is required</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field :class="getValidationClass('passwordConfirm')">
              <label>Confirmar Password</label>
              <md-input v-model="form.passwordConfirm" type="password"></md-input>
              <span
                class="md-error"
                v-if="!$v.form.passwordConfirm.required"
              >The first name is required</span>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-100">
            <p>
              Já tem uma conta?
              <router-link to="/login">Entre Aqui!</router-link>
            </p>
          </div>
          <div class="md-layout-item md-size-100 text-center">
            <md-card-actions style="justify-content: center!important;">
              <md-button type="submit" class="md-raised md-success" :disabled="sending">Registrar</md-button>
            </md-card-actions>
          </div>
        </div>
      </md-card-content>
      <md-progress-bar md-mode="indeterminate" v-if="sending" />
    </md-card>

    <md-snackbar :md-active.sync="userSaved">O utilizador {{ lastUser }} foi salvo com Sucesso!</md-snackbar>
  </form>
</template>
<script>
const { validationMixin, default: Vuelidate } = require('vuelidate');
const { required, email, minLength, maxLength } = require('vuelidate/lib/validators');
import status from './../../utils/statusEnum';

export default {
  name: 'sigin-form',
  props: {
    dataBackgroundColor: {
      type: String,
      default: '',
    },
  },
  mixins: [validationMixin],
  mounted() {
    this.$store.dispatch('getPerfils');
  },
  data: () => ({
    form: {
      name: null,
      role: null,
      email: null,
      telemovel: null,
      password: null,
      passwordConfirm: null,
    },
    userSaved: false,
    sending: false,
    lastUser: null,
  }),
  validations: {
    form: {
      name: {
        required,
        minLength: minLength(3),
      },
      role: {
        required,
      },
      email: {
        required,
        email,
      },
      telemovel: {
        required,
        isValid: (value) => /^([+]?244){0,1}\s{0,1}9([1-4]|9)[0-9]{1}\s{0,1}[0-9]{3}\s{0,1}[0-9]{3}$/g.test(value),
      },
      password: {
        required,
      },
      passwordConfirm: {
        required,
        // verifyPassword: (value, vm) => value === vm.form.passwordConfirm,
      },
    },
  },
  methods: {
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName];

      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty,
        };
      }
    },
    clearForm() {
      this.$v.$reset();
      this.form.name = null;
      this.form.password = null;
      this.form.passwordConfirm = null;
      this.form.role = null;
      this.form.email = null;
      this.form.telemovel = null;
    },
    async saveUser() {
      this.sending = true;
      try {
        if(this.form.role===1) this.form.isBloqued = true;
        let response = await this.$store.dispatch('userStore/signup', this.form);
        this.userSaved = true;
        this.sending = false;
        this.clearForm();
        this.notifyVue(status.SUCCESS, "Utilizador Registrado com Sucesso!");
      } catch (err) {
        this.sending = false;
        this.notifyVue(status.DANGER, err.message);
      }
      const isAuth = this.$store.getters['userStore/getIsAuth'];
      const perfilCode = this.$store.getters['userStore/getUserAuthPerfilCode'];
      if (isAuth) {
        if(perfilCode ===1){
          try {
            let response = await this.$store.dispatch('userStore/logout');
          } catch (err) {
            // console.log(err);
          }
          this.$router.push({ path: '/login' });
        }else{
          this.$router.push({ path: '/' });
        }
      }
    },
    validateUser() {
      this.$v.$touch();

      if (!this.$v.$invalid) {
        this.saveUser();
      }
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
  computed: {
    perfils() {
      return this.$store.getters.getPerfils;
    },
  },
};
</script>
<style>
.md-progress-bar {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
}
.md-card {
  -webkit-box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.16);
  -moz-box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.16);
  box-shadow: 0px 0px 5px 3px rgba(0, 0, 0, 0.16);
}
</style>
