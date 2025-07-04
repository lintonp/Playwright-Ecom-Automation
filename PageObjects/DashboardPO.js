export default class DashboardPO {
    constructor(page) {
        this.page = page;
        this.ProductsList =  page.locator("#products");
        this.product_Titles = page.locator(".card h5");
        this.product_Prices = page.locator(".card .text-muted");
        this.product_addToCart = page.locator(".card button:text('Add To Cart')");
        this.Cart =  page.locator("[routerlink='/dashboard/cart']");
    }
    
    async navigateToCart(){
        await this.Cart.click();
        await this.page.title();
    }

    async addProductToCart(productTitle_toPurchase){
        await this.ProductsList.textContent();
        let productTitles = await this.product_Titles.allTextContents();

        let i = productTitles.findIndex(p => p.toUpperCase() === productTitle_toPurchase.toUpperCase());

        let productPrice_toPurchase = await this.product_Prices.nth(i).textContent();
        productPrice_toPurchase = productPrice_toPurchase.replaceAll("$ ", "").trim();

        await this.product_addToCart.nth(i).click();

        return productPrice_toPurchase;
    }

}