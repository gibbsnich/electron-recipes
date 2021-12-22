<template>
    <div class="modal" tabindex="-1">
    <div class="modal-dialog">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title">Rezeptauswahl</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeNoSave"></button>
        </div>
        <div class="modal-body">
            <p>Rezept auswählen:</p>
            <div class="accordion">
                <div class="accordion-item" v-for="recipeCategory in this.$store.getters.getSortedRecipeCategories" v-bind:key="recipeCategory.id">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                            <button type="button" :class="['accordion-button', {collapsed: recipeCategory.id !== expandedCategory}]" @click="toggle(recipeCategory.id)">
                                {{ recipeCategory.name }}
                            </button>
                        </h2>
                        <div :class="['accordion-collapse', 'collapse', {show: recipeCategory.id === expandedCategory}]">
                            <div class="accordion-body">
                                <select class="form-select" aria-label="Rezeptauswahl" v-model="this.selectedRecipe">
                                    <option value="-1">Rezept wählen..</option>
                                    <option v-for="recipe in this.$store.getters.getSortedRecipes(recipeCategory.id)" :value="recipe.id" v-bind:key="recipe.id">
                                        {{ recipe.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
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
import { recurEventToEvent } from '../util/event';

export default defineComponent({
    name: 'SelectRecipeModal',
    emits: ['close'],
    props: {
        event: Object,
    },
    data() {
        return {
            selectedRecipe: null,
            expandedCategory: -1,
        }
    },
    computed: {
        selectedChoice: {
            get() {
                if (this.event) {
                    if (this.event.extendedProps.recur) {
                        const { eventStart } = recurEventToEvent(this.event);
                        const selEvent = this.$store.getters.getEventByStart(eventStart);
                        if (selEvent) {
                            return selEvent.extendedProps.recipeId;
                        }
                    } else {
                        return this.event.extendedProps.recipeId;
                    }
                }
                return null;
            },
            set(v) {
                this.selectedRecipe = v;
            }
        }
    },
    methods: {
        toggle(recipeCategoryId) {
            if (this.expandedCategory === recipeCategoryId) {
                this.expandedCategory = -1;
            } else {
                this.expandedCategory = recipeCategoryId;
            }
        },
        close() {
            this.$emit('close', this.selectedRecipe === -1 ? null : this.selectedRecipe);
        },
        closeNoSave() {
            this.$emit('close', null);
        },
    }
})
</script>

<style scoped>
    .accordion-button {
        padding: 0;
    }
</style>