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

    public async clickLogin() {
        const btn = await this.loginButton;
        await btn.waitForExist({ timeout: 10000 });
        await browser.execute((el: HTMLElement) => el.click(), btn as unknown as HTMLElement);
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
     * The cart button is the sibling button immediately after the Login button in the header.
     * We locate it by finding the div that contains the Login button, then clicking
     * the last button in that same div.
     */
    public async clickCartButton() {
        await browser.execute(() => {
            // The header actions div contains: theme-toggle, Scan Image, search form, [Login, Cart]
            // The Login button and Cart button are siblings inside the same div
            const loginBtn = Array.from(document.querySelectorAll('header button'))
                .find(b => b.textContent?.trim() === 'Login');
            if (loginBtn) {
                // Cart button is the next sibling element after Login
                const cartBtn = loginBtn.nextElementSibling as HTMLElement;
                if (cartBtn && cartBtn.tagName === 'BUTTON') {
                    cartBtn.click();
                    return;
                }
                // Fallback: parent div's last button
                const parentDiv = loginBtn.parentElement;
                if (parentDiv) {
                    const buttons = parentDiv.querySelectorAll('button');
                    const lastBtn = buttons[buttons.length - 1] as HTMLElement;
                    if (lastBtn) lastBtn.click();
                }
            }
        });
        await browser.pause(500);
    }

    public get scanImageButton() {
        return $('button=Scan Image');
    }

    /**
     * The dark/light mode toggle switch in the header (next to Scan Image).
     * id="test-mode-switch" — stable unique ID observed in DOM.
     * Toggling this switches the site between light and dark themes,
     * producing a visual change that Percy can detect.
     */
    public get themeToggle() {
        return $('#test-mode-switch');
    }

    /**
     * Toggle the site theme (light ↔ dark).
     * Uses JavaScript click to bypass interactability issues.
     */
    public async toggleTheme() {
        const toggle = await this.themeToggle;
        await toggle.waitForExist({ timeout: 5000 });
        await browser.execute((el: HTMLElement) => el.click(), toggle as unknown as HTMLElement);
        await browser.pause(300); // allow CSS transition to complete
    }

    public open(path = '') {
        return browser.url(`https://ecommercebs.vercel.app/${path}`);
    }
}