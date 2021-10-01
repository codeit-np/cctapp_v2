<template>
  <div id="app">
      <el-skeleton v-if="$store.state.loading" v-loading.fullscreen.lock="$store.state.loading"/>
    <router-view v-else> </router-view>
  </div>
</template>

<script>


export default {
  name: 'app',
  components: {
  
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
