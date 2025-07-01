import {test, request} from "@playwright/test";

let webContext;

test.beforeAll(async ({browser})=>{
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto("https://rahulshettyacademy.com/client/");
    const uid = "fnln112025@mail.com",
          pwd = "Password@1";
    await page.locator("#userEmail").fill(uid);
    await page.locator("#userPassword").fill(pwd);
    await page.locator("#login").click();

    console.log("Page Title", await page.title());
    await page.locator("#products").textContent();

    await context.storageState({path: 'state.json'});
    webContext = await browser.newContext({storageState: 'state.json'});
});

test("Session Storage", async ({}) => {
    const page = await webContext.newPage();
    await page.goto("https://rahulshettyacademy.com/client/");
    const products = page.locator(".card-body");
    
    console.log("Page Title", await page.title());
    await page.locator("#products").textContent();

    const product_Titles = page.locator(".card h5");
    const product_Prices = page.locator(".card .text-muted");
    const product_addToCart = page.locator(".card button:text('Add To Cart')");

    let productTitles = await product_Titles.allTextContents();
});

