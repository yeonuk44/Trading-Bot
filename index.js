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

async function findBTC() {
  const getAllAccountsInfo = await accountsInfo.getAllAccountsInfo();
  const isCurrency = getAllAccountsInfo.map((item) => item.currency);
  for (let i = 0; i < isCurrency.length; i++) {
    if (isCurrency[i] === "BTC") {
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

    console.log("----------------------------------------------------");
    console.log("Daily BB Value: ");
    console.log(dailyFetchData);
    console.log("----------------------------------------------------");

    const upperBand = dailyFetchData["Upper Band"];
    const middleBand = dailyFetchData["Middle Band"];
    const lowerBand = dailyFetchData["Lower Band"];

    const getAllAccountsInfo = await accountsInfo.getAllAccountsInfo();
    const isCurrency = getAllAccountsInfo.map((item) => item.currency);
    const isBalance = getAllAccountsInfo.map((item) => item.balance);
    const idxKRW = await findKRW();
    const idxBTC = await findBTC();

    console.log("보유중인 자산: ");
    console.log(getAllAccountsInfo);
    console.log("----------------------------------------------------");

    // 자산 운용 상한선 기준: 내 자산의 50%까지만 가용
    if (isCurrency[idxKRW] === "KRW") {
      const limitBalance = isBalance[idxKRW] / 2;
      console.log("보유중인 KRW: " + isBalance[idxKRW]);
      console.log("현재 가용이 가능한 자산의 금액: " + limitBalance);
      console.log("----------------------------------------------------");
    } else {
      console.log("더 이상 KRW가 없습니다.");
      // 트레이딩 봇 종료
      clearInterval(minuteInterval);
    }

    // API Call every minute
    const minuteInterval = setInterval(async () => {
      const minuteFetchData = await getCandlesInfo.getMinuteCandleInfo();
      const minuteCandlePrice = minuteFetchData.map((item) => item.price);
      const minuteCandleTime = minuteFetchData.map((item) => item.time);

      console.log("====================================================");
      console.log(
        minuteCandleTime + " 종가: " + minuteCandlePrice + " 입니다."
      );
      /**
       * INFO:
       * 매매 프로세스
       */

      if (minuteCandlePrice <= lowerBand * 1.05) {
        // 1. BB의 Lower Band 보다 가격이 낮을 때 구매
        console.log("====================================================");
        console.log(
          lowerBand +
            " 의 가격에 근접한 종가로 현재 종가는 " +
            minuteCandlePrice +
            " 입니다."
        );
        const isCurrency = await accountsInfo
          .getAllAccountsInfo()
          .map((item) => item.currency);
        const isBalance = await accountsInfo
          .getAllAccountsInfo()
          .map((item) => item.balance);
        if (
          isCurrency[idxKRW] === "KRW" &&
          isBalance[idxKRW] > 5000 &&
          limitBalance > isBalance[idxKRW]
        ) {
          console.log("====================================================");
          await orderCryptocurrency
            .orderCryptocurrency()
            .then((result) => {
              console.log("5000KRW 만큼의 BTC를 구매하였습니다.");
              console.log(result);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      } else if (minuteCandlePrice <= upperBand * 0.95) {
        // 2. BB의 Upper Band 보다 가격이 높을 때 판매
        console.log("====================================================");
        console.log(
          upperBand +
            " 의 가격에 근접한 종가로 현재 종가는 " +
            minuteCandlePrice +
            " 입니다."
        );
        // 토큰의 KRW 가치 환산 Response value가 없어 따로 계산
        let currentBTCtoKRW = isBalance[idxBTC] * minuteCandlePrice;
        if (isCurrency[idxBTC] === "BTC" && currentBTCtoKRW > 5000) {
          console.log("====================================================");
          await orderCryptocurrency
            .orderCryptocurrency()
            .then((result) => {
              console.log("5000KRW 만큼의 BTC를 판매하였습니다.");
              console.log(result);
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }

      // 종료 조건을 설정하려면 clearInterval 사용
      // clearInterval(minuteInterval);
    }, 60000);
  } catch (error) {
    console.error(error);
  }
}

fetchData();
