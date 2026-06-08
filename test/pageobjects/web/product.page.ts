import { $ } from '@wdio/globals';
import FashionStackPage from './fashionstack.page.js';

/**
 * Product Detail Page object — handles color/size selection, quantity, and add-to-cart
 */
export default class ProductPage extends FashionStackPage {
    public get productTitle() {
        return $('h1');
    }

    public get colorLabel() {
        return $('h3*=Color:');
    }

    public get sizeLabel() {
        return $('h3*=Size:');
    }

    public get quantityDisplay() {
        return $('h3=Quantity').$('..').$('span');
    }

    public get quantityIncreaseButton() {
        // The + button is the second button inside the quantity control div
        return $('h3=Quantity').$('..').$('div').$('button:last-child');
    }

    public get quantityDecreaseButton() {
        return $('h3=Quantity').$('..').$('div').$('button:first-child');
    }

    public get addToCartButton() {
        return $('button*=Add to Cart');
    }

    public get viewCartButton() {
        return $('button=View Cart');
    }

    public get breadcrumb() {
        return $('nav ol');
    }

    /**
     * Select a color by its 1-based index position (1=first color, 2=second, etc.)
     */
    public async selectColorByIndex(index: number) {
        const colorContainer = await $('h3*=Color:').$('..').$('div');
        const buttons = await colorContainer.$$('button');
        await buttons[index - 1].click();
    }

    /**
     * Select a size by its label text (e.g., 'S', 'M', 'L', 'XL', 'XXL')
     */
    public async selectSize(size: string) {
        await $(`button=${size}`).click();
    }

    /**
     * Increase quantity by clicking the + button n times
     */
    public async increaseQuantity(times = 1) {
        for (let i = 0; i < times; i++) {
            await this.quantityIncreaseButton.click();
        }
    }
}