import { expect } from "@playwright/test";

export default class OrderConfirmation {
    constructor(page) {
        this.page = page;
        this.header = page.locator("h1");
        this.orderDownloadButton = page.locator("button:text('Click To Download Order Details in CSV')");
        this.myOrders = page.locator("label[routerlink='/dashboard/myorders']");
    }

    async validateProductDetails(productTitle_toPurchase,productPrice_toPurchase){
        let thankYouHeader = await this.header.textContent();
        expect(thankYouHeader.trim()).toBe("Thankyou for the order.");
        expect(await this.orderDownloadButton.isVisible()).toBeTruthy();

        await this.myOrders.click();
        await this.page.title();
    }
}