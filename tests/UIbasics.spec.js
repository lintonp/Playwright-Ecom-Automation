const {test, expect} = require('@playwright/test');
const { type } = require('os');

// {} --> represents variables are global fixers

test('First Playwright Test', async ({browser}) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://google.com");
})

test('Google navigation', async ({page}) => {
    await page.goto("https://google.com")
    console.log(await page.title());
    await expect(page).toHaveTitle("Google");
});

test('Login page - Error msg', async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    console.log(await page.title());
    
    let username = await page.locator("#username");
    let password = await page.locator("#password");

    await username.fill("");
    await username.fill("rahulshettyacademy");
    await password.fill("");
    await password.fill("learninginc");

    await page.locator("#signInBtn").click();    

    console.log(await page.locator("[style*='block']").textContent())
    await expect(page.locator("[style*='block']")).toContainText("Incorrect")
    
})

const login = async (page, userId="rahulshettyacademy", pwd="learning") => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    console.log(await page.title());

    let username = await page.locator("#username");
    let password = await page.locator("#password");

    await username.fill("");
    await username.fill(userId);
    await password.fill("");
    await password.fill(pwd);

    await page.locator("#signInBtn").click();
}

test("Presence of Products", async ({page}) => {
    await login(page, "rahulshettyacademy","learning");

    console.log(await page.locator(".card-title a").nth(0).textContent());
    console.log(await page.locator(".card-title a").first().textContent());

    let products = await page.locator(".card-title a").allTextContents();
    console.log(products);

})

test('UI Controls', async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    console.log(await page.title());

    await page.locator("#username").fill("rahulshettyacademy");
    await page.locator("#password").fill("learning");

    //Dropdown
    let select = await page.locator("select.form-control");
    select.selectOption("consult");
    
    //Radio Button
    let userRadioButton = page.locator("[value=user]");
    await userRadioButton.click();
    await page.locator("#okayBtn").click();
    console.log(await userRadioButton.isChecked());

    //Checkbox
    let termsCheckbox = page.locator("#terms");
    await termsCheckbox.click();
    
    console.log(await termsCheckbox.isChecked());
    expect(await termsCheckbox.isChecked()).toBe(true);
    
    await termsCheckbox.uncheck();
    expect(await termsCheckbox.isChecked()).toBeFalsy();

})

test("Navigation", async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    console.log(await page.title());

    let blinkTexts = page.locator(".blinkingText");
    console.log(await blinkTexts.first().textContent());
    await blinkTexts.click();

})

test("Other Locators", async ({page})=>{
    await page.goto("https://rahulshettyacademy.com/angularpractice/");
    await page.getByLabel("Student").click();
    await page.getByRole("button", {name: "Submit"}).click();
    await page.getByRole("link", {name: "Shop"}).click();
    let addSamsung = page.locator("app-card").filter({hasText: "Samsung"});
    await addSamsung.waitFor();
    await page.pause();
    await addSamsung.getByRole("button", {name: "Add"}).click();
})

test.only("BasicsTwo", async ({page}) => {
    await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
    await page.locator("#name").fill("Messi");
    await page.getByLabel("Alert").click();
    await page.getByRole()
    page.on('dialog', dialog => dialog.accept());
})