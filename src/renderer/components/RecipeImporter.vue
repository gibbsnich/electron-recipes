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

            const existingRecipes = this.$store.state.recipes.filter((r) => r.url === this.recipeUrl);
            if (existingRecipes.length > 0) {
                //todo show user
                console.warn('Already imported.');
                this.$emit('recipeImported', existingRecipes[0]);
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