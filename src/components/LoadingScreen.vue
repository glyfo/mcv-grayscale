<script>
export default {
  name: "LoadingScreen",
  props: ["isLoading"]
};
</script>

<template>
    <div :class="{ loader: true, fadeout: !isLoading }">
  
    </div>
  </template>
  

  
  <style>
  .loader {
    background-color: #000000;
    bottom: 0;
    color: white;
    display: block;
    font-size: 32px;
    left: 0;
    overflow: hidden;
    padding-top: 10vh;
    position: fixed;
    right: 0;
    text-align: center;
    top: 0;
  }
  
  .fadeout {
    animation: fadeout 5s forwards;
  }
  
  @keyframes fadeout {
    to {
      opacity: 0;
      visibility: hidden;
    }
  }
  </style>