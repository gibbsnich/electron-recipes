<template>
    <div class="row mb-3">
        <label for="name-input" class="col-sm-2 col-form-label">Name</label>
        <div class="col-sm-10">
        <input type="text" class="form-control" id="name-input" v-model="currentRecipe.name">
        </div>
    </div>
    <div class="row mb-3">
        <label for="name-input" class="col-sm-2 col-form-label">Genug für</label>
        <div class="col-sm-3">
        <input type="text" class="form-control" id="name-input" v-model="currentRecipe.serving.value">
        </div>
        <div class="col-sm-7">
        <input type="text" class="form-control" id="name-input" v-model="currentRecipe.serving.type">
        </div>
    </div>
    <h5>Zutaten:</h5>
    <ingredients-list :ingredients="this.currentRecipe.ingredients" />
    <h5 id="prep-label">Zubereitung:</h5>
    <textarea class="form-control" rows="20" v-model="currentRecipe.preparation" />
    <button id="save-button" type="button" class="btn btn-primary" :disabled="currentRecipe.name === ''" @click="saveRecipe" >Rezept speichern</button>
</template>

<script>
import { defineComponent } from 'vue';
import IngredientsList from './IngredientsList.vue';

export default defineComponent({
    name: 'RecipeDetails',
    components: {
        IngredientsList,
    },
    props: {
        recipeId: Number, 
        recipeData: Object,
        clearRecipe: Boolean,
    },
    data() {
      return {
          currentRecipe: this.makeEmptyRecipe(),
      }
    },
    watch: {
        recipeId(rid) {
            if (!rid)
                return;
            const recipe = this.$store.state.recipes.find((recipe) => recipe.id === rid);
            if (!recipe) {
                return console.warn("Couldn't select recipe.")
            }
            this.currentRecipe = JSON.parse(JSON.stringify(recipe));
        },
        recipeData(rdata) {
            if (!rdata)
                return;
            this.currentRecipe = JSON.parse(JSON.stringify(rdata));
        },
        clearRecipe(flag) {
            if (flag) {
                this.currentRecipe = this.makeEmptyRecipe();
            }
        },
    },
    methods: {
        saveRecipe() {
            this.currentRecipe.ingredients = this.currentRecipe.ingredients.filter((i) => i.amount !== '' || i.ingredient !== '');
            this.$store.dispatch('storeRecipe', this.currentRecipe);
            //keep current recipe visible after save
            //this.currentRecipe = this.makeEmptyRecipe();
        },
        makeEmptyRecipe() {
            return {name: '', serving: {value: '', type: ''}, ingredients: [], preparation: '', url: ''};
        }
    }
})
</script>

<style scoped>
    #prep-label { margin-top: .5rem; }
    #save-button { margin-top: .5rem; margin-left: 2rem; margin-bottom: 1rem; }
</style>