<template>
<div class="modal" tabindex="-1">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Zutatenauswahl</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeNoSave"></button>
      </div>
      <div class="modal-body">
        <p>Zutaten auswählen:</p>
        <div class="accordion">
            <div class="accordion-item"
                    v-for="ingredientCategory in this.$store.state.ingredientCategories" v-bind:key="ingredientCategory.id">
                <div class="accordion-item">
                    <h2 class="accordion-header">
                        <button type="button" :class="['accordion-button', {collapsed: ingredientCategory.id !== expandedCategory}]" @click="toggle(ingredientCategory.id)">
                            {{ ingredientCategory.name }}
                        </button>
                    </h2>
                    <div :class="['accordion-collapse', 'collapse', {show: ingredientCategory.id === expandedCategory}]">
                        <div class="accordion-body">
                            <button type="button" class="btn btn-outline-primary"
                                @click="addIngredientById(ingredient.id)"
                                v-for="ingredient in this.$store.state.ingredients.filter((i) => { return i.categoryId === ingredientCategory.id })" v-bind:key="ingredient.id">
                                {{ ingredient.ingredient }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <p>Gewählte Zutaten:</p>
        <ul class="list-group list-group-flush">
            <li class="list-group-item" v-for="(ingredient, index) in ingredients" v-bind:key="index">
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Menge" aria-label="Zutat" v-model="ingredient.amount" >
                    <input type="text" class="form-control" placeholder="Zutat" readonly aria-label="Menge" v-model="ingredient.ingredient" >
                    <button type="button" class="btn btn-danger btn-sm" aria-label="Close" @click="deleteIngredient(index)">[X]</button>
                </div>
            </li>
            <li class="list-group-item">
                <div class="input-group mb-3">
                    <!-- todo: DropDown vorhandener passender Zutaten, wenn mehr als Zeichen eingegeben wurde -->
                    <input type="text" class="form-control" placeholder="Menge" aria-label="Zutat" v-model="newIngredient.amount">
                    <input type="text" class="form-control" placeholder="Zutat" aria-label="Menge" v-model="newIngredient.ingredient">
                    <button type="button" class="btn btn-success btn-sm" aria-label="Close" @click="addIngredient()">[N]</button>
                </div>
            </li>
        </ul>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" @click="close">Speichern</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'RandomIngredientsModal',
    props: {
        date: String,
    },
    data() {
        return {
            newIngredient: this.makeEmptyIngredient(),
            expandedCategory: -1,
            ingredientsArray: [],
        }
    },
    computed: {
        ingredients: {
            get() {
                if (this.date) {
                    const ingredientsEvent = this.$store.state.events.find((e) => e.extendedProps.extra && e.start === this.date + "T14:00");
                    if (ingredientsEvent) {
                        this.ingredientsArray = JSON.parse(JSON.stringify(ingredientsEvent.extendedProps.ingredients));
                    }
                }
                return this.ingredientsArray;
            }
        }
    },
    methods: {
        addIngredient() {
            if (this.newIngredient.ingredient !== '') {
                //todo match to existing ingredient (with ID!), 
                //if no match: show red border
                this.ingredients.push(this.newIngredient);
                this.newIngredient = this.makeEmptyIngredient();
            }
        },
        deleteIngredient(index) {
            this.ingredients.splice(index, 1);
        },
        close() {
            this.ingredients.push(this.newIngredient);
            const nonEmptyIngredients = this.ingredients.filter((i) => i.amount !== '' || i.ingredient !== '');
            if (nonEmptyIngredients.length > 0) {
                this.$emit('close', {
                    title: 'Zutaten',
                    color: 'black',
                    start: `${this.date}T14:00`,
                    end: `${this.date}T15:00`,
                    extendedProps: {extra: true, ingredients: nonEmptyIngredients},
                });
            } else {
                this.$emit('close', null);    
            }
            this.ingredientsArray = [];
            this.expandedCategory = -1;
            this.newIngredient = this.makeEmptyIngredient();
        },
        closeNoSave() {
            this.ingredientsArray = [];
            this.$emit('close', null);
        },
        makeEmptyIngredient() {
            return {amount: '', ingredient: '', id: null, categoryId: null};
        },
        toggle(ingredientCategoryId) {
            if (this.expandedCategory === ingredientCategoryId) {
                this.expandedCategory = -1;
            } else {
                this.expandedCategory = ingredientCategoryId;
            }
        },
        addIngredientById(ingredientId) {
            const selIngredient = this.$store.state.ingredients.find((i) => i.id === ingredientId);
            if (selIngredient) {
                this.ingredients.push({amount: '', ingredient: selIngredient.ingredient, id: selIngredient.id, categoryId: selIngredient.categoryId});
            }
        },
    }
})
</script>
<style scoped>
button.btn {
    margin-right: .5rem;
}
.accordion-button {
    padding: 0;
}
</style>