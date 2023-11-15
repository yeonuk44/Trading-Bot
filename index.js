// const accountsInfo = require("./apis/assets");
// const orderCryptocurrency = require("./apis/order");

// console.log("Get Accounts Info: Before ordering Cryptocurrency");

// accountsInfo
//   .getAllAccountsInfo()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// console.log("Start ordering crypto");

// orderCryptocurrency
//   .orderCryptocurrency()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// console.log("Get Accounts Info: After ordering Cryptocurrency");

// accountsInfo
//   .getAllAccountsInfo()
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

const request = require("request");

const options = {
  method: "GET",
  url: "https://api.upbit.com/v1/candles/days?count=1&market=KRW-BTC",
  headers: { accept: "application/json" },
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
