<template>
  <div class="content" style="padding-top: 0!important;">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-90">
        <md-card>
          <md-card-header data-background-color="green">
            <h4 class="title">Utilizadores</h4>
            <p class="category">Todos utilizadores da Aplicação</p>
          </md-card-header>
          <md-card-content>
            <TableUsers :users="getUsers"></TableUsers>
          </md-card-content>
        </md-card>
      </div>
    </div>
  </div>
</template>

<script>
import { TableUsers } from '@/pages';

export default {
  components: { TableUsers },
  methods: {
    updateUser(user) {
      (async () => {
        try {
          let response = await this.$store.dispatch('userStore/updateUser', user);
          this.fecthUsers();
        } catch (err) {
          this.notifyVue(status.DANGER, err.message);
        }
      })();
    },
  },
  computed: {
    getUsers() {
      return this.$store.getters['userStore/getUsers'];
    },
  },
};
</script>
