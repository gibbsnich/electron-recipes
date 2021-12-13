import cheerio from 'cheerio';
import { ipcRenderer } from '@/electron';

function rmWhitespace(str) {
    return str.replace(/ +(?= )/g,'').trim();
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export const fetchRecipe = async (url) => {
    //todo get the right fetcher, currently only chefkoch.de is supported

    const body = await ipcRenderer.invoke('request', url);
    const $ = cheerio.load(body);
    const name = $('h1').text();
    const servingsField = $('input.ds-input');
    const serving = {
        type: capitalize(servingsField.attr('name')),
        value: servingsField.attr('value')
    };
    const ingredients = $('table.ingredients tr').map((idx, ing) => {
        const cells = $(ing).children('td');
        const amount = rmWhitespace($(cells[0]).text());
        const i = rmWhitespace($(cells[1]).text());
        return {amount: amount, ingredient: i};
    });
    const articles = $('article');
    const prepArticle = articles.filter((idx, a) => 
        a.attribs['class'].indexOf('recipe') === -1
        );
    let preparation = '';
    if (prepArticle.length === 0) {
        console.warn('Cannot extract preparation instructions.')
    } else {
        const meta = $(prepArticle[0]).children('small.ds-recipe-meta');
        preparation = meta.next().text();
    }
    
    return {name, serving, ingredients, preparation, url};
};
