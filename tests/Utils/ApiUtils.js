export default class ApiUtils{
    token="";

    constructor(apiContext, loginPayload){
        console.log("ApiUtils Constructor")
        this.apiContext = apiContext;
        this.loginPayload = loginPayload;
    }

    async generateToken(){
        let loginRes = this.apiContext.post("https://rahulshettyacademy.com/api/ecom/auth/login", 
                {
                    data: this.loginPayload,
                    headers: {
                        'Content-Type': 'application/json'
                        }
                });
        
            const loginResJson = (await loginRes).json();
            let token = (await loginResJson).token;
            this.token = token;
            return token;
    }

    async createOrder(orderPayload){
        let response = {};
        const token = await this.generateToken();
        
        let apiContextRes = await this.apiContext.post("https://rahulshettyacademy.com/api/ecom/order/create-order",{
                data: orderPayload,
                headers: {
                    'authorization': token,
                    'Content-Type': 'application/json'
                }
            });
        
            let apiContextResJson = await apiContextRes.json();
            let orderID = await apiContextResJson.orders[0];

            response.token = token;
            response.orderID = orderID;

            return response;
    }
}
