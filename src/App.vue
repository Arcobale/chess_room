<template>
  <router-view></router-view>
</template>

<script>
import Golang from './components/Golang.vue'

export default {
  name: 'App',
  components: {
    Golang,
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
