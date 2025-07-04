import { expect } from "@playwright/test";

export default class Cart {
    constructor(page) {
        this.page = page;
        this.cartTitle = page.locator(".cart h3");
        this.cartPrice = page.locator(".cart h3 + p");
        this.checkoutbtn = page.locator("button:text('Checkout')");
    }

    async validateProductinCart(productTitle_toPurchase, productPrice_toPurchase){
        let cart_title = await this.cartTitle.textContent();
        let cart_price = await this.cartPrice.textContent();
        
        console.log("cart_title.toLowerCase() - "+cart_title.toLowerCase());
        console.log("productTitle_toPurchase.toLowerCase() - "+productTitle_toPurchase.toLowerCase());

        expect(cart_title.toLowerCase()).toBe(productTitle_toPurchase.toLowerCase());
        expect(productPrice_toPurchase).toBe(cart_price.split(" ")[3]);
    }

    async goToCheckout(){
        await this.checkoutbtn.click();
        console.log("Page Title", await this.page.title());
    }
}