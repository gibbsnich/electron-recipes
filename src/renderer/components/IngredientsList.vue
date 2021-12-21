<template>
    <ul class="list-group list-group-flush">
        <li class="list-group-item" v-for="(ingredient, index) in ingredients" v-bind:key="index">
            <div class="input-group">
                <input type="text"  class="form-control" placeholder="Menge" aria-label="Menge" :value="ingredient.amount">
                <div class="dropdown">
                    <input type="text" :id="`dd_${index}`" :class="['form-control', 'dropdown-toggle', {unknown: !ingredient.id}]" placeholder="Zutat" aria-label="Zutat" data-bs-toggle="dropdown" 
                        v-model="ingredient.ingredient" v-on:blur="ingredientChanged(index, $event)" 
                        v-on:keyup="maybeShowIngredients(index, $event)">
                    <ul class="dropdown-menu" v-show="Object.keys(dropDownIngredients).includes(`${index}`) && dropDownIngredients[index].length > 0">
                        <li v-for="ddingredient in dropDownIngredients[index]" v-bind:key="ddingredient.id" :aria-labelledby="`dd_${index}`">
                            <a class="dropdown-item" href="javascript:void(0)" v-on:click="ingredientChanged(index, ddingredient.ingredient)"><span v-html="ddingredient.highlight"></span></a>
                        </li>
                    </ul>
                </div>
                <button type="button" class="btn btn-danger btn-sm" aria-label="Close" @click="deleteIngredient(index)">[X]</button>
            </div>
        </li>
        <li class="list-group-item">
            <div class="input-group">
                <input type="text" class="form-control" placeholder="Menge" aria-label="Menge" :value="newIngredient.amount">
                <div class="dropdown">
                    <input type="text" id="dd_new" :class="['form-control', 'dropdown-toggle', {unknown: !newIngredient.id}]" placeholder="Zutat" aria-label="Zutat" data-bs-toggle="dropdown" 
                        v-model="newIngredient.ingredient" v-on:keyup="maybeShowIngredients(-1, $event)">
                    <ul class="dropdown-menu" v-show="newIngredientDropDownIngredients.length > 0">
                        <li v-for="ddingredient in newIngredientDropDownIngredients" v-bind:key="ddingredient.id" aria-labelledby="dd_new">
                            <a class="dropdown-item" href="javascript:void(0)" v-on:click="newIngredient.ingredient = ddingredient.ingredient"><span v-html="ddingredient.highlight"></span></a>
                        </li>
                    </ul>
                </div>
                <button type="button" class="btn btn-success btn-sm" aria-label="Close" @click="addIngredient()">[N]</button>
            </div>
        </li>
    </ul>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'IngredientsList',
    props: {
        ingredients: Array, 
    },
    data() {
        return {
            newIngredient: this.makeEmptyIngredient(),
            dropDownIngredients: [],
            newIngredientDropDownIngredients: [],
        }
    },
    methods: {
        maybeShowIngredients(ingredientIndex, event) {
            if (event.key.startsWith('Arrow'))
                return;
            if (event.key === 'Enter') {
                if (ingredientIndex === -1) {
                    this.addIngredient();
                } else {
                    this.ingredientChanged(ingredientIndex, event);
                }
                return;
            }
            const value = event.target.value;
            const possibleIngredientsRaw = this.$store.getters.getIngredientsBySubstring(value);
            const possibleIngredients = possibleIngredientsRaw.map(i => { 
                const idx = i.ingredient.toLowerCase().indexOf(value.toLowerCase());
                i.highlight = `${i.ingredient.substring(0, idx)}<b>${i.ingredient.substring(idx, value.length)}</b>${i.ingredient.substring(idx+value.length, i.ingredient.length)}`;
                return i;
            });
            if (ingredientIndex === -1) {
                this.newIngredientDropDownIngredients = possibleIngredients;
            } else {
                this.dropDownIngredients[ingredientIndex] = possibleIngredients;
            }
            // fixes dropdown position:
            window.dispatchEvent(new Event('resize'));
        },
        ingredientChanged(ingredientIndex, value) {
            if (value.relatedTarget && value.relatedTarget.tagName === 'A')
                return;
            const oldIngredient = this.ingredients[ingredientIndex];
            let newIngredientValue;
            if (value.target) {
                newIngredientValue = value.target.value.trim()
            } else {
                newIngredientValue = value.trim();
            }
            oldIngredient.ingredient = newIngredientValue;
            this.ingredients[ingredientIndex] = oldIngredient;
            this.checkExistingIngredient(ingredientIndex);
            this.dropDownIngredients = [];
            this.newIngredientDropDownIngredients = [];
        },
        addIngredient() {
            if (this.newIngredient.ingredient !== '') {
                if (this.newIngredient.highlight) {
                    delete this.newIngredient.highlight;
                }
                this.ingredients.push(this.newIngredient);
                this.checkExistingIngredient(this.ingredients.length - 1);
                this.newIngredient = this.makeEmptyIngredient();
                this.dropDownIngredients = [];
                this.newIngredientDropDownIngredients = [];
            }
        },
        checkExistingIngredient(index) {
            const oldIngredient = this.ingredients[index];
            const existingNewIngredient = this.$store.getters.getIngredientByIngredient(oldIngredient.ingredient);
            if (existingNewIngredient) {
                oldIngredient.id = existingNewIngredient.id;
                oldIngredient.ingredientId = existingNewIngredient.ingredientId;
            } else {
                oldIngredient.id = null;
                oldIngredient.ingredientId = null;
            }
            this.ingredients[index] = oldIngredient;
        },
        deleteIngredient(index) {
            this.ingredients.splice(index, 1);
        },
        makeEmptyIngredient() {
            return {amount: '', ingredient: '', id: null};
        },
    },
});
</script>

<style scoped>
    input.unknown { border-color: red;}
    .dropdown-menu { z-index: 1100; }
</style>