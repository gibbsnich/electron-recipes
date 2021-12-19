
<template>
    <select-recipe-modal v-show="isSelectRecipeModalVisible" @close="closeSelectRecipeModal" v-bind:event="selectRecipeModalEventInfo" />
    <random-ingredients-modal v-show="isRandomIngredientsModalVisible" @close="closeRandomIngredientsModal" v-bind:date="randomIngredientsDate" />
    <ingredient-without-category-modal v-show="isIngredientWithoutCategoryModalVisible" @close="closeIngredientsWithoutCategoryModal" v-bind:ingredient="ingredientWithoutCategory" />
    <FullCalendar :options="{...calendarOptions, events: this.$store.state.events}"  />
</template>

<script>
import { defineComponent } from 'vue';
import '@fullcalendar/core/vdom'; // solves problem with Vite
import deLocale from '@fullcalendar/core/locales/de';
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import SelectRecipeModal from './SelectRecipeModal.vue';
import RandomIngredientsModal from './RandomIngredientsModal.vue';
import IngredientWithoutCategoryModal from './IngredientWithoutCategoryModal.vue';
import { dateToString } from '../util/date.js';
import { generatePDF } from '../util/generatePDF.js';

export default defineComponent({
    components: {
        FullCalendar,
        SelectRecipeModal,
        RandomIngredientsModal,
        IngredientWithoutCategoryModal,
    },
    data() {
        return {
            currentSelection: null,
            calendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                locale: deLocale,
                //slotDuration: "02:00:00",
                initialView: 'timeGridWeek',
                headerToolbar: {
                    left: 'prev,next today gotoRecipesButton generatePDFButton',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek'
                },
                customButtons: {
                    gotoRecipesButton: {
                        text: 'Rezepte',
                        click: () => {
                            this.$router.push('/recipes');
                        }
                    },
                    generatePDFButton: {
                        text: 'PDF erzeugen',
                        click: () => {
                            if (this.currentSelection) {
                                generatePDF(this.currentSelection, this.$store);
                            }
                        }
                    }
                },
                eventClick: this.handleEventClick,
                editable: true,
                selectable: true,
                select: this.handleSelect,
                dateClick: this.handleDateClick,
            },
            isSelectRecipeModalVisible: false,
            selectRecipeModalEventInfo: null,
            isRandomIngredientsModalVisible: false,
            randomIngredientsDate: null,
            newIngredientsEvent: null,
            isIngredientWithoutCategoryModalVisible: false,
            ingredientWithoutCategory: null,
        }
    },
    methods: {
        handleSelect(info) {
            this.currentSelection = {start: info.start, end: info.end};
        },
        handleEventClick(info) {
            if (info.event.extendedProps.extra) {
                this.randomIngredientsDate = dateToString(info.event.start)
                this.isRandomIngredientsModalVisible = true;
            } else {
                this.selectRecipeModalEventInfo = info.event;
                this.isSelectRecipeModalVisible = true;
            }
        },
        closeSelectRecipeModal(selectedRecipe) {
            this.isSelectRecipeModalVisible = false;
            if (selectedRecipe) {
                this.selectRecipeModalEventInfo.recipeId = selectedRecipe;
                this.$store.dispatch('storeEvent', this.selectRecipeModalEventInfo);
            }
            this.selectRecipeModalEventInfo = null;
        },
        handleDateClick(info) {
            this.randomIngredientsDate = dateToString(info.date);
            this.isRandomIngredientsModalVisible = true;
        },
        closeRandomIngredientsModal(ingredientsEvent) {
            this.isRandomIngredientsModalVisible = false;
            if (ingredientsEvent) {
                const withoutCategory = checkForIngredientsWithoutCategory(ingredientsEvent);
                if (withoutCategory) {
                    this.ingredientWithoutCategory = withoutCategory;
                    this.isIngredientWithoutCategoryModalVisible = true;
                    this.newIngredientsEvent = ingredientsEvent;
                } else {
                    //todo delete event if empty ingredients
                    this.$store.dispatch('storeEvent', ingredientsEvent);
                }
            }
            this.randomIngredientsDate = null;
        },
        async closeIngredientsWithoutCategoryModal(selectedIngredientCategory) {
            if (selectedIngredientCategory.name) {
                await this.$store.dispatch('storeIngredientCategory', selectedIngredientCategory.name);
                const ingredientCategory = this.$store.state.ingredientCategories.find((ic) => ic.name === selectedIngredientCategory.name);
                if (!ingredientCategory) {
                    console.warn("Cannot find created category!");
                } else {
                    selectedIngredientCategory.id = ingredientCategory.id;
                }
            }
            this.$store.dispatch('storeIngredient', {ingredientWithoutCategory: this.ingredientWithoutCategory, ingredientCategoryId: selectedIngredientCategory.id});
            const withoutCategory = checkForIngredientsWithoutCategory(this.newIngredientsEvent);
            if (withoutCategory) {
                this.ingredientWithoutCategory = withoutCategory;
            } else {
                this.$store.dispatch('storeEvent', this.newIngredientsEvent);
                this.newIngredientsEvent = null;
                this.isIngredientWithoutCategoryModalVisible = false;
            }
        },
    }
});

function checkForIngredientsWithoutCategory(ingredientsEvent) {
    const withoutCategory = ingredientsEvent.extendedProps.ingredients.find((i) => !i.id);
    if (withoutCategory) {
        return withoutCategory;
    }
    return null;
}
</script>
