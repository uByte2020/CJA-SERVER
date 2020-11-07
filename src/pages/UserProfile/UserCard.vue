<template>
  <md-card class="md-card-profile">
    <notifications></notifications>
    <div class="md-card-avatar">
      <img class="img" :src="getProfilePhoto" />
    </div>

    <md-card-content>
      <h6 class="category text-gray">{{ getUser.role.perfil }}</h6>
      <h4 class="card-title">{{ getUser.name }}</h4>
      <p class="card-description">{{ getUser.descicao }}</p>
      <input
        @change="updateProfilePhoto($event)"
        style="display: none"
        type="file"
        accept="image/jpeg, image/png, image/jpg"
        ref="fileInput"
      />
      <md-button
        v-show="isMyProfile"
        class="md-round md-success"
        @click="$refs.fileInput.click()"
      >Actualizar Foto</md-button>
    </md-card-content>
  </md-card>
</template>
<script>
export default {
  name: 'user-card',
  props: {
    cardUserImage: {
      type: String,
      default: require('@/assets/img/faces/marc.jpg'),
    },
    getUser: Object,
    getProfilePhoto: String,
    isMyProfile: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {
    updateProfilePhoto(event) {
      const files = event.currentTarget.files;
      const user = new FormData();
      user.append('photo', files[0]);
      this.$emit('update-user', user);
    },
  },
};
</script>
<style></style>
