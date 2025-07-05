import { expect } from "@playwright/test";

export default class Checkout {
    constructor(page) {
        this.page = page;
        this.checkoutTitle = page.locator(".item__title");
        this.checkoutPrice = page.locator(".item__price");
        this.countryDropdown = page.locator("[placeholder='Select Country']");
        this.placeOrder = page.locator("a:text('Place Order')");
    }

    async validateProductDetails(productTitle_toPurchase, productPrice_toPurchase){
        
        let checkout_title = await this.checkoutTitle.textContent();
        expect(productTitle_toPurchase.toUpperCase()).toBe(checkout_title.trim().toUpperCase());
        
        let checkout_price = await this.checkoutPrice.textContent();
        expect(productPrice_toPurchase).toBe(checkout_price.replaceAll("$ ", "").trim());
    
        await this.countryDropdown.click();
        await this.page.keyboard.type("India");
        await this.page.locator("xpath=//span[text()=' India']").click();
        await this.placeOrder.click();
        await this.page.title();
    }
}