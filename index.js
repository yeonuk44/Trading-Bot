const accountsInfo = require("./apis/assets");
const orderCryptocurrency = require("./apis/order");
const getCandlesInfo = require("./apis/ticker");

// console.log("Get Accounts Info: Before ordering Cryptocurrency");
// accountsInfo
//   .getAllAccountsInfo()
//   .then((result) => {
//     const balances = result.map((item) => item.balance);
//     const coun = result.map((co) => co.currency);
//     console.log(balances[0]);
//     console.log(coun[0]);
//     console.log("KRW" === coun[0]);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

async function findKRW() {
  const getAllAccountsInfo = await accountsInfo.getAllAccountsInfo();
  const isCurrency = getAllAccountsInfo.map((item) => item.currency);
  for (let i = 0; i < isCurrency.length; i++) {
    if (isCurrency[i] === "KRW") {
      return i;
    }
  }
}

/**
 * Trading Bot
 */

async function fetchData() {
  try {
    const dailyFetchData = await getCandlesInfo.getDailyCandlesInfo();
    console.log("Daily BB Value: ");
    console.log(dailyFetchData);

    const getAllAccountsInfo = await accountsInfo.getAllAccountsInfo();

    const idxKRW = await findKRW();
    console.log(getAllAccountsInfo[idxKRW]);

    // 자산 운용 상한선 기준: 내 자산의 50%까지만 가용
    // if (isCurrency[0] === "KRW") {
    //   const limitBalance = isBalance[0] / 2;
    //   console.log("현재 가용이 가능한 자산의 금액: " + limitBalance);
    // } else {
    //   console.log("더 이상 KRW가 없습니다.");
    //   clearInterval(minuteInterval);
    // }

    // 1분마다 실행
    const minuteInterval = setInterval(async () => {
      const minuteFetchData = await getCandlesInfo.getMinuteCandleInfo();
      console.log("1 Minute Candle Info: ");
      console.log(minuteFetchData);
      /**
       * INFO:
       * 매매 프로세스
       */

      // if (minuteFetchData[0] <= dailyFetchData[2] * 1.05) {
      //   // 1. BB의 Lower Band 보다 가격이 낮을 때 구매
      //   const isCurrency = await accountsInfo
      //     .getAllAccountsInfo()
      //     .map((item) => item.currency);
      //   const isBalance = await accountsInfo
      //     .getAllAccountsInfo()
      //     .map((item) => item.balance);
      //   if (isCurrency[0] === "KRW" && isBalance[0] > 5000) {
      //     if (isCurrency[1] === "BTC" && isBalance)
      //       await orderCryptocurrency
      //         .orderCryptocurrency()
      //         .then((result) => {
      //           console.log("구매하였습니다.");
      //           console.log(result);
      //         })
      //         .catch((error) => {
      //           console.error(error);
      //         });
      //   }
      // } else if (minuteFetchData[0] <= dailyFetchData[0] * 0.95) {
      //   // 2. BB의 Upper Band 보다 가격이 높을 때 판매

      //   if (isCurrency[1] === "BTC" && isBalance[1] > 5000) {
      //     await orderCryptocurrency
      //       .orderCryptocurrency()
      //       .then((result) => {
      //         console.log(result);
      //       })
      //       .catch((error) => {
      //         console.error(error);
      //       });
      //   }
      // }

      // 종료 조건을 설정하려면 clearInterval 사용
      // clearInterval(minuteInterval);
    }, 60000);
  } catch (error) {
    console.error(error);
  }
}

fetchData();
