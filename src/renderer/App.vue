<template>
  <div id="app">
    <container />
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { container } from 'jenesius-vue-modal';

export default defineComponent({
  name: 'app',
  components: {
    container,
  },
  beforeMount() {
    this.$store.dispatch('loadInitialData');
  }
});
</script>

<style>
  .modal-container {
    z-index: 100;
  }
</style>
