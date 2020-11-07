<template>
  <form>
    <notifications></notifications>
    <md-card>
      <md-card-header :data-background-color="dataBackgroundColor">
        <h4 class="title">{{ title }}</h4>
        <p class="category">{{ description }}</p>
      </md-card-header>

      <md-card-content>
        <div class="md-layout">
          <div class="md-layout-item md-small-size-100 md-size-100">
            <md-field>
              <label>Nome</label>
              <md-input v-model="user.name" type="text" :disabled="isBloque"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-60">
            <md-field>
              <label>Email</label>
              <md-input v-model="user.email" type="email" :disabled="isBloque"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-40">
            <md-field>
              <label>Telemovel</label>
              <md-input v-model="user.telemovel" type="text" :disabled="isBloque"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-60">
            <md-field>
              <label>Endereco</label>
              <md-input v-model="user.endereco" type="text" :disabled="isBloque"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-40">
            <md-field>
              <label>NIF</label>
              <md-input v-model="user.nif" type="text" :disabled="isBloque"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-40">
            <md-field>
              <label>Sector de Actividade</label>
              <md-input v-model="user.sectorActividade" type="text" :disabled="isBloque"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-small-size-100 md-size-60">
            <md-field>
              <label>Actividade</label>
              <md-input v-model="user.actividade" type="text" :disabled="isBloque"></md-input>
            </md-field>
          </div>
          <div class="md-layout-item md-size-100">
            <md-field maxlength="5">
              <label>Sobre</label>
              <md-textarea v-model="user.descricao" :disabled="isBloque"></md-textarea>
            </md-field>
          </div>
          <div v-show="isMyProfile" class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" @click="update">Actualizar</md-button>
          </div>
          <div v-show="isBloque" class="md-layout-item md-size-100 text-right">
            <md-button class="md-raised md-success" @click="bloque">{{ getBloqText }}</md-button>
          </div>
        </div>
      </md-card-content>
    </md-card>
  </form>
</template>
<script>
export default {
  name: 'edit-profile-form',
  props: {
    dataBackgroundColor: {
      type: String,
      default: '',
    },
    getUser: Object,
    title: {
      type: String,
      default: 'Editar Perfil',
    },
    description: {
      type: String,
      default: 'Complete o seu perfil',
    },
    isBloque: {
      type: Boolean,
      dafault: false,
    },
    isMyProfile: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      user: {
        _id: null,
        name: null,
        descricao: null,
        email: null,
        telemovel: null,
        endereco: null,
        photo: null,
        actividade: null,
        sectorActividade: null,
        nif: null,
        isBloqued: false,
      },
    };
  },
  watch: {
    getUser: function(newVal, oldVal) {
      this.setUser(newVal);
    },
  },
  mounted() {
    this.setUser(this.getUser);
  },
  computed: {},
  methods: {
    setUser(getUser) {
      this.user._id = getUser._id;
      this.user.name = getUser.name;
      this.user.descricao = getUser.descricao;
      this.user.email = getUser.email;
      this.user.telemovel = getUser.telemovel;
      this.user.endereco = getUser.endereco.join(';');
      this.user.photo = getUser.photo;
      this.user.actividade = getUser.actividade;
      this.user.sectorActividade = getUser.sectorActividade;
      this.user.nif = getUser.nif;
      this.user.isBloqued = getUser.isBloqued;
    },
    async update() {
      const user = { ...this.user };
      user.endereco = this.user.endereco.split(';');
      this.$emit('update-user', user);
    },
    async bloque() {
      const { _id, isBloqued } = this.user;
      this.$emit('bloque-user', { _id: _id, isBloqued: !isBloqued });
    },
  },
  computed: {
    getBloqText() {
      return this.user.isBloqued ? 'Desbloquear' : 'Bloquear';
    },
  },
};
</script>
<style></style>
