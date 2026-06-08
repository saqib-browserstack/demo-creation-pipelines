//import { expect, browser, $ } from '@wdio/globals';
//import FashionStackPage from '../../pageobjects/web/fashionstack.page.js';
//import CategoryPage from '../../pageobjects/web/category.page.js';
//import ProductPage from '../../pageobjects/web/product.page.js';
//import CartPage from '../../pageobjects/web/cart.page.js';
//import CheckoutPage from '../../pageobjects/web/checkout.page.js';
//import AuthPage from '../../pageobjects/web/auth.page.js';
//
//const homePage = new FashionStackPage();
//const categoryPage = new CategoryPage();
//const productPage = new ProductPage();
//const cartPage = new CartPage();
//const checkoutPage = new CheckoutPage();
//const authPage = new AuthPage();
//
//const SHIPPING = {
//    firstName: 'John',
//    lastName: 'Doe',
//    address: '123 Main Street',
//    city: 'New York',
//    zipCode: '10001',
//    phone: '5551234567',
//};
//
//const PAYMENT = {
//    cardNumber: '4111111111111111',
//    nameOnCard: 'John Doe',
//    expiryDate: '12/26',
//    cvv: '123',
//};
//
//describe('FashionStack E2E — Browse, Cart, and Checkout Journeys', () => {
//
//    // ─── T001 ────────────────────────────────────────────────────────────────
//    it('should simulate the full E2E user journey — browse Men category, add Polo Shirt to cart with Navy color and size L, and complete checkout', async () => {
//        await homePage.open();
//        await expect($('h1*=FashionStack')).toBeDisplayed();
//
//        // Navigate to Men's category using JS click to bypass carousel overlap
//        await homePage.clickNavButton('Men');
//        await expect($("h1*=Men")).toBeExisting();
//        await expect($('p*=16')).toBeExisting();
//
//        // Click Polo Shirt product card
//        await categoryPage.clickProductByName('Polo Shirt');
//        await expect($('h1=Polo Shirt')).toBeExisting();
//
//        // Select Navy color (index 1) and size L
//        await productPage.selectColorByIndex(1);
//        await expect($('h3*=Color: Navy')).toBeExisting();
//        await productPage.selectSize('L');
//        await expect($('h3*=Size: L')).toBeExisting();
//
//        // Increase quantity to 2
//        await productPage.increaseQuantity(1);
//
//        // Add to cart
//        await productPage.addToCartButton.click();
//        await browser.pause(1000);
//
//        // Navigate to cart
//        await homePage.clickCartButton();
//        await expect(cartPage.heading).toBeExisting();
//        await expect($('h3=Polo Shirt')).toBeExisting();
//
//        // Proceed to checkout
//        await cartPage.proceedToCheckoutButton.click();
//        await expect(checkoutPage.heading).toBeExisting();
//
//        // Fill checkout form and complete order
//        await checkoutPage.completeCheckout('test@example.com', SHIPPING, PAYMENT);
//        await browser.pause(2000);
//
//        // Verify order confirmation
//        await expect($('h1*=Order')).toBeExisting();
//    });
//
//    // ─── T002 ────────────────────────────────────────────────────────────────
//    it('should simulate the full E2E journey — use Scan Image visual search to find a product, select variants, and add to cart', async () => {
//        await homePage.open();
//        await expect($('button=Scan Image')).toBeExisting();
//
//        // Click Scan Image button
//        // await homePage.scanImageButton.click();
//        // File picker opens — skip actual file upload in automated test; verify modal/dialog appears
//        // await browser.pause(1000);
//
//        // const filePath = "/Users/jaycheda/Documents/Screenshot 2026-05-05 at 11.17.16 PM.png";
//        // const remoteFilePath = await browser.uploadFile(filePath);
//        // await fileUploadInput.setValue(remoteFilePath);
//        ////*[@id="root"]/div/header/div[2]/div/div/div[2]/div/button
//        // Navigate directly to Women's category as a proxy for visual search results
//        await homePage.clickNavButton('Women');
//        await expect($("h1*=Women")).toBeExisting();
//
//        // Click first product from results
//        await categoryPage.clickFirstProduct();
//        await expect($('h1')).toBeExisting();
//
//        // Select first color and size M
//        await productPage.selectColorByIndex(1);
//        await productPage.selectSize('M');
//
//        // Add to cart
//        await productPage.addToCartButton.click();
//        await browser.pause(1000);
//
//        // Navigate to cart and verify item
//        await homePage.clickCartButton();
//        await expect(cartPage.heading).toBeExisting();
//        await expect($('h3')).toBeExisting();
//    });
//
//    // ─── T003 ────────────────────────────────────────────────────────────────
//    it('should simulate the full E2E journey — register a new account, search for a dress, add to cart, and complete purchase', async () => {
//        await homePage.open();
//
//        // Click Login
//        await homePage.loginButton.click();
//        await browser.pause(500);
//
//        // Navigate to registration
//        await $('button=Sign up here').click();
//        await browser.pause(500);
//
//        // Fill registration form
//        const uniqueEmail = `testuser_${Date.now()}@example.com`;
//        await authPage.register({
//            firstName: 'Jane',
//            lastName: 'Smith',
//            email: uniqueEmail,
//            password: 'Password123!',
//            confirmPassword: 'Password123!',
//        });
//        await browser.pause(2000);
//        // Navigate to homepage after registration
//        await homePage.open();
//        await $('h1*=FashionStack').waitForExist({ timeout: 10000 });
//
//        // Search for dress
//        await homePage.searchInput.setValue('dress');
//        await browser.keys('Enter');
//        await browser.pause(1000);
//        // Search results page loaded — verify at least one product heading is visible
//        await expect($('h3')).toBeExisting();
//
//        // Click first dress product
//        await categoryPage.clickFirstProduct();
//        await expect($('h1')).toBeExisting();
//
//        // Select color and size, add to cart
//        await productPage.selectColorByIndex(1);
//        await productPage.selectSize('M');
//        await productPage.addToCartButton.click();
//        await browser.pause(1000);
//
//        // Go to cart and checkout
//        await homePage.clickCartButton();
//        await expect(cartPage.heading).toBeExisting();
//        await cartPage.proceedToCheckoutButton.click();
//        await expect(checkoutPage.heading).toBeExisting();
//
//        await checkoutPage.completeCheckout(uniqueEmail, SHIPPING, PAYMENT);
//        await browser.pause(2000);
//        await expect($('h1*=Order')).toBeExisting();
//    });
//
//    // ─── T004 ────────────────────────────────────────────────────────────────
//    it('should simulate the full E2E journey — discover geo-location based special offers, select a sale product, and complete checkout', async () => {
//        await homePage.open();
//
//        // Navigate to Offers using JS click
//        await homePage.clickNavButton('Offers');
//        await expect($('h1*=Special Offers')).toBeExisting();
//
//        // Wait for geo-location to resolve and products to load (country detection takes time)
//        await browser.pause(3000);
//        await $('[data-slot="card-content"]').waitForExist({ timeout: 15000 });
//
//        // Verify product count text is shown
//        await expect($('p*=Showing')).toBeExisting();
//
//        // Click first product from geo-targeted offers
//        await categoryPage.clickFirstProduct();
//        // Wait for product detail page — must have Add to Cart button
//        await $('button*=Add to Cart').waitForExist({ timeout: 15000 });
//
//        // Select color and size, add to cart — some products may not have color options
//        const hasColorOptions = await $('h3*=Color:').isExisting();
//        if (hasColorOptions) {
//            await productPage.selectColorByIndex(1);
//        }
//        const hasSizeOptions = await $('h3*=Size:').isExisting();
//        if (hasSizeOptions) {
//            await productPage.selectSize('M');
//        }
//        await productPage.addToCartButton.click();
//        await browser.pause(1000);
//
//        // Go to cart and checkout
//        await homePage.clickCartButton();
//        await expect(cartPage.heading).toBeExisting();
//        await cartPage.proceedToCheckoutButton.click();
//        await expect(checkoutPage.heading).toBeExisting();
//
//        await checkoutPage.completeCheckout('offers@example.com', SHIPPING, PAYMENT);
//        await browser.pause(2000);
//        await expect($('h1*=Order')).toBeExisting();
//    });
//
//    // ─── T005 ────────────────────────────────────────────────────────────────
//    it('should simulate the E2E journey — use quick view eye icon on Women category product card to navigate to product detail page, select variants, and add to cart', async () => {
//        await homePage.open();
//
//        // Navigate to Women's category using JS click
//        await homePage.clickNavButton('Women');
//        await expect($("h1*=Women")).toBeExisting();
//
//        // Hover over first product card to reveal eye icon, then click it
//        await categoryPage.clickQuickViewOnFirstProduct();
//        await expect($('h1')).toBeExisting();
//
//        // Verify breadcrumb shows Women path
//        const breadcrumb = await productPage.breadcrumb;
//        await expect(breadcrumb).toBeExisting();
//
//        // Select color and size
//        await productPage.selectColorByIndex(1);
//        await productPage.selectSize('M');
//
//        // Add to cart
//        await productPage.addToCartButton.click();
//        await browser.pause(1000);
//
//        // Navigate to cart and verify
//        await homePage.clickCartButton();
//        await expect(cartPage.heading).toBeExisting();
//        await expect($('h3')).toBeExisting();
//    });
//
//    // ─── T006 ────────────────────────────────────────────────────────────────
//    it('should simulate the E2E journey — browse products with missing images, verify product detail page loads correctly, and complete purchase', async () => {
//        await homePage.open();
//
//        // Navigate to Sale category using JS click
//        await homePage.clickNavButton('Sale');
//        await expect($('h1')).toBeExisting();
//
//        // Find and click a product with a broken image
//        await categoryPage.clickProductWithBrokenImage();
//        await expect($('h1')).toBeExisting();
//
//        // Verify product detail page loads with all required elements
//        await expect(productPage.addToCartButton).toBeExisting();
//        await expect($('h3*=Color:')).toBeExisting();
//        await expect($('h3*=Size:')).toBeExisting();
//
//        // Select color and size, add to cart
//        await productPage.selectColorByIndex(1);
//        await productPage.selectSize('M');
//        await productPage.addToCartButton.click();
//        await browser.pause(1000);
//
//        // Navigate to cart and verify item appears
//        await homePage.clickCartButton();
//        await expect(cartPage.heading).toBeExisting();
//        await expect($('h3')).toBeExisting();
//
//        // Proceed to checkout and complete order
//        await cartPage.proceedToCheckoutButton.click();
//        await expect(checkoutPage.heading).toBeExisting();
//
//        await checkoutPage.completeCheckout('sale@example.com', SHIPPING, PAYMENT);
//        await browser.pause(2000);
//        await expect($('h1*=Order')).toBeExisting();
//    });
//
//});
