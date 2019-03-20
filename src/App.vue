<template>
  <div id="app">
    <router-view v-if="!loading"></router-view>
    <div v-if="loading" class="loadingSuccess max-width">
      <img src="./assets/imgage/Loading1.gif">
    </div>
  </div>
</template>

<script>
  var appVue = {
    name: "app",
    data() {
      return {
        transiName: "fide",
        loading: false
      };
    },
    watch: {
      $route(to, from) {
        this.transiName = "fide";
      },
    },
  }
  export default appVue;
</script>

<style lang="scss">
  #app {
    width: 100%;
    height: 100%;
  }
  .fide-enter-active,
  .fide-leave-active {
    transition: opacity 0.3s;
  }
  .fide-enter,
  .fide-leave-to {
    transition: opacity 0.3s;
  }
  .loadingSuccess {
    position: fixed;
    -webkit-transform: translateZ(0);
    -webkit-transform: translateZ(0);
    width: 100%;
    height: 100%;
    img {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
</style>
