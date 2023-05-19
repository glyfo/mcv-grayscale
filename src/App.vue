<script setup>
import IPhoneView from './views/IPhoneView.vue';
import DesktopView from './views/DesktopView.vue';

const isIOSSafari = !!window.navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

</script>

<template>
  <div id="app">

    <div v-if="isIOSSafari">
      <IPhoneView/>
    </div>
    <div v-else>
      <DesktopView/>
    </div>

</div>

</template>