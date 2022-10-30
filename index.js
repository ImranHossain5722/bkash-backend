const express = require("express");
var morgan = require("morgan");
var morganBody = require("morgan-body");
const bodyParser = require("body-parser");
var rp = require("request-promise");
const cors = require("cors");
const app = express();
const port = 8000;

app.use(morgan("combined"));
morganBody(app);
app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

async function getToken() {
  var options = {
    method: "POST",
    url: "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/token/grant",
    headers: {
      password: "hWD@8vtzw0",
      username: "sandboxTestUser",
    },
    json: {
      app_key: "5tunt4masn6pv2hnvte1sb5n3j",
      app_secret: "1vggbqd4hqk9g96o9rrrp2jftvek578v7d2bnerim12a87dbrrka",
    },
  };

  const tokenObj = await rp(options);
  console.log(tokenObj.id_token);
  return tokenObj.id_token;
}

app.post("/createRequest", async (req, res) => {
  const reqBody = req.body;
  const token = await getToken();

  const data = {
  
    amount: "1000",
    currency: "BDT",
    intent: "sale",
    merchantInvoiceNumber: "Inv0124",
  };

  var options = {
    method: "POST",
    url: "https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create",
    headers: {
      "x-app-key": "5tunt4masn6pv2hnvte1sb5n3j",
      authorization: token,
    },
   
    json: data,
  };
  // console.log(options)
  const body = await rp(options);
  
  res.json(body);
  

});


app.post("/executeRequest", async (req, res) => {
const paymentID = req.body.paymentID;
  console.log(paymentID)
  const token = await getToken();

  var options = {
    method: "POST",
    url: `https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/execute/${paymentID}`,
    headers: {
      "x-app-key": "5tunt4masn6pv2hnvte1sb5n3j",
      authorization: token,
    },
  };

  const body = await rp(options);
  
  res.json(body);
 
});

app.listen(port, () => console.log(`App listening on port ${port}!`));