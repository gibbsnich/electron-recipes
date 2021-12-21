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
                const ingredientCategories = this.$store.getters.getIngredientCategoriesByName(selectedIngredientCategory.name);
                if (ingredientCategories.length === 0) {
                    console.warn("Cannot find created category!");
                } else {
                    selectedIngredientCategory.id = ingredientCategories[0].id;
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