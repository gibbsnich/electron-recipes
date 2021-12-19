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
    <ul class="list-group list-group-flush">
        <li class="list-group-item" v-for="(ingredient, index) in currentRecipe.ingredients" v-bind:key="index">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Menge" aria-label="Zutat" v-model="ingredient.amount" >
                <input type="text" class="form-control" placeholder="Zutat" readonly aria-label="Menge" v-model="ingredient.ingredient" >
                <button type="button" class="btn btn-danger btn-sm" aria-label="Close" @click="deleteIngredient(index)">[X]</button>
            </div>
        </li>
        <li class="list-group-item">
            <div class="input-group">
                <!-- todo: DropDown vorhandener passender Zutaten, wenn mehr als Zeichen eingegeben wurde -->
                <input type="text" class="form-control" placeholder="Menge" aria-label="Zutat" v-model="newIngredient.amount">
                <input type="text" class="form-control" placeholder="Zutat" aria-label="Menge" v-model="newIngredient.ingredient">
                <button type="button" class="btn btn-success btn-sm" aria-label="Close" @click="addIngredient()">[N]</button>
            </div>
        </li>
    </ul>
    <h5 id="prep-label">Zubereitung:</h5>
    <textarea class="form-control" rows="20" v-model="currentRecipe.preparation" />
    <button id="save-button" type="button" class="btn btn-primary" :disabled="currentRecipe.name === ''" @click="saveRecipe" >Rezept speichern</button>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'RecipeDetails',
    setup() {

    },
    props: {
        recipeId: Number, 
        recipeData: Object,
        clearRecipe: Boolean,
    },
    data() {
      return {
          currentRecipe: this.makeEmptyRecipe(),
          newIngredient: this.makeEmptyIngredient(),
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
            this.currentRecipe = recipe;
        },
        recipeData(rdata) {
            if (!rdata)
                return;
            this.currentRecipe = rdata;
        },
        clearRecipe(flag) {
            if (flag) {
                this.currentRecipe = this.makeEmptyRecipe();
            }
        },
    },
    methods: {
        addIngredient() {
            if (this.newIngredient.ingredient !== '') {
                this.currentRecipe.ingredients.push(this.newIngredient);
                this.newIngredient = this.makeEmptyIngredient();
            }
        },
        deleteIngredient(index) {
            this.currentRecipe.ingredients.splice(index, 1);
        },
        saveRecipe() {
            this.currentRecipe.ingredients = this.currentRecipe.ingredients.filter((i) => i.amount !== '' || i.ingredient !== '');
            if (this.newIngredient.amount !== '' || this.newIngredient.ingredient !== '') {
                this.currentRecipe.ingredients.push(this.newIngredient);
            }
            this.$store.dispatch('storeRecipe', this.currentRecipe);
            this.currentRecipe = this.makeEmptyRecipe();
            this.newIngredient = this.makeEmptyIngredient();
        },
        makeEmptyIngredient() {
            return {amount: '', ingredient: ''};
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