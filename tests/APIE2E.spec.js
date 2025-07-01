const {test, expect, request} = require('@playwright/test');
const { default: ApiUtils } = require('./Utils/ApiUtils');
// const { ApiUtils } = require('./Utils/ApiUtils');

const loginPayload = {userEmail: "fnln112025@mail.com", userPassword: "Password@1"};
let token;

test.beforeAll("Login", async ({}) => {
    const apiContext = await request.newContext();
    let loginRes = apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
        {
            data: loginPayload,
            headers: {
                'Content-Type': 'application/json'
                }
        });

    expect((await loginRes).ok()).toBeTruthy();
    const loginResJson = (await loginRes).json();
    token = (await loginResJson).token;
})

test("E2E Order a product", async ({page}) => {
    const apiContext = await request.newContext();
    page.addInitScript(value => window.localStorage.setItem('token',value), token);

    await page.goto("https://rahulshettyacademy.com/client/");
    
    //Place Order
    // let PlaceOrderPayload = '{"orders":[{"country":"India","productOrderedId":"67a8dde5c0d3e6622a297cc8"}]}';
    let PlaceOrderPayload = {
    orders: [
        {
            country: "India",
            productOrderedId: "67a8dde5c0d3e6622a297cc8"
        }
    ]
    };

    // let PlaceOrderPayload = {orders:[{country:"India",productOrderedId:"67a8dde5c0d3e6622a297cc8"}]};
    let apiContextRes = await apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",{
        data: PlaceOrderPayload,
        headers: {
            'authorization': token,
            'Content-Type': 'application/json'
        }
    });

    console.log("Ordering...");
    expect((await apiContextRes).ok()).toBeTruthy();
    let apiContextResJson = await apiContextRes.json();
    let orderID = await apiContextResJson.orders[0];
    console.log("orderID: ",orderID);
    
    //Verify Orders page
    await page.pause();
    const ordersButton = await page.locator("button[routerlink='/dashboard/myorders']");
    await ordersButton.click();

    let ordersPage_orderID = await page.locator("th:has-text(' "+orderID+" ')");
    ordersPage_orderID.waitFor();
    expect(await ordersPage_orderID.isVisible()).toBeTruthy();
    await ordersPage_orderID.scrollIntoViewIfNeeded();
    
    let viewXpath = "xpath=//th[contains(text(),'"+orderID+"')]/parent::tr//button[text()='View']";
    await page.locator(viewXpath).click();
    
    let ordersDetails_orderID = await page.locator("div:has-text(' "+orderID+" ')");
    await ordersDetails_orderID.waitFor();
    
    expect(await ordersDetails_orderID.isVisible()).toBeTruthy();

})


test.only('Refactored API', async ({page}) => {
    let apiContext = await request.newContext();
    // console.log("apiContext",apiContext);
    const apiUtils = new ApiUtils(apiContext, loginPayload);
    let PlaceOrderPayload = {
    orders: [
        {
            country: "India",
            productOrderedId: "67a8dde5c0d3e6622a297cc8"
        }
    ]};
    const response = await apiUtils.createOrder(PlaceOrderPayload);

    page.addInitScript(value => window.localStorage.setItem('token',value), response.token);

    await page.goto("https://rahulshettyacademy.com/client/");
    
    const ordersButton = await page.locator("button[routerlink='/dashboard/myorders']");
    await ordersButton.waitFor();
    expect(await ordersButton.isVisible()).toBeTruthy();
    await ordersButton.click();

    // await page.pause();

    let ordersPage_orderID = await page.locator("th:has-text(' "+response.orderID+" ')");
    await ordersPage_orderID.waitFor();
    expect(await ordersPage_orderID.isVisible()).toBeTruthy();
    // await ordersPage_orderID.scrollIntoViewIfNeeded();

    let viewXpath = "xpath=//th[contains(text(),'"+response.orderID+"')]/parent::tr//button[text()='View']";
    await page.locator(viewXpath).click();
    
    let ordersDetails_orderID = await page.locator("small:has-text('Order Id') + div");
    await ordersDetails_orderID.waitFor();
    expect(await ordersDetails_orderID.textContent()).toBe(response.orderID);
});