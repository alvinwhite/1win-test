<template>
    <div class="app">
        <app-header></app-header>
        <router-view></router-view>
    </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue'

export default {
    name: 'app',
    components: {
        AppHeader
    }
}
</script>

<style>
.app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}


</style>
