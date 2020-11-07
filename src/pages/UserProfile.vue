<template>
  <div class="content">
    <div class="md-layout">
      <div class="md-layout-item md-medium-size-100 md-size-66">
        <edit-profile-form
          :get-user="getUser"
          @update-user="updateUser"
          data-background-color="green"
        ></edit-profile-form>
      </div>
      <div class="md-layout-item md-medium-size-100 md-size-33">
        <user-card
          :get-user="getUser"
          :get-profile-photo="getProfilePhoto"
          @update-user="updateUser"
        ></user-card>
      </div>
    </div>
  </div>
</template>

<script>
import { EditProfileForm, UserCard } from '@/pages';

export default {
  components: {
    EditProfileForm,
    UserCard,
  },
  methods: {
    async updateUser(user) {
      const loader = this.$loading.show({
        color: '#4caf50',
        opacity: 0.3,
      });
      try { 
        let response = await this.$store.dispatch('userStore/updateMe', user);
        loader.hide();
      } catch (err) {
        loader.hide();
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
  },
  computed: {
    getUser() {
      return this.$store.getters['userStore/getUser'];
    },
    getProfilePhoto() {
      return this.$store.getters['userStore/getProfilePhoto'];
    },
  },
};
</script>
