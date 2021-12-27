<template>
    <settings-menu activeTab="categories" />
    <div class="container">
        <h4>Kategorien</h4>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import SettingsMenu from './components/SettingsMenu.vue';

export default defineComponent({
  name: 'categories',
  components: {
    SettingsMenu,
  },
});
</script>