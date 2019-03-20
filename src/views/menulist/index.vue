
<template>
  <div class="hello">
    <ul>
      <li v-for="item in menulist">
        <router-link :to="item.path">
          {{item.meta.name}}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
  import route from '@/router/index.js'
  export default {
    data() {
      return {
        menulist: []
      }
    },
    methods: {},
    mounted() {
      this.menulist = route.options.routes
    }
  }
</script>

<style lang="scss">

</style>
