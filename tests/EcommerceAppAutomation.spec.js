import test, { expect } from "@playwright/test";

const loginEcom = async (page, uid, pwd) => {
    await page.locator("#userEmail").fill(uid);
    await page.locator("#userPassword").fill(pwd);
    await page.locator("login").click();
}

test("E2E purchase product", async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/client/");
    //https://rahulshettyacademy.com/client/
    // loginEcom(page, "fnln112025@mail.com", "Password@1");
    const uid = "fnln112025@mail.com",
          pwd = "Password@1";
    await page.locator("#userEmail").fill(uid);
    await page.locator("#userPassword").fill(pwd);
    await page.locator("#login").click();

    console.log("Page Title", await page.title());
    await page.locator("#products").textContent();

    const product_Titles = page.locator(".card h5");
    const product_Prices = page.locator(".card .text-muted");
    const product_addToCart = page.locator(".card button:text('Add To Cart')");

    let productTitles = await product_Titles.allTextContents();
    const productTitle_toPurchase = "ADIDAS ORIGINAL";

    let i = productTitles.findIndex(p => p.toUpperCase() === productTitle_toPurchase.toUpperCase());

    let productPrice_toPurchase = await product_Prices.nth(i).textContent();
    productPrice_toPurchase = productPrice_toPurchase.replaceAll("$ ", "").trim();

    await product_addToCart.nth(i).click();

    await page.locator("[routerlink='/dashboard/cart']").click();
    console.log("Page Title", await page.title());
    
    let cart_title = await page.locator(".cart h3").textContent();
    let cart_price = await page.locator(".cart h3 + p").textContent();
    
    console.log("cart_title.toLowerCase() - "+cart_title.toLowerCase());
    console.log("productTitle_toPurchase.toLowerCase() - "+productTitle_toPurchase.toLowerCase());

    expect(cart_title.toLowerCase()).toBe(productTitle_toPurchase.toLowerCase());
    expect(productPrice_toPurchase).toBe(cart_price.split(" ")[3]);
    
    await page.locator("button:text('Checkout')").click();
    console.log("Page Title", await page.title());
    
    let checkout_title = await page.locator(".item__title").textContent();
    expect(productTitle_toPurchase.toUpperCase()).toBe(checkout_title.trim().toUpperCase());
    
    let checkout_price = await page.locator(".item__price").textContent();
    expect(productPrice_toPurchase).toBe(checkout_price.replaceAll("$ ", "").trim());

    let countryDropdown = page.locator("[placeholder='Select Country']");
    countryDropdown.fill("Argentina");
    await page.locator("span[class='ng-star-inserted']").click();
    
    await page.locator("a:text('Place Order')").click();

    // Thankyou for the order. 

    let thankYouHeader = await page.locator("h1").textContent();
    expect(thankYouHeader.trim()).toBe("Thankyou for the order.");
    expect(await page.locator("button:text('Click To Download Order Details in CSV')").isVisible()).toBeTruthy();

    await page.locator("label[routerlink='/dashboard/myorders']").click();

})