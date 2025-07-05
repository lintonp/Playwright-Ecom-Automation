import test, { expect } from "@playwright/test";
import LoginPage from "../PageObjects/LoginPagePO";
import DashboardPO from "../PageObjects/DashboardPO";
import Cart from "../PageObjects/CartPO";
import Checkout from "../PageObjects/CheckoutPO";
import OrderConfirmation from "../PageObjects/OrderConfirmationPO";

test("E2E purchase product", async ({page}) => {
    
    const uid = "fnln112025@mail.com",
          pwd = "Password@1";
    const productTitle_toPurchase = "ZARA COAT 3"; //ADIDAS ORIGINAL";

    const loginPage = new LoginPage(page);
    await loginPage.login(uid, pwd);

    const dashboard = new DashboardPO(page);
    let productPrice_toPurchase = await dashboard.addProductToCart(productTitle_toPurchase);
    await dashboard.navigateToCart();

    const cart = new Cart(page);
    await cart.validateProductionCart(productTitle_toPurchase, productPrice_toPurchase);
    await cart.goToCheckout();

    const checkout = new Checkout(page);
    await checkout.validateProductDetails(productTitle_toPurchase,productPrice_toPurchase)

    const orderConfirmation = new OrderConfirmation(page);
    await orderConfirmation.validateProductDetails(productTitle_toPurchase,productPrice_toPurchase);

})