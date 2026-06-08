import { $, $$, browser } from '@wdio/globals';

/**
 * FashionStack base page object with shared navigation and header methods
 */
export default class FashionStackPage {
    public get logoButton() {
        return $('button=FashionStack');
    }

    public get navMen() {
        return $('button=Men');
    }

    public get navWomen() {
        return $('button=Women');
    }

    public get navSale() {
        return $('button=Sale');
    }

    public get navOffers() {
        return $('button=Offers');
    }

    public get navNew() {
        return $('button=New');
    }

    public get cartButton() {
        // Cart icon button — the button with no text content in the header actions div
        return $('header div div button:nth-child(2)');
    }

    public get loginButton() {
        return $('button=Login');
    }

    public get searchInput() {
        // Search input in the header form
        return $('header form input');
    }

    /**
     * Click a nav button using JavaScript to bypass interactability issues.
     * Waits for the button to exist before executing.
     */
    public async clickNavButton(name: string) {
        const btn = await $(`button=${name}`);
        await btn.waitForExist({ timeout: 10000 });
        await browser.execute((el: HTMLElement) => el.click(), btn as unknown as HTMLElement);
    }

    /**
     * Click the cart button using JavaScript.
     * The cart button is the button immediately after the Login button in the header.
     */
    public async clickCartButton() {
        await browser.execute(() => {
            // Find the Login button, then click its next sibling button
            const headerButtons = Array.from(document.querySelectorAll('header button'));
            const loginIdx = headerButtons.findIndex(b => b.textContent && b.textContent.includes('Login'));
            if (loginIdx >= 0 && loginIdx + 1 < headerButtons.length) {
                (headerButtons[loginIdx + 1] as HTMLElement).click();
            }
        });
        await browser.pause(500);
    }

    public get scanImageButton() {
        return $('button=Scan Image');
    }

    public open(path = '') {
        return browser.url(`https://ecommercebs.vercel.app/${path}`);
    }
}