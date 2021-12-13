<template>
<div class='fc fc-media-screen fc-direction-ltr fc-theme-standard'>
    <div class='fc-header-toolbar fc-toolbar fc-toolbar-ltr'>
        <div class='fc-toolbar-chunk'>
            <div class='fc-button-group'>
                <button @click="gotoCalendar" type="button" class='fc-button fc-button-primary'>Kalender</button>
            </div>
        </div>
    </div>

    <div class="container">
        <div class="item">
            <h4>Vorhandene Rezepte:</h4>
            <ul>
                <li v-for="recipe in this.$store.state.recipes" v-bind:key="recipe.id">
                    <a href="#" @click.prevent="selectRecipe(recipe.id)">{{ recipe.name }}</a>
                </li>
            </ul>
            <button @click="addRecipe" type="button">Rezept anlegen</button>
            <button @click="importRecipe" type="button">Rezept importieren</button>
            <div v-show="showImporter">
                <RecipeImporter @recipe-imported="recipeImported" />
            </div>
        </div>
        <div class="item-center">
            <RecipeDetails :recipeId=recipeId :recipeData=recipeData />
        </div>
    </div>
</div>
</template>

<script>
import { defineComponent } from 'vue';
import RecipeDetails from './components/RecipeDetails.vue';
import RecipeImporter from './components/RecipeImporter.vue';

export default defineComponent({
  components: [ RecipeDetails ],
  name: 'recipes',
  components: {
    RecipeDetails,
    RecipeImporter,
  },
  data() {
      return {
          recipeId: null,
          recipeData: null,
          showImporter: false,
      }
  },
  methods: {
      gotoCalendar() {
          this.$router.push('/');
      },
      addRecipe() {
          this.recipeId = null;
          this.recipeData = null;
          this.showImporter = false;
      },
      importRecipe() {
          this.showImporter = !this.showImporter;
      },
      selectRecipe(rid) {
          this.recipeId = rid;
      },
      recipeImported(recipe) {
          this.recipeData = recipe;
          this.showImporter = false;
      }
  }
});
</script>

<style scoped src='@fullcalendar/common/main.css'></style>
<style scoped>
.container {
  display: flex;
}

.item {
  height: 100px;
  width: 240px;
}

.item-center { 
  flex-grow: 1;
}

.item + .item { 
  margin-left: 2%; 
}
</style>
