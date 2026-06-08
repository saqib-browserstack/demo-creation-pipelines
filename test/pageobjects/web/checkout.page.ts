import { $ } from '@wdio/globals';
import FashionStackPage from './fashionstack.page.js';

/**
 * Checkout page object — Contact Info, Shipping Address, Payment Information
 */
export default class CheckoutPage extends FashionStackPage {
    public get heading() {
        return $('h1=Checkout');
    }

    // Contact Information
    public get emailInput() {
        return $('input[type="email"]');
    }

    // Shipping Address — use label text selectors
    public get firstNameInput() {
        return $('label=First name').$('..').$('input');
    }

    public get lastNameInput() {
        return $('label=Last name').$('..').$('input');
    }

    public get addressInput() {
        return $('label=Address').$('..').$('input');
    }

    public get cityInput() {
        return $('label=City').$('..').$('input');
    }

    public get stateDropdown() {
        return $('button=Select state');
    }

    public get zipCodeInput() {
        return $('label=ZIP code').$('..').$('input');
    }

    public get phoneInput() {
        return $('label=Phone').$('..').$('input');
    }

    // Payment Information — use label text selectors
    public get cardNumberInput() {
        return $('label=Card number').$('..').$('input');
    }

    public get nameOnCardInput() {
        return $('label=Name on card').$('..').$('input');
    }

    public get expiryDateInput() {
        return $('label=Expiry date').$('..').$('input');
    }

    public get cvvInput() {
        return $('label=CVV').$('..').$('input');
    }

    public get completeOrderButton() {
        return $('button=Complete Order');
    }

    public get orderSummarySection() {
        return $('h4=Order Summary');
    }

    /**
     * Fill all checkout form fields in one call
     */
    public async fillContactInfo(email: string) {
        await this.emailInput.setValue(email);
    }

    public async fillShippingAddress(details: {
        firstName: string;
        lastName: string;
        address: string;
        city: string;
        zipCode: string;
        phone: string;
    }) {
        await this.firstNameInput.setValue(details.firstName);
        await this.lastNameInput.setValue(details.lastName);
        await this.addressInput.setValue(details.address);
        await this.cityInput.setValue(details.city);
        await this.zipCodeInput.setValue(details.zipCode);
        await this.phoneInput.setValue(details.phone);
    }

    public async fillPaymentInfo(details: {
        cardNumber: string;
        nameOnCard: string;
        expiryDate: string;
        cvv: string;
    }) {
        await this.cardNumberInput.setValue(details.cardNumber);
        await this.nameOnCardInput.setValue(details.nameOnCard);
        await this.expiryDateInput.setValue(details.expiryDate);
        await this.cvvInput.setValue(details.cvv);
    }

    public async completeCheckout(
        email: string,
        shipping: { firstName: string; lastName: string; address: string; city: string; zipCode: string; phone: string },
        payment: { cardNumber: string; nameOnCard: string; expiryDate: string; cvv: string }
    ) {
        await this.fillContactInfo(email);
        await this.fillShippingAddress(shipping);
        await this.fillPaymentInfo(payment);
        await this.completeOrderButton.click();
    }
}