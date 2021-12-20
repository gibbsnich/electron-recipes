export const UnknownIngredientsMixin = {
    data() {
        return {
            isIngredientWithoutCategoryModalVisible: false,
            ingredientWithoutCategory: null,
        }
    },
    methods: {
        checkForIngredientsWithoutCategory: function(ingredients) {
            const withoutCategory = ingredients.find((i) => !i.id);
            if (withoutCategory) {
                return withoutCategory;
            }
            return null;
        },
        closeIngredientsWithoutCategoryModal: async function(selectedIngredientCategory) {
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
            const withoutCategory = this.checkForIngredientsWithoutCategory(this.unknownIngredients);
            if (withoutCategory) {
                this.ingredientWithoutCategory = withoutCategory;
            } else {
                this.finishedHandlingUnknownIngredients();
                this.isIngredientWithoutCategoryModalVisible = false;
            }
        },
    }
};