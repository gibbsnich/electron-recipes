<template>
    <div class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Zutatenauswahl</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeNoSave"></button>
                </div>
                <div class="modal-body">
                    <div v-if="this.$store.state.ingredients.length === 0">
                        Bisher keine Zutaten vorhanden...
                    </div>
                    <div v-else>
                        <p>Zutaten auswählen:</p>
                        <div class="accordion">
                            <div class="accordion-item" v-for="ingredientCategory in this.$store.getters.getSortedIngredientCategories" v-bind:key="ingredientCategory.id">
                                <div class="accordion-item">
                                    <h2 class="accordion-header">
                                        <button type="button" :class="['accordion-button', {collapsed: ingredientCategory.id !== expandedCategory}]" @click="toggle(ingredientCategory.id)">
                                            {{ ingredientCategory.name }}
                                        </button>
                                    </h2>
                                    <div :class="['accordion-collapse', 'collapse', {show: ingredientCategory.id === expandedCategory}]">
                                        <div class="accordion-body">
                                            <button type="button" class="btn btn-outline-primary btn-ing"
                                                @click="addIngredientById(ingredient.id)"
                                                v-for="ingredient in this.$store.getters.getSortedIngredients(ingredientCategory.id)" v-bind:key="ingredient.id">
                                                {{ ingredient.ingredient }}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p>Gewählte Zutaten:</p>
                        <ingredients-list :ingredients="this.ingredients" />
                    </div>
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
import IngredientsList from './IngredientsList.vue';

export default defineComponent({
    name: 'RandomIngredientsModal',
    emits: ['close'],
    components: {
        IngredientsList,
    },
    props: {
        date: String,
    },
    data() {
        return {
            expandedCategory: -1,
            ingredientsArray: [],
        }
    },
    computed: {
        ingredients: {
            get() {
                if (this.date) {
                    const ingredientsEvent = this.$store.getters.getIngredientEventByStart(this.date + "T14:00");
                    if (ingredientsEvent) {
                        this.ingredientsArray = JSON.parse(JSON.stringify(ingredientsEvent.extendedProps.ingredients));
                    }
                }
                return this.ingredientsArray;
            }
        }
    },
    methods: {
        close() {
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
        },
        closeNoSave() {
            this.ingredientsArray = [];
            this.$emit('close', null);
        },
        toggle(ingredientCategoryId) {
            if (this.expandedCategory === ingredientCategoryId) {
                this.expandedCategory = -1;
            } else {
                this.expandedCategory = ingredientCategoryId;
            }
        },
        addIngredientById(ingredientId) {
            const selIngredient = this.$store.getters.getIngredientById(ingredientId);
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
    button.btn-ing {
        margin-top: .2rem;
    }
</style>