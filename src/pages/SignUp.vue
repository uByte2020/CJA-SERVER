<template>
  <div class="wrapper wrapper-full-page">
    <notifications></notifications>
    <div
      class="page-header login-page header-filter"
      filter-color="black"
      :style="{ 'background-image': 'url(' + backgroundImg + ')' }"
      style="
            background-size: cover;
            background-position: top center;
          "
    ></div>
    <div class="content div-content-center">
      <div class="md-layout" style="overflow-y: scroll;">
        <div
          style="overflow-y: hidden;"
          class="md-layout-item md-small-size-100 md-xsmall-size-100 md-medium-size-60 md-size-40 card-center"
        >
          <sigin-form data-background-color="green"></sigin-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SiginForm } from '@/pages';

export default {
  data() {
    return {
      backgroundImg: require('@/assets/img/login.jpg'),
    };
  },
  components: {
    SiginForm,
  },
};
</script>

<style scoped>
.md-layout-item {
  margin: auto;
}
.div-content-center {
  z-index: 2;
  /* position: relative; */
  position: absolute !important;
  margin: auto;
  top: 0%;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}

.div-content-center::-webkit-scrollbar {
  display: none;
  -ms-overflow-style: none;
}

.header-filter {
  position: relative;
  filter: brightness(0.6);
}
.page-header,
.page-header .page-header-image {
  height: 100%;
  background-position: 50%;
  background-size: cover;
}
.page-header {
  min-height: 100vh;
  max-height: 1000px;
  display: flex !important;
  padding: 0;
  margin: 0;
  border: 0;
  color: #fff;
  position: relative;
  align-items: center;
}
.wrapper.wrapper-full-page {
  height: auto;
  min-height: 100vh;
}
.wrapper {
  position: relative;
  top: 0;
  height: 100vh;
}
</style>
