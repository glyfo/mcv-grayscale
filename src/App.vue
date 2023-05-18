<template>
  <div id="app">
    <LoadingScreen :isLoading="isLoading" />
    <main v-if="!isLoading">
     <HomeView/>
    </main>
  </div>

</template>
<script setup>
import LoadingScreen from './components/LoadingScreen.vue'
import HomeView from './views/HomeView.vue'
</script>
<style>
body { margin: 0; padding: 0; background : #0A0C16 }
</style>