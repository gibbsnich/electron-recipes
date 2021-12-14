import { dateToString, dateStringToReadableString } from './date.js';
import { toRaw } from 'vue';
import jsPDF from 'jspdf'

export const generatePDF = ({start, end}, store) => {
    const doc = new jsPDF();

    const   startStr = dateToString(start),
            endStr = dateToString(end);

    const currentEvents = store.state.events.filter((e) => e.start && e.start >= startStr && e.start <= endStr).map((e) => toRaw(e));
    //can contain multiple instances of the same recipe!
    const currentRecipes = currentEvents.filter((e) => !e.extendedProps.extra).map((e) => toRaw(store.state.recipes.filter((r) => r.id === e.extendedProps.recipeId)[0]));

    const allIngredientsPerRecipe = currentRecipes.map((r) => r.ingredients).flat(2);
    const extraEvents = currentEvents.filter((e) => e.extendedProps.extra).map((e) => e.extendedProps.ingredients);
    extraEvents.forEach((i) => i.forEach((ii) => allIngredientsPerRecipe.push(ii)));
    const allIngredients = allIngredientsPerRecipe.reduce((memo, i) => {
        if (memo[i.ingredient]) {
            memo[i.ingredient] = memo[i.ingredient] + ' ' + i.amount;
        } else {
            memo[i.ingredient] = i.amount;
        }
        return memo;
    }, {});

    doc.text('Einkaufsliste', 20, 10);
    const ingredientKeys = Object.keys(allIngredients).sort((a, b) => a < b ? -1 : (b < a ? 1 : 0));
    ingredientKeys.forEach((i, idx) => {
        doc.text(allIngredients[i] + ' ' + i, 10, 30 + (idx*10));
    });

    doc.addPage();

    currentEvents.sort((a, b) => a.start < b.start ? -1 : (b.start < a.start ? 1 : 0)).forEach((e) => {
        const readableDate = dateStringToReadableString(e.start);
        const time = e.start.indexOf("T12:") !== -1 ? "Mittagessen" : "Abendessen";
        const currentRecipe = store.state.recipes.filter((r) => r.id === e.extendedProps.recipeId)[0];
        if (currentRecipe) {
            doc.text(readableDate + ' ' + time, 20, 10);
            doc.text(currentRecipe.name, 30, 10);
            doc.text(currentRecipe.serving.value + ' ' + currentRecipe.serving.type, 40, 20);
            doc.text('Zutaten:', 20, 30);
            currentRecipe.ingredients.forEach((i, idx) => doc.text(i.amount + ' ' + i.ingredient, 50, 40 + (idx*10)));
            doc.text(currentRecipe.url, 30, 60 + (currentRecipe.ingredients.length*10));
            doc.text(currentRecipe.preparation, 30, 70 + (currentRecipe.ingredients.length*10));
            doc.addPage();
        }
    });

    doc.save('Rezepte.pdf'); //todo add date to name
};
