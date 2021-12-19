<template>
    <div class="modal" tabindex="-1">
        <div class="modal-dialog">
            <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">Zutaten ohne Kategorie</h5>
            </div>
            <div class="modal-body">
                <p>Neue Zutat ohne Kategorie gefunden:</p>
                <div>
                    <h6>{{ ingredientName }}</h6>
                    <div class="form-check form-check-inline" v-for="ingredientCategory in this.$store.state.ingredientCategories" v-bind:key="ingredientCategory.id">
                        <input class="form-check-input" type="radio" name="categoryOptions" :id="'radio_' + ingredientCategory.id" :value="ingredientCategory.id" v-model="pickedCategory">
                        <label class="form-check-label" :for="'radio_' + ingredientCategory.id">{{ ingredientCategory.name }}</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="radio" name="categoryOptions" id="radio_new" value="new" v-model="pickedCategory">
                        ... oder neu anlegen:
                        <input type="text" placeholder="Neue Kategorie" v-model="newCategoryName">
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" @click="close" :disabled="disallowSave">Speichern</button>
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'IngredientWithoutCategoryModal',
    props: {
        ingredient: Object,
    },
    data() {
        return {
            pickedCategory: null,
            newCategoryName: '',
        }
    },
    computed: {
        ingredientName: {
            get() {
                if (this.ingredient) {
                    return this.ingredient.ingredient;
                }
                return null;
            },
        },
        disallowSave: {
            get() {
                if (!this.pickedCategory)
                    return true;
                if (this.pickedCategory === 'new' && this.newCategoryName.length === 0)
                    return true;
                if (this.$store.state.ingredientCategories.find((ic) => ic.name === this.newCategoryName))
                    return true;
                return false;
            }
        },
    },
    methods: {
        close() {
            if (this.pickedCategory) {
                if (this.pickedCategory === 'new') {
                    this.$emit('close', {name: this.newCategoryName});
                } else {
                    this.$emit('close', {id: this.pickedCategory});
                }
                this.pickedCategory = null;
                this.newCategoryName = '';
            }
        },
    }
})
</script>