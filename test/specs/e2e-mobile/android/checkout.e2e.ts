import { expect } from "@wdio/globals";
import HomePage from "../../../pageobjects/mobile/android/home.page.js";
import LoginPage from "../../../pageobjects/mobile/android/login.page.js";
import CartPage from "../../../pageobjects/mobile/android/cart.page.js";
import CheckoutPage from "../../../pageobjects/mobile/android/checkout.page.js";

describe("BrowserStack Demo App - E2E Checkout Flow", () => {
  it("should complete a full purchase journey: login → add to cart → checkout", async () => {
    // Step 1: Open the hamburger menu and navigate to Sign In
    await HomePage.openMenu();

    const signInNavItem = await $('//android.view.ViewGroup[@content-desc="nav-signin"]');
    await signInNavItem.waitForDisplayed({ timeout: 10000 });
    await signInNavItem.click();

    // Step 2: Login with valid credentials
    await LoginPage.loginForm.waitForDisplayed({ timeout: 10000 });
    await LoginPage.login("demouser", "testingisfun99");

    // Step 3: Verify we're back on the Home screen with products
    await HomePage.productsFound.waitForDisplayed({ timeout: 10000 });
    const productsText = await HomePage.productsFound.getText();
    expect(productsText).toContain("Product(s) found.");

    // Step 4: Add first product to cart
    await HomePage.addFirstProductToCart();

    // Step 5: Navigate to Cart
    await HomePage.openCart();

    // Step 6: Verify cart has 1 product
    await CartPage.waitForCartToLoad();
    const cartProductCount = await CartPage.numberOfProducts.getText();
    expect(cartProductCount).toContain("1 product(s) found.");

    // Step 7: Verify cart item is present
    await expect(CartPage.cartItem).toBeDisplayed();

    // Step 8: Proceed to Checkout
    await CartPage.proceedToCheckout();

    // Step 9: Fill in shipping address
    await CheckoutPage.waitForCheckoutToLoad();
    await CheckoutPage.fillShippingAddress({
      firstName: "John",
      lastName: "Doe",
      address: "123 Main Street",
      state: "California",
      postalCode: "90001",
    });

    // Step 10: Submit the order
    await CheckoutPage.submitOrder();
  });
});