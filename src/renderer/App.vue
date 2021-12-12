<template>
  <div id="app">
    <container />
    <Calendar />
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import Calendar from './components/Calendar.vue'
import { ipcRenderer } from '@/electron';
import { container } from 'jenesius-vue-modal';

export default defineComponent({
  name: 'app',
  components: {
    Calendar,
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
