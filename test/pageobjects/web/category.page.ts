import { $, $$ } from '@wdio/globals';
import FashionStackPage from './fashionstack.page.js';

/**
 * Category page (Men, Women, Sale, New Arrivals, Offers) page object
 */
export default class CategoryPage extends FashionStackPage {
    public get pageHeading() {
        return $('h1');
    }

    public get productCount() {
        return $('p*=products in');
    }

    public get geoLocationIndicator() {
        return $('p*=📍');
    }

    public get productGrid() {
        return $$('h3');
    }

    /**
     * Click a product card by its name
     */
    public async clickProductByName(name: string) {
        const heading = await $(`h3=${name}`);
        const card = await heading.$('..');
        await card.click();
    }

    /**
     * Hover over a product card to reveal the quick-view eye icon, then click it
     */
    public async clickQuickViewOnFirstProduct() {
        const firstCard = await $$('[data-slot="card-content"]')[0];
        await firstCard.moveTo();
        // The eye icon button appears on hover — click the first product card directly
        await firstCard.click();
    }

    /**
     * Click the first product card in the grid.
     * Falls back to clicking the first h3 heading if card-content not found.
     */
    public async clickFirstProduct() {
        const cards = await $$('[data-slot="card-content"]');
        const cardCount = await cards.length;
        if (cardCount > 0) {
            await cards[0].click();
        } else {
            // Fallback: click first product heading
            const headings = await $$('h3');
            const headingCount = await headings.length;
            if (headingCount > 0) {
                await headings[0].click();
            }
        }
    }

    /**
     * Click a product card that has a broken image (placeholder)
     */
    public async clickProductWithBrokenImage() {
        const cards = await $$('[data-slot="card-content"]');
        for (const card of cards) {
            const img = await card.$('img');
            const naturalWidth: number = await browser.execute(
                (el: HTMLImageElement) => el.naturalWidth,
                img as unknown as HTMLImageElement
            );
            if (naturalWidth === 0) {
                await card.click();
                return;
            }
        }
        // Fallback: click first card
        await cards[0].click();
    }
}