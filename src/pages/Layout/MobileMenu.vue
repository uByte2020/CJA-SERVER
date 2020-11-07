<template>
  <ul class="nav nav-mobile-menu">
    <li>
      <a @click="logout()"><i class="material-icons">person</i> 
        <p>Sair</p></a
      >
    </li>
  </ul>
</template>
<script>
export default {
  data() {
    return {
      search: null,
      selectedEmployee: null,
      employees: [
        'Jim Halpert',
        'Dwight Schrute',
        'Michael Scott',
        'Pam Beesly',
        'Angela Martin',
        'Kelly Kapoor',
        'Ryan Howard',
        'Kevin Malone',
      ],
    };
  },
  methods: {
    async logout() {
      try {
        let response = await this.$store.dispatch('userStore/logout');
      } catch (err) {
        // console.log(err);
      }
      this.$router.push({ path: '/login' });
    },
  },
};
</script>
