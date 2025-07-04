import test, { expect } from "@playwright/test";
import LoginPage from "../PageObjects/LoginPagePO";
import DashboardPO from "../PageObjects/DashboardPO";
import Cart from "../PageObjects/CartPO";

test("E2E purchase product", async ({page}) => {
    
    const uid = "fnln112025@mail.com",
          pwd = "Password@1";
    const productTitle_toPurchase = "ADIDAS ORIGINAL";

    const loginPage = new LoginPage(page);
    await loginPage.login(uid, pwd);

    const dashboard = new DashboardPO(page);
    let productPrice_toPurchase = await dashboard.addProductToCart(productTitle_toPurchase);
    await dashboard.navigateToCart();

    const cart = new Cart(page);
    await cart.validateProductinCart(productTitle_toPurchase, productPrice_toPurchase);
    await cart.goToCheckout();

    // let cart_title = await page.locator(".cart h3").textContent();
    // let cart_price = await page.locator(".cart h3 + p").textContent();
    
    // console.log("cart_title.toLowerCase() - "+cart_title.toLowerCase());
    // console.log("productTitle_toPurchase.toLowerCase() - "+productTitle_toPurchase.toLowerCase());

    // expect(cart_title.toLowerCase()).toBe(productTitle_toPurchase.toLowerCase());
    // expect(productPrice_toPurchase).toBe(cart_price.split(" ")[3]);
    
    // await page.locator("button:text('Checkout')").click();
    // console.log("Page Title", await page.title());
    
    let checkout_title = await page.locator(".item__title").textContent();
    expect(productTitle_toPurchase.toUpperCase()).toBe(checkout_title.trim().toUpperCase());
    
    let checkout_price = await page.locator(".item__price").textContent();
    expect(productPrice_toPurchase).toBe(checkout_price.replaceAll("$ ", "").trim());

    let countryDropdown = page.locator("[placeholder='Select Country']");
    countryDropdown.fill("India");

    try {
        await page.locator("span[class='ng-star-inserted']").click();
    } catch (error) {
        console.log(error);
    }
    
    await page.locator("a:text('Place Order')").click();

    // Thankyou for the order. 

    let thankYouHeader = await page.locator("h1").textContent();
    expect(thankYouHeader.trim()).toBe("Thankyou for the order.");
    expect(await page.locator("button:text('Click To Download Order Details in CSV')").isVisible()).toBeTruthy();

    await page.locator("label[routerlink='/dashboard/myorders']").click();

})