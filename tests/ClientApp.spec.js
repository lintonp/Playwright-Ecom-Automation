import test from "@playwright/test";

const login = async (page, userId, pwd) => {
    await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
    console.log(await page.title());

    let username = await page.locator("#username");
    let password = await page.locator("#password");

    await username.fill("");
    await username.fill(userId);
    await password.fill("");
    await password.fill(pwd);

    await page.locator("#signInBtn").click();

    return page;
}

test("Products Page", async ({page}) => {
    await login(page, "rahulshettyacademy","learning");
    // await page.waitForLoadState("networkidle");
    await page.locator(".card-title a").first().waitFor();
    let productTitles = await page.locator(".card-title a").allTextContents();
    console.log(await page.locator(".card-title a").allTextContents());
});

