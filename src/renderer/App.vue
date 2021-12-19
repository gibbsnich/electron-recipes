<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'app',
  beforeMount() {
    this.$store.dispatch('loadInitialData');
  }
});
</script>

<style>
  .modal {
    display: block;
  }
</style>
