const accountsInfo = require("./apis/assets");
const orderCryptocurrency = require("./apis/order");
const getCandlesInfo = require("./apis/ticker");
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

/**
 * Trading Bot
 */
const cron = require("node-cron");

async function fetchData() {
  try {
    const result = await getCandlesInfo.getDailyCandlesInfo();
    const tradePrices = result.map((candle) => candle.trade_price);
    const dailyBBValue = technicalBollingerBand.bb(tradePrices);
    console.log("Fetched data at", new Date());
  } catch (error) {
    console.error(error);
  }
}

// cron 표현식: 매일 00:00에 실행 (UTC 기준, 한국 시간 00:00)
const cronExpression = "0 15 * * *";

// cron 작업 설정
cron.schedule(cronExpression, fetchData);
