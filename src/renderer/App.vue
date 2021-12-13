<template>
  <div id="app">
    <container />
    <router-view />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
//import { ipcRenderer } from '@/electron';
import { container } from 'jenesius-vue-modal';

export default defineComponent({
  name: 'app',
  components: {
    container,
  },
  setup() {
    //ipcRenderer.send('message', 'Hello from App.vue!');
  },
});
</script>

<style>
  .modal-container {
    z-index: 100;
  }
</style>
