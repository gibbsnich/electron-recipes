<template>
    <ingredient-without-category-modal v-show="isIngredientWithoutCategoryModalVisible" @close="closeIngredientsWithoutCategoryModal" v-bind:ingredient="ingredientWithoutCategory" />
    <div class='fc fc-media-screen fc-direction-ltr fc-theme-standard'>
        <div class='fc-header-toolbar fc-toolbar fc-toolbar-ltr'>
            <div class='fc-toolbar-chunk'>
                <div class='fc-button-group'>
                    <button @click="gotoCalendar" type="button" class='fc-button fc-button-primary'>Kalender</button>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="row">
                <div class="col-sm-3">
                    <h6>Vorhandene Rezepte:</h6>
                    <div class="list-group">
                        <button type="button" v-for="recipe in this.$store.state.recipes" v-bind:key="recipe.id" 
                                :class="['list-group-item', 'list-group-item-action', {active: recipeId === recipe.id}]"
                                @click="selectRecipe(recipe.id)">{{ recipe.name }}</button>
                    </div>
                    <ul class="list-group" id="action-group">
                        <li class="list-group-item">
                            <button type="button" class="btn btn-primary" @click="addRecipe" >Rezept anlegen</button>
                        </li>
                        <li class="list-group-item">
                            <button type="button" :class="['btn', 'btn-primary', {active: showImporter}]" @click="importRecipe" >Rezept importieren</button>
                            <div v-show="showImporter">
                                <RecipeImporter @recipe-imported="recipeImported" />
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="col-sm-9">
                    <RecipeDetails :recipeId=recipeId :recipeData=recipeData :clearRecipe=clearRecipe @save="recipeSaved" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import RecipeDetails from './components/RecipeDetails.vue';
import RecipeImporter from './components/RecipeImporter.vue';
import { UnknownIngredientsMixin } from './components/UnknownIngredientsMixin.js';
import IngredientWithoutCategoryModal from './components/IngredientWithoutCategoryModal.vue';

export default defineComponent({
  components: [ RecipeDetails ],
  name: 'recipes',
  components: {
    RecipeDetails,
    RecipeImporter,
    IngredientWithoutCategoryModal,
  },
  mixins: [UnknownIngredientsMixin],
  data() {
      return {
          recipeId: null,
          recipeData: null,
          showImporter: false,
          clearRecipe: false,
          savedRecipe: null,
      }
  },
  methods: {
      gotoCalendar() {
          this.$router.push('/');
      },
      addRecipe() {
          this.clearRecipe = true;
          this.recipeId = null;
          this.recipeData = null;
          this.showImporter = false;
      },
      importRecipe() {
          this.showImporter = !this.showImporter;
      },
      selectRecipe(rid) {
          this.clearRecipe = false;
          this.recipeData = null;
          this.recipeId = rid;
      },
      recipeImported(recipe) {
          this.clearRecipe = false;
          this.recipeData = recipe;
          this.recipeId = recipe.id ? recipe.id : null;
          this.showImporter = false;
      },
      recipeSaved(recipe) {
          const withoutCategory = this.checkForIngredientsWithoutCategory(recipe.ingredients);
          if (withoutCategory) {
              this.savedRecipe = recipe;
              this.ingredientWithoutCategory = withoutCategory;
              this.isIngredientWithoutCategoryModalVisible = true;
              this.unknownIngredients = this.savedRecipe.ingredients;
          } else {
              this.$store.dispatch('storeRecipe', recipe);
          }
      },
      finishedHandlingUnknownIngredients() {
          this.$store.dispatch('storeRecipe', this.savedRecipe);
          this.savedRecipe = null;
      },
  }
});
</script>

<style scoped src='@fullcalendar/common/main.css'></style>
<style scoped>
#action-group {margin-top: 1rem;}
</style>