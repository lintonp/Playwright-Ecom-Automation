export default class LoginPage{
    constructor(page){
        this.page = page;
        this.email = page.locator("#userEmail");
        this.password = page.locator("#userPassword");
        this.loginButton = page.locator("#login");
    }

    async login(uid, password){
        await this.page.goto("https://rahulshettyacademy.com/client/");
        await this.email.fill(uid);
        await this.password.fill(password);
        await this.loginButton.click();

        console.log("Page Title: ", await this.page.title());
    }
}