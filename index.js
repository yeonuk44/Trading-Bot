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
// const daily = getCandlesInfo
//   .getDailyCandlesInfo()
//   .then((result) => {
//     return result;
//   })
//   .catch((error) => {
//     console.error(error);
//   });

// console.log(daily);

getCandlesInfo
  .getMinuteCandleInfo()
  .then((result) => {})
  .catch((error) => {
    console.error(error);
  });

async function fetchData() {
  try {
    const dailyFetchData = await getCandlesInfo.getDailyCandlesInfo();
    console.log(dailyFetchData);

    // 1분마다 실행
    const minuteInterval = setInterval(async () => {
      const minuteFetchData = await getCandlesInfo.getMinuteCandleInfo();
      console.log(minuteFetchData);
      // 여기에 필요한 로직 추가

      // 종료 조건을 설정하려면 clearInterval 사용
      // clearInterval(minuteInterval);
    }, 60000);
  } catch (error) {
    console.error(error);
  }
}

fetchData();
