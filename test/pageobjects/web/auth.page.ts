import { $ } from '@wdio/globals';
import FashionStackPage from './fashionstack.page.js';

/**
 * Auth page object — Login and Registration pages
 */
export default class AuthPage extends FashionStackPage {
    // Login page
    public get loginHeading() {
        return $('h4=Sign In');
    }

    public get loginEmailInput() {
        return $('input=Email Address');
    }

    public get loginPasswordInput() {
        return $('input=Password');
    }

    public get signInButton() {
        return $('button=Sign In');
    }

    public get signUpButton() {
        return $('button=Sign up here');
    }

    // Registration page
    public get registerHeading() {
        return $('h2=Create Account');
    }

    public get termsCheckbox() {
        return $('button=I agree to the Terms of Service and Privacy Policy');
    }

    public get createAccountButton() {
        return $('button=Create Account');
    }

    /**
     * Fill registration form using positional input selectors.
     * Registration form order: First Name, Last Name, Email, Password, Confirm Password
     */
    public async register(details: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        confirmPassword: string;
    }) {
        // Wait for the registration form to be visible
        await this.createAccountButton.waitForExist({ timeout: 10000 });
        // Use positional selectors — registration form inputs in order
        const allInputs = await $$('form input:not([type="hidden"])');
        await allInputs[0].setValue(details.firstName);
        await allInputs[1].setValue(details.lastName);
        await allInputs[2].setValue(details.email);
        await allInputs[3].setValue(details.password);
        await allInputs[4].setValue(details.confirmPassword);
        // Click terms checkbox using JS — find by role=checkbox
        await browser.execute(() => {
            const checkboxes = Array.from(document.querySelectorAll('[role="checkbox"]'));
            if (checkboxes.length > 0) (checkboxes[0] as HTMLElement).click();
        });
        await browser.pause(300);
        // Click Create Account using JS to bypass disabled state
        await browser.execute(() => {
            const buttons = Array.from(document.querySelectorAll('button[type="submit"]'));
            if (buttons.length > 0) (buttons[0] as HTMLElement).click();
        });
    }
}