<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-profile-form
          :get-user="user"
          :is-my-profile="false"
          :is-bloque="true"
          title="Detalhes do Utilizador"
          description="Informações Detalhadas do Utilizador"
          :data-background-color="getHeadColor(user)"
          @bloque-user="updateUser"
        ></edit-profile-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <user-card
          :get-user="user"
          :is-my-profile="false"
          :get-profile-photo="`${getUserImgUrl}${user.photo}`"
          @update-user="updateUser"
        ></user-card>
      </div>
    </div>
  </div>
</template>

<script>
import { EditProfileForm, UserCard } from '@/pages';

export default {
  name: 'user-detalhe',
  components: {
    EditProfileForm,
    UserCard,
  },
  props: ['userId'],
  data() {
    return {
      user: {
        descricao: null,
        endereco: [],
        photo: null,
        dataNascimento: null,
        actividade: null,
        sectorActividade: null,
        nif: '',
        isBloqued: false,
        secretUser: false,
        _id: null,
        name: '',
        email: '',
        role: { modalidades: [], _id: null, perfil: null, perfilCode: null },
        telemovel: null,
      },
    };
  },
  mounted() {
    this.getSolicitacaoById();
  },
  methods: {
    async updateUser(user) {
      const loader = this.$loading.show({
        color: '#4caf50',
        opacity: 0.3,
      });
      console.log(user);
      try {
        let response = await this.$store.dispatch('userStore/updateUser', user);
        await this.fetchUsers();
        loader.hide();
        this.$router.push('/users');
      } catch (err) {
        loader.hide();
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
    notifyVue(status, message) {
      this.$notify({
        message: message,
        icon: 'add_alert',
        horizontalAlign: 'right',
        verticalAlign: 'top',
        type: status,
      });
    },
    async getSolicitacaoById() {
      try {
        const response = await this.$store.dispatch('userStore/getUserById', this.userId);
        this.user = response.data.doc;
      } catch (err) {
        this.notifyVue(status.DANGER, err.message);
      }
    },
    getHeadColor(user) {
      return user.isBloqued ? 'orange' : 'green';
    },
  },
  computed: {
    getUserImgUrl() {
      return this.$store.getters['userStore/getUserImgUrl'];
    },
  },
};
</script>
