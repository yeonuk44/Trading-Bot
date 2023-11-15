const accountsInfo = require("./apis/assets");
const orderCryptocurrency = require("./apis/order");
const technicalBollingerBand = require("./technicals/bb");

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

const getCandlesInfo = require("./apis/ticker");
getCandlesInfo
  .getCandlesInfo()
  .then((result) => {
    const tradePrices = result.map((candle) => candle.trade_price);
    console.log(technicalBollingerBand.bb(tradePrices));
  })
  .catch((error) => {
    console.error(error);
  });

// console.log(tradePrices.length);
//
