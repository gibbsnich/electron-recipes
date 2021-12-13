import cheerio from 'cheerio';
import { ipcRenderer } from '@/electron';

function rmWhitespace(str) {
    return str.replace(/ +(?= )/g,'').trim();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const fetchRecipe = async (url) => {
    //todo get the right fetcher, currently only chefkoch

    const body = await ipcRenderer.invoke('request', url);
    const $ = cheerio.load(body);
    const name = $('h1').text();
    const servingsField = $('input.ds-input');
    let servingsName = capitalize(servingsField.attr('name'));
    const servings = `${servingsField.attr('value')} ${servingsName}`;
    const ingredients = $('table.ingredients tr').map((idx, ing) => {
        const cells = $(ing).children('td');
        const amount = rmWhitespace($(cells[0]).text());
        const i = rmWhitespace($(cells[1]).text());
        return {amount: amount, ingredient: i};
    });
    return {name, servings, ingredients};
};
