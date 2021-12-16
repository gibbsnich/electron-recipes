<template>
    <div class='modal'>
        <div v-for="(ingredient, index) in ingredients" v-bind:key="index">
            <input type="text" v-model="ingredient.amount" />
            <input type="text" v-model="ingredient.ingredient" />
            <button type="button" @click="deleteIngredient(index)">[X]</button>
        </div>
        <div>
            <input type="text" v-model="newIngredient.amount" />
            <input type="text" v-model="newIngredient.ingredient" />
            <button type="button" @click="addIngredient()">[N]</button>
        </div>
        <button @click="close">OK</button>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import { closeModal } from 'jenesius-vue-modal';

export default defineComponent({
    name: 'RandomIngredientsModal',
    props: ['date'],
    data() {
        return {
            ingredients: [],
            newIngredient: this.makeEmptyIngredient(),
        }
    },
    mounted() {
        const ingredientsEvent = this.$store.state.events
            .filter((e) => e.extendedProps.extra && e.start === this.date + "T14:00");
        if (ingredientsEvent && ingredientsEvent.length === 1) {
            this.ingredients = ingredientsEvent[0].extendedProps.ingredients;
        }
    },
    methods: {
        addIngredient() {
            this.ingredients.push(this.newIngredient);
            this.newIngredient = this.makeEmptyIngredient();
        },
        deleteIngredient(index) {
            this.ingredients.splice(index, 1);
        },
        close() {
            closeModal();
            this.ingredients.push(this.newIngredient);
            const nonEmptyIngredients = this.ingredients.filter((i) => i.amount !== '' || i.ingredient !== '');
            if (nonEmptyIngredients.length > 0) {
                this.$store.dispatch('storeEvent', {
                    title: 'Zutaten',
                    color: 'black',
                    start: `${this.date}T14:00`,
                    end: `${this.date}T15:00`,
                    extendedProps: {extra: true, ingredients: nonEmptyIngredients},
                });
            }
        },
        makeEmptyIngredient() {
            return {amount: '', ingredient: ''};
        },
    }
})
</script>
