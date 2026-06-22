import { $, browser } from '@wdio/globals';
import FashionStackPage from './fashionstack.page.js';

/**
 * Shopping Cart page object
 */
export default class CartPage extends FashionStackPage {
    public get heading() {
        return $('h1=Shopping Cart');
    }

    public get itemCount() {
        return $('h1=Shopping Cart').$('..').$('p');
    }

    public get proceedToCheckoutButton() {
        return $('button=Proceed to Checkout');
    }

    public async clickProceedToCheckout() {
        const btn = await this.proceedToCheckoutButton;
        await browser.execute((el: HTMLElement) => el.click(), btn as unknown as HTMLElement);
    }

    public get continueShoppingButton() {
        return $('button=Continue Shopping');
    }

    public get subtotalAmount() {
        return $('*=Subtotal').$('..').$('span');
    }

    /**
     * Verify a cart item exists with the given product name
     */
    public async getCartItemByName(name: string) {
        return $(`h3=${name}`);
    }

    /**
     * Get the color/size detail text for a cart item
     */
    public async getCartItemColorText(name: string) {
        const item = await $(`h3=${name}`).$('..');
        return item.$('span*=Color:');
    }
}