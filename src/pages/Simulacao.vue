<template>
  <div class="content">
    <SeguroParticular v-if="restrictTo(2)"></SeguroParticular>
    <SeguroEmpresa v-else></SeguroEmpresa>
  </div>
</template>

<script>
import { SeguroParticular, SeguroEmpresa } from '@/pages';

export default {
  components: { SeguroParticular, SeguroEmpresa },
  data: () => ({}),
  methods: {},
  computed: {
    restrictTo() {
      return this.$store.getters['userStore/restrictTo'];
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
