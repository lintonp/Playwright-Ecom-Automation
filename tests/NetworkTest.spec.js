const {test, expect, request} = require('@playwright/test');
const { default: ApiUtils } = require('./Utils/ApiUtils');
const { json } = require('stream/consumers');
const { url } = require('inspector');

const loginPayload = {userEmail: "fnln112025@mail.com", userPassword: "Password@1"};
let PlaceOrderPayload = {
    orders: [
        {
            country: "India",
            productOrderedId: "67a8dde5c0d3e6622a297cc8"
        }
    ]
    };
const fakePayloadOrders = { data: [], message: "No Orders" };

test('Fake response', async ({page}) => {
    let apiContext = await request.newContext();
    const apiUtils = new ApiUtils(apiContext, loginPayload);
    const response = await apiUtils.createOrder(PlaceOrderPayload);
    page.addInitScript(value => window.localStorage.setItem('token',value), response.token);

    await page.goto("https://rahulshettyacademy.com/client/");

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",
        async route => {
            const response = await page.request.fetch(route.request());
            let body = JSON.stringify(fakePayloadOrders);
            route.fulfill({
                response,
                body,
            });
        });
    
    //click Orders
    const ordersButton = await page.locator("button[routerlink='/dashboard/myorders']");
    await ordersButton.waitFor();
    expect(await ordersButton.isVisible()).toBeTruthy();
    await ordersButton.click();

    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*");
    
    let text = await page.locator("div[class='container table-responsive py-5'] div").textContent();
    console.log(text);
    expect(text).toContain("You have No Orders to show at this time.");
});

test.only('Intercept Network Calls', async ({page})=>{
    //Login
    let apiContext = await request.newContext();
    const apiUtils = new ApiUtils(apiContext, loginPayload);
    const response = await apiUtils.createOrder(PlaceOrderPayload);
    page.addInitScript(value => window.localStorage.setItem('token',value), response.token);
    await page.goto("https://rahulshettyacademy.com/client/");

    await page.locator(".card-body b").first().waitFor();
    await page.locator("button[routerlink*='myorders']").click();


    //Intercept OrderID
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*", 
        route => route.continue({url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=68614b09129e250258bf123z'}));

//     await page.route(
//     'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*',
//     async (route, request) => {
//         await route.continue({
//         url: 'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=12354'
//         });
//     }
// );

    //Click order
    await page.locator("button:has-text('View')").first().click();

    //Validate Forbidden
    // await page.pause();
    let errorMsg = await page.locator("div[class='container-fluid'] p");
    await errorMsg.waitFor();
    expect(await errorMsg.textContent()).toContain('You are not authorize to view this order');

});