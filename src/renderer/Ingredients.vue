<template>
    <settings-menu activeTab="ingredients" />
    <div class="container">
        <h4>Zutaten</h4>
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Kategorie</th>
                    <th scope="col">Laden</th>
                    <th scope="col">&nbsp;</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(ingredient, index) in ingredients" v-bind:key="ingredient.id">
                    <td>
                        <input type="text" class="form-control" v-model="ingredient.ingredient" @change="updateDirty(index)"/>
                    </td>
                    <td>
                        <select class="form-select" @change="updateDirty(index)" v-model="ingredient.categoryId">
                            <option v-for="category in this.$store.getters.getSortedIngredientCategories" v-bind:key="category.id" :value="category.id" :selected="ingredient.categoryId === category.id">
                                {{ category.name }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <select class="form-select" @change="updateDirty(index)" v-model="ingredient.storeId">
                            <option v-for="store in this.$store.getters.getSortedIngredientStores" v-bind:key="store.id" :value="store.id" :selected="ingredient.storeId === store.id">
                                {{ store.name }}
                            </option>
                        </select>
                    </td>
                    <td>
                        <button type="button" class="btn btn-success btn-sm" aria-label="Save" @click="saveIngredient(index)" :disabled="!dirty[index]">
                            <font-awesome-icon icon="save" />
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import SettingsMenu from './components/SettingsMenu.vue';

export default defineComponent({
  name: 'ingredients',
  components: {
    SettingsMenu,
  },
  data() {
      return {
          ingredients: [],
          originalIngredients: [],
          dirty: [],
      }
  },
  mounted() {
      this.ingredients = JSON.parse(JSON.stringify(this.$store.getters.getSortedIngredients));
      this.originalIngredients = JSON.parse(JSON.stringify(this.$store.getters.getSortedIngredients));
      this.dirty = [];
  },
  methods: {
      updateDirty(index) {
          const curIngredient = this.ingredients[index];
          const nameExists = !this.originalIngredients.find(oi => oi.id !== curIngredient.id && oi.ingredient === curIngredient.ingredient);
          this.dirty[index] = nameExists && curIngredient.ingredient.length > 0 && (curIngredient.ingredient !== this.originalIngredients[index].ingredient ||
              curIngredient.categoryId !== this.originalIngredients[index].categoryId ||
              curIngredient.storeId !== this.originalIngredients[index].storeId);
      },
      saveIngredient(index) {
          this.$store.dispatch('updateIngredient', this.ingredients[index]);
          this.originalIngredients = JSON.parse(JSON.stringify(this.$store.getters.getSortedIngredients));
          this.updateDirty(index);
      },
  },
});
</script>