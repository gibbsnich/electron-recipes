<template>
    <input type="text" class="importUrlField" v-model="recipeUrl" />
    <br />
    <button @click="startImport">Importieren</button>
</template>

<script>
import { defineComponent } from 'vue';
import { fetchRecipe } from '../util/fetchRecipe.js';

export default defineComponent({
    name: 'recipeImporter',
    data() {
        return {
            recipeUrl: ""
        }
    },
    emits: ['recipeImported'],
    methods: {
        async startImport() {
            if (!this.recipeUrl || this.recipeUrl.length === 0) {
                this.recipeUrl = 'https://www.chefkoch.de/rezepte/4045411625126577/Curry-Blumenkohl.html';
            }
            const existingRecipe = this.$store.state.recipes.find((r) => r.url === this.recipeUrl);
            if (existingRecipe) {
                this.$emit('recipeImported', existingRecipe);
            } else {
                const recipeData = await fetchRecipe(this.recipeUrl);
                this.$emit('recipeImported', recipeData);
            }
            this.recipeUrl = '';
        }
    },
})
</script>

<style scoped>
.importUrlField { width: 100%; }
</style>